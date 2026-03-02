'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Instagram, MessageCircle, Zap, Bell,
  CreditCard, Mail, ArrowRight, CheckCircle2,
  ChevronRight, ChevronDown,
} from 'lucide-react';

/* ─── Tokens ─────────────────────────────────────────────────────────────── */
const T = {
  card:       '#111111',
  border:     '#1E1E1E',
  gold:       '#C6A75E',
  goldBorder: 'rgba(198,167,94,0.25)',
  white:      '#F5F0E8',
  gray1:      '#C8C4BC',
  gray2:      '#7A756C',
  gray3:      '#3E3A34',
  font:       "'DM Sans', system-ui, sans-serif",
  serif:      "'Cormorant Garamond', serif",
};

/* ─── HelpCard ───────────────────────────────────────────────────────────── */
function HelpCard({
  id, icon: Icon, iconColor, iconBg, title, children,
}: {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div id={id} style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: '16px', overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* Card header — clickable to collapse */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '22px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer',
          borderBottom: open ? `1px solid ${T.border}` : 'none',
          transition: 'border-color 0.2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: iconBg, border: `1px solid ${iconColor}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon size={17} color={iconColor} strokeWidth={1.5} />
          </div>
          <h2 style={{
            fontFamily: T.serif, fontSize: '19px', fontWeight: 500,
            color: T.white, margin: 0,
          }}>
            {title}
          </h2>
        </div>
        <ChevronDown
          size={16} color={T.gray3}
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s' }}
        />
      </button>

      {open && (
        <div style={{ padding: '24px 28px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Step ───────────────────────────────────────────────────────────────── */
function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '13px' }}>
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
        background: 'rgba(198,167,94,0.1)', border: '1px solid rgba(198,167,94,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '10px', fontWeight: 700, color: T.gold, fontFamily: T.font,
        marginTop: '1px',
      }}>
        {n}
      </div>
      <p style={{ fontSize: '13px', color: T.gray1, lineHeight: 1.72, fontFamily: T.font, margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

/* ─── CheckItem ──────────────────────────────────────────────────────────── */
function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '9px', marginBottom: '10px', alignItems: 'flex-start' }}>
      <CheckCircle2 size={13} color={T.gold} strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
      <p style={{ fontSize: '13px', color: T.gray1, lineHeight: 1.65, fontFamily: T.font, margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

/* ─── Code ───────────────────────────────────────────────────────────────── */
function Code({ children }: { children: string }) {
  return (
    <code style={{
      background: '#0D0D0D', border: '1px solid #2A2A2A', borderRadius: '5px',
      padding: '1px 7px', fontSize: '12px', color: T.gold, fontFamily: 'monospace',
      display: 'inline-block',
    }}>
      {children}
    </code>
  );
}

/* ─── Divider ────────────────────────────────────────────────────────────── */
function Divider() {
  return <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,#1E1E1E,transparent)', margin: '18px 0' }} />;
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function HelpPage() {
  return (
    <div>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontFamily: T.serif, fontSize: '32px', fontWeight: 500,
          color: T.white, margin: 0, letterSpacing: '-0.02em',
        }}>
          Help Center
        </h1>
        <p style={{ fontSize: '13px', color: T.gray2, marginTop: '6px', fontFamily: T.font }}>
          Setup guides, how-it-works explanations, and support resources.
        </p>
      </div>

      {/* Quick-jump bar */}
      <div style={{
        display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '28px',
        padding: '14px 18px', background: T.card,
        border: `1px solid ${T.border}`, borderRadius: '12px', alignItems: 'center',
      }}>
        <span style={{
          fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: T.gray3, marginRight: '4px', fontFamily: T.font,
        }}>
          Jump to
        </span>
        {[
          { label: 'Instagram',  href: '#help-instagram' },
          { label: 'WhatsApp',   href: '#help-whatsapp'  },
          { label: 'Trigger',    href: '#help-trigger'   },
          { label: 'Follow-ups', href: '#help-followup'  },
          { label: 'Billing',    href: '#help-billing'   },
          { label: 'Support',    href: '#help-support'   },
        ].map(({ label, href }) => (
          <a
            key={href} href={href}
            style={{
              padding: '4px 13px', borderRadius: '999px',
              border: `1px solid ${T.border}`, background: 'transparent',
              fontSize: '12px', color: T.gray2, textDecoration: 'none',
              fontFamily: T.font, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.goldBorder; e.currentTarget.style.color = T.gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;     e.currentTarget.style.color = T.gray2; }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* ── 1. Instagram ─────────────────────────────────────────────── */}
        <HelpCard id="help-instagram" icon={Instagram} iconColor="#E1306C" iconBg="rgba(225,48,108,0.08)" title="Connect Instagram">
          <p style={{ fontSize: '13px', color: T.gray2, lineHeight: 1.72, fontFamily: T.font, marginBottom: '20px' }}>
            JewelLead connects to your Instagram Business account via Meta&apos;s official Graph API.
            You need a Meta Business Manager account to proceed.
          </p>
          <Step n={1}>Go to <strong style={{ color: T.white }}>developers.facebook.com</strong> → My Apps → Create App → select <em>Business</em> type.</Step>
          <Step n={2}>Under Products, add <strong style={{ color: T.white }}>Instagram Graph API</strong>. Connect your Instagram Professional account.</Step>
          <Step n={3}>Go to <strong style={{ color: T.white }}>Tools → Graph API Explorer</strong>. Generate a User Access Token with: <Code>instagram_basic</Code> <Code>instagram_manage_comments</Code> <Code>pages_messaging</Code></Step>
          <Step n={4}>Convert your short-lived token to a <strong style={{ color: T.white }}>long-lived token</strong> (60-day) and verify expiry in Token Debugger.</Step>
          <Step n={5}>Find your <strong style={{ color: T.white }}>Instagram User ID</strong> by calling <Code>GET /me?fields=id,username</Code> in Graph Explorer.</Step>
          <Step n={6}>Paste both values into <strong style={{ color: T.white }}>Dashboard → Settings → Instagram</strong> and click Connect.</Step>
          <Divider />
          <div style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '10px', padding: '12px 16px' }}>
            <p style={{ fontSize: '12px', color: '#FCD34D', fontFamily: T.font, margin: 0, lineHeight: 1.65 }}>
              ⚠️ <strong>Webhook verification:</strong> During Meta business verification webhooks may pause. JewelLead automatically switches to 15-minute polling so no leads are missed.
            </p>
          </div>
        </HelpCard>

        {/* ── 2. WhatsApp ──────────────────────────────────────────────── */}
        <HelpCard id="help-whatsapp" icon={MessageCircle} iconColor="#25D366" iconBg="rgba(37,211,102,0.08)" title="Connect WhatsApp Cloud API">
          <p style={{ fontSize: '13px', color: T.gray2, lineHeight: 1.72, fontFamily: T.font, marginBottom: '20px' }}>
            JewelLead uses WhatsApp Cloud API (free tier) for lead alerts, auto follow-ups, and campaign broadcasts.
          </p>
          <Step n={1}>In Meta Business Manager, go to <strong style={{ color: T.white }}>WhatsApp → Getting Started</strong>. Add a phone number (must not be linked to personal WhatsApp).</Step>
          <Step n={2}>Copy your <strong style={{ color: T.white }}>Phone Number ID</strong> and <strong style={{ color: T.white }}>WhatsApp Business Account ID</strong> from the dashboard.</Step>
          <Step n={3}>Generate a <strong style={{ color: T.white }}>System User Token</strong> with <Code>whatsapp_business_messaging</Code> permission. Use System User (not a personal token) for production.</Step>
          <Step n={4}>Submit message templates for approval: <Code>jewellead_new_lead</Code>, <Code>jewellead_followup</Code>, <Code>jewellead_summary</Code>.</Step>
          <Step n={5}>Paste Phone Number ID, Business ID, and token into <strong style={{ color: T.white }}>Settings → WhatsApp</strong> and click Connect.</Step>
          <Divider />
          <CheckItem>Free tier allows 1,000 conversations/month — most shops stay comfortably within this.</CheckItem>
          <CheckItem>Template approval typically takes 10–30 minutes after submission.</CheckItem>
        </HelpCard>

        {/* ── 3. Trigger words ─────────────────────────────────────────── */}
        <HelpCard id="help-trigger" icon={Zap} iconColor={T.gold} iconBg="rgba(198,167,94,0.08)" title="How Comment Trigger Works">
          <p style={{ fontSize: '13px', color: T.gray2, lineHeight: 1.72, fontFamily: T.font, marginBottom: '20px' }}>
            Each reel has a configurable <strong style={{ color: T.white }}>trigger word</strong>. When someone comments it, JewelLead fires the full automation.
          </p>

          <div style={{ background: '#0D0D0D', border: `1px solid ${T.border}`, borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.gray3, fontFamily: T.font, marginBottom: '14px' }}>Flow</p>
            {[
              'Buyer comments "interested" on your reel',
              'JewelLead detects it via webhook (or 15-min poll)',
              'Auto-DM sent with your lead capture form link',
              'Buyer fills Name, Phone, City — takes 30 seconds',
              'Lead appears in your dashboard instantly',
            ].map((step, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: i < arr.length - 1 ? '10px' : 0 }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: T.gold, width: '16px', flexShrink: 0, fontFamily: T.font }}>{i + 1}</div>
                <ChevronRight size={11} color={T.gray3} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: T.gray1, fontFamily: T.font }}>{step}</span>
              </div>
            ))}
          </div>

          <CheckItem>Trigger matching is <strong style={{ color: T.white }}>case-insensitive</strong> and partial — "very Interested!" still triggers.</CheckItem>
          <CheckItem>Default trigger is <Code>interested</Code>. Change it per reel to <Code>price</Code>, <Code>details</Code>, <Code>buy</Code>, etc.</CheckItem>
          <CheckItem>Each Instagram user is processed <strong style={{ color: T.white }}>only once per reel</strong> — no duplicate leads.</CheckItem>
        </HelpCard>

        {/* ── 4. Follow-up automation ──────────────────────────────────── */}
        <HelpCard id="help-followup" icon={Bell} iconColor="#C4B5FD" iconBg="rgba(167,139,250,0.08)" title="How Follow-up Automation Works">
          <p style={{ fontSize: '13px', color: T.gray2, lineHeight: 1.72, fontFamily: T.font, marginBottom: '20px' }}>
            Two cron jobs run daily to keep your pipeline moving without any manual effort.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {[
              { when: 'Daily at 10 AM', title: '2-Day Follow-up', body: 'Leads 2+ days old and still in NEW, INTERESTED, or FOLLOW_UP get a WhatsApp reminder about the product they enquired about.' },
              { when: 'Daily at 3 PM',  title: 'Summary Report',  body: 'You receive a WhatsApp summary of today\'s new leads, conversion count, and leads needing your attention.' },
            ].map(({ when, title, body }) => (
              <div key={title} style={{ background: '#0D0D0D', border: `1px solid ${T.border}`, borderRadius: '12px', padding: '16px' }}>
                <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.gray3, fontFamily: T.font, marginBottom: '7px' }}>{when}</p>
                <p style={{ fontFamily: T.serif, fontSize: '15px', fontWeight: 500, color: T.white, marginBottom: '8px' }}>{title}</p>
                <p style={{ fontSize: '12px', color: T.gray2, lineHeight: 1.65, fontFamily: T.font, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
          <CheckItem>Follow-ups are skipped for <Code>NOT_INTERESTED</Code> and <Code>CONVERTED</Code> leads automatically.</CheckItem>
          <CheckItem>Each lead only ever gets one follow-up message (tracked by <Code>followUpSentAt</Code>).</CheckItem>
          <CheckItem>WhatsApp must be connected in Settings for automation to send.</CheckItem>
        </HelpCard>

        {/* ── 5. Billing ───────────────────────────────────────────────── */}
        <HelpCard id="help-billing" icon={CreditCard} iconColor={T.gold} iconBg="rgba(198,167,94,0.08)" title="Billing & Free Trial">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {[
              {
                plan: 'Starter', price: '₹999/mo', gold: false,
                features: ['Up to 3 active reels', 'Comment auto-replies', 'Lead dashboard', 'WhatsApp alerts', '2-day follow-ups', 'Daily summaries'],
              },
              {
                plan: 'Growth', price: '₹2,499/mo', gold: true,
                features: ['Unlimited reels', 'Everything in Starter', 'Campaign broadcasts', 'Advanced analytics', 'Priority support', 'Multi-account ready'],
              },
            ].map(({ plan, price, gold, features }) => (
              <div key={plan} style={{
                background: gold ? 'linear-gradient(135deg,#171410,#111)' : '#0D0D0D',
                border: `1px solid ${gold ? T.goldBorder : T.border}`,
                borderRadius: '12px', padding: '18px',
              }}>
                <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: gold ? T.gold : T.gray3, fontFamily: T.font, marginBottom: '7px' }}>{plan}</p>
                <p style={{ fontFamily: T.serif, fontSize: '24px', fontWeight: 600, color: gold ? T.gold : T.white, marginBottom: '14px' }}>{price}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={12} color={gold ? T.gold : T.gray2} strokeWidth={2} />
                      <span style={{ fontSize: '12px', color: T.gray1, fontFamily: T.font }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Divider />
          <CheckItem><strong style={{ color: T.white }}>14-day free trial</strong> — all Growth features included. No credit card required.</CheckItem>
          <CheckItem>After trial, choose a plan or your account pauses. Your data is never deleted.</CheckItem>
          <CheckItem>Billing via Razorpay (coming soon). Contact support to extend your trial if needed.</CheckItem>
        </HelpCard>

        {/* ── 6. Support ───────────────────────────────────────────────── */}
        <HelpCard id="help-support" icon={Mail} iconColor="#93C5FD" iconBg="rgba(96,165,250,0.08)" title="Contact Support">
          <p style={{ fontSize: '13px', color: T.gray2, lineHeight: 1.72, fontFamily: T.font, marginBottom: '20px' }}>
            We typically respond within 4 business hours. For urgent production issues, use WhatsApp.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {[
              { method: 'Email Support',    value: 'support@jewellead.com',  href: 'mailto:support@jewellead.com', icon: Mail,          color: '#93C5FD' },
              { method: 'WhatsApp (Urgent)', value: '+91 98765 43210',        href: 'https://wa.me/919876543210',   icon: MessageCircle, color: '#25D366' },
            ].map(({ method, value, href, icon: Icon, color }) => (
              <a
                key={method} href={href} target="_blank" rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '16px 18px', background: '#0D0D0D',
                  border: `1px solid ${T.border}`, borderRadius: '12px',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}35`; e.currentTarget.style.background = `${color}07`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;     e.currentTarget.style.background = '#0D0D0D'; }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: `${color}12`, border: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color={color} strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{ fontSize: '10px', color: T.gray3, fontFamily: T.font, margin: 0, marginBottom: '2px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{method}</p>
                  <p style={{ fontSize: '13px', color: T.white, fontFamily: T.font, margin: 0 }}>{value}</p>
                </div>
                <ArrowRight size={13} color={T.gray3} style={{ marginLeft: 'auto' }} />
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/dashboard/settings" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 18px', borderRadius: '9px',
              background: 'linear-gradient(135deg,#C6A75E,#A8894A)', color: '#0A0A0A',
              fontSize: '13px', fontWeight: 600, textDecoration: 'none',
              fontFamily: T.font, boxShadow: '0 2px 12px rgba(198,167,94,0.2)',
            }}>
              Go to Settings <ArrowRight size={13} />
            </Link>
            <Link href="/dashboard/overview" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 18px', borderRadius: '9px',
              border: `1px solid ${T.border}`, background: 'transparent',
              color: T.gray1, fontSize: '13px', textDecoration: 'none',
              fontFamily: T.font, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.goldBorder; e.currentTarget.style.color = T.white; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;     e.currentTarget.style.color = T.gray1; }}
            >
              Back to Dashboard
            </Link>
          </div>
        </HelpCard>

      </div>
    </div>
  );
}
