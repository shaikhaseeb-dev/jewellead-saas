import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { settingsSchema } from '@/lib/validations';
import { encrypt } from '@/lib/encryption';
import { logger } from '@/lib/logger';
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: {
      shopName: true,
      ownerName: true,
      phone: true,
      email: true,
      city: true,
      instagramUserId: true,
      instagramConnected: true,
      waPhoneNumberId: true,
      waBusinessId: true,
      waConnected: true,
      subscriptionStatus: true,
      trialEndsAt: true,
      businessType: true,
    },
  });

  return NextResponse.json({ user: dbUser });
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const result = settingsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { instagramAccessToken, waAccessToken, ...rest } = result.data;

    const updateData: Record<string, unknown> = { ...rest };

    if (instagramAccessToken) {
      updateData.instagramAccessToken = encrypt(instagramAccessToken);
      updateData.instagramConnected = true;
    }
    if (waAccessToken) {
      updateData.waAccessToken = encrypt(waAccessToken);
      updateData.waConnected = true;
    }

    const updated = await prisma.user.update({
      where: { id: user.userId },
      data: updateData,
    });

    await logger.info('Settings', 'Settings updated', {}, user.userId);
    return NextResponse.json({ success: true, shopName: updated.shopName });
  } catch (err) {
    await logger.error('Settings', 'Update error', { err: String(err) }, user.userId);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
