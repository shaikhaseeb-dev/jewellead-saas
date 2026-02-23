import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rateLimit';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, { max: 10, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await createToken({ userId: user.id, email: user.email, shopName: user.shopName });
    await setAuthCookie(token);

    await logger.info('Auth', 'User logged in', { email }, user.id);

    return NextResponse.json({ success: true, shopName: user.shopName });
  } catch (err) {
    await logger.error('Auth', 'Login error', { err: String(err) });
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
