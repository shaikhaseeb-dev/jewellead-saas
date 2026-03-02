import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';
import { sendWhatsAppTemplate, buildSummaryComponents } from '@/lib/whatsapp';
import { logger } from '@/lib/logger';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const today = new Date();
  const start = startOfDay(subDays(today, 1));
  const end = endOfDay(subDays(today, 1));

  let successCount = 0;

  try {
    const users = await prisma.user.findMany({
      where: { waConnected: true, subscriptionStatus: { not: 'EXPIRED' } },
    });

    for (const user of users) {
      if (!user.waPhoneNumberId || !user.waAccessToken) continue;

      const [totalLeads, newLeads, converted] = await Promise.all([
        prisma.lead.count({ where: { userId: user.id } }),
        prisma.lead.count({ where: { userId: user.id, createdAt: { gte: start, lte: end } } }),
        prisma.lead.count({ where: { userId: user.id, status: 'CONVERTED' } }),
      ]);

      const token = decrypt(user.waAccessToken);
      await sendWhatsAppTemplate(
        {
          phoneNumberId: user.waPhoneNumberId,
          accessToken: token,
          to: `91${user.phone}`,
          templateName: process.env.WA_TEMPLATE_SUMMARY!,
          components: buildSummaryComponents(totalLeads, newLeads, converted, user.shopName),
        },
        user.id
      );

      successCount++;
    }

    await logger.info('Cron:Summary', `Daily summary sent to ${successCount} shops`);
    return NextResponse.json({ success: true, sent: successCount });
  } catch (err) {
    await logger.error('Cron:Summary', 'Summary cron failed', { err: String(err) });
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 });
  }
}
