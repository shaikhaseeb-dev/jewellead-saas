import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import Sidebar from '@/components/dashboard/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) redirect('/auth/login');

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar shopName={user.shopName} />
      <main className="flex-1 ml-64 p-8 max-w-6xl">
        {children}
      </main>
    </div>
  );
}
