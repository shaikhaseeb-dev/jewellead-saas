'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Gem, MessageSquare, Users, Bell, TrendingUp, CheckCircle2,
  ArrowRight, ChevronDown, Star, Zap, Shield, BarChart3,
  Instagram, Phone, Mail, ExternalLink, Menu, X
} from 'lucide-react';

/* ─── Shared token styles ────────────────────────────────────────────────── */
const T = {
  bg:        '#0A0A0A',
  card:      '#111111',
  cardHover: '#161616',
  border:    '#1E1E1E',
  borderGold:'rgba(198,167,94,0.3)',
  gold:      '#C6A75E',
  goldDim:   '#A8894A',
  white:     '#F5F0E8',
  gray1:     '#C8C4BC',
  gray2:     '#7A756C',
  gray3:     '#3E3A34',
  font:      "'DM Sans', system-ui, sans-serif",
  serif:     "'Cormorant Garamond', Georgia, serif",
};

/* ─── Nav ─────────────────────────────────────────────────────────────────── */
function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,10,10,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #C6A75E, #8B6B2E)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(198,167,94,0.3)' }}>
            <Gem size={16} color="#0A0A0A" strokeWidth={2} />
          </div>
          <span style={{ fontFamily: T.serif, fontSize: '20px', fontWeight: 600, color: T.white, letterSpacing: '-0.01em' }}>JewelLead</span>
        </div>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="nav-desktop">
          {['Features', 'How It Works', 'Pricing', 'FAQ'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              style={{ fontSize: '13px', color: T.gray2, textDecoration: 'none', transition: 'color 0.2s', fontFamily: T.font }}
              onMouseEnter={e => e.currentTarget.style.color = T.white}
              onMouseLeave={e => e.currentTarget.style.color = T.gray2}
            >{item}</a>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/auth/login" style={{
            padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
            color: T.gray1, textDecoration: 'none', fontFamily: T.font,
            border: `1px solid ${T.border}`, background: 'transparent', transition: 'all 0.2s',
            display: 'inline-block',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderGold; e.currentTarget.style.color = T.white; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.gray1; }}
          >Sign In</Link>

          <Link href="/auth/register" style={{
            padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
            color: '#0A0A0A', textDecoration: 'none', fontFamily: T.font,
            background: 'linear-gradient(135deg, #C6A75E, #A8894A)',
            boxShadow: '0 2px 12px rgba(198,167,94,0.25)',
            display: 'inline-block', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(198,167,94,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(198,167,94,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >Start Free Trial</Link>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', color: T.gray1, cursor: 'pointer', padding: '4px' }}
            className="nav-mobile-btn"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ padding: '16px 24px 20px', background: T.card, borderTop: `1px solid ${T.border}` }}>
          {['Features', 'How It Works', 'Pricing', 'FAQ'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '10px 0', fontSize: '14px', color: T.gray1, textDecoration: 'none', borderBottom: `1px solid ${T.border}`, fontFamily: T.font }}
            >{item}</a>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            <Link href="/auth/login" style={{ textAlign: 'center', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, color: T.white, textDecoration: 'none', border: `1px solid ${T.border}`, fontFamily: T.font }}>Sign In</Link>
            <Link href="/auth/register" style={{ textAlign: 'center', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#0A0A0A', textDecoration: 'none', background: 'linear-gradient(135deg, #C6A75E, #A8894A)', fontFamily: T.font }}>Start Free Trial</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Section wrapper ─────────────────────────────────────────────────────── */
function Section({ id, children, style }: { id?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ padding: '96px 24px', maxWidth: '1120px', margin: '0 auto', ...style }}>
      {children}
    </section>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
      <div style={{ height: '1px', width: '32px', background: T.borderGold }} />
      <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.gold, fontFamily: T.font }}>{children}</span>
      <div style={{ height: '1px', width: '32px', background: T.borderGold }} />
    </div>
  );
}

function SectionTitle({ children, center = true }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2 style={{
      fontFamily: T.serif, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 500,
      color: T.white, textAlign: center ? 'center' : 'left',
      lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 16px',
    }}>{children}</h2>
  );
}

