import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { leadFormSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rateLimit';
import { decrypt } from '@/lib/encryption';
import { sendOwnerAlert } from '@/lib/whatsapp';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, { max: 5, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const body = await req.json();
    const result = leadFormSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { name, phone, city, reelId, userId, instagramUser } = result.data;

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'Invalid form link' }, { status: 404 });

    // Update existing placeholder or create new lead
    let lead = await prisma.lead.findFirst({
      where: { userId, instagramUser },
    });

    const reel = reelId
      ? await prisma.reel.findFirst({ where: { id: reelId, userId } })
      : null;

    if (lead) {
      lead = await prisma.lead.update({
        where: { id: lead.id },
        data: { name, phone, city, status: 'NEW', reelId: reelId || lead.reelId },
      });
    } else {
      lead = await prisma.lead.create({
        data: { userId, reelId: reelId || null, name, phone, city, instagramUser, status: 'NEW' },
      });
    }

    // Send WhatsApp alert to owner (non-blocking)
    if (user.waConnected && user.waPhoneNumberId && user.waAccessToken) {
      const token = decrypt(user.waAccessToken);
      sendOwnerAlert(
        user.waPhoneNumberId,
        token,
        user.phone,
        name,
        phone,
        reel?.productName || 'Jewelry',
        userId
      ).catch(() => {});
    }

    await logger.info('Form', `New lead: ${name}`, { leadId: lead.id }, userId);
    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (err) {
    await logger.error('Form', 'Lead capture error', { err: String(err) });
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
