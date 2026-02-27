'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, MapPin, Store, AlertCircle, ArrowRight } from 'lucide-react';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#161616',
  border: '1px solid #242424',
  borderRadius: '10px',
  color: '#F5F0E8',
  padding: '11px 12px 11px 38px',
  fontSize: '13px',
  fontFamily: "'DM Sans', system-ui, sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: '#7A756C',
  marginBottom: '6px',
  fontFamily: "'DM Sans', system-ui, sans-serif",
};

interface FieldConfig {
  key: keyof FormState;
  label: string;
  placeholder: string;
  type: string;
  icon: React.ElementType;
  maxLength?: number;
}

const FIELDS: FieldConfig[][] = [
  [
    { key: 'shopName',  label: 'Shop Name',    placeholder: 'Meera Jewellers',  type: 'text',  icon: Store },
    { key: 'ownerName', label: 'Your Name',     placeholder: 'Rahul Gupta',      type: 'text',  icon: User },
  ],
  [
    { key: 'phone', label: 'Mobile Number', placeholder: '9876543210', type: 'tel',  icon: Phone, maxLength: 10 },
    { key: 'city',  label: 'City',          placeholder: 'Mumbai',     type: 'text', icon: MapPin },
  ],
  [
    { key: 'email', label: 'Email Address', placeholder: 'you@yourshop.com', type: 'email', icon: Mail },
  ],
  [
    { key: 'password', label: 'Password', placeholder: 'Min. 8 characters', type: 'password', icon: Lock },
  ],
];

type FormState = {
  shopName: string;
  ownerName: string;
  phone: string;
  email: string;
  password: string;
  city: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    shopName: '', ownerName: '', phone: '', email: '', password: '', city: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

    if (!res.ok) {
      setError(data.error ?? 'Registration failed. Please try again.');
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
        padding: '32px 28px',
        boxShadow: '0 8px 48px rgba(0,0,0,0.6), 0 1px 0 rgba(198,167,94,0.08) inset',
      }}
    >
      {/* Heading */}
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '24px',
            fontWeight: 500,
            color: '#F5F0E8',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          Create your account
        </h2>
        <p style={{ fontSize: '12px', color: '#7A756C', marginTop: '4px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          Set up your shop in 60 seconds · Free 14-day trial
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {FIELDS.map((row, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: 'grid',
              gridTemplateColumns: row.length === 2 ? '1fr 1fr' : '1fr',
              gap: '12px',
            }}
          >
            {row.map(({ key, label, placeholder, type, icon: Icon, maxLength }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon
                    size={14}
                    color={focusedField === key ? '#C6A75E' : '#3E3A34'}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      transition: 'color 0.2s',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    onFocus={() => setFocusedField(key)}
                    onBlur={() => setFocusedField(null)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    required
                    style={{ ...inputStyle, ...getFocusStyle(key) }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}

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
            }}
          >
            <AlertCircle size={14} color="#FCA5A5" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: '#FCA5A5', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
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
              Creating account...
            </>
          ) : (
            <>
              Start Free Trial
              <ArrowRight size={15} strokeWidth={2} />
            </>
          )}
        </button>

        {/* Trial note */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '11px',
            color: '#3E3A34',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
        >
          ✦ No credit card required · Cancel anytime
        </p>
      </form>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #1E1E1E, transparent)',
          margin: '20px 0',
        }}
      />

      <p style={{ textAlign: 'center', fontSize: '13px', color: '#7A756C', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        Already have an account?{' '}
        <Link
          href="/auth/login"
          style={{ color: '#C6A75E', fontWeight: 500, textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          Sign in
        </Link>
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
