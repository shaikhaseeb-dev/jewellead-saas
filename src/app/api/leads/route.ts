import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { updateLeadSchema } from '@/lib/validations';
import { logger } from '@/lib/logger';
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const where = {
    userId: user.userId,
    ...(status ? { status: status as never } : {}),
  };

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: { reel: { select: { productName: true, url: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.lead.count({ where }),
  ]);

  return NextResponse.json({ leads, total, page, pages: Math.ceil(total / limit) });
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { leadId, ...updates } = await req.json();
    if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 });

    const result = updateLeadSchema.safeParse(updates);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Enforce tenant isolation
    const lead = await prisma.lead.findFirst({ where: { id: leadId, userId: user.userId } });
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data: {
        ...result.data,
        ...(result.data.status === 'CONVERTED' ? { convertedAt: new Date() } : {}),
      },
    });

    await logger.info('Leads', `Lead ${leadId} updated`, { status: result.data.status }, user.userId);
    return NextResponse.json({ lead: updated });
  } catch (err) {
    await logger.error('Leads', 'Update error', { err: String(err) }, user.userId);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
