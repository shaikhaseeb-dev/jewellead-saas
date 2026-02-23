import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './src/lib/auth';

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/form', '/api/webhooks', '/api/form', '/api/auth'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  // Protect dashboard and API routes
  if (path.startsWith('/dashboard') || (path.startsWith('/api') && !path.startsWith('/api/cron'))) {
    const token = req.cookies.get('jewellead_token')?.value;

    if (!token) {
      if (path.startsWith('/api')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      if (path.startsWith('/api')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
