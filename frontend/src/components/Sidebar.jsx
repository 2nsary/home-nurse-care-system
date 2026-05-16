import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = {
  patient: [
    { path: '/patient', label: 'Dashboard', icon: '📊' },
    { path: '/patient/search', label: 'Find Nurses', icon: '🔍' },
    { path: '/patient/bookings', label: 'My Bookings', icon: '📋' },
    { path: '/patient/payments', label: 'Payments', icon: '💳' },
  ],
  nurse: [
    { path: '/nurse', label: 'Dashboard', icon: '📊' },
    { path: '/nurse/schedule', label: 'Schedule', icon: '📅' },
    { path: '/nurse/profile', label: 'My Profile', icon: '👤' },
  ],
  admin: [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Manage Users', icon: '👥' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItems[user?.role] || [];
  const initials = (user?.full_name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <span style={styles.brandIcon}>🏥</span>
        <div>
          <h2 style={styles.brandTitle}>NurseCare</h2>
          <p style={styles.brandSub}>Home Health System</p>
        </div>
      </div>

      <nav style={styles.nav}>
        {items.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.path === `/${user?.role}`}
            style={({ isActive }) => ({ ...styles.navItem, ...(isActive ? styles.navItemActive : {}) })}>
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <div className="avatar">{initials}</div>
          <div>
            <p style={styles.userName}>{user?.full_name}</p>
            <p style={styles.userRole}>{user?.role}</p>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout} title="Logout">🚪</button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    position: 'fixed', top: 0, left: 0, bottom: 0,
    width: 260, background: '#FFFFFF', borderRight: '1px solid #E2E8F0',
    display: 'flex', flexDirection: 'column', zIndex: 100,
    boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '20px 20px', borderBottom: '1px solid #E2E8F0',
  },
  brandIcon: { fontSize: '1.75rem' },
  brandTitle: { fontSize: '1.125rem', fontWeight: 800, color: '#0066CC', lineHeight: 1.2 },
  brandSub: { fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 500 },
  nav: { flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px', borderRadius: 10,
    fontSize: '0.875rem', fontWeight: 500, color: '#475569',
    textDecoration: 'none', transition: 'all 150ms ease',
  },
  navItemActive: {
    background: '#E8F4FD', color: '#0066CC', fontWeight: 600,
  },
  navIcon: { fontSize: '1.1rem' },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px', borderTop: '1px solid #E2E8F0',
  },
  userInfo: { display: 'flex', alignItems: 'center', gap: 10 },
  userName: { fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B' },
  userRole: { fontSize: '0.6875rem', color: '#94A3B8', textTransform: 'capitalize' },
  logoutBtn: {
    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem',
    padding: 6, borderRadius: 8, transition: 'background 150ms',
  },
};
