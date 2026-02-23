'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Instagram, MessageCircle, Store } from 'lucide-react';

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

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then((data) => {
      setSettings(data.user);
      setForm({
        shopName: data.user.shopName || '',
        ownerName: data.user.ownerName || '',
        phone: data.user.phone || '',
        city: data.user.city || '',
        instagramUserId: data.user.instagramUserId || '',
        instagramAccessToken: '',
        waPhoneNumberId: data.user.waPhoneNumberId || '',
        waAccessToken: '',
        waBusinessId: data.user.waBusinessId || '',
      });
    });
  }, []);

  const save = async (section: string, fields: string[]) => {
    setSaving(true);
    setSuccess('');
    setError('');
    const payload = fields.reduce((acc, k) => ({ ...acc, [k]: form[k] }), {});
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error); return; }
    setSuccess(`${section} saved successfully!`);
    // Refresh settings
    const updated = await fetch('/api/settings').then((r) => r.json());
    setSettings(updated.user);
  };

  if (!settings) return <div className="py-16 text-center text-muted-foreground">Loading settings...</div>;

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white";
  const labelClass = "block text-sm font-medium mb-1.5";

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your shop profile and integrations</p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 text-green-700 px-5 py-4 rounded-2xl border border-green-100 flex items-center gap-2">
          <CheckCircle2 size={18} /> {success}
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 text-red-600 px-5 py-4 rounded-2xl border border-red-100 flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Shop Profile */}
        <section className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
              <Store size={18} className="text-gold-600" />
            </div>
            <div>
              <h2 className="font-semibold text-base">Shop Profile</h2>
              <p className="text-xs text-muted-foreground">Basic info about your jewelry shop</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Shop Name</label>
              <input className={inputClass} value={form.shopName || ''} onChange={(e) => setForm({ ...form, shopName: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Owner Name</label>
              <input className={inputClass} value={form.ownerName || ''} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Mobile Number</label>
              <input className={inputClass} value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={10} />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input className={inputClass} value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
          </div>
          <button
            onClick={() => save('Shop profile', ['shopName', 'ownerName', 'phone', 'city'])}
            disabled={saving}
            className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60 text-sm"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </section>

        {/* Instagram */}
        <section className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                <Instagram size={18} className="text-pink-600" />
              </div>
              <div>
                <h2 className="font-semibold text-base">Instagram</h2>
                <p className="text-xs text-muted-foreground">Connect to capture reel comments</p>
              </div>
            </div>
            {settings.instagramConnected && (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 size={12} /> Connected
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Instagram User ID</label>
              <input className={inputClass} value={form.instagramUserId || ''} onChange={(e) => setForm({ ...form, instagramUserId: e.target.value })} placeholder="17841400008460056" />
            </div>
            <div>
              <label className={labelClass}>Access Token</label>
              <input className={inputClass} type="password" value={form.instagramAccessToken || ''} onChange={(e) => setForm({ ...form, instagramAccessToken: e.target.value })} placeholder="••••••••••••••••" />
              <p className="text-xs text-muted-foreground mt-1">Get from Meta Business Suite</p>
            </div>
          </div>
          <button
            onClick={() => save('Instagram', ['instagramUserId', 'instagramAccessToken'])}
            disabled={saving}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60 text-sm"
          >
            {saving ? 'Saving...' : 'Connect Instagram'}
          </button>
        </section>

        {/* WhatsApp */}
        <section className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <MessageCircle size={18} className="text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-base">WhatsApp</h2>
                <p className="text-xs text-muted-foreground">Send alerts, follow-ups, and campaigns</p>
              </div>
            </div>
            {settings.waConnected && (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 size={12} /> Connected
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Phone Number ID</label>
              <input className={inputClass} value={form.waPhoneNumberId || ''} onChange={(e) => setForm({ ...form, waPhoneNumberId: e.target.value })} placeholder="From Meta Business Manager" />
            </div>
            <div>
              <label className={labelClass}>Business Account ID</label>
              <input className={inputClass} value={form.waBusinessId || ''} onChange={(e) => setForm({ ...form, waBusinessId: e.target.value })} placeholder="WABA ID" />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Access Token</label>
              <input className={inputClass} type="password" value={form.waAccessToken || ''} onChange={(e) => setForm({ ...form, waAccessToken: e.target.value })} placeholder="••••••••••••••••" />
            </div>
          </div>
          <button
            onClick={() => save('WhatsApp', ['waPhoneNumberId', 'waAccessToken', 'waBusinessId'])}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60 text-sm"
          >
            {saving ? 'Saving...' : 'Connect WhatsApp'}
          </button>
        </section>

        {/* Subscription */}
        <section className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-semibold text-base mb-3">Subscription</h2>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
              settings.subscriptionStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' :
              settings.subscriptionStatus === 'TRIAL' ? 'bg-gold-100 text-gold-700' :
              'bg-red-100 text-red-600'
            }`}>
              {settings.subscriptionStatus}
            </span>
            {settings.trialEndsAt && (
              <span className="text-sm text-muted-foreground">
                Trial ends: {new Date(settings.trialEndsAt).toLocaleDateString('en-IN')}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Billing integration coming soon. Contact us to upgrade.
          </p>
        </section>
      </div>
    </div>
  );
}
