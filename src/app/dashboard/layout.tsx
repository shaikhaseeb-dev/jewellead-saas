import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import Sidebar from '@/components/dashboard/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) redirect('/auth/login');

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#0A0A0A',
      }}
    >
      <Sidebar shopName={user.shopName} />
      <main
        style={{
          flex: 1,
          marginLeft: '232px',
          padding: '40px 48px',
          maxWidth: 'calc(100vw - 232px)',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
}
