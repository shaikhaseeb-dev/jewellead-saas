import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
  await prisma.$queryRaw`SELECT 1`;  // lighter than findFirst()
  return NextResponse.json({ status: 'awake', ts: new Date().toISOString() });
}