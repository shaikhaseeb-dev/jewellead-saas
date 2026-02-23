import { NextRequest, NextResponse } from 'next/server';

const store = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  req: NextRequest,
  { max = 30, windowMs = 60_000 }: { max?: number; windowMs?: number } = {}
): NextResponse | null {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  const key = `${req.nextUrl.pathname}:${ip}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (entry.count >= max) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  entry.count++;
  return null;
}
