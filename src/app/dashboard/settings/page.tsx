'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Store, Instagram, MessageCircle, CreditCard, Eye, EyeOff } from 'lucide-react';

type UserSettings = {
  shopName: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string | null;
  instagramUserId: string | null;
  instagramConnected: boolean;
  waPhoneNumberId: string | null;
  waBusinessId: string | null;
  waConnected: boolean;
  subscriptionStatus: string;
  trialEndsAt: string | null;
};

function Section({
  icon: Icon,
  title,
  subtitle,
  iconColor = '#C6A75E',
  iconBg = 'rgba(198,167,94,0.08)',
  badge,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  iconColor?: string;
  iconBg?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="lux-card"
      style={{ padding: '28px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: iconBg,
              border: `1px solid ${iconColor}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={18} color={iconColor} strokeWidth={1.5} />
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 500, color: '#F5F0E8', fontFamily: "'Cormorant Garamond', serif" }}>
              {title}
            </p>
            <p style={{ fontSize: '11px', color: '#7A756C', marginTop: '2px' }}>{subtitle}</p>
          </div>
        </div>
        {badge}
      </div>
      {children}
    </div>
  );
}

function ConnectedBadge() {
  return (
    <span style={{
      display: 'flex', alignItems: 'center', gap: '5px',
      background: 'rgba(134,239,172,0.08)',
      border: '1px solid rgba(134,239,172,0.2)',
      borderRadius: '999px',
      padding: '4px 10px',
      fontSize: '11px',
      fontWeight: 600,
      color: '#86EFAC',
    }}>
      <CheckCircle2 size={11} />
      Connected
    </span>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showIgToken, setShowIgToken] = useState(false);
  const [showWaToken, setShowWaToken] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then((data) => {
      setSettings(data.user);
      setForm({
        shopName: data.user.shopName ?? '',
        ownerName: data.user.ownerName ?? '',
        phone: data.user.phone ?? '',
        city: data.user.city ?? '',
        instagramUserId: data.user.instagramUserId ?? '',
        instagramAccessToken: '',
        waPhoneNumberId: data.user.waPhoneNumberId ?? '',
        waAccessToken: '',
        waBusinessId: data.user.waBusinessId ?? '',
      });
    });
  }, []);

  const save = async (section: string, fields: string[]) => {
    setSaving(section);
    setSuccess('');
    setError('');
    const payload = fields.reduce<Record<string, string>>((acc, k) => ({ ...acc, [k]: form[k] ?? '' }), {});
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(null);
    if (!res.ok) { setError(data.error); return; }
    setSuccess(`${section} saved!`);
    const updated = await fetch('/api/settings').then((r) => r.json());
    setSettings(updated.user);
    setTimeout(() => setSuccess(''), 3000);
  };

  if (!settings) {
    return (
      <div style={{ padding: '64px', textAlign: 'center', color: '#7A756C' }}>
        Loading settings...
      </div>
    );
  }

  const F = (key: string) => ({
    value: form[key] ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '36px' }}>
        <h1 className="lux-title">Settings</h1>
        <p style={{ color: '#7A756C', marginTop: '6px', fontSize: '13px' }}>
          Manage your shop profile and integrations
        </p>
      </div>

      {/* Global alerts */}
      {success && (
        <div style={{
          marginBottom: '20px',
          background: 'rgba(134,239,172,0.06)',
          border: '1px solid rgba(134,239,172,0.15)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.3s ease',
        }}>
          <CheckCircle2 size={16} color="#86EFAC" />
          <span style={{ fontSize: '13px', color: '#86EFAC' }}>{success}</span>
        </div>
      )}
      {error && (
        <div style={{
          marginBottom: '20px',
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <AlertCircle size={16} color="#FCA5A5" />
          <span style={{ fontSize: '13px', color: '#FCA5A5' }}>{error}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Shop Profile */}
        <Section icon={Store} title="Shop Profile" subtitle="Basic info about your jewelry shop">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            {[
              { key: 'shopName', label: 'Shop Name', placeholder: 'Meera Jewellers' },
              { key: 'ownerName', label: 'Owner Name', placeholder: 'Rahul Gupta' },
              { key: 'phone', label: 'Mobile Number', placeholder: '9876543210' },
              { key: 'city', label: 'City', placeholder: 'Mumbai' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A756C', marginBottom: '6px', display: 'block' }}>
                  {label}
                </label>
                <input {...F(key)} placeholder={placeholder} className="lux-input" />
              </div>
            ))}
          </div>
          <button
            onClick={() => save('Shop profile', ['shopName', 'ownerName', 'phone', 'city'])}
            disabled={saving === 'Shop profile'}
            className="lux-btn lux-btn-gold"
          >
            {saving === 'Shop profile' ? 'Saving...' : 'Save Profile'}
          </button>
        </Section>

        {/* Instagram */}
        <Section
          icon={Instagram}
          title="Instagram"
          subtitle="Connect to capture reel comments automatically"
          iconColor="#E1306C"
          iconBg="rgba(225,48,108,0.08)"
          badge={settings.instagramConnected ? <ConnectedBadge /> : undefined}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A756C', marginBottom: '6px', display: 'block' }}>
                Instagram User ID
              </label>
              <input {...F('instagramUserId')} placeholder="17841400008460056" className="lux-input" />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A756C', marginBottom: '6px', display: 'block' }}>
                Access Token
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  {...F('instagramAccessToken')}
                  type={showIgToken ? 'text' : 'password'}
                  placeholder="From Meta Business Suite"
                  className="lux-input"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowIgToken(!showIgToken)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#7A756C', cursor: 'pointer' }}
                >
                  {showIgToken ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => save('Instagram', ['instagramUserId', 'instagramAccessToken'])}
            disabled={saving === 'Instagram'}
            className="lux-btn"
            style={{ background: 'linear-gradient(135deg, #E1306C, #C13584)', color: '#fff', boxShadow: '0 2px 12px rgba(225,48,108,0.25)' }}
          >
            {saving === 'Instagram' ? 'Saving...' : 'Connect Instagram'}
          </button>
        </Section>

        {/* WhatsApp */}
        <Section
          icon={MessageCircle}
          title="WhatsApp"
          subtitle="Send alerts, follow-ups and campaign broadcasts"
          iconColor="#25D366"
          iconBg="rgba(37,211,102,0.08)"
          badge={settings.waConnected ? <ConnectedBadge /> : undefined}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            {[
              { key: 'waPhoneNumberId', label: 'Phone Number ID', placeholder: 'From Meta Business Manager' },
              { key: 'waBusinessId', label: 'Business Account ID', placeholder: 'WABA ID' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A756C', marginBottom: '6px', display: 'block' }}>
                  {label}
                </label>
                <input {...F(key)} placeholder={placeholder} className="lux-input" />
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A756C', marginBottom: '6px', display: 'block' }}>
                Access Token
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  {...F('waAccessToken')}
                  type={showWaToken ? 'text' : 'password'}
                  placeholder="••••••••••••••••"
                  className="lux-input"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowWaToken(!showWaToken)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#7A756C', cursor: 'pointer' }}
                >
                  {showWaToken ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => save('WhatsApp', ['waPhoneNumberId', 'waAccessToken', 'waBusinessId'])}
            disabled={saving === 'WhatsApp'}
            className="lux-btn"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', boxShadow: '0 2px 12px rgba(37,211,102,0.2)' }}
          >
            {saving === 'WhatsApp' ? 'Saving...' : 'Connect WhatsApp'}
          </button>
        </Section>

        {/* Subscription */}
        <Section
          icon={CreditCard}
          title="Subscription"
          subtitle="Your current plan and billing status"
          iconColor="#A78BFA"
          iconBg="rgba(167,139,250,0.08)"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <span style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: settings.subscriptionStatus === 'ACTIVE'
                ? 'rgba(134,239,172,0.08)'
                : settings.subscriptionStatus === 'TRIAL'
                  ? 'rgba(198,167,94,0.08)'
                  : 'rgba(239,68,68,0.08)',
              color: settings.subscriptionStatus === 'ACTIVE'
                ? '#86EFAC'
                : settings.subscriptionStatus === 'TRIAL'
                  ? '#C6A75E'
                  : '#FCA5A5',
              border: `1px solid ${settings.subscriptionStatus === 'ACTIVE'
                ? 'rgba(134,239,172,0.2)'
                : settings.subscriptionStatus === 'TRIAL'
                  ? 'rgba(198,167,94,0.2)'
                  : 'rgba(239,68,68,0.15)'}`,
            }}>
              {settings.subscriptionStatus}
            </span>
            {settings.trialEndsAt && (
              <p style={{ fontSize: '12px', color: '#7A756C' }}>
                Trial ends {new Date(settings.trialEndsAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            )}
          </div>
          <div className="gold-divider" style={{ marginBottom: '16px' }} />
          <p style={{ fontSize: '12px', color: '#7A756C', lineHeight: 1.6 }}>
            Razorpay billing integration coming soon.{' '}
            <span style={{ color: '#C6A75E' }}>Contact us to upgrade your plan.</span>
          </p>
        </Section>
      </div>
    </div>
  );
}
