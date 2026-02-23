'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    email: '',
    password: '',
    city: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      setError(data.error || 'Registration failed');
      return;
    }

    router.push('/dashboard/overview');
    router.refresh();
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
      <h2 className="text-2xl font-display font-semibold mb-1">Start free trial</h2>
      <p className="text-muted-foreground text-sm mb-6">Set up your shop in 60 seconds</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Shop Name</label>
            <input
              {...field('shopName')}
              placeholder="Meera Jewellers"
              required
              className="w-full px-4 py-3 rounded-xl border border-border text-base focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Your Name</label>
            <input
              {...field('ownerName')}
              placeholder="Rahul Gupta"
              required
              className="w-full px-4 py-3 rounded-xl border border-border text-base focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Mobile Number</label>
            <input
              {...field('phone')}
              type="tel"
              placeholder="9876543210"
              maxLength={10}
              required
              className="w-full px-4 py-3 rounded-xl border border-border text-base focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">City</label>
            <input
              {...field('city')}
              placeholder="Mumbai"
              className="w-full px-4 py-3 rounded-xl border border-border text-base focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            {...field('email')}
            type="email"
            placeholder="rahul@meerajewellers.com"
            required
            className="w-full px-4 py-3 rounded-xl border border-border text-base focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Password</label>
          <input
            {...field('password')}
            type="password"
            placeholder="Min. 8 characters"
            required
            className="w-full px-4 py-3 rounded-xl border border-border text-base focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3.5 rounded-xl text-base transition-colors disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create Free Account →'}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Free 14-day trial · No credit card required
        </p>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-gold-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
