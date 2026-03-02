import { Gem } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', position: 'relative', overflow: 'hidden',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -60%)', width: '600px', height: '500px', background: 'radial-gradient(circle, rgba(198,167,94,0.055) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '900px', height: '160px', background: 'radial-gradient(ellipse, rgba(198,167,94,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #C6A75E, #8B6B2E)', boxShadow: '0 4px 24px rgba(198,167,94,0.28)', marginBottom: '16px' }}>
            <Gem size={24} color="#0A0A0A" strokeWidth={1.75} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{ height: '1px', width: '28px', background: 'rgba(198,167,94,0.3)' }} />
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '28px', fontWeight: 500, color: '#F5F0E8', margin: 0, letterSpacing: '-0.01em' }}>JewelLead</h1>
            <div style={{ height: '1px', width: '28px', background: 'rgba(198,167,94,0.3)' }} />
          </div>
          <p style={{ fontSize: '11px', color: '#7A756C', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Lead Automation · Jewelry Shops</p>
        </div>

        {children}

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#2A2A2A', marginTop: '24px' }}>
          Secure · Encrypted · Built for India
        </p>
      </div>

      
    </div>
  );
}
