# 💍 JewelLead — Lead Automation for Jewelry Shops

A production-ready multi-tenant SaaS platform that automatically captures Instagram reel comments, sends DMs with lead forms, and manages follow-ups via WhatsApp.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Meta Developer Account (Instagram + WhatsApp)

### 1. Clone & Install

```bash
cd jewellead
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values
```

**Required Variables:**
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Min 32 chars, random string |
| `ENCRYPTION_KEY` | Exactly 32 chars for token encryption |
| `META_WEBHOOK_VERIFY_TOKEN` | Any secret string for Instagram webhook |
| `CRON_SECRET` | Secret to protect cron endpoints |

### 3. Setup Database

```bash
npm run db:push        # Push schema to DB
npm run db:seed        # Load demo data
```

Demo login: `demo@jewellead.com` / `password123`

### 4. Run Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Production Deployment

### Option A: Vercel (Recommended)

1. Push code to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Set `DATABASE_URL` to your hosted PostgreSQL (Supabase / Railway / Neon)
5. Deploy!

**Cron jobs are auto-configured via `vercel.json`:**
- Follow-up: Daily at 10:00 AM IST
- Summary: Daily at 9:00 PM IST

### Option B: Docker

```bash
# Build and run
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy
```

---

## 🔗 Instagram Webhook Setup

1. Go to [Meta Developer Console](https://developers.facebook.com)
2. Create/select your App → Add Instagram product
3. Webhook URL: `https://yourdomain.com/api/webhooks/instagram`
4. Verify Token: Value from `META_WEBHOOK_VERIFY_TOKEN` in your `.env`
5. Subscribe to: **comments** field
6. Approve required permissions

---

## 💬 WhatsApp Setup

1. Go to Meta Business Manager → WhatsApp → Getting Started
2. Create message templates (must be approved by Meta):
   - `jewellead_followup` — for 2-day follow-up
   - `jewellead_daily_summary` — for owner summary
   - `jewellead_festival_offer` — campaign
   - `jewellead_bridal_offer` — campaign
   - `jewellead_gold_rate_drop` — campaign
   - `jewellead_new_collection` — campaign
3. Copy Phone Number ID and Access Token to Settings in dashboard

---

## 🏗️ Architecture

```
jewellead/
├── prisma/
│   ├── schema.prisma       # Multi-tenant DB schema
│   └── seed.ts             # Demo data
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/       # Login, register, logout
│   │   │   ├── leads/      # Lead CRUD + stats
│   │   │   ├── reels/      # Reel management
│   │   │   ├── campaigns/  # Broadcast campaigns
│   │   │   ├── webhooks/   # Instagram webhook
│   │   │   ├── form/       # Public lead capture
│   │   │   └── cron/       # Automated jobs
│   │   ├── auth/           # Login & Register pages
│   │   ├── dashboard/      # Protected dashboard
│   │   │   ├── overview/
│   │   │   ├── leads/
│   │   │   ├── reels/
│   │   │   ├── campaigns/
│   │   │   └── settings/
│   │   └── form/[userId]/  # Public lead form
│   ├── components/
│   │   └── dashboard/      # Sidebar, etc.
│   └── lib/
│       ├── auth.ts         # JWT + bcrypt
│       ├── encryption.ts   # AES-256-GCM
│       ├── logger.ts       # Structured logging
│       ├── prisma.ts       # DB singleton
│       ├── rateLimit.ts    # In-memory rate limiter
│       ├── whatsapp.ts     # WhatsApp Cloud API
│       ├── instagram.ts    # Instagram Graph API
│       ├── validations.ts  # Zod schemas
│       └── campaignTemplates.ts
├── middleware.ts           # Auth protection
├── Dockerfile
├── docker-compose.yml
└── vercel.json
```

---

## 🔒 Security

- JWT tokens stored in httpOnly cookies
- All API tokens encrypted at rest (AES-256-GCM)
- Every DB query scoped by `userId` (multi-tenant isolation)
- Rate limiting on webhook + public form endpoints
- Zod input validation on all API routes
- CRON endpoints protected with `x-cron-secret` header
- Admin alerts via Telegram on critical errors

---

## 📊 Database Schema

| Table | Purpose |
|---|---|
| `User` | Shop owner accounts (tenant root) |
| `Reel` | Instagram reels being monitored |
| `Lead` | Captured leads scoped to user |
| `FollowUpLog` | All automated message history |
| `Campaign` | Bulk broadcast campaigns |
| `SystemLog` | Error and info logging |

---

## 🔄 Automation Flow

```
Instagram Comment (trigger word)
    ↓
Webhook received → Find reel → Send DM
    ↓
Customer clicks form link → Fills Name/Phone/City
    ↓
Lead saved in DB → WhatsApp alert to owner
    ↓
2 days later (cron) → Auto follow-up WhatsApp
    ↓
Owner updates status → Automation stops
    ↓
9 PM daily (cron) → Summary WhatsApp to owner
```

---

## 💳 Billing (Phase 2 Ready)

The schema already includes:
- `subscriptionStatus`: TRIAL | ACTIVE | EXPIRED | CANCELLED
- `trialEndsAt`: Date field
- `subscriptionId` / `planId`: Razorpay integration fields

To implement Razorpay: create `/api/billing/checkout` and webhook at `/api/billing/webhook`.

---

## 📞 Support

This is a production SaaS. For issues, check `SystemLog` table in your database or Telegram alerts.
