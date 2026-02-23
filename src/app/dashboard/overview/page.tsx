import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Users, TrendingUp, Bell, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { startOfDay, subDays } from 'date-fns';

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-yellow-100 text-yellow-700',
  INTERESTED: 'bg-green-100 text-green-700',
  NOT_INTERESTED: 'bg-red-100 text-red-600',
  CONVERTED: 'bg-gold-100 text-gold-700',
  FOLLOW_UP: 'bg-purple-100 text-purple-700',
};

export default async function OverviewPage() {
  const user = await getAuthUser();
  if (!user) redirect('/auth/login');

  const today = startOfDay(new Date());
  const twoDaysAgo = subDays(today, 2);

  const [total, newToday, followUpDue, converted, recentLeads] = await Promise.all([
    prisma.lead.count({ where: { userId: user.userId } }),
    prisma.lead.count({ where: { userId: user.userId, createdAt: { gte: today } } }),
    prisma.lead.count({
      where: {
        userId: user.userId,
        status: { notIn: ['NOT_INTERESTED', 'CONVERTED'] },
        createdAt: { lte: twoDaysAgo },
        followUpSentAt: null,
      },
    }),
    prisma.lead.count({ where: { userId: user.userId, status: 'CONVERTED' } }),
    prisma.lead.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { reel: { select: { productName: true } } },
    }),
  ]);

  const stats = [
    { label: 'Total Leads', value: total, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'New Today', value: newToday, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Follow-up Due', value: followUpDue, icon: Bell, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Converted', value: converted, icon: CheckCircle2, color: 'text-gold-600', bg: 'bg-gold-50' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Good morning! 👋</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your leads today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon className={stat.color} size={20} />
              </div>
              <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg">Recent Leads</h2>
          <a href="/dashboard/leads" className="text-sm text-gold-600 hover:underline font-medium">
            View all →
          </a>
        </div>

        <div className="divide-y divide-border">
          {recentLeads.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-4xl mb-2">📭</p>
              <p className="font-medium">No leads yet</p>
              <p className="text-sm mt-1">Add a reel to start capturing leads automatically</p>
            </div>
          ) : (
            recentLeads.map((lead) => (
              <div key={lead.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-100 flex items-center justify-center text-sm font-bold text-gold-700">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.reel?.productName || 'Direct lead'} · {formatDate(lead.createdAt)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-600'}`}
                >
                  {lead.status.replace('_', ' ')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