/* ─── 1. HERO ─────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{ paddingTop: '160px', paddingBottom: '96px', textAlign: 'center', padding: '160px 24px 96px', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '120px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(198,167,94,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(198,167,94,0.08)', border: `1px solid ${T.borderGold}`, marginBottom: '28px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.gold, display: 'inline-block' }} />
          <span style={{ fontSize: '12px', color: T.gold, fontWeight: 500, fontFamily: T.font }}>Built for Indian Jewelry Shops</span>
        </div>

        <h1 style={{
          fontFamily: T.serif, fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 500,
          color: T.white, lineHeight: 1.1, letterSpacing: '-0.025em', marginBottom: '24px',
        }}>
          Turn Instagram{' '}
          <span style={{ fontStyle: 'italic', color: T.gold }}>"Price?"</span>
          {' '}Comments<br />Into Real Jewelry Buyers.
        </h1>

        <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: T.gray1, lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 40px', fontFamily: T.font, fontWeight: 300 }}>
          Automatically reply to reel comments, capture serious buyers in a structured dashboard, and follow up on WhatsApp — without manual work.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
          <Link href="/auth/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '14px 28px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #C6A75E, #A8894A)',
            color: '#0A0A0A', fontSize: '15px', fontWeight: 600,
            textDecoration: 'none', fontFamily: T.font,
            boxShadow: '0 4px 24px rgba(198,167,94,0.3)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 32px rgba(198,167,94,0.45)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(198,167,94,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Start Free Trial <ArrowRight size={16} strokeWidth={2} />
          </Link>

          <a href="https://calendly.com/jewellead-in/instagram-lead-automation-demo-jewellery-brands"
target="_blank"
rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '14px 28px', borderRadius: '12px',
            border: `1px solid ${T.border}`, background: 'transparent',
            color: T.gray1, fontSize: '15px', fontWeight: 500,
            textDecoration: 'none', fontFamily: T.font, transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderGold; e.currentTarget.style.color = T.white; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.gray1; }}
          >
            Book 15-min Demo
          </a>
        </div>

        {/* Social proof */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={13} color={T.gold} fill={T.gold} />)}
            <span style={{ fontSize: '13px', color: T.gray2, marginLeft: '4px', fontFamily: T.font }}>Loved by 200+ shops</span>
          </div>
          <div style={{ width: '1px', height: '16px', background: T.border }} />
          <span style={{ fontSize: '13px', color: T.gray2, fontFamily: T.font }}>14-day free trial</span>
          <div style={{ width: '1px', height: '16px', background: T.border }} />
          <span style={{ fontSize: '13px', color: T.gray2, fontFamily: T.font }}>No credit card required</span>
        </div>
      </div>
    </section>
  );
}

/* ─── 2. PAIN POINTS ──────────────────────────────────────────────────────── */
const PAINS = [
  { icon: MessageSquare, title: 'Missed DMs & Comments', body: 'Hundreds of interested buyers comment on your reels, but you\'re manually replying hours later — or never.' },
  { icon: Zap,           title: 'Slow Replies Kill Sales', body: 'A jewelry buyer who waits more than 10 minutes for a response usually moves on to a competitor.' },
  { icon: BarChart3,     title: 'Zero Tracking System', body: 'No way to see who showed interest, which products are hottest, or which leads need a follow-up today.' },
  { icon: Bell,          title: 'No Follow-up Process', body: 'Leads slip through the cracks because there\'s no automated reminder system to re-engage serious buyers.' },
];

