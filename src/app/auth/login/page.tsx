'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      setError(data.error || 'Login failed');
      return;
    }

    router.push('/dashboard/overview');
    router.refresh();
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-border">
      <h2 className="text-2xl font-display font-semibold mb-1">Welcome back</h2>
      <p className="text-muted-foreground text-sm mb-6">Sign in to your shop dashboard</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@yourshop.com"
            required
            className="w-full px-4 py-3 rounded-xl border border-border text-base focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 rounded-xl border border-border text-base focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
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
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        New to JewelLead?{' '}
        <Link href="/auth/register" className="text-gold-600 font-medium hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
