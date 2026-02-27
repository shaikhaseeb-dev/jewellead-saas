'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Film,
  Megaphone,
  Settings,
  LogOut,
  Gem,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard/overview',   label: 'Overview',   icon: LayoutDashboard },
  { href: '/dashboard/leads',      label: 'Leads',      icon: Users },
  { href: '/dashboard/reels',      label: 'Reels',      icon: Film },
  { href: '/dashboard/campaigns',  label: 'Campaigns',  icon: Megaphone },
  { href: '/dashboard/settings',   label: 'Settings',   icon: Settings },
];

export default function Sidebar({ shopName }: { shopName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
    router.refresh();
  };

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
      <div style={{ padding: '28px 20px 24px', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #C6A75E, #8B6B2E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(198,167,94,0.3)',
              flexShrink: 0,
            }}
          >
            <Gem size={18} color="#0A0A0A" strokeWidth={1.75} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '18px',
                fontWeight: 600,
                color: '#F5F0E8',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
              }}
            >
              JewelLead
            </p>
            <p
              style={{
                fontSize: '11px',
                color: '#7A756C',
                marginTop: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '140px',
              }}
            >
              {shopName}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        <p
          style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#3E3A34',
            padding: '0 8px',
            marginBottom: '8px',
          }}
        >
          Navigation
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="nav-link"
                style={{
                  background: active ? 'rgba(198,167,94,0.08)' : 'transparent',
                  color: active ? '#C6A75E' : '#7A756C',
                }}
              >
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: '18px',
                      width: '2px',
                      background: '#C6A75E',
                      borderRadius: '0 2px 2px 0',
                      boxShadow: '0 0 8px rgba(198,167,94,0.5)',
                    }}
                  />
                )}
                <Icon
                  size={16}
                  strokeWidth={active ? 2 : 1.5}
                  color={active ? '#C6A75E' : '#7A756C'}
                />
                <span style={{ fontWeight: active ? 500 : 400 }}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: '1px solid #1A1A1A' }}>
        {/* Status indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            borderRadius: '10px',
            background: '#111111',
            marginBottom: '8px',
          }}
        >
          <span className="pulse-dot" />
          <span style={{ fontSize: '11px', color: '#7A756C' }}>System online</span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '10px 12px',
            borderRadius: '10px',
            background: 'transparent',
            border: 'none',
            color: '#5A5550',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
            e.currentTarget.style.color = '#FCA5A5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#5A5550';
          }}
        >
          <LogOut size={15} strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
