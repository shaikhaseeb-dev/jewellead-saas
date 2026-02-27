export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';
import { sendWhatsAppTemplate, buildFollowUpComponents } from '@/lib/whatsapp';
import { logger } from '@/lib/logger';
import { subDays } from 'date-fns';

export async function POST(req: NextRequest) {
  // Protect cron with secret
  const secret = req.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const twoDaysAgo = subDays(new Date(), 2);
  let sent = 0;
  let failed = 0;

  try {
    // Find leads that need follow-up
    const leads = await prisma.lead.findMany({
      where: {
        status: { notIn: ['NOT_INTERESTED', 'CONVERTED'] },
        createdAt: { lte: twoDaysAgo },
        followUpSentAt: null,
        // Must have valid phone
        NOT: { phone: '' },
      },
      include: {
        user: true,
        reel: { select: { productName: true } },
      },
      take: 100, // batch limit
    });

    for (const lead of leads) {
      const user = lead.user;
      if (!user.waConnected || !user.waPhoneNumberId || !user.waAccessToken) continue;

      const token = decrypt(user.waAccessToken);
      const productName = lead.reel?.productName || 'our jewelry';

      const result = await sendWhatsAppTemplate(
        {
          phoneNumberId: user.waPhoneNumberId,
          accessToken: token,
          to: `91${lead.phone}`,
          templateName: process.env.WA_TEMPLATE_FOLLOWUP!,
          components: buildFollowUpComponents(lead.name, productName, user.shopName),
        },
        user.id
      );

      if (result.success) {
        sent++;
        await prisma.lead.update({
          where: { id: lead.id },
          data: { followUpSentAt: new Date(), status: 'FOLLOW_UP' },
        });
        await prisma.followUpLog.create({
          data: {
            userId: user.id,
            leadId: lead.id,
            type: 'whatsapp',
            status: 'sent',
            message: `Follow-up sent for ${productName}`,
          },
        });
      } else {
        failed++;
        await prisma.followUpLog.create({
          data: {
            userId: user.id,
            leadId: lead.id,
            type: 'whatsapp',
            status: 'failed',
            error: result.error,
          },
        });
      }
    }

    await logger.info('Cron:FollowUp', `Done. Sent: ${sent}, Failed: ${failed}`);
    return NextResponse.json({ success: true, sent, failed });
  } catch (err) {
    await logger.error('Cron:FollowUp', 'Follow-up cron failed', { err: String(err) });
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 });
  }
}
