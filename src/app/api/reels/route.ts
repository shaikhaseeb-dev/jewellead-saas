import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { reelSchema } from '@/lib/validations';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const reels = await prisma.reel.findMany({
    where: { userId: user.userId },
    include: {
      _count: { select: { leads: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ reels });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const result = reelSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    // Extract Instagram reel ID from URL
    const reelIdMatch = result.data.url.match(/\/reel\/([A-Za-z0-9_-]+)/);
    const reelId = reelIdMatch?.[1] || null;

    const reel = await prisma.reel.create({
      data: {
        ...result.data,
        reelId,
        userId: user.userId,
      },
    });

    await logger.info('Reels', 'Reel added', { reelId: reel.id }, user.userId);
    return NextResponse.json({ reel }, { status: 201 });
  } catch (err) {
    await logger.error('Reels', 'Create error', { err: String(err) }, user.userId);
    return NextResponse.json({ error: 'Failed to add reel' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const reel = await prisma.reel.findFirst({ where: { id, userId: user.userId } });
  if (!reel) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.reel.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
