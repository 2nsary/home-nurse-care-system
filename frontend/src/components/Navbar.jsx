import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <header style={styles.navbar}>
      <div>
        <p style={styles.greeting}>{greeting}, <strong>{user?.full_name?.split(' ')[0]}</strong> 👋</p>
      </div>
      <div style={styles.right}>
        <span style={styles.date}>{now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </header>
  );
}

const styles = {
  navbar: {
    position: 'fixed', top: 0, right: 0,
    left: 260, height: 64, background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(12px)', borderBottom: '1px solid #E2E8F0',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px', zIndex: 90,
  },
  greeting: { fontSize: '0.9375rem', color: '#1E293B' },
  right: { display: 'flex', alignItems: 'center', gap: 16 },
  date: { fontSize: '0.8125rem', color: '#64748B' },
};
