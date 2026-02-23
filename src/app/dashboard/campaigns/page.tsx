'use client';

import { useEffect, useState } from 'react';
import { CAMPAIGN_TEMPLATES } from '@/lib/campaignTemplates';
import { formatDate } from '@/lib/utils';
import { Megaphone, Send, CheckCircle2 } from 'lucide-react';

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
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchCampaigns = async () => {
    const res = await fetch('/api/campaigns');
    const data = await res.json();
    setCampaigns(data.campaigns || []);
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const sendCampaign = async (templateType: string, name: string) => {
    setSending(templateType);
    setMessage('');
    setError('');

    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateType }),
    });
    const data = await res.json();
    setSending(null);

    if (!res.ok) {
      setError(data.error || 'Failed to send campaign');
      return;
    }
    setMessage(data.message || `${name} campaign started!`);
    fetchCampaigns();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Campaigns</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Send bulk WhatsApp messages to all your leads with one click
        </p>
      </div>

      {message && (
        <div className="mb-6 bg-green-50 text-green-700 px-5 py-4 rounded-2xl border border-green-100 flex items-center gap-2">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 text-red-600 px-5 py-4 rounded-2xl border border-red-100">
          {error}
        </div>
      )}

      {/* Template Cards */}
      <div className="mb-10">
        <h2 className="font-display font-semibold text-lg mb-4">Send a Campaign</h2>
        <div className="grid grid-cols-2 gap-4">
          {CAMPAIGN_TEMPLATES.map((template) => (
            <div key={template.type} className="bg-white rounded-2xl border border-border p-6">
              <div className="text-3xl mb-3">{template.emoji}</div>
              <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
              <div className="bg-muted/50 rounded-xl p-3 mb-4 text-sm text-muted-foreground italic">
                &ldquo;{template.preview}&rdquo;
              </div>
              <button
                onClick={() => sendCampaign(template.type, template.name)}
                disabled={!!sending}
                className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                <Send size={16} />
                {sending === template.type ? 'Sending...' : `Send ${template.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign History */}
      <div>
        <h2 className="font-display font-semibold text-lg mb-4">Campaign History</h2>
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Loading...</div>
          ) : campaigns.length === 0 ? (
            <div className="py-12 text-center">
              <Megaphone size={36} className="mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">No campaigns sent yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="text-left px-6 py-3.5 font-semibold text-muted-foreground">Campaign</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-muted-foreground">Sent</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-muted-foreground">Failed</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4 font-medium">{c.name}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        c.status === 'SENT' ? 'bg-green-100 text-green-700' :
                        c.status === 'FAILED' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{c.status}</span>
                    </td>
                    <td className="px-6 py-4 text-green-600 font-medium">{c.sentCount}</td>
                    <td className="px-6 py-4 text-red-500">{c.failedCount}</td>
                    <td className="px-6 py-4 text-muted-foreground">{c.sentAt ? formatDate(c.sentAt) : formatDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
