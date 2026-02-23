import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@jewellead.com' },
    update: {},
    create: {
      email: 'demo@jewellead.com',
      passwordHash: hash,
      shopName: 'Meera Jewellers',
      ownerName: 'Meera Sharma',
      phone: '9876543210',
      city: 'Mumbai',
      subscriptionStatus: 'TRIAL',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  const reel = await prisma.reel.create({
    data: {
      userId: user.id,
      url: 'https://www.instagram.com/reel/demo123/',
      reelId: 'demo123',
      productName: 'Gold Kundan Necklace',
      category: 'Necklaces',
      price: 45000,
      triggerWord: 'interested',
    },
  });

  await prisma.lead.createMany({
    data: [
      { userId: user.id, reelId: reel.id, name: 'Priya Gupta', phone: '9876543211', city: 'Mumbai', status: 'NEW' },
      { userId: user.id, reelId: reel.id, name: 'Sunita Patel', phone: '9876543212', city: 'Surat', status: 'INTERESTED' },
      { userId: user.id, reelId: reel.id, name: 'Rekha Jain', phone: '9876543213', city: 'Jaipur', status: 'CONVERTED', convertedAt: new Date() },
      { userId: user.id, name: 'Anita Shah', phone: '9876543214', city: 'Ahmedabad', status: 'FOLLOW_UP' },
    ],
  });

  console.log('✅ Seed complete!');
  console.log('📧 Email: demo@jewellead.com');
  console.log('🔑 Password: password123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
