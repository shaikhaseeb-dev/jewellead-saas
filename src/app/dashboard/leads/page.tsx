'use client';

import { useEffect, useState, useCallback } from 'react';
import { Phone, ExternalLink, Search, SlidersHorizontal } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type Lead = {
  id: string;
  name: string;
  phone: string;
  city: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  reel: { productName: string; url: string } | null;
};

const STATUS_OPTIONS = [
  'NEW', 'CONTACTED', 'INTERESTED', 'NOT_INTERESTED', 'CONVERTED', 'FOLLOW_UP',
] as const;
type LeadStatus = (typeof STATUS_OPTIONS)[number];

const STATUS_CONFIG: Record<LeadStatus, { label: string; className: string }> = {
  NEW:           { label: 'New',         className: 'badge badge-new' },
  CONTACTED:     { label: 'Contacted',   className: 'badge badge-contacted' },
  INTERESTED:    { label: 'Interested',  className: 'badge badge-interested' },
  FOLLOW_UP:     { label: 'Follow Up',   className: 'badge badge-followup' },
  CONVERTED:     { label: 'Converted',   className: 'badge badge-converted' },
  NOT_INTERESTED:{ label: 'Not Interest',className: 'badge badge-notinterested' },
};

const FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'New', value: 'NEW' },
  { label: 'Interested', value: 'INTERESTED' },
  { label: 'Follow Up', value: 'FOLLOW_UP' },
  { label: 'Converted', value: 'CONVERTED' },
  { label: 'Not Interested', value: 'NOT_INTERESTED' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '60' });
    if (activeFilter) params.set('status', activeFilter);
    const res = await fetch(`/api/leads?${params}`);
    const data = await res.json();
    setLeads(data.leads ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [activeFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateLead = async (leadId: string, updates: { status?: string; notes?: string }) => {
    setUpdating(leadId);
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, ...updates }),
    });
    setUpdating(null);
    fetchLeads();
  };

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      (l.city ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">

      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 className="lux-title">Leads</h1>
          <p style={{ color: '#7A756C', marginTop: '6px', fontSize: '13px' }}>
            {total} total leads captured
          </p>
        </div>
      </div>

      {/* Filter chips + search */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`filter-chip ${activeFilter === f.value ? 'active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '380px' }}>
            <Search
              size={14}
              color="#7A756C"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, city..."
              className="lux-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          <button
            className="lux-btn lux-btn-ghost"
            style={{ flexShrink: 0 }}
          >
            <SlidersHorizontal size={14} />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="lux-card" style={{ overflow: 'hidden', padding: 0 }}>

        {/* Table head */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.2fr 1fr 1.5fr 1.2fr 1fr 1.5fr',
            padding: '12px 24px',
            borderBottom: '1px solid #1A1A1A',
            background: '#0D0D0D',
          }}
        >
          {['Customer', 'Phone', 'City', 'Product', 'Status', 'Date', 'Notes'].map((h) => (
            <p key={h} className="lux-label">{h}</p>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ padding: '64px', textAlign: 'center', color: '#7A756C' }}>
            Loading leads...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>📭</p>
            <p style={{ color: '#7A756C' }}>No leads found</p>
          </div>
        ) : (
          filtered.map((lead) => {
            const conf = STATUS_CONFIG[lead.status as LeadStatus];
            const isConverted = lead.status === 'CONVERTED';

            return (
              <div
                key={lead.id}
                className="lux-table-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.2fr 1fr 1.5fr 1.2fr 1fr 1.5fr',
                  padding: '14px 24px',
                  alignItems: 'center',
                  borderLeft: isConverted ? '2px solid rgba(198,167,94,0.4)' : '2px solid transparent',
                  opacity: updating === lead.id ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: isConverted
                        ? 'linear-gradient(135deg, rgba(198,167,94,0.2), rgba(198,167,94,0.05))'
                        : '#161616',
                      border: isConverted ? '1px solid rgba(198,167,94,0.3)' : '1px solid #2A2A2A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: isConverted ? '#C6A75E' : '#7A756C',
                      flexShrink: 0,
                    }}
                  >
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#F5F0E8' }}>
                    {lead.name}
                  </span>
                </div>

                {/* Phone */}
                <div>
                  {lead.phone ? (
                    <a
                      href={`tel:+91${lead.phone}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#C6A75E',
                        fontSize: '13px',
                        textDecoration: 'none',
                      }}
                    >
                      <Phone size={11} />
                      {lead.phone}
                    </a>
                  ) : (
                    <span style={{ color: '#3E3A34', fontSize: '13px' }}>—</span>
                  )}
                </div>

                {/* City */}
                <p style={{ fontSize: '13px', color: '#7A756C' }}>{lead.city || '—'}</p>

                {/* Product */}
                <div>
                  {lead.reel ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', color: '#C8C4BC' }}>{lead.reel.productName}</span>
                      <a
                        href={lead.reel.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#3E3A34', transition: 'color 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#C6A75E')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#3E3A34')}
                      >
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  ) : (
                    <span style={{ color: '#3E3A34', fontSize: '13px' }}>—</span>
                  )}
                </div>

                {/* Status dropdown */}
                <div>
                  <select
                    value={lead.status}
                    disabled={updating === lead.id}
                    onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                    className="lux-select"
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      color: conf?.className.includes('converted') ? '#C6A75E'
                           : conf?.className.includes('interested') ? '#C4B5FD'
                           : conf?.className.includes('followup') ? '#FCD34D'
                           : conf?.className.includes('new') ? '#93C5FD'
                           : '#9CA3AF',
                      cursor: 'pointer',
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} style={{ background: '#111', color: '#F5F0E8' }}>
                        {STATUS_CONFIG[s].label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <p style={{ fontSize: '12px', color: '#7A756C' }}>{formatDate(lead.createdAt)}</p>

                {/* Notes */}
                <input
                  defaultValue={lead.notes ?? ''}
                  onBlur={(e) => {
                    if (e.target.value !== lead.notes) {
                      updateLead(lead.id, { notes: e.target.value });
                    }
                  }}
                  placeholder="Add note..."
                  style={{
                    background: 'transparent',
                    border: '1px solid transparent',
                    borderRadius: '8px',
                    color: '#7A756C',
                    fontSize: '12px',
                    padding: '4px 8px',
                    width: '100%',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(198,167,94,0.3)';
                    e.currentTarget.style.background = '#161616';
                    e.currentTarget.style.color = '#F5F0E8';
                  }}
                  onBlurCapture={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#7A756C';
                  }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
