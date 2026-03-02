'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Phone, ExternalLink, Search, X, MessageCircle, TrendingUp, IndianRupee, Users, BarChart3 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

/* ─── Types ──────────────────────────────────────────────────────────────── */
type LeadStatus =
  | 'NEW' | 'CONTACTED' | 'INTERESTED'
  | 'NOT_INTERESTED' | 'CONVERTED' | 'FOLLOW_UP';

type SortOption = 'newest' | 'oldest';

type Lead = {
  id: string;
  name: string;
  phone: string;
  city: string | null;
  status: LeadStatus;
  notes: string | null;
  saleAmount: number | null;
  createdAt: string;
  reel: { productName: string; url: string } | null;
};

/* ─── Constants ──────────────────────────────────────────────────────────── */
const STATUS_OPTIONS: LeadStatus[] = [
  'NEW', 'CONTACTED', 'INTERESTED', 'NOT_INTERESTED', 'CONVERTED', 'FOLLOW_UP',
];

const STATUS_META: Record<LeadStatus, { label: string; color: string; bg: string; border: string }> = {
  NEW:           { label: 'New',          color: '#93C5FD', bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.22)'  },
  CONTACTED:     { label: 'Contacted',    color: '#9CA3AF', bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.22)' },
  INTERESTED:    { label: 'Interested',   color: '#C4B5FD', bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.22)' },
  FOLLOW_UP:     { label: 'Follow Up',    color: '#FCD34D', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.22)'  },
  CONVERTED:     { label: 'Converted',    color: '#C6A75E', bg: 'rgba(198,167,94,0.10)',  border: 'rgba(198,167,94,0.30)'  },
  NOT_INTERESTED:{ label: 'Not Interested',color:'#FCA5A5', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.18)'   },
};

