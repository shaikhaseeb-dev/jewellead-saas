import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rateLimit';
import { logger } from '@/lib/logger';
import { addDays } from 'date-fns';
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, { max: 5, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { shopName, ownerName, phone, email, password, city } = result.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const trialEndsAt = addDays(new Date(), 14);

    const user = await prisma.user.create({
      data: {
        shopName,
        ownerName,
        phone,
        email,
        passwordHash,
        city,
        trialEndsAt,
        subscriptionStatus: 'TRIAL',
      },
    });

    const token = await createToken({ userId: user.id, email: user.email, shopName: user.shopName });
    await setAuthCookie(token);

    await logger.info('Auth', 'New user registered', { email, shopName }, user.id);

    return NextResponse.json({ success: true, shopName: user.shopName }, { status: 201 });
  } catch (err) {
    await logger.error('Auth', 'Register error', { err: String(err) });
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
