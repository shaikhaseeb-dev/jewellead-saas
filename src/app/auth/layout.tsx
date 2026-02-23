export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500 text-white text-2xl mb-4 shadow-lg">
            💍
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground">JewelLead</h1>
          <p className="text-muted-foreground mt-1 text-sm">Lead Automation for Jewelry Shops</p>
        </div>
        {children}
      </div>
    </div>
  );
}
