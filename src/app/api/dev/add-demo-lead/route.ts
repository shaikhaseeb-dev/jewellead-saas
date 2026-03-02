/**
 * POST /api/dev/add-demo-lead
 *
 * DEVELOPMENT ONLY — creates a random demo lead for the logged-in user.
 * This route returns 404 in any non-development environment.
 * Never import or reference this file from production code.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

/* ─── Guard: hard 404 in production ──────────────────────────────────────── */
if (process.env.NODE_ENV !== 'development') {
  // Module-level check so the route never even registers outside dev
  console.warn('[dev] add-demo-lead route loaded outside development — all requests will 404');
}

/* ─── Demo data pools ─────────────────────────────────────────────────────── */
const NAMES = [
  'Priya Sharma',   'Anita Patel',    'Rekha Jain',     'Sunita Gupta',
  'Kavita Singh',   'Pooja Mehta',    'Meena Verma',    'Deepa Iyer',
  'Lalita Rao',     'Sushma Nair',    'Vinita Tiwari',  'Geeta Pillai',
  'Smita Desai',    'Usha Malhotra',  'Ritu Khanna',    'Nandita Bose',
  'Sudha Reddy',    'Aarti Mishra',   'Neha Agarwal',   'Seema Srivastava',
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal',
];

const PRODUCTS = [
  'Gold Kundan Necklace',     'Diamond Solitaire Ring',
  'Polki Bridal Set',         'Emerald Pendant',
  'Ruby Earrings',            'Gold Bangles Set',
  'Antique Jhumkas',          'Pearl Choker',
  'Platinum Wedding Band',    'Sapphire Bracelet',
  'Temple Jewellery Set',     'Gold Mangalsutra',
  'Uncut Diamond Earrings',   'Rose Gold Chain',
];

const STATUSES = [
  'NEW', 'NEW',             // weighted slightly higher
  'INTERESTED',
  'FOLLOW_UP',
  'CONVERTED',
] as const;

type DemoStatus = typeof STATUSES[number];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone(): string {
  // Valid Indian mobile: starts with 6-9, total 10 digits
  const prefixes = ['6', '7', '8', '9'];
  const prefix = pick(prefixes);
  const rest = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
  return `${prefix}${rest}`;
}

function randomSaleAmount(): number {
  // Random integer between 20,000 and 80,000 in steps of 500
  const min = 20_000;
  const max = 80_000;
  const steps = (max - min) / 500;
  return min + Math.floor(Math.random() * steps) * 500;
}

/* ─── Route handler ───────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  // Hard block in non-development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const status: DemoStatus = pick(STATUSES);
  const isConverted = status === 'CONVERTED';
  const productName = pick(PRODUCTS);

  // Try to attach to a real reel owned by this user, else leave null
  const reel = await prisma.reel.findFirst({
    where: { userId: user.userId, active: true },
    select: { id: true },
    orderBy: { createdAt: 'desc' },
  });

  const lead = await prisma.lead.create({
    data: {
      userId:     user.userId,
      reelId:     reel?.id ?? null,
      name:       pick(NAMES),
      phone:      randomPhone(),
      city:       pick(CITIES),
      status,
      saleAmount: isConverted ? randomSaleAmount() : null,
      convertedAt:isConverted ? new Date() : null,
      notes:      `Demo lead — ${productName}`,
      createdAt:  new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    lead: {
      id:     lead.id,
      name:   lead.name,
      status: lead.status,
      city:   lead.city,
      ...(isConverted && { saleAmount: lead.saleAmount }),
    },
  });
}
