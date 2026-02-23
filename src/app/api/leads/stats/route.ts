import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { startOfDay, subDays } from 'date-fns';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const today = startOfDay(new Date());
  const twoDaysAgo = subDays(today, 2);

  const [total, newToday, followUpDue, converted, recentLeads] = await Promise.all([
    prisma.lead.count({ where: { userId: user.userId } }),
    prisma.lead.count({ where: { userId: user.userId, createdAt: { gte: today } } }),
    prisma.lead.count({
      where: {
        userId: user.userId,
        status: { notIn: ['NOT_INTERESTED', 'CONVERTED'] },
        createdAt: { lte: twoDaysAgo },
        followUpSentAt: null,
      },
    }),
    prisma.lead.count({ where: { userId: user.userId, status: 'CONVERTED' } }),
    prisma.lead.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { reel: { select: { productName: true } } },
    }),
  ]);

  return NextResponse.json({ total, newToday, followUpDue, converted, recentLeads });
}
