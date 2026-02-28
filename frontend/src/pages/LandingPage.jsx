import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={s.page}>
      {/* Decorative blobs */}
      <div style={s.blob1} />
      <div style={s.blob2} />

      <nav style={s.nav}>
        <div style={s.brand}>
          <span style={{ color: 'var(--rose)', fontSize: 22 }}>✂</span>
          <span style={s.brandText}>GlowUp</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" style={s.navOutline}>Sign In</Link>
          <Link to="/register" style={s.navFill}>Get Started</Link>
        </div>
      </nav>

      <main style={s.hero}>
        <div style={s.badge}>✨ Book Your Glow Today</div>
        <h1 style={s.title}>
          Your Perfect<br />
          <em>Hairstyle</em> Awaits
        </h1>
        <p style={s.subtitle}>
          Discover stunning hairstyles, find top-rated salons and spas near you,
          and book your appointment in minutes.
        </p>
        <div style={s.ctas}>
          <Link to="/register" style={s.ctaPrimary}>Start Your Journey →</Link>
          <Link to="/login" style={s.ctaSecondary}>Sign In</Link>
        </div>

        <div style={s.statsRow}>
          {[['500+', 'Hairstyles'], ['200+', 'Salons & Spas'], ['50K+', 'Happy Clients']].map(([n, l]) => (
            <div key={l} style={s.stat}>
              <div style={s.statNum}>{n}</div>
              <div style={s.statLabel}>{l}</div>
            </div>
          ))}
        </div>
      </main>

      <section style={s.features}>
        {[
          { icon: '💇', title: 'Choose Your Style', desc: 'Browse hundreds of curated hairstyles across all hair types and lengths.' },
          { icon: '📍', title: 'Find Nearby Salons', desc: 'Discover top-rated salons and spas in your area with real-time availability.' },
          { icon: '📅', title: 'Easy Scheduling', desc: 'Book your appointment instantly and manage all your bookings in one place.' },
        ].map(f => (
          <div key={f.title} style={s.featureCard}>
            <div style={s.featureIcon}>{f.icon}</div>
            <h3 style={s.featureTitle}>{f.title}</h3>
            <p style={s.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #FAF7F2 0%, #FFF0E8 50%, #FAF7F2 100%)',
    position: 'relative', overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', top: -100, right: -100,
    width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(242, 203, 191, 0.4) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute', bottom: 100, left: -150,
    width: 600, height: 600, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(196, 212, 189, 0.3) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 60px',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  brandText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 24, fontWeight: 700, color: 'var(--espresso)',
  },
  navOutline: {
    textDecoration: 'none', padding: '10px 22px', borderRadius: 10,
    border: '1.5px solid var(--sand)', color: 'var(--mocha)',
    fontSize: 14, fontWeight: 500,
  },
  navFill: {
    textDecoration: 'none', padding: '10px 22px', borderRadius: 10,
    background: 'var(--rose)', color: '#fff',
    fontSize: 14, fontWeight: 600,
    boxShadow: '0 4px 16px rgba(201, 125, 110, 0.3)',
  },
  hero: {
    textAlign: 'center',
    padding: '80px 40px 60px',
    maxWidth: 700, margin: '0 auto',
    animation: 'fadeUp 0.6s ease',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(242, 203, 191, 0.5)',
    color: 'var(--rose-dark)',
    padding: '6px 16px', borderRadius: 20,
    fontSize: 13, fontWeight: 500,
    marginBottom: 24,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(48px, 8vw, 72px)',
    lineHeight: 1.1, color: 'var(--espresso)',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18, color: 'var(--mocha)', lineHeight: 1.7,
    maxWidth: 500, margin: '0 auto 36px',
    fontWeight: 300,
  },
  ctas: { display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 60 },
  ctaPrimary: {
    textDecoration: 'none',
    background: 'linear-gradient(135deg, var(--rose), var(--rose-dark))',
    color: '#fff', padding: '14px 32px', borderRadius: 12,
    fontSize: 16, fontWeight: 600,
    boxShadow: '0 8px 24px rgba(201, 125, 110, 0.35)',
  },
  ctaSecondary: {
    textDecoration: 'none',
    background: 'rgba(250, 247, 242, 0.8)',
    color: 'var(--espresso)', padding: '14px 32px', borderRadius: 12,
    fontSize: 16, fontWeight: 500, border: '1.5px solid var(--sand)',
  },
  statsRow: {
    display: 'flex', justifyContent: 'center', gap: 48,
  },
  stat: { textAlign: 'center' },
  statNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32, fontWeight: 700, color: 'var(--rose-dark)',
  },
  statLabel: { fontSize: 14, color: 'var(--mocha)', marginTop: 4 },
  features: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24, maxWidth: 900, margin: '0 auto 80px',
    padding: '0 40px',
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    padding: '32px 28px', borderRadius: 20,
    border: '1px solid rgba(201, 168, 140, 0.2)',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(44, 24, 16, 0.06)',
  },
  featureIcon: { fontSize: 36, marginBottom: 16 },
  featureTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20, color: 'var(--espresso)', marginBottom: 10,
  },
  featureDesc: { fontSize: 14, color: 'var(--mocha)', lineHeight: 1.6 },
};