const AVG_TICKET = 35_000; // fallback estimate ₹

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function fmtINR(n: number) {
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function waLink(phone: string) {
  const digits = phone.replace(/\D/g, '');
  const e164 = digits.startsWith('91') && digits.length === 12 ? digits : `91${digits}`;
  return `https://wa.me/${e164}`;
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function MetricCard({
  icon: Icon, label, value, sub, gold = false,
}: { icon: React.ElementType; label: string; value: string; sub?: string; gold?: boolean }) {
  return (
    <div style={{
      background: gold ? 'linear-gradient(135deg,#171410,#111)' : '#111111',
      border: `1px solid ${gold ? 'rgba(198,167,94,0.3)' : '#1E1E1E'}`,
      borderRadius: '14px', padding: '20px 22px',
      boxShadow: gold ? '0 4px 20px rgba(198,167,94,0.06)' : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: gold ? 'rgba(198,167,94,0.12)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${gold ? 'rgba(198,167,94,0.2)' : '#222'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={15} color={gold ? '#C6A75E' : '#7A756C'} strokeWidth={1.5} />
        </div>
        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A756C', fontFamily: "'DM Sans',system-ui,sans-serif" }}>
          {label}
        </span>
      </div>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '26px', fontWeight: 600, color: gold ? '#C6A75E' : '#F5F0E8', lineHeight: 1, margin: 0 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: '11px', color: '#7A756C', marginTop: '5px', fontFamily: "'DM Sans',system-ui,sans-serif" }}>{sub}</p>}
    </div>
  );
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div style={{ padding: '72px 24px', textAlign: 'center' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(198,167,94,0.06)', border: '1px solid rgba(198,167,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
        <Search size={18} color="#7A756C" strokeWidth={1.5} />
      </div>
      <p style={{ fontSize: '15px', fontWeight: 500, color: '#F5F0E8', fontFamily: "'DM Sans',system-ui,sans-serif", marginBottom: '6px' }}>
        {hasFilter ? 'No leads match your filters' : 'No leads yet'}
      </p>
      <p style={{ fontSize: '13px', color: '#7A756C', fontFamily: "'DM Sans',system-ui,sans-serif" }}>
        {hasFilter ? 'Try a different status or clear your search.' : 'Add a reel to start capturing leads automatically.'}
      </p>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function LeadsPage() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [sortBy, setSortBy]             = useState<SortOption>('newest');
  const [search, setSearch]             = useState('');

  // Inline sale amount edit state
  const [editingSale, setEditingSale]   = useState<string | null>(null);
  const [saleInput, setSaleInput]       = useState('');
  const [updating, setUpdating]         = useState<string | null>(null);

  // Dev-only demo lead
  const [addingDemo, setAddingDemo]     = useState(false);

  /* ── Data fetching ─────────────────────────────────────────────────── */
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '200' });
    if (statusFilter) params.set('status', statusFilter);
    try {
      const res = await fetch(`/api/leads?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAllLeads(data.leads ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setAllLeads([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  /* ── Dev-only: add a random demo lead ─────────────────────────────── */
  const addDemoLead = async () => {
    if (process.env.NODE_ENV !== 'development') return;
    setAddingDemo(true);
    try {
      const res = await fetch('/api/dev/add-demo-lead', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to add demo lead');
      await fetchLeads(); // refetch so new lead appears instantly
    } catch (err) {
      console.error('[dev]', err);
    } finally {
      setAddingDemo(false);
    }
  };

  /* ── Client-side filtering & sorting ──────────────────────────────── */
  const visibleLeads = useMemo(() => {
    let list = [...allLeads];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.city ?? '').toLowerCase().includes(q) ||
        (l.reel?.productName ?? '').toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? db - da : da - db;
    });

    return list;
  }, [allLeads, search, sortBy]);

  /* ── Revenue metrics ───────────────────────────────────────────────── */
  const metrics = useMemo(() => {
    const converted = allLeads.filter(l => l.status === 'CONVERTED');
    const total_ = allLeads.length;

    // Real revenue from leads with saleAmount set
    const realRevenue = converted
      .filter(l => l.saleAmount != null)
      .reduce((sum, l) => sum + (l.saleAmount ?? 0), 0);

    // Estimated revenue for leads without saleAmount
    const estimatedCount = converted.filter(l => l.saleAmount == null).length;
    const estimatedRevenue = estimatedCount * AVG_TICKET;

    const totalRevenue = realRevenue + estimatedRevenue;
    const hasRealRevenue = converted.some(l => l.saleAmount != null);

    // This month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthRevenue = converted
      .filter(l => new Date(l.createdAt) >= monthStart)
      .reduce((sum, l) => sum + (l.saleAmount ?? AVG_TICKET), 0);

    const convRate = total_ > 0 ? ((converted.length / total_) * 100).toFixed(1) : '0.0';

    return { totalRevenue, thisMonthRevenue, convertedCount: converted.length, convRate, hasRealRevenue };
  }, [allLeads]);

  /* ── Lead update ───────────────────────────────────────────────────── */
  const updateLead = async (
    leadId: string,
    updates: { status?: string; notes?: string; saleAmount?: number | null },
  ) => {
    setUpdating(leadId);

    // Optimistic update
    setAllLeads(prev => prev.map(l =>
      l.id === leadId ? { ...l, ...updates, status: (updates.status ?? l.status) as LeadStatus } : l
    ));

    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, ...updates }),
      });
      if (!res.ok) throw new Error();
    } catch {
      await fetchLeads(); // rollback on error
    } finally {
      setUpdating(null);
    }
  };

  const saveSaleAmount = (leadId: string) => {
    const val = parseFloat(saleInput);
    if (!isNaN(val) && val > 0) {
      updateLead(leadId, { saleAmount: val });
    }
    setEditingSale(null);
    setSaleInput('');
  };

  /* ── Style helpers ─────────────────────────────────────────────────── */
  const selectBase: React.CSSProperties = {
    background: '#161616', border: '1px solid #242424', borderRadius: '10px',
    color: '#F5F0E8', padding: '9px 12px', fontSize: '13px',
    fontFamily: "'DM Sans',system-ui,sans-serif", outline: 'none',
    appearance: 'none', cursor: 'pointer', transition: 'border-color 0.2s',
  };

  const th: React.CSSProperties = {
    fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: '#3E3A34',
    fontFamily: "'DM Sans',system-ui,sans-serif",
  };

  const hasFilter = statusFilter !== '' || search.trim() !== '';

  /* ── Render ────────────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '32px', fontWeight: 500, color: '#F5F0E8', margin: 0, letterSpacing: '-0.02em' }}>
            Leads
          </h1>
          <p style={{ fontSize: '13px', color: '#7A756C', marginTop: '5px', fontFamily: "'DM Sans',system-ui,sans-serif" }}>
            {loading ? 'Loading...' : `${total} total · ${visibleLeads.length} shown`}
          </p>
        </div>

        {/* Dev-only: add demo lead button — stripped out in production build */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={addDemoLead}
            disabled={addingDemo}
            title="Development only — not visible in production"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '8px 16px', borderRadius: '9px',
              background: addingDemo ? '#1A1A1A' : 'transparent',
              border: '1px dashed #3E3A34',
              color: addingDemo ? '#3E3A34' : '#7A756C',
              fontSize: '12px', fontWeight: 500,
              fontFamily: "'DM Sans',system-ui,sans-serif",
              cursor: addingDemo ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s ease',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              if (!addingDemo) {
                e.currentTarget.style.borderColor = 'rgba(198,167,94,0.35)';
                e.currentTarget.style.color = '#C6A75E';
                e.currentTarget.style.background = 'rgba(198,167,94,0.04)';
              }
            }}
            onMouseLeave={e => {
              if (!addingDemo) {
                e.currentTarget.style.borderColor = '#3E3A34';
                e.currentTarget.style.color = '#7A756C';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {addingDemo ? (
              <>
                <span style={{ width: '11px', height: '11px', border: '1.5px solid #3E3A34', borderTopColor: '#C6A75E', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Adding…
              </>
            ) : (
              <>
                <span style={{ fontSize: '15px', lineHeight: 1 }}>+</span>
                Add Demo Lead
              </>
            )}
          </button>
        )}
      </div>

      {/* ── Revenue Metrics ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '24px' }}>
        <MetricCard
          icon={IndianRupee}
          label={metrics.hasRealRevenue ? 'Actual Revenue' : 'Est. Revenue'}
          value={fmtINR(metrics.totalRevenue)}
          sub={metrics.hasRealRevenue ? 'Based on recorded sales' : `Avg ₹${(AVG_TICKET / 1000).toFixed(0)}k ticket · update on conversion`}
          gold
        />
        <MetricCard
          icon={TrendingUp}
          label="Revenue This Month"
          value={fmtINR(metrics.thisMonthRevenue)}
        />
        <MetricCard
          icon={Users}
          label="Converted Leads"
          value={String(metrics.convertedCount)}
        />
        <MetricCard
          icon={BarChart3}
          label="Conversion Rate"
          value={`${metrics.convRate}%`}
        />
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '360px' }}>
          <Search size={14} color="#3E3A34" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, phone, city, product…"
            style={{
              ...selectBase,
              padding: '9px 34px 9px 36px',
              width: '100%', color: '#F5F0E8',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(198,167,94,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(198,167,94,0.08)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#242424'; e.currentTarget.style.boxShadow = 'none'; }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#3E3A34', cursor: 'pointer', padding: '2px', display: 'flex' }}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Status filter */}
        <div style={{ position: 'relative' }}>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as LeadStatus | '')}
            style={{ ...selectBase, paddingRight: '32px', minWidth: '160px' }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(198,167,94,0.4)'}
            onBlur={e => e.currentTarget.style.borderColor = '#242424'}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{STATUS_META[s].label}</option>
            ))}
          </select>
          <svg style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="#7A756C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Sort */}
        <div style={{ position: 'relative' }}>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            style={{ ...selectBase, paddingRight: '32px', minWidth: '150px' }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(198,167,94,0.4)'}
            onBlur={e => e.currentTarget.style.borderColor = '#242424'}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <svg style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="#7A756C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div style={{ background: '#111111', border: '1px solid #1A1A1A', borderRadius: '16px', overflow: 'hidden' }}>

        {/* Head */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.3fr 0.8fr 1.3fr 1.3fr 0.9fr 1.4fr',
          padding: '11px 22px', borderBottom: '1px solid #1A1A1A', background: '#0D0D0D',
        }}>
          {['Customer', 'Phone / WA', 'City', 'Product', 'Status', 'Date', 'Sale / Notes'].map(h => (
            <span key={h} style={th}>{h}</span>
          ))}
        </div>

        {/* Body */}
        {loading ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '16px', height: '16px', border: '2px solid #1E1E1E', borderTopColor: '#C6A75E', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              <span style={{ fontSize: '13px', color: '#7A756C', fontFamily: "'DM Sans',system-ui,sans-serif" }}>Loading leads…</span>
            </div>
          </div>
        ) : visibleLeads.length === 0 ? (
          <EmptyState hasFilter={hasFilter} />
        ) : (
          visibleLeads.map(lead => {
            const isConverted = lead.status === 'CONVERTED';
            const isBusy = updating === lead.id;
            const meta = STATUS_META[lead.status];
            const isEditingSale = editingSale === lead.id;

            return (
              <div
                key={lead.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.3fr 0.8fr 1.3fr 1.3fr 0.9fr 1.4fr',
                  padding: '13px 22px', alignItems: 'center',
                  borderBottom: '1px solid #161616',
                  borderLeft: isConverted ? '2px solid rgba(198,167,94,0.4)' : '2px solid transparent',
                  background: isConverted ? 'rgba(198,167,94,0.015)' : 'transparent',
                  opacity: isBusy ? 0.7 : 1,
                  transition: 'background 0.15s, opacity 0.2s',
                }}
                onMouseEnter={e => { if (!isConverted) e.currentTarget.style.background = 'rgba(255,255,255,0.018)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = isConverted ? 'rgba(198,167,94,0.015)' : 'transparent'; }}
              >
                {/* Customer avatar + name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', overflow: 'hidden' }}>
                  <div style={{
                    width: '29px', height: '29px', borderRadius: '50%', flexShrink: 0,
                    background: isConverted ? 'rgba(198,167,94,0.12)' : '#161616',
                    border: `1px solid ${isConverted ? 'rgba(198,167,94,0.3)' : '#242424'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700,
                    color: isConverted ? '#C6A75E' : '#7A756C',
                    fontFamily: "'DM Sans',system-ui,sans-serif",
                  }}>
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#F5F0E8', fontFamily: "'DM Sans',system-ui,sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.name}
                  </span>
                </div>

                {/* Phone + WhatsApp button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {lead.phone ? (
                    <>
                      <a href={`tel:+91${lead.phone}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#C6A75E', fontSize: '12px', textDecoration: 'none', fontFamily: "'DM Sans',system-ui,sans-serif" }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                      >
                        <Phone size={10} /> {lead.phone}
                      </a>
                      {/* WhatsApp quick action */}
                      <a
                        href={waLink(lead.phone)}
                        target="_blank"
                        rel="noreferrer"
                        title={`WhatsApp ${lead.name}`}
                        style={{
                          width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                          background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.18)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s', textDecoration: 'none',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.15)'; e.currentTarget.style.borderColor = 'rgba(37,211,102,0.35)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.08)'; e.currentTarget.style.borderColor = 'rgba(37,211,102,0.18)'; }}
                      >
                        <MessageCircle size={12} color="#25D366" strokeWidth={1.75} />
                      </a>
                    </>
                  ) : (
                    <>
                      <span style={{ color: '#2A2A2A', fontSize: '13px' }}>—</span>
                      {/* Disabled WA button */}
                      <div title="No phone number" style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3, cursor: 'not-allowed' }}>
                        <MessageCircle size={12} color="#7A756C" strokeWidth={1.75} />
                      </div>
                    </>
                  )}
                </div>

                {/* City */}
                <span style={{ fontSize: '13px', color: '#7A756C', fontFamily: "'DM Sans',system-ui,sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.city || '—'}
                </span>

                {/* Product */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', overflow: 'hidden' }}>
                  {lead.reel ? (
                    <>
                      <span style={{ fontSize: '13px', color: '#C8C4BC', fontFamily: "'DM Sans',system-ui,sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lead.reel.productName}
                      </span>
                      <a href={lead.reel.url} target="_blank" rel="noreferrer"
                        style={{ color: '#3E3A34', flexShrink: 0, transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#C6A75E'}
                        onMouseLeave={e => e.currentTarget.style.color = '#3E3A34'}
                      >
                        <ExternalLink size={11} />
                      </a>
                    </>
                  ) : <span style={{ color: '#2A2A2A', fontSize: '13px' }}>—</span>}
                </div>

                {/* Status dropdown */}
                <div style={{ position: 'relative' }}>
                  <select
                    value={lead.status}
                    disabled={isBusy}
                    onChange={e => updateLead(lead.id, { status: e.target.value })}
                    style={{
                      background: meta.bg, border: `1px solid ${meta.border}`,
                      borderRadius: '999px', color: meta.color,
                      padding: '4px 10px', fontSize: '11px', fontWeight: 600,
                      letterSpacing: '0.03em', textTransform: 'uppercase',
                      fontFamily: "'DM Sans',system-ui,sans-serif",
                      cursor: isBusy ? 'not-allowed' : 'pointer',
                      outline: 'none', appearance: 'none',
                      opacity: isBusy ? 0.6 : 1, transition: 'all 0.15s',
                    }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s} style={{ background: '#111', color: '#F5F0E8', textTransform: 'none' }}>
                        {STATUS_META[s].label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <span style={{ fontSize: '12px', color: '#7A756C', fontFamily: "'DM Sans',system-ui,sans-serif" }}>
                  {formatDate(lead.createdAt)}
                </span>

                {/* Sale Amount (if CONVERTED) OR Notes */}
                <div>
                  {isConverted ? (
                    isEditingSale ? (
                      /* ── Inline sale amount input ── */
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '12px', color: '#C6A75E', fontFamily: "'DM Sans',system-ui,sans-serif" }}>₹</span>
                        <input
                          autoFocus
                          type="number"
                          min="1"
                          value={saleInput}
                          onChange={e => setSaleInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveSaleAmount(lead.id);
                            if (e.key === 'Escape') { setEditingSale(null); setSaleInput(''); }
                          }}
                          onBlur={() => saveSaleAmount(lead.id)}
                          placeholder="Amount"
                          style={{
                            background: '#161616', border: '1px solid rgba(198,167,94,0.4)',
                            borderRadius: '7px', color: '#F5F0E8', padding: '4px 8px',
                            fontSize: '12px', width: '90px', outline: 'none',
                            fontFamily: "'DM Sans',system-ui,sans-serif",
                          }}
                        />
                      </div>
                    ) : (
                      /* ── Sale amount display / click to edit ── */
                      <button
                        onClick={() => { setEditingSale(lead.id); setSaleInput(lead.saleAmount ? String(lead.saleAmount) : ''); }}
                        title="Click to record sale amount"
                        style={{
                          background: lead.saleAmount ? 'rgba(198,167,94,0.08)' : 'transparent',
                          border: `1px solid ${lead.saleAmount ? 'rgba(198,167,94,0.25)' : '#242424'}`,
                          borderRadius: '7px', padding: '4px 10px',
                          fontSize: '12px', fontWeight: 600,
                          color: lead.saleAmount ? '#C6A75E' : '#3E3A34',
                          cursor: 'pointer', fontFamily: "'DM Sans',system-ui,sans-serif",
                          transition: 'all 0.15s',
                          display: 'flex', alignItems: 'center', gap: '4px',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(198,167,94,0.4)'; e.currentTarget.style.color = '#C6A75E'; }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = lead.saleAmount ? 'rgba(198,167,94,0.25)' : '#242424';
                          e.currentTarget.style.color = lead.saleAmount ? '#C6A75E' : '#3E3A34';
                        }}
                      >
                        <IndianRupee size={10} />
                        {lead.saleAmount ? fmtINR(lead.saleAmount).replace('₹', '') : 'Add sale'}
                      </button>
                    )
                  ) : (
                    /* ── Notes input (non-converted) ── */
                    <input
                      key={`notes-${lead.id}`}
                      defaultValue={lead.notes ?? ''}
                      placeholder="Add note…"
                      onBlur={e => {
                        const val = e.target.value.trim();
                        if (val !== (lead.notes ?? '')) updateLead(lead.id, { notes: val });
                      }}
                      style={{
                        background: 'transparent', border: '1px solid transparent',
                        borderRadius: '8px', color: '#7A756C', fontSize: '12px',
                        padding: '4px 8px', width: '100%', outline: 'none',
                        fontFamily: "'DM Sans',system-ui,sans-serif", transition: 'all 0.2s',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(198,167,94,0.25)'; e.currentTarget.style.background = '#161616'; e.currentTarget.style.color = '#F5F0E8'; }}
                      onBlurCapture={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7A756C'; }}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=number]::-webkit-inner-spin-button { display: none; }
        input::placeholder { color: #3E3A34 !important; }
        select option { background: #111111 !important; color: #F5F0E8 !important; }
      `}</style>
    </div>
  );
}
