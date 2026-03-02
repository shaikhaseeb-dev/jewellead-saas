'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, MapPin, Store, AlertCircle, ArrowRight } from 'lucide-react';

type FormState = { shopName: string; ownerName: string; phone: string; email: string; password: string; city: string; };

const ROWS: { key: keyof FormState; label: string; placeholder: string; type: string; Icon: React.ElementType; maxLength?: number }[][] = [
  [
    { key: 'shopName',  label: 'Shop Name',     placeholder: 'Meera Jewellers',  type: 'text',     Icon: Store },
    { key: 'ownerName', label: 'Your Name',      placeholder: 'Rahul Gupta',      type: 'text',     Icon: User },
  ],
  [
    { key: 'phone', label: 'Mobile Number', placeholder: '9876543210', type: 'tel',  Icon: Phone, maxLength: 10 },
    { key: 'city',  label: 'City',          placeholder: 'Mumbai',     type: 'text', Icon: MapPin },
  ],
  [{ key: 'email',    label: 'Email Address',  placeholder: 'you@yourshop.com',  type: 'email',    Icon: Mail }],
  [{ key: 'password', label: 'Password',        placeholder: 'Min. 8 characters', type: 'password', Icon: Lock }],
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ shopName: '', ownerName: '', phone: '', email: '', password: '', city: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? 'Registration failed.'); return; }
    router.push('/dashboard/overview');
    router.refresh();
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%', background: '#161616',
    border: `1px solid ${focused === field ? '#C6A75E' : '#242424'}`,
    borderRadius: '10px', color: '#F5F0E8',
    padding: '11px 12px 11px 38px',
    fontSize: '13px', fontFamily: "'DM Sans', system-ui, sans-serif",
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused === field ? '0 0 0 3px rgba(198,167,94,0.1)' : 'none',
    boxSizing: 'border-box',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '10px', fontWeight: 600,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: '#7A756C', marginBottom: '6px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  };

  return (
    <div style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '20px', padding: '32px 28px', boxShadow: '0 8px 48px rgba(0,0,0,0.55)' }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 500, color: '#F5F0E8', margin: '0 0 5px', letterSpacing: '-0.01em' }}>
        Create your account
      </h2>
      <p style={{ fontSize: '12px', color: '#7A756C', margin: '0 0 24px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        Free 14-day trial · No credit card required
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {ROWS.map((row, ri) => (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: row.length === 2 ? '1fr 1fr' : '1fr', gap: '12px' }}>
            {row.map(({ key, label, placeholder, type, Icon, maxLength }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={14} color={focused === key ? '#C6A75E' : '#3E3A34'}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s', pointerEvents: 'none' }} />
                  <input type={type} value={form[key]} required maxLength={maxLength}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    onFocus={() => setFocused(key)} onBlur={() => setFocused(null)}
                    placeholder={placeholder} style={inputStyle(key)} />
                </div>
              </div>
            ))}
          </div>
        ))}

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: '9px' }}>
            <AlertCircle size={14} color="#FCA5A5" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: '#FCA5A5', fontFamily: "'DM Sans', system-ui, sans-serif" }}>{error}</span>
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
            <><span style={{ width: '14px', height: '14px', border: '2px solid rgba(0,0,0,0.25)', borderTopColor: '#0A0A0A', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />Creating account...</>
          ) : (
            <>Start Free Trial <ArrowRight size={15} strokeWidth={2} /></>
          )}
        </button>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#3E3A34', fontFamily: "'DM Sans', system-ui, sans-serif" }}>✦ No credit card · Cancel anytime</p>
      </form>

      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #1E1E1E, transparent)', margin: '20px 0' }} />
      <p style={{ textAlign: 'center', fontSize: '13px', color: '#7A756C', fontFamily: "'DM Sans', system-ui, sans-serif", margin: 0 }}>
        Already have an account?{' '}
        <Link href="/auth/login" style={{ color: '#C6A75E', fontWeight: 500, textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
        >Sign in</Link>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
