'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? 'Login failed. Please try again.'); return; }
    router.push('/dashboard/overview');
    router.refresh();
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%', background: '#161616',
    border: `1px solid ${focused === field ? '#C6A75E' : '#242424'}`,
    borderRadius: '10px', color: '#F5F0E8',
    padding: '12px 14px 12px 42px',
    fontSize: '14px', fontFamily: "'DM Sans', system-ui, sans-serif",
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused === field ? '0 0 0 3px rgba(198,167,94,0.1)' : 'none',
    boxSizing: 'border-box',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: 600,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: '#7A756C', marginBottom: '7px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  };

  const iconColor = (field: string) => focused === field ? '#C6A75E' : '#3E3A34';

  return (
    <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '20px', padding: '36px 32px', boxShadow: '0 8px 48px rgba(0,0,0,0.55)' }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 500, color: '#F5F0E8', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
        Welcome back
      </h2>
      <p style={{ fontSize: '13px', color: '#7A756C', margin: '0 0 28px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        Sign in to your shop dashboard
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={labelStyle}>Email address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={15} color={iconColor('email')} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s', pointerEvents: 'none' }} />
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
              placeholder="you@yourshop.com" required style={inputStyle('email')} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={15} color={iconColor('password')} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s', pointerEvents: 'none' }} />
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
              placeholder="••••••••" required style={inputStyle('password')} />
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: '9px' }}>
            <AlertCircle size={14} color="#FCA5A5" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#FCA5A5', fontFamily: "'DM Sans', system-ui, sans-serif" }}>{error}</span>
          </div>
        )}

        <button type="submit" disabled={loading} style={{
          width: '100%', background: 'linear-gradient(135deg, #C6A75E, #A8894A)',
          color: '#0A0A0A', border: 'none', borderRadius: '10px',
          padding: '13px 20px', fontSize: '14px', fontWeight: 600,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: '0 2px 16px rgba(198,167,94,0.25)',
          transition: 'all 0.2s', marginTop: '4px', opacity: loading ? 0.7 : 1,
        }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 4px 24px rgba(198,167,94,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(198,167,94,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {loading ? (
            <><span style={{ width: '14px', height: '14px', border: '2px solid rgba(0,0,0,0.25)', borderTopColor: '#0A0A0A', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />Signing in...</>
          ) : (
            <>Sign In <ArrowRight size={15} strokeWidth={2} /></>
          )}
        </button>
      </form>

      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #1E1E1E, transparent)', margin: '24px 0' }} />

      <p style={{ textAlign: 'center', fontSize: '13px', color: '#7A756C', fontFamily: "'DM Sans', system-ui, sans-serif", margin: 0 }}>
        New to JewelLead?{' '}
        <Link href="/auth/register" style={{ color: '#C6A75E', fontWeight: 500, textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
        >Create free account</Link>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
