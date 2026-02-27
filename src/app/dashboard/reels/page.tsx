'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Film, Users, Tag, IndianRupee, Zap } from 'lucide-react';

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
    url: '', productName: '', category: '', price: '', triggerWord: 'interested',
  });
  const [error, setError] = useState('');

  const fetchReels = async () => {
    const res = await fetch('/api/reels');
    const data = await res.json();
    setReels(data.reels ?? []);
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
    if (!confirm('Remove this reel? Leads will be kept.')) return;
    await fetch(`/api/reels?id=${id}`, { method: 'DELETE' });
    fetchReels();
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#7A756C',
    marginBottom: '6px',
    display: 'block',
  };

  return (
    <div className="fade-in">

      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 className="lux-title">Reels</h1>
          <p style={{ color: '#7A756C', marginTop: '6px', fontSize: '13px' }}>
            Connect Instagram reels to auto-capture leads from comments
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="lux-btn lux-btn-gold"
        >
          <Plus size={15} strokeWidth={2} />
          Add Reel
        </button>
      </div>

      {/* Add Reel Form */}
      {showForm && (
        <div
          className="lux-card"
          style={{
            padding: '28px',
            marginBottom: '28px',
            borderColor: 'rgba(198,167,94,0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: '#F5F0E8' }}>
              Add New Reel
            </h3>
            <button
              onClick={() => { setShowForm(false); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#7A756C', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Instagram Reel URL</label>
                <input
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://www.instagram.com/reel/ABC123/"
                  required
                  className="lux-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Product Name</label>
                  <input
                    value={form.productName}
                    onChange={(e) => setForm({ ...form, productName: e.target.value })}
                    placeholder="Gold Kundan Necklace"
                    required
                    className="lux-input"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                    className="lux-select"
                    style={{ width: '100%' }}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Price (₹) — optional</label>
                  <input
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    type="number"
                    placeholder="25000"
                    className="lux-input"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Trigger Word</label>
                  <input
                    value={form.triggerWord}
                    onChange={(e) => setForm({ ...form, triggerWord: e.target.value })}
                    placeholder="interested"
                    required
                    className="lux-input"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div style={{ marginTop: '16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px', padding: '12px 16px', color: '#FCA5A5', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" disabled={submitting} className="lux-btn lux-btn-gold">
                {submitting ? 'Adding...' : 'Add Reel'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError(''); }}
                className="lux-btn lux-btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reel Cards Grid */}
      {loading ? (
        <div style={{ padding: '64px', textAlign: 'center', color: '#7A756C' }}>Loading reels...</div>
      ) : reels.length === 0 ? (
        <div
          className="lux-card"
          style={{ padding: '64px', textAlign: 'center' }}
        >
          <Film size={40} color="#3E3A34" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: '#7A756C', fontSize: '14px' }}>No reels added yet</p>
          <p style={{ color: '#3E3A34', fontSize: '12px', marginTop: '4px' }}>
            Add your first reel to start capturing leads automatically
          </p>
        </div>
      ) : (
        <div
          className="stagger"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}
        >
          {reels.map((reel) => (
            <div
              key={reel.id}
              style={{
                background: reel.active ? '#111111' : '#0E0E0E',
                borderRadius: '16px',
                border: reel.active
                  ? '1px solid rgba(198,167,94,0.3)'
                  : '1px solid #1A1A1A',
                padding: '24px',
                boxShadow: reel.active
                  ? '0 0 0 1px rgba(198,167,94,0.05), 0 4px 20px rgba(198,167,94,0.06)'
                  : 'var(--shadow-card)',
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = reel.active
                  ? '0 8px 32px rgba(198,167,94,0.1)'
                  : '0 8px 24px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = reel.active
                  ? '0 0 0 1px rgba(198,167,94,0.05), 0 4px 20px rgba(198,167,94,0.06)'
                  : 'var(--shadow-card)';
              }}
            >
              {/* Active glow */}
              {reel.active && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(198,167,94,0.6), transparent)',
                }} />
              )}

              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: reel.active ? 'rgba(198,167,94,0.1)' : '#161616',
                    border: reel.active ? '1px solid rgba(198,167,94,0.2)' : '1px solid #2A2A2A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Film size={18} color={reel.active ? '#C6A75E' : '#3E3A34'} strokeWidth={1.5} />
                </div>

                <button
                  onClick={() => handleDelete(reel.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3E3A34',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '8px',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
                    e.currentTarget.style.color = '#FCA5A5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = '#3E3A34';
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Product Name */}
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  color: '#F5F0E8',
                  marginBottom: '4px',
                  lineHeight: 1.3,
                }}
              >
                {reel.productName}
              </h3>
              <a
                href={reel.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '11px',
                  color: '#3E3A34',
                  display: 'block',
                  marginBottom: '16px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#C6A75E')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#3E3A34')}
              >
                {reel.url}
              </a>

              <div className="gold-divider" style={{ marginBottom: '16px' }} />

              {/* Meta Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Tag size={11} color="#7A756C" />
                  <span style={{ fontSize: '11px', color: '#7A756C' }}>{reel.category}</span>
                </div>
                {reel.price && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IndianRupee size={11} color="#7A756C" />
                    <span style={{ fontSize: '11px', color: '#7A756C' }}>
                      {reel.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Zap size={11} color="#7A756C" />
                  <span style={{ fontSize: '11px', color: '#7A756C' }}>&quot;{reel.triggerWord}&quot;</span>
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={13} color={reel._count.leads > 0 ? '#C6A75E' : '#3E3A34'} />
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: reel._count.leads > 0 ? '#C6A75E' : '#3E3A34',
                    }}
                  >
                    {reel._count.leads}
                  </span>
                  <span style={{ fontSize: '11px', color: '#3E3A34' }}>leads</span>
                </div>

                {/* Active toggle */}
                <label className="lux-toggle">
                  <input
                    type="checkbox"
                    defaultChecked={reel.active}
                    onChange={() => {/* extend API if needed */}}
                  />
                  <span className="lux-toggle-slider" />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
