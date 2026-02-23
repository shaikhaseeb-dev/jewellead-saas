import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { campaignSchema } from '@/lib/validations';
import { getTemplate } from '@/lib/campaignTemplates';
import { decrypt } from '@/lib/encryption';
import { sendWhatsAppTemplate } from '@/lib/whatsapp';
import { logger } from '@/lib/logger';
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const campaigns = await prisma.campaign.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return NextResponse.json({ campaigns });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const result = campaignSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid campaign type' }, { status: 400 });
    }

    const { templateType } = result.data;
    const template = getTemplate(templateType);
    if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

    // Get user's WA credentials
    const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
    if (!dbUser?.waConnected || !dbUser.waPhoneNumberId || !dbUser.waAccessToken) {
      return NextResponse.json({ error: 'WhatsApp not connected. Please connect in Settings.' }, { status: 400 });
    }

    // Get all converted/interested leads with phone numbers
    const leads = await prisma.lead.findMany({
      where: {
        userId: user.userId,
        status: { notIn: ['NOT_INTERESTED'] },
        NOT: { phone: '' },
      },
      select: { id: true, phone: true, name: true },
    });

    if (leads.length === 0) {
      return NextResponse.json({ error: 'No leads to send campaign to' }, { status: 400 });
    }

    const campaign = await prisma.campaign.create({
      data: {
        userId: user.userId,
        name: template.name,
        templateType,
        status: 'DRAFT',
      },
    });

    // Send in background
    sendCampaign(campaign.id, dbUser, leads, template.templateName).catch(() => {});

    return NextResponse.json({ campaign, message: `Campaign started for ${leads.length} leads` }, { status: 201 });
  } catch (err) {
    await logger.error('Campaigns', 'Create error', { err: String(err) }, user.userId);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

async function sendCampaign(
  campaignId: string,
  user: { id: string; waPhoneNumberId: string | null; waAccessToken: string | null; shopName: string },
  leads: { id: string; phone: string; name: string }[],
  templateName: string
) {
  let sentCount = 0;
  let failedCount = 0;
  const token = decrypt(user.waAccessToken!);

  for (const lead of leads) {
    const result = await sendWhatsAppTemplate(
      {
        phoneNumberId: user.waPhoneNumberId!,
        accessToken: token,
        to: `91${lead.phone}`,
        templateName,
      },
      user.id
    );
    if (result.success) sentCount++;
    else failedCount++;
    // Small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 500));
  }

  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: failedCount > sentCount ? 'FAILED' : 'SENT', sentCount, failedCount, sentAt: new Date() },
  });

  await logger.info('Campaign', `Done: ${sentCount} sent, ${failedCount} failed`, { campaignId }, user.id);
}
