'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Film, Users } from 'lucide-react';

type Reel = {
  id: string;
  url: string;
  productName: string;
  category: string;
  price: number | null;
  triggerWord: string;
  active: boolean;
  createdAt: string;
  _count: { leads: number };
};

const CATEGORIES = ['Rings', 'Necklaces', 'Earrings', 'Bangles', 'Bracelets', 'Sets', 'Other'];

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    url: '',
    productName: '',
    category: '',
    price: '',
    triggerWord: 'interested',
  });
  const [error, setError] = useState('');

  const fetchReels = async () => {
    const res = await fetch('/api/reels');
    const data = await res.json();
    setReels(data.reels || []);
    setLoading(false);
  };

  useEffect(() => { fetchReels(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const res = await fetch('/api/reels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: form.price ? parseFloat(form.price) : undefined }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) { setError(data.error); return; }
    setShowForm(false);
    setForm({ url: '', productName: '', category: '', price: '', triggerWord: 'interested' });
    fetchReels();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reel? Leads will still be kept.')) return;
    await fetch(`/api/reels?id=${id}`, { method: 'DELETE' });
    fetchReels();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="page-title">Reels</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Add Instagram reels to automatically capture leads from comments
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={18} />
          Add Reel
        </button>
      </div>

      {/* Add Reel Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <h3 className="font-display font-semibold text-lg mb-4">Add New Reel</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Instagram Reel URL</label>
              <input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://www.instagram.com/reel/ABC123/"
                required
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Product Name</label>
                <input
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  placeholder="Gold Kundan Necklace"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Price (₹) <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  type="number"
                  placeholder="25000"
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Trigger Word</label>
                <input
                  value={form.triggerWord}
                  onChange={(e) => setForm({ ...form, triggerWord: e.target.value })}
                  placeholder="interested"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
                <p className="text-xs text-muted-foreground mt-1">Comments containing this word will trigger a DM</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60"
              >
                {submitting ? 'Adding...' : 'Add Reel'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError(''); }}
                className="px-6 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reels List */}
      {loading ? (
        <div className="py-16 text-center text-muted-foreground">Loading reels...</div>
      ) : reels.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border py-16 text-center">
          <Film size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="font-medium text-foreground">No reels added yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add your first reel to start capturing leads automatically</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reels.map((reel) => (
            <div key={reel.id} className="bg-white rounded-2xl border border-border p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center shrink-0">
                <Film size={22} className="text-gold-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{reel.productName}</h3>
                  <span className="gold-badge">{reel.category}</span>
                  {reel.price && <span className="text-xs text-muted-foreground">₹{reel.price.toLocaleString('en-IN')}</span>}
                </div>
                <a
                  href={reel.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gold-600 hover:underline truncate block max-w-xs"
                >
                  {reel.url}
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  Trigger: &quot;{reel.triggerWord}&quot;
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                  <Users size={13} />
                  <span className="text-sm font-semibold">{reel._count.leads} leads</span>
                </div>
                <button
                  onClick={() => handleDelete(reel.id)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
