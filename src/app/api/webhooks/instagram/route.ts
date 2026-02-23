import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendInstagramDM, buildLeadFormDM, matchesTriggerWord } from '@/lib/instagram';
import { decrypt } from '@/lib/encryption';
import { rateLimit } from '@/lib/rateLimit';
import { logger } from '@/lib/logger';

// GET: Webhook verification by Meta
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// POST: Receive Instagram events
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, { max: 100, windowMs: 60_000 });
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  console.log("🔥 WEBHOOK PAYLOAD:", JSON.stringify(body, null, 2));

  // Always return 200 to Meta immediately
  processWebhook(body).catch(() => {});
  return NextResponse.json({ received: true });
}

interface MetaWebhookPayload {
  object?: string;
  entry?: Array<{
    id?: string;
    changes?: Array<{
      field?: string;
      value?: {
        media_id?: string;
        comments?: Array<{
          from?: { id?: string; username?: string };
          text?: string;
        }>;
        comment?: {
          from?: { id?: string; username?: string };
          text?: string;
        };
      };
    }>;
  }>;
}

async function processWebhook(body: unknown) {
  const payload = body as MetaWebhookPayload;

  if (payload.object !== 'instagram') return;

  for (const entry of payload.entry || []) {
    const igUserId = entry.id;

    // Find user by Instagram user ID
    const user = await prisma.user.findFirst({ where: { instagramUserId: igUserId } });
    if (!user || !user.instagramAccessToken) continue;

    const accessToken = decrypt(user.instagramAccessToken);

    for (const change of entry.changes || []) {
      if (change.field !== 'comments') continue;

      const comment = change.value?.comment;
      if (!comment) continue;

      const commenterId = comment.from?.id;
      const commenterUsername = comment.from?.username || '';
      const text = comment.text || '';
      const mediaId = change.value?.media_id;

      if (!commenterId) continue;

      // Find reel matching this media_id + user
      const reel = await prisma.reel.findFirst({
        where: { userId: user.id, reelId: mediaId, active: true },
      });

      if (!reel) continue;

      // Check trigger word
      if (!matchesTriggerWord(text, reel.triggerWord)) continue;

      // Avoid duplicate DMs
      const existing = await prisma.lead.findFirst({
        where: { userId: user.id, instagramUser: commenterUsername },
      });
      if (existing) continue;

      // Send DM with form link
      const formUrl = `${process.env.NEXT_PUBLIC_APP_URL}/form/${user.id}?reel=${reel.id}&ig=${commenterUsername}`;
      const message = buildLeadFormDM(formUrl, reel.productName);

      await sendInstagramDM(
        { recipientId: commenterId, message, accessToken, igUserId: igUserId! },
        user.id
      );

      // Create placeholder lead
      await prisma.lead.create({
        data: {
          userId: user.id,
          reelId: reel.id,
          instagramUser: commenterUsername,
          name: commenterUsername,
          phone: '',
          status: 'CONTACTED',
        },
      });

      await logger.info('Webhook', `DM sent to @${commenterUsername}`, { reelId: reel.id }, user.id);
    }
  }
}
