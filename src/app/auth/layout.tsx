import { Gem } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(198,167,94,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Bottom subtle glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(198,167,94,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo mark */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #C6A75E, #8B6B2E)',
              boxShadow: '0 4px 24px rgba(198,167,94,0.3)',
              marginBottom: '16px',
            }}
          >
            <Gem size={26} color="#0A0A0A" strokeWidth={1.75} />
          </div>

          {/* Decorative line */}
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(198,167,94,0.4), transparent)',
              margin: '0 auto 14px',
            }}
          />

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '32px',
              fontWeight: 500,
              color: '#F5F0E8',
              letterSpacing: '-0.01em',
              lineHeight: 1,
              margin: 0,
            }}
          >
            JewelLead
          </h1>
          <p
            style={{
              fontSize: '12px',
              color: '#7A756C',
              marginTop: '6px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            Lead Automation for Jewelry Shops
          </p>
        </div>

        {children}

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#3E3A34', marginTop: '28px' }}>
          © 2025 JewelLead · Secure · Encrypted
        </p>
      </div>
    </div>
  );
}
