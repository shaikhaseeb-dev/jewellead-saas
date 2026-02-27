'use client';

import { useEffect, useState } from 'react';
import { CAMPAIGN_TEMPLATES } from '@/lib/campaignTemplates';
import { formatDate } from '@/lib/utils';
import { Send, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

type Campaign = {
  id: string;
  name: string;
  templateType: string;
  status: string;
  sentCount: number;
  failedCount: number;
  sentAt: string | null;
  createdAt: string;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const fetchCampaigns = async () => {
    const res = await fetch('/api/campaigns');
    const data = await res.json();
    setCampaigns(data.campaigns ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const sendCampaign = async (templateType: string) => {
    setSending(templateType);
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateType }),
    });
    const data = await res.json();
    setSending(null);
    if (!res.ok) { showToast('error', data.error ?? 'Failed to send'); return; }
    showToast('success', data.message ?? 'Campaign started!');
    fetchCampaigns();
  };

  return (
    <div className="fade-in">

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 1000,
            background: toast.type === 'success' ? '#0A1A0A' : '#1A0A0A',
            border: `1px solid ${toast.type === 'success' ? 'rgba(134,239,172,0.2)' : 'rgba(252,165,165,0.2)'}`,
            borderRadius: '12px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.3s ease',
            maxWidth: '360px',
          }}
        >
          {toast.type === 'success'
            ? <CheckCircle2 size={16} color="#86EFAC" />
            : <AlertCircle size={16} color="#FCA5A5" />}
          <span style={{ fontSize: '13px', color: toast.type === 'success' ? '#86EFAC' : '#FCA5A5' }}>
            {toast.msg}
          </span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 className="lux-title">Campaigns</h1>
        <p style={{ color: '#7A756C', marginTop: '6px', fontSize: '13px' }}>
          Send bulk WhatsApp messages to all your leads with one tap
        </p>
      </div>

      {/* Template Cards */}
      <div style={{ marginBottom: '40px' }}>
        <p className="lux-label" style={{ marginBottom: '16px' }}>Send a Campaign</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {CAMPAIGN_TEMPLATES.map((t) => (
            <div
              key={t.type}
              className="lux-card"
              style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}
            >
              {/* Corner accent */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '60px', height: '60px',
                background: 'radial-gradient(circle at top right, rgba(198,167,94,0.05), transparent 70%)',
                pointerEvents: 'none',
              }} />

              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{t.emoji}</div>

              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  color: '#F5F0E8',
                  marginBottom: '6px',
                }}
              >
                {t.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#7A756C', marginBottom: '16px', lineHeight: 1.5 }}>
                {t.description}
              </p>

              {/* Preview */}
              <div
                style={{
                  background: '#0D0D0D',
                  border: '1px solid #1E1E1E',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginBottom: '20px',
                  borderLeft: '2px solid rgba(198,167,94,0.3)',
                }}
              >
                <p style={{ fontSize: '11px', color: '#7A756C', fontStyle: 'italic', lineHeight: 1.6 }}>
                  &ldquo;{t.preview}&rdquo;
                </p>
              </div>

              <button
                onClick={() => sendCampaign(t.type)}
                disabled={!!sending}
                className="lux-btn lux-btn-gold"
                style={{ width: '100%', justifyContent: 'center', opacity: sending ? 0.6 : 1 }}
              >
                <Send size={14} />
                {sending === t.type ? 'Sending...' : `Send ${t.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div>
        <p className="lux-label" style={{ marginBottom: '16px' }}>Campaign History</p>
        <div className="lux-card" style={{ overflow: 'hidden', padding: 0 }}>

          {/* Head */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr 1fr',
              padding: '12px 24px',
              borderBottom: '1px solid #1A1A1A',
              background: '#0D0D0D',
            }}
          >
            {['Campaign', 'Status', 'Sent', 'Failed', 'Date'].map((h) => (
              <p key={h} className="lux-label">{h}</p>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#7A756C' }}>Loading...</div>
          ) : campaigns.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#7A756C' }}>
              <Send size={32} color="#3E3A34" style={{ margin: '0 auto 12px' }} />
              <p>No campaigns sent yet</p>
            </div>
          ) : (
            campaigns.map((c) => (
              <div
                key={c.id}
                className="lux-table-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr 1fr',
                  padding: '14px 24px',
                  alignItems: 'center',
                }}
              >
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#C8C4BC' }}>{c.name}</p>
                <div>
                  {c.status === 'SENT' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#86EFAC' }}>
                      <CheckCircle2 size={12} /> Sent
                    </span>
                  ) : c.status === 'FAILED' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#FCA5A5' }}>
                      <AlertCircle size={12} /> Failed
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#FCD34D' }}>
                      <Clock size={12} /> Pending
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: '#86EFAC', fontWeight: 600 }}>{c.sentCount}</p>
                <p style={{ fontSize: '13px', color: c.failedCount > 0 ? '#FCA5A5' : '#3E3A34' }}>
                  {c.failedCount}
                </p>
                <p style={{ fontSize: '12px', color: '#7A756C' }}>
                  {c.sentAt ? formatDate(c.sentAt) : formatDate(c.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
