'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

export default function LeadFormPage({ params }: { params: { userId: string } }) {
  const searchParams = useSearchParams();
  const reelId = searchParams.get('reel') || '';
  const igUser = searchParams.get('ig') || '';

  const [form, setForm] = useState({ name: '', phone: '', city: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const res = await fetch('/api/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        userId: params.userId,
        reelId,
        instagramUser: igUser,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center border border-border">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Thank you! 🎉</h2>
          <p className="text-muted-foreground">
            We&apos;ve received your details. Our team will reach out to you shortly on WhatsApp.
          </p>
          <p className="text-xs text-muted-foreground mt-6">Powered by JewelLead 💍</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">💍</div>
          <h1 className="text-2xl font-display font-bold text-foreground">Interested?</h1>
          <p className="text-muted-foreground text-sm mt-1">Share your details and we&apos;ll contact you right away!</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-medium mb-2">Your Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Priya Sharma"
                required
                className="w-full px-4 py-4 rounded-2xl border border-border text-base focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">Mobile Number</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                type="tel"
                placeholder="9876543210"
                maxLength={10}
                required
                pattern="[6-9][0-9]{9}"
                className="w-full px-4 py-4 rounded-2xl border border-border text-base focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-2">Your City</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Mumbai"
                required
                className="w-full px-4 py-4 rounded-2xl border border-border text-base focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 rounded-2xl text-lg transition-colors disabled:opacity-60"
            >
              {submitting ? 'Sending...' : '📲 Send My Details'}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Your number will only be used to contact you about this jewelry.
          </p>
        </div>
      </div>
    </div>
  );
}
