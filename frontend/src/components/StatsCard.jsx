import React from 'react';

export default function StatsCard({ icon, label, value, color = '#0066CC', bgColor = '#E8F4FD', trend }) {
  return (
    <div className="card" style={styles.card}>
      <div style={{ ...styles.iconWrap, background: bgColor, color }}>
        <span style={styles.icon}>{icon}</span>
      </div>
      <div>
        <p style={styles.label}>{label}</p>
        <p style={styles.value}>{value}</p>
        {trend && <p style={{ ...styles.trend, color: trend > 0 ? '#10B981' : '#EF4444' }}>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</p>}
      </div>
    </div>
  );
}

const styles = {
  card: { display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px' },
  iconWrap: {
    width: 52, height: 52, borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  icon: { fontSize: '1.5rem' },
  label: { fontSize: '0.8125rem', color: '#64748B', fontWeight: 500, marginBottom: 2 },
  value: { fontSize: '1.75rem', fontWeight: 800, color: '#1E293B', lineHeight: 1.2 },
  trend: { fontSize: '0.75rem', fontWeight: 600, marginTop: 2 },
};
