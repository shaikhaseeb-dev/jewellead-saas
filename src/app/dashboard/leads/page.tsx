'use client';

import { useEffect, useState, useCallback } from 'react';
import { Phone, ExternalLink, Search } from 'lucide-react';
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

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'INTERESTED', 'NOT_INTERESTED', 'CONVERTED', 'FOLLOW_UP'];

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-yellow-100 text-yellow-700',
  INTERESTED: 'bg-green-100 text-green-700',
  NOT_INTERESTED: 'bg-red-100 text-red-600',
  CONVERTED: 'bg-gold-100 text-gold-700',
  FOLLOW_UP: 'bg-purple-100 text-purple-700',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '50' });
    if (filter) params.set('status', filter);
    const res = await fetch(`/api/leads?${params}`);
    const data = await res.json();
    setLeads(data.leads || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [filter]);

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
      (l.city || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="text-muted-foreground mt-1 text-sm">{total} total leads captured</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, city..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-400"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground">Loading leads...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-2">📭</p>
            <p className="font-medium text-foreground">No leads found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Name</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Phone</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">City</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Product</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Date</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-xs font-bold text-gold-700 shrink-0">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {lead.phone ? (
                        <a
                          href={`tel:+91${lead.phone}`}
                          className="flex items-center gap-1.5 text-gold-600 hover:text-gold-700 font-medium"
                        >
                          <Phone size={13} />
                          {lead.phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground italic">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{lead.city || '—'}</td>
                    <td className="px-5 py-4">
                      {lead.reel ? (
                        <div className="flex items-center gap-1.5">
                          <span>{lead.reel.productName}</span>
                          <a
                            href={lead.reel.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={lead.status}
                        disabled={updating === lead.id}
                        onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-gold-400 ${STATUS_COLORS[lead.status] || ''}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-xs">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <input
                        defaultValue={lead.notes || ''}
                        onBlur={(e) => {
                          if (e.target.value !== lead.notes) {
                            updateLead(lead.id, { notes: e.target.value });
                          }
                        }}
                        placeholder="Add note..."
                        className="w-40 text-sm px-2 py-1 rounded-lg border border-transparent hover:border-border focus:border-gold-400 focus:ring-2 focus:ring-gold-200 outline-none bg-transparent"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
