'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#161616',
  border: '1px solid #242424',
  borderRadius: '10px',
  color: '#F5F0E8',
  padding: '12px 14px 12px 40px',
  fontSize: '14px',
  fontFamily: "'DM Sans', system-ui, sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: '#7A756C',
  marginBottom: '7px',
  fontFamily: "'DM Sans', system-ui, sans-serif",
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

    if (!res.ok) {
      setError(data.error ?? 'Login failed. Please try again.');
      return;
    }

    router.push('/dashboard/overview');
    router.refresh();
  };

  const getFocusStyle = (field: string): React.CSSProperties =>
    focusedField === field
      ? { borderColor: '#C6A75E', boxShadow: '0 0 0 3px rgba(198,167,94,0.1)' }
      : {};

  return (
    <div
      style={{
        background: '#111111',
        border: '1px solid #1E1E1E',
        borderRadius: '20px',
        padding: '36px 32px',
        boxShadow: '0 8px 48px rgba(0,0,0,0.6), 0 1px 0 rgba(198,167,94,0.08) inset',
      }}
    >
      {/* Heading */}
      <div style={{ marginBottom: '28px' }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '26px',
            fontWeight: 500,
            color: '#F5F0E8',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          Welcome back
        </h2>
        <p
          style={{
            fontSize: '13px',
            color: '#7A756C',
            marginTop: '5px',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
        >
          Sign in to your shop dashboard
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* Email */}
        <div>
          <label style={labelStyle}>Email address</label>
          <div style={{ position: 'relative' }}>
            <Mail
              size={15}
              color={focusedField === 'email' ? '#C6A75E' : '#3E3A34'}
              style={{
                position: 'absolute',
                left: '13px',
                top: '50%',
                transform: 'translateY(-50%)',
                transition: 'color 0.2s',
                pointerEvents: 'none',
              }}
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="you@yourshop.com"
              required
              style={{ ...inputStyle, ...getFocusStyle('email') }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <Lock
              size={15}
              color={focusedField === 'password' ? '#C6A75E' : '#3E3A34'}
              style={{
                position: 'absolute',
                left: '13px',
                top: '50%',
                transform: 'translateY(-50%)',
                transition: 'color 0.2s',
                pointerEvents: 'none',
              }}
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              required
              style={{ ...inputStyle, ...getFocusStyle('password') }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: 'rgba(239,68,68,0.07)',
              border: '1px solid rgba(239,68,68,0.15)',
              borderRadius: '10px',
              padding: '11px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              animation: 'fadeIn 0.25s ease',
            }}
          >
            <AlertCircle size={14} color="#FCA5A5" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#FCA5A5', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              {error}
            </span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#8B6B2E' : 'linear-gradient(135deg, #C6A75E, #A8894A)',
            color: '#0A0A0A',
            border: 'none',
            borderRadius: '10px',
            padding: '13px 20px',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 16px rgba(198,167,94,0.25)',
            transition: 'all 0.2s ease',
            letterSpacing: '0.01em',
            marginTop: '4px',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(198,167,94,0.4)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 16px rgba(198,167,94,0.25)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(0,0,0,0.3)',
                  borderTopColor: '#0A0A0A',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }}
              />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight size={15} strokeWidth={2} />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #1E1E1E, transparent)',
          margin: '24px 0',
        }}
      />

      {/* Register link */}
      <p
        style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#7A756C',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        New to JewelLead?{' '}
        <Link
          href="/auth/register"
          style={{
            color: '#C6A75E',
            fontWeight: 500,
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          Create free account
        </Link>
      </p>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
