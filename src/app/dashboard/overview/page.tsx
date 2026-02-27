import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { startOfDay, subDays, formatDistanceToNow } from 'date-fns';
import {
  Users,
  TrendingUp,
  CheckCircle2,
  BarChart3,
  Film,
  ArrowUpRight,
  IndianRupee,
} from 'lucide-react';

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  gold = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  gold?: boolean;
}) {
  return (
    <div
      className={gold ? 'lux-card-gold' : 'lux-card'}
      style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle corner geometry */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '80px',
          height: '80px',
          background: gold
            ? 'radial-gradient(circle at top right, rgba(198,167,94,0.1), transparent 70%)'
            : 'radial-gradient(circle at top right, rgba(255,255,255,0.02), transparent 70%)',
          borderRadius: '0 16px 0 0',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: gold ? 'rgba(198,167,94,0.12)' : 'rgba(255,255,255,0.04)',
            border: gold ? '1px solid rgba(198,167,94,0.2)' : '1px solid #1E1E1E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={18} color={gold ? '#C6A75E' : '#7A756C'} strokeWidth={1.5} />
        </div>
        {sub && (
          <span style={{ fontSize: '11px', color: '#C6A75E', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={11} />
            {sub}
          </span>
        )}
      </div>

      <p className={gold ? 'lux-stat-gold' : 'lux-stat'}>{value}</p>
      <p className="lux-label" style={{ marginTop: '8px' }}>{label}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function OverviewPage() {
  const user = await getAuthUser();
  if (!user) redirect('/auth/login');

  const today = startOfDay(new Date());
  const twoDaysAgo = subDays(today, 2);

  const [total, newToday, converted, recentLeads, topReel] = await Promise.all([
    prisma.lead.count({ where: { userId: user.userId } }),
    prisma.lead.count({ where: { userId: user.userId, createdAt: { gte: today } } }),
    prisma.lead.count({ where: { userId: user.userId, status: 'CONVERTED' } }),
    prisma.lead.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { reel: { select: { productName: true } } },
    }),
    prisma.reel.findFirst({
      where: { userId: user.userId, active: true },
      include: { _count: { select: { leads: true } } },
      orderBy: { leads: { _count: 'desc' } },
    }),
  ]);

  const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : '0.0';
  // Revenue impact: assume ₹35,000 avg ticket × converted
  const revenueImpact = converted * 35000;

  const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    NEW:           { label: 'New',      className: 'badge badge-new' },
    CONTACTED:     { label: 'Contacted',className: 'badge badge-contacted' },
    INTERESTED:    { label: 'Interested',className:'badge badge-interested' },
    FOLLOW_UP:     { label: 'Follow Up',className: 'badge badge-followup' },
    CONVERTED:     { label: 'Converted',className: 'badge badge-converted' },
    NOT_INTERESTED:{ label: 'Not Int.', className: 'badge badge-notinterested' },
  };

  return (
    <div className="stagger fade-in">

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 className="lux-title">Good morning 🌅</h1>
        <p style={{ color: '#7A756C', marginTop: '6px', fontSize: '14px' }}>
          Here&apos;s your lead activity overview for today.
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <StatCard label="Total Leads" value={total} icon={Users} sub={`${newToday} today`} />
        <StatCard label="New Today" value={newToday} icon={TrendingUp} />
        <StatCard label="Converted" value={converted} icon={CheckCircle2} gold />
        <StatCard label="Conversion Rate" value={`${conversionRate}%`} icon={BarChart3} />
      </div>

      {/* Revenue Impact + Top Reel row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {/* Revenue Impact */}
        <div className="lux-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <p className="lux-label">Revenue Impact</p>
              <p style={{ color: '#7A756C', fontSize: '11px', marginTop: '3px' }}>
                Estimated · Avg ₹35,000 ticket
              </p>
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(198,167,94,0.08)',
                border: '1px solid rgba(198,167,94,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IndianRupee size={16} color="#C6A75E" strokeWidth={1.5} />
            </div>
          </div>
          <p className="lux-stat-gold" style={{ fontSize: '2.2rem' }}>
            ₹{revenueImpact.toLocaleString('en-IN')}
          </p>
          <div className="gold-divider" style={{ margin: '20px 0' }} />
          <p style={{ fontSize: '12px', color: '#7A756C' }}>
            Based on <span style={{ color: '#C6A75E', fontWeight: 600 }}>{converted} converted leads</span> · Update ticket size in Settings
          </p>
        </div>

        {/* Top Performing Reel */}
        <div className="lux-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Film size={15} color="#7A756C" strokeWidth={1.5} />
            <p className="lux-label">Top Performing Reel</p>
          </div>

          {topReel ? (
            <>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  color: '#F5F0E8',
                  lineHeight: 1.2,
                  marginBottom: '12px',
                }}
              >
                {topReel.productName}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="badge badge-new" style={{ fontSize: '10px' }}>
                  {topReel.category}
                </span>
                {topReel.price && (
                  <span style={{ fontSize: '12px', color: '#7A756C' }}>
                    ₹{topReel.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <div className="gold-divider" style={{ margin: '16px 0' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p className="lux-label">Leads Generated</p>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '2rem',
                      fontWeight: 600,
                      color: '#C6A75E',
                      lineHeight: 1,
                      marginTop: '4px',
                    }}
                  >
                    {topReel._count.leads}
                  </p>
                </div>
                <a
                  href="/dashboard/reels"
                  style={{
                    fontSize: '12px',
                    color: '#C6A75E',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  View all <ArrowUpRight size={12} />
                </a>
              </div>
            </>
          ) : (
            <div style={{ padding: '24px 0', textAlign: 'center' }}>
              <p style={{ color: '#7A756C', fontSize: '13px' }}>No reels added yet</p>
              <a
                href="/dashboard/reels"
                style={{
                  display: 'inline-block',
                  marginTop: '12px',
                  fontSize: '12px',
                  color: '#C6A75E',
                  textDecoration: 'none',
                }}
              >
                Add your first reel →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="lux-card" style={{ padding: '0' }}>
        <div
          style={{
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #1A1A1A',
          }}
        >
          <div>
            <p className="lux-label">Recent Activity</p>
            <p style={{ color: '#F5F0E8', fontSize: '15px', fontFamily: "'Cormorant Garamond', serif", marginTop: '2px' }}>
              Latest Leads
            </p>
          </div>
          <a
            href="/dashboard/leads"
            style={{
              fontSize: '12px',
              color: '#C6A75E',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            View all <ArrowUpRight size={12} />
          </a>
        </div>

        {recentLeads.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#7A756C' }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>📭</p>
            <p style={{ fontSize: '14px' }}>No leads yet. Add a reel to start.</p>
          </div>
        ) : (
          <div>
            {recentLeads.map((lead, i) => {
              const statusConf = STATUS_CONFIG[lead.status];
              return (
                <div
                  key={lead.id}
                  className="lux-table-row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 28px',
                    gap: '16px',
                  }}
                >
                  {/* Timeline dot */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '12px', flexShrink: 0 }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: i === 0 ? '#C6A75E' : '#3E3A34',
                        border: i === 0 ? '1px solid rgba(198,167,94,0.4)' : '1px solid #2A2A2A',
                        boxShadow: i === 0 ? '0 0 6px rgba(198,167,94,0.4)' : 'none',
                      }}
                    />
                  </div>

                  {/* Avatar */}
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1E1A14, #2A2218)',
                      border: '1px solid #2A2218',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#C6A75E',
                      flexShrink: 0,
                    }}
                  >
                    {lead.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#F5F0E8' }}>{lead.name}</p>
                    <p style={{ fontSize: '11px', color: '#7A756C', marginTop: '1px' }}>
                      {lead.reel?.productName ?? 'Direct lead'} ·{' '}
                      {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Badge */}
                  <span className={statusConf?.className ?? 'badge badge-new'}>
                    {statusConf?.label ?? lead.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
