import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendInstagramDM, buildLeadFormDM, matchesTriggerWord } from '@/lib/instagram';
import { decrypt } from '@/lib/encryption';
import { rateLimit } from '@/lib/rateLimit';
import { logger } from '@/lib/logger';


export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET: Webhook verification by Meta
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge || '', { status: 200 });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// POST: Receive Instagram events
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, { max: 100, windowMs: 60_000 });
  if (limited) return limited;

  let body: any;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  console.log("🔥 WEBHOOK PAYLOAD:", JSON.stringify(body, null, 2));

  processWebhook(body).catch((err) => {
    console.error("Webhook processing error:", err);
  });

  return NextResponse.json({ received: true });
}

async function processWebhook(payload: any) {
  if (payload.object !== 'instagram') return;

  for (const entry of payload.entry || []) {
    const igUserId = entry.id;

    if (!igUserId) continue;

    // Find user by Instagram Business ID
    const user = await prisma.user.findFirst({
      where: { instagramUserId: igUserId },
    });

    if (!user || !user.instagramAccessToken) continue;

    let accessToken: string;

    try {
      accessToken = decrypt(user.instagramAccessToken);
    } catch (err) {
      console.error("Token decrypt failed:", err);
      continue;
    }

    for (const change of entry.changes || []) {
      if (change.field !== 'comments') continue;

      const value = change.value;
      if (!value) continue;

      const commenterId = value.from?.id;
      const commenterUsername = value.from?.username || '';
      const text = value.text || '';
      const mediaId = value.media?.id;

      if (!commenterId || !mediaId) continue;

      // Find reel matching this media_id + user
      const reel = await prisma.reel.findFirst({
        where: {
          userId: user.id,
          reelId: mediaId,
          active: true,
        },
      });

      if (!reel) continue;

      // Check trigger word
      if (!matchesTriggerWord(text, reel.triggerWord)) continue;

      // Avoid duplicate leads
      const existing = await prisma.lead.findFirst({
        where: {
          userId: user.id,
          instagramUser: commenterUsername,
        },
      });

      if (existing) continue;

      // Create lead FIRST (important)
      const lead = await prisma.lead.create({
        data: {
          userId: user.id,
          reelId: reel.id,
          instagramUser: commenterUsername,
          name: commenterUsername,
          phone: '',
          status: 'CONTACTED',
        },
      });

      // Build DM
      const formUrl = `${process.env.NEXT_PUBLIC_APP_URL}/form/${user.id}?reel=${reel.id}&ig=${commenterUsername}`;
      const message = buildLeadFormDM(formUrl, reel.productName);

      try {
        await sendInstagramDM(
          {
            recipientId: commenterId,
            message,
            accessToken,
            igUserId,
          },
          user.id
        );

        await logger.info(
          'Webhook',
          `DM sent to @${commenterUsername}`,
          { reelId: reel.id, leadId: lead.id },
          user.id
        );
      } catch (err) {
        console.error("DM send failed:", err);

        await logger.error(
          'Webhook',
          'DM failed after lead creation',
          { reelId: reel.id, leadId: lead.id, error: String(err) },
          user.id
        );
      }
    }
  }
}