function PainSection() {
  return (
    <section id="features" style={{ background: '#0D0D0D', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <Section>
        <SectionLabel>The Problem</SectionLabel>
        <SectionTitle>Every jewelry shop faces the same four problems.</SectionTitle>
        <p style={{ textAlign: 'center', color: T.gray2, fontSize: '16px', maxWidth: '520px', margin: '0 auto 56px', fontFamily: T.font, lineHeight: 1.6 }}>
          Instagram drives interest. But converting that interest into booked sales — that's where most shops fail.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {PAINS.map(({ icon: Icon, title, body }) => (
            <div key={title} style={{
              background: T.card, border: `1px solid ${T.border}`, borderRadius: '16px',
              padding: '28px', transition: 'border-color 0.25s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderGold; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(198,167,94,0.08)', border: `1px solid rgba(198,167,94,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Icon size={18} color={T.gold} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: T.serif, fontSize: '18px', fontWeight: 500, color: T.white, marginBottom: '10px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: T.gray2, lineHeight: 1.7, fontFamily: T.font }}>{body}</p>
            </div>
          ))}
        </div>
      </Section>
    </section>
  );
}

/* ─── 3. HOW IT WORKS ─────────────────────────────────────────────────────── */
const STEPS = [
  { num: '01', icon: Instagram, title: 'Comment Detected', body: 'Someone comments "interested" on your reel. JewelLead detects it instantly via Instagram webhook.' },
  { num: '02', icon: MessageSquare, title: 'Auto DM Sent', body: 'A professional DM is sent automatically with a secure form link. No manual action needed.' },
  { num: '03', icon: Users, title: 'Lead Captured', body: 'Buyer fills Name, Phone, City. Lead is stored in your dashboard, organized by product and status.' },
  { num: '04', icon: Phone, title: 'WhatsApp Follow-up', body: 'After 2 days, a WhatsApp follow-up is sent automatically. You get a daily summary at 9 PM.' },
];

function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '96px 24px', background: T.bg }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <SectionLabel>How It Works</SectionLabel>
        <SectionTitle>From reel comment to booked sale — automatically.</SectionTitle>
        <p style={{ textAlign: 'center', color: T.gray2, fontSize: '16px', maxWidth: '500px', margin: '0 auto 64px', fontFamily: T.font }}>Four steps. Zero manual work. Full visibility into every potential buyer.</p>

        <div style={{ position: 'relative' }}>
          {/* Connecting line */}
          <div style={{ position: 'absolute', top: '40px', left: '12.5%', right: '12.5%', height: '1px', background: `linear-gradient(90deg, transparent, ${T.borderGold}, ${T.borderGold}, transparent)`, display: 'none' }} className="step-line" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2px' }}>
            {STEPS.map(({ num, icon: Icon, title, body }, i) => (
              <div key={num} style={{ position: 'relative' }}>
                {/* Connector */}
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', right: '-1px', top: '36px', width: '2px', height: 'calc(100% - 36px)', background: `linear-gradient(180deg, ${T.border}, transparent)`, zIndex: 1 }} />
                )}
                <div style={{
                  padding: '32px 24px', background: T.card, border: `1px solid ${T.border}`,
                  borderRadius: '0',
                  borderTopLeftRadius: i === 0 ? '16px' : '0',
                  borderBottomLeftRadius: i === 0 ? '16px' : '0',
                  borderTopRightRadius: i === STEPS.length - 1 ? '16px' : '0',
                  borderBottomRightRadius: i === STEPS.length - 1 ? '16px' : '0',
                  borderLeft: i === 0 ? `1px solid ${T.border}` : 'none',
                  height: '100%', boxSizing: 'border-box' as const,
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#141414'}
                  onMouseLeave={e => e.currentTarget.style.background = T.card}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <span style={{ fontFamily: T.serif, fontSize: '13px', color: T.gold, fontWeight: 500 }}>{num}</span>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(198,167,94,0.06)', border: `1px solid ${T.borderGold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={T.gold} strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 style={{ fontFamily: T.serif, fontSize: '18px', fontWeight: 500, color: T.white, marginBottom: '10px' }}>{title}</h3>
                  <p style={{ fontSize: '13px', color: T.gray2, lineHeight: 1.7, fontFamily: T.font }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 4. PRODUCT PREVIEW ──────────────────────────────────────────────────── */
function ProductPreview() {
  return (
    <section style={{ background: '#0D0D0D', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: '96px 24px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <SectionLabel>Dashboard Preview</SectionLabel>
        <SectionTitle>Clean. Fast. Built for non-technical shop owners.</SectionTitle>
        <p style={{ textAlign: 'center', color: T.gray2, fontSize: '15px', maxWidth: '480px', margin: '0 auto 48px', fontFamily: T.font }}>
          Everything you need to manage leads — status tracking, WhatsApp follow-up, campaign broadcasts, and daily summaries.
        </p>

        {/* Mock dashboard */}
        <div style={{ borderRadius: '20px', border: `1px solid ${T.border}`, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
          {/* Fake browser bar */}
          <div style={{ background: '#0D0D0D', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['#FF5F56','#FFBD2E','#27C93F'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.6 }} />)}
            </div>
            <div style={{ flex: 1, background: T.card, borderRadius: '6px', padding: '5px 12px', maxWidth: '280px', margin: '0 auto' }}>
              <span style={{ fontSize: '11px', color: T.gray3, fontFamily: T.font }}>app.jewellead.com/dashboard</span>
            </div>
          </div>

          {/* Mock dashboard UI */}
          <div style={{ background: T.bg, display: 'flex', minHeight: '380px' }}>
            {/* Sidebar */}
            <div style={{ width: '180px', background: '#0A0A0A', borderRight: `1px solid ${T.border}`, padding: '20px 12px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px', marginBottom: '24px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, #C6A75E, #8B6B2E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Gem size={12} color="#0A0A0A" />
                </div>
                <span style={{ fontFamily: T.serif, fontSize: '14px', color: T.white }}>JewelLead</span>
              </div>
              {[
                { label: 'Overview', active: false },
                { label: 'Leads', active: true },
                { label: 'Reels', active: false },
                { label: 'Campaigns', active: false },
              ].map(({ label, active }) => (
                <div key={label} style={{
                  padding: '8px 10px', borderRadius: '8px', marginBottom: '2px',
                  background: active ? 'rgba(198,167,94,0.08)' : 'transparent',
                  borderLeft: active ? `2px solid ${T.gold}` : '2px solid transparent',
                }}>
                  <span style={{ fontSize: '12px', color: active ? T.gold : T.gray3, fontFamily: T.font }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Main content */}
            <div style={{ flex: 1, padding: '24px' }}>
              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'Total Leads', val: '247' },
                  { label: 'New Today',   val: '12' },
                  { label: 'Converted',   val: '38', gold: true },
                  { label: 'Rate',        val: '15.3%' },
                ].map(({ label, val, gold }) => (
                  <div key={label} style={{
                    background: gold ? 'linear-gradient(135deg, #171410, #111)' : T.card,
                    border: `1px solid ${gold ? T.borderGold : T.border}`,
                    borderRadius: '12px', padding: '14px',
                  }}>
                    <p style={{ fontFamily: T.serif, fontSize: '22px', fontWeight: 600, color: gold ? T.gold : T.white, margin: 0, lineHeight: 1 }}>{val}</p>
                    <p style={{ fontSize: '10px', color: T.gray3, marginTop: '4px', fontFamily: T.font, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Fake table */}
              <div style={{ background: T.card, borderRadius: '12px', border: `1px solid ${T.border}`, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 16px', borderBottom: `1px solid ${T.border}`, background: '#0D0D0D' }}>
                  {['Customer', 'Product', 'Status', 'Date'].map(h => (
                    <span key={h} style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.gray3, fontFamily: T.font }}>{h}</span>
                  ))}
                </div>
                {[
                  { name: 'Priya Gupta', prod: 'Gold Necklace', status: 'Converted', statusColor: '#C6A75E', date: 'Today' },
                  { name: 'Anita Shah', prod: 'Kundan Set', status: 'Interested', statusColor: '#C4B5FD', date: 'Yesterday' },
                  { name: 'Rekha Jain', prod: 'Diamond Ring', status: 'Follow Up', statusColor: '#FCD34D', date: '2 days ago' },
                ].map(({ name, prod, status, statusColor, date }) => (
                  <div key={name} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px 16px', borderBottom: `1px solid ${T.border}`, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(198,167,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600, color: T.gold }}>{name[0]}</div>
                      <span style={{ fontSize: '11px', color: T.white, fontFamily: T.font }}>{name}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: T.gray2, fontFamily: T.font }}>{prod}</span>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: statusColor, fontFamily: T.font }}>{status}</span>
                    <span style={{ fontSize: '10px', color: T.gray3, fontFamily: T.font }}>{date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 5. PRICING ──────────────────────────────────────────────────────────── */
const STARTER_FEATURES = [
  'Up to 3 active reels',
  'Comment auto-detection & DM reply',
  'Structured lead dashboard',
  'WhatsApp new lead alerts',
  '2-day auto follow-up',
  'Daily summary messages',
  '14-day free trial',
];

const GROWTH_FEATURES = [
  'Unlimited active reels',
  'Everything in Starter',
  'Campaign broadcasts (4 templates)',
  'Advanced lead analytics',
  'Multiple Instagram accounts',
  'Priority WhatsApp support',
  'Razorpay billing integration',
];

function Pricing() {
  return (
    <section id="pricing" style={{ background: T.bg, padding: '96px 24px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <SectionLabel>Pricing</SectionLabel>
        <SectionTitle>Simple plans. No hidden fees.</SectionTitle>
        <p style={{ textAlign: 'center', color: T.gray2, fontSize: '15px', maxWidth: '440px', margin: '0 auto 56px', fontFamily: T.font }}>
          Start free. Upgrade when you&apos;re ready. Cancel anytime.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '720px', margin: '0 auto' }}>
          {/* Starter */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '36px 32px' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.gray2, fontFamily: T.font, marginBottom: '12px' }}>Starter</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '6px' }}>
              <span style={{ fontFamily: T.serif, fontSize: '42px', fontWeight: 600, color: T.white, lineHeight: 1 }}>₹999</span>
              <span style={{ fontSize: '13px', color: T.gray2, marginBottom: '6px', fontFamily: T.font }}>/month</span>
            </div>
            <p style={{ fontSize: '13px', color: T.gray2, marginBottom: '28px', fontFamily: T.font }}>Perfect for shops just starting with lead automation.</p>

            <div style={{ height: '1px', background: T.border, marginBottom: '24px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {STARTER_FEATURES.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={15} color={T.gray2} strokeWidth={2} style={{ marginTop: '1px', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: T.gray1, fontFamily: T.font }}>{f}</span>
                </div>
              ))}
            </div>

            
            <Link href="/auth/register" style={{
              display: 'block', textAlign: 'center', padding: '13px',
              borderRadius: '10px', border: `1px solid ${T.border}`,
              color: T.white, fontSize: '14px', fontWeight: 500,
              textDecoration: 'none', fontFamily: T.font, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderGold; e.currentTarget.style.background = 'rgba(198,167,94,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = 'transparent'; }}
            >Start Free Trial</Link>
          </div>

          {/* Growth */}
          <div style={{
            background: 'linear-gradient(160deg, #171410 0%, #111111 40%, #13100A 100%)',
            border: `1px solid ${T.borderGold}`,
            borderRadius: '20px', padding: '36px 32px', position: 'relative',
            boxShadow: `0 0 0 1px rgba(198,167,94,0.08), 0 20px 60px rgba(198,167,94,0.06)`,
          }}>
            {/* Popular badge */}
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #C6A75E, #A8894A)', borderRadius: '999px', padding: '4px 14px', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0A0A0A', fontFamily: T.font, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Most Popular</span>
            </div>

            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.gold, fontFamily: T.font, marginBottom: '12px' }}>Growth</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '6px' }}>
              <span style={{ fontFamily: T.serif, fontSize: '42px', fontWeight: 600, color: T.gold, lineHeight: 1 }}>₹2,499</span>
              <span style={{ fontSize: '13px', color: T.gray2, marginBottom: '6px', fontFamily: T.font }}>/month</span>
            </div>
            <p style={{ fontSize: '13px', color: T.gray2, marginBottom: '28px', fontFamily: T.font }}>For shops serious about scaling lead automation.</p>

            <div style={{ height: '1px', background: T.borderGold, marginBottom: '24px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {GROWTH_FEATURES.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={15} color={T.gold} strokeWidth={2} style={{ marginTop: '1px', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: T.gray1, fontFamily: T.font }}>{f}</span>
                </div>
              ))}
            </div>

            <Link href="/auth/register" style={{
              display: 'block', textAlign: 'center', padding: '13px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #C6A75E, #A8894A)',
              color: '#0A0A0A', fontSize: '14px', fontWeight: 600,
              textDecoration: 'none', fontFamily: T.font,
              boxShadow: '0 2px 16px rgba(198,167,94,0.25)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(198,167,94,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(198,167,94,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >Start Free Trial</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 6. FAQ ──────────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'Does JewelLead work with any Instagram account?',
    a: 'JewelLead works with Instagram Business accounts connected through Meta\'s official API. You\'ll need a Meta Business Manager account and your Instagram must be set to Professional / Business mode. Setup takes about 10 minutes.',
  },
  {
    q: 'Will leads actually fill in the form that gets sent via DM?',
    a: 'Yes — our form is extremely simple: just Name, Phone, and City. It takes under 30 seconds. The DM is crafted to feel natural and personal, not automated, which drives high completion rates.',
  },
  {
    q: 'What happens if my Instagram webhook gets blocked temporarily?',
    a: 'JewelLead includes a polling fallback system that automatically checks for new comments every 15 minutes when webhooks are unavailable. No leads are missed during Meta verification periods.',
  },
  {
    q: 'Do I need technical knowledge to set this up?',
    a: 'No. Our onboarding guides you step by step through connecting Instagram and WhatsApp. Most shop owners are fully set up in under 30 minutes. We also offer a free 15-minute setup call.',
  },
  {
    q: 'Can I try before paying? What happens after the trial?',
    a: 'Yes — every new account gets a full 14-day free trial with all features. No credit card required to start. After 14 days, choose a plan or your account pauses (your data is never deleted).',
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ background: '#0D0D0D', borderTop: `1px solid ${T.border}`, padding: '96px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <SectionLabel>FAQ</SectionLabel>
        <SectionTitle>Common questions, answered.</SectionTitle>

        <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {FAQS.map(({ q, a }, i) => (
            <div key={i} style={{
              background: open === i ? T.card : 'transparent',
              border: `1px solid ${open === i ? T.borderGold : T.border}`,
              borderRadius: '12px', overflow: 'hidden', transition: 'all 0.25s',
              marginBottom: '2px',
            }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', padding: '20px 24px', background: 'none', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 500, color: open === i ? T.white : T.gray1, fontFamily: T.font, lineHeight: 1.4 }}>{q}</span>
                <ChevronDown size={16} color={T.gray2} style={{ flexShrink: 0, transform: open === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s' }} />
              </button>
              {open === i && (
                <div style={{ padding: '0 24px 20px' }}>
                  <p style={{ fontSize: '14px', color: T.gray2, lineHeight: 1.75, fontFamily: T.font, margin: 0 }}>{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 7. FOOTER ───────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: T.bg, borderTop: `1px solid ${T.border}`, padding: '48px 24px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #C6A75E, #8B6B2E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gem size={14} color="#0A0A0A" strokeWidth={2} />
          </div>
          <span style={{ fontFamily: T.serif, fontSize: '17px', color: T.white }}>JewelLead</span>
          <span style={{ fontSize: '12px', color: T.gray3, fontFamily: T.font }}>© 2025</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
          ].map(({ label, href }) => (
            <a key={label} href={href} style={{ fontSize: '13px', color: T.gray3, textDecoration: 'none', fontFamily: T.font, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = T.gray1}
              onMouseLeave={e => e.currentTarget.style.color = T.gray3}
            >{label}</a>
          ))}

          <a href="mailto:support@jewellead.com" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', color: T.gray2, textDecoration: 'none', fontFamily: T.font,
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = T.gold}
            onMouseLeave={e => e.currentTarget.style.color = T.gray2}
          >
            <Mail size={13} />
            support@jewellead.com
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      
      <Nav />
      <Hero />
      <PainSection />
      <HowItWorks />
      <ProductPreview />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
