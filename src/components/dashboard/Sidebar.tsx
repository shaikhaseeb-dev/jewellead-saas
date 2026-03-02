'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Film,
  Megaphone, Settings, LogOut,
  Gem, HelpCircle,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard/overview',  label: 'Overview',   icon: LayoutDashboard },
  { href: '/dashboard/leads',     label: 'Leads',      icon: Users },
  { href: '/dashboard/reels',     label: 'Reels',      icon: Film },
  { href: '/dashboard/campaigns', label: 'Campaigns',  icon: Megaphone },
  { href: '/dashboard/settings',  label: 'Settings',   icon: Settings },
];

export default function Sidebar({ shopName }: { shopName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
    router.refresh();
  };

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      style={{
        width: '232px',
        minHeight: '100vh',
        background: '#0A0A0A',
        borderRight: '1px solid #1A1A1A',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '9px',
            background: 'linear-gradient(135deg, #C6A75E, #8B6B2E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(198,167,94,0.28)',
            flexShrink: 0,
          }}>
            <Gem size={17} color="#0A0A0A" strokeWidth={1.75} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: '17px', fontWeight: 600, color: '#F5F0E8',
              lineHeight: 1.1, letterSpacing: '-0.01em', margin: 0,
            }}>
              JewelLead
            </p>
            <p style={{
              fontSize: '11px', color: '#7A756C', marginTop: '2px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              maxWidth: '140px', margin: 0, fontFamily: "'DM Sans',system-ui,sans-serif",
            }}>
              {shopName}
            </p>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav style={{ flex: 1, padding: '14px 10px 10px' }}>
        <p style={{
          fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#3E3A34',
          padding: '0 8px', marginBottom: '8px',
          fontFamily: "'DM Sans',system-ui,sans-serif",
        }}>
          Menu
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '11px',
                  padding: '10px 12px', borderRadius: '10px',
                  fontSize: '13px', fontWeight: active ? 500 : 400,
                  color: active ? '#C6A75E' : '#7A756C',
                  background: active ? 'rgba(198,167,94,0.08)' : 'transparent',
                  textDecoration: 'none', position: 'relative',
                  transition: 'all 0.18s ease',
                  fontFamily: "'DM Sans',system-ui,sans-serif",
                  borderLeft: active ? '2px solid #C6A75E' : '2px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.color = '#C8C4BC';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#7A756C';
                  }
                }}
              >
                <Icon
                  size={15}
                  strokeWidth={active ? 2 : 1.5}
                  color={active ? '#C6A75E' : '#7A756C'}
                />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg,transparent,#1E1E1E,transparent)', margin: '14px 4px' }} />

        {/* Help link */}
        {(() => {
          const active = isActive('/dashboard/help');
          return (
            <Link
              href="/dashboard/help"
              style={{
                display: 'flex', alignItems: 'center', gap: '11px',
                padding: '10px 12px', borderRadius: '10px',
                fontSize: '13px', fontWeight: active ? 500 : 400,
                color: active ? '#C6A75E' : '#7A756C',
                background: active ? 'rgba(198,167,94,0.08)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.18s ease',
                fontFamily: "'DM Sans',system-ui,sans-serif",
                borderLeft: active ? '2px solid #C6A75E' : '2px solid transparent',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.color = '#C8C4BC';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#7A756C';
                }
              }}
            >
              <HelpCircle size={15} strokeWidth={active ? 2 : 1.5} color={active ? '#C6A75E' : '#7A756C'} />
              Help Center
            </Link>
          );
        })()}
      </nav>

      {/* Bottom: status + logout */}
      <div style={{ padding: '10px 10px 14px', borderTop: '1px solid #1A1A1A' }}>
        {/* Live indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 12px', borderRadius: '8px', background: '#111111',
          marginBottom: '6px',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#C6A75E', display: 'inline-block',
            boxShadow: '0 0 6px rgba(198,167,94,0.5)',
            animation: 'pulseGlow 2.5s infinite',
          }} />
          <span style={{ fontSize: '11px', color: '#7A756C', fontFamily: "'DM Sans',system-ui,sans-serif" }}>
            System online
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            width: '100%', padding: '9px 12px', borderRadius: '9px',
            background: 'transparent', border: 'none',
            color: '#5A5550', fontSize: '13px', cursor: 'pointer',
            transition: 'all 0.18s ease',
            fontFamily: "'DM Sans',system-ui,sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; e.currentTarget.style.color = '#FCA5A5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5A5550'; }}
        >
          <LogOut size={14} strokeWidth={1.5} />
          Sign out
        </button>
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(198,167,94,0.4); }
          50%      { box-shadow: 0 0 0 4px rgba(198,167,94,0); }
        }
      `}</style>
    </aside>
  );
}
