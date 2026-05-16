import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🏠', title: 'Home Visits', desc: 'Professional nurses come directly to your doorstep for personalized healthcare.' },
  { icon: '⏰', title: '24/7 Availability', desc: 'Round-the-clock nursing services whenever you need them most.' },
  { icon: '🩺', title: 'Specialized Care', desc: 'From elderly care to pediatric and post-surgery nursing specialists.' },
  { icon: '⭐', title: 'Trusted Professionals', desc: 'Verified, experienced nurses with transparent ratings and reviews.' },
  { icon: '💳', title: 'Easy Payments', desc: 'Secure and hassle-free payment processing for all services.' },
  { icon: '📱', title: 'Easy Booking', desc: 'Book a nurse in minutes with our streamlined scheduling system.' },
];

const steps = [
  { num: '01', title: 'Search', desc: 'Browse qualified nurses by specialization and availability.' },
  { num: '02', title: 'Book', desc: 'Choose your preferred date, time, and duration.' },
  { num: '03', title: 'Care', desc: 'Receive professional care at your home.' },
];

export default function Landing() {
  const { isAuthenticated, user } = useAuth();
  const dashPath = isAuthenticated ? `/${user.role}` : '/login';

  return (
    <div style={{ background: '#FFFFFF' }}>
      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <div style={s.brand}><span style={{ fontSize: '1.5rem' }}>🏥</span><span style={s.brandText}>NurseCare</span></div>
          <div style={s.navLinks}>
            <a href="#features" style={s.navLink}>Features</a>
            <a href="#how" style={s.navLink}>How It Works</a>
            {isAuthenticated ? (
              <Link to={dashPath} className="btn btn-primary btn-sm">Dashboard</Link>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroContent} className="animate-fade-in-up">
          <span style={s.heroBadge}>🏥 Trusted Home Healthcare</span>
          <h1 style={s.heroTitle}>Professional Nursing Care<br /><span style={s.heroHighlight}>At Your Doorstep</span></h1>
          <p style={s.heroDesc}>Connect with qualified, experienced nurses for personalized home healthcare services. Quality care, comfort, and convenience — all in one platform.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-gradient btn-lg">Start Free →</Link>
            <a href="#features" className="btn btn-outline btn-lg">Learn More</a>
          </div>
          <div style={s.heroStats}>
            <div><strong style={s.statNum}>500+</strong><span style={s.statLabel}>Active Nurses</span></div>
            <div style={s.statDivider}></div>
            <div><strong style={s.statNum}>10K+</strong><span style={s.statLabel}>Patients Served</span></div>
            <div style={s.statDivider}></div>
            <div><strong style={s.statNum}>4.9★</strong><span style={s.statLabel}>Average Rating</span></div>
          </div>
        </div>
        <div style={s.heroVisual} className="animate-fade-in">
          <div style={s.heroCard}>
            <div style={s.heroCardTop}>
              <div style={s.heroAvatar}>👩‍⚕️</div>
              <div>
                <p style={s.heroCardName}>Sarah Johnson</p>
                <p style={s.heroCardSpec}>Elderly Care Specialist</p>
              </div>
              <span style={s.heroCardBadge}>⭐ 4.9</span>
            </div>
            <div style={s.heroCardMeta}>
              <span>🕐 8 yrs experience</span>
              <span>💰 $65/hr</span>
            </div>
            <div style={s.heroCardStatus}><span className="status-dot online"></span> Available Now</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={s.section}>
        <div style={s.container}>
          <div style={s.sectionHeader}>
            <span className="badge badge-primary" style={{ marginBottom: 8, fontSize: '0.8rem', padding: '4px 12px' }}>Why Choose Us</span>
            <h2 style={s.sectionTitle}>Everything You Need for Home Healthcare</h2>
            <p style={s.sectionDesc}>Our platform connects patients with verified nursing professionals for comprehensive home care.</p>
          </div>
          <div className="grid-3 stagger">
            {features.map((f, i) => (
              <div key={i} className="card" style={s.featureCard}>
                <div style={s.featureIcon}>{f.icon}</div>
                <h3 style={s.featureTitle}>{f.title}</h3>
                <p style={s.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" style={{ ...s.section, background: '#F0F4F8' }}>
        <div style={s.container}>
          <div style={s.sectionHeader}>
            <span className="badge badge-primary" style={{ marginBottom: 8, fontSize: '0.8rem', padding: '4px 12px' }}>Simple Process</span>
            <h2 style={s.sectionTitle}>How It Works</h2>
          </div>
          <div className="grid-3 stagger">
            {steps.map((step, i) => (
              <div key={i} style={s.stepCard}>
                <span style={s.stepNum}>{step.num}</span>
                <h3 style={s.stepTitle}>{step.title}</h3>
                <p style={s.featureDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ ...s.section, background: 'linear-gradient(135deg, #0066CC 0%, #00B4D8 100%)', color: '#FFF', textAlign: 'center' }}>
        <div style={s.container}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: 12 }}>Ready to Get Started?</h2>
          <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
            Join thousands of patients and nurses on our platform.
          </p>
          <Link to="/register" className="btn btn-lg" style={{ background: '#FFF', color: '#0066CC', fontWeight: 700, boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>Create Free Account →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <p>© 2026 NurseCare — Home Nurse Care System. All rights reserved.</p>
      </footer>
    </div>
  );
}

const s = {
  nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E2E8F0' },
  navInner: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  brand: { display: 'flex', alignItems: 'center', gap: 8 },
  brandText: { fontSize: '1.25rem', fontWeight: 800, color: '#0066CC' },
  navLinks: { display: 'flex', alignItems: 'center', gap: 20 },
  navLink: { fontSize: '0.875rem', fontWeight: 500, color: '#475569', textDecoration: 'none' },

  hero: { maxWidth: 1200, margin: '0 auto', padding: '120px 24px 60px', display: 'flex', alignItems: 'center', gap: 60, minHeight: '85vh' },
  heroContent: { flex: 1 },
  heroBadge: { display: 'inline-block', background: '#E8F4FD', color: '#0066CC', padding: '6px 14px', borderRadius: 20, fontSize: '0.8125rem', fontWeight: 600, marginBottom: 16 },
  heroTitle: { fontSize: '3.25rem', fontWeight: 800, color: '#1E293B', lineHeight: 1.15, marginBottom: 16 },
  heroHighlight: { background: 'linear-gradient(135deg, #0066CC, #00B4D8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroDesc: { fontSize: '1.125rem', color: '#64748B', lineHeight: 1.7, marginBottom: 28, maxWidth: 520 },
  heroStats: { display: 'flex', alignItems: 'center', gap: 24, marginTop: 36, padding: '20px 0' },
  statNum: { display: 'block', fontSize: '1.5rem', fontWeight: 800, color: '#1E293B' },
  statLabel: { fontSize: '0.8125rem', color: '#64748B' },
  statDivider: { width: 1, height: 40, background: '#E2E8F0' },

  heroVisual: { flex: '0 0 360px' },
  heroCard: { background: '#FFF', borderRadius: 20, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid #E8F0F8' },
  heroCardTop: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  heroAvatar: { width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #0066CC, #00B4D8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
  heroCardName: { fontWeight: 700, fontSize: '1rem', color: '#1E293B' },
  heroCardSpec: { fontSize: '0.8125rem', color: '#64748B' },
  heroCardBadge: { marginLeft: 'auto', background: '#FEF3C7', color: '#92400E', padding: '4px 10px', borderRadius: 12, fontSize: '0.8125rem', fontWeight: 600 },
  heroCardMeta: { display: 'flex', gap: 16, fontSize: '0.8125rem', color: '#475569', marginBottom: 12 },
  heroCardStatus: { display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', fontWeight: 600, color: '#10B981', padding: '8px 12px', background: '#F0FDF4', borderRadius: 10 },

  section: { padding: '80px 0' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '0 24px' },
  sectionHeader: { textAlign: 'center', marginBottom: 48 },
  sectionTitle: { fontSize: '2rem', fontWeight: 800, color: '#1E293B', marginBottom: 8 },
  sectionDesc: { fontSize: '1rem', color: '#64748B', maxWidth: 560, margin: '0 auto' },

  featureCard: { textAlign: 'center', padding: 32 },
  featureIcon: { fontSize: '2.5rem', marginBottom: 16 },
  featureTitle: { fontSize: '1.125rem', fontWeight: 700, marginBottom: 8, color: '#1E293B' },
  featureDesc: { fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 },

  stepCard: { textAlign: 'center', padding: 32 },
  stepNum: { display: 'inline-block', fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #0066CC, #00B4D8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12 },
  stepTitle: { fontSize: '1.25rem', fontWeight: 700, marginBottom: 8, color: '#1E293B' },

  footer: { textAlign: 'center', padding: '24px', borderTop: '1px solid #E2E8F0', fontSize: '0.8125rem', color: '#94A3B8' },
};
