import React from 'react';

const statusConfig = {
  pending: { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
  accepted: { bg: '#DBEAFE', color: '#1E40AF', label: 'Accepted' },
  rejected: { bg: '#FEE2E2', color: '#991B1B', label: 'Rejected' },
  completed: { bg: '#D1FAE5', color: '#065F46', label: 'Completed' },
  cancelled: { bg: '#F1F5F9', color: '#475569', label: 'Cancelled' },
};

export default function BookingCard({ booking, actions }) {
  const status = statusConfig[booking.status] || statusConfig.pending;

  return (
    <div className="card-flat" style={styles.card}>
      <div style={styles.header}>
        <div>
          <p style={styles.id}>#{booking.booking_id}</p>
          <h4 style={styles.name}>{booking.nurse_name || booking.patient_name}</h4>
          <span className="badge badge-primary">{booking.nurse_specialization || 'General'}</span>
        </div>
        <span style={{ ...styles.status, background: status.bg, color: status.color }}>{status.label}</span>
      </div>
      <div style={styles.details}>
        <div style={styles.detail}><span style={styles.detailIcon}>📅</span><span>{booking.booking_date}</span></div>
        <div style={styles.detail}><span style={styles.detailIcon}>⏰</span><span>{booking.booking_time}</span></div>
        <div style={styles.detail}><span style={styles.detailIcon}>⏱️</span><span>{booking.duration_hours}h</span></div>
        <div style={styles.detail}><span style={styles.detailIcon}>💰</span><span>${(booking.hourly_rate || 50) * (booking.duration_hours || 1)}</span></div>
      </div>
      {booking.notes && <p style={styles.notes}>{booking.notes}</p>}
      {actions && <div style={styles.actions}>{actions}</div>}
    </div>
  );
}

const styles = {
  card: { marginBottom: 12 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  id: { fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, marginBottom: 2 },
  name: { fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 4 },
  status: { padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' },
  details: { display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 },
  detail: { display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: '#475569' },
  detailIcon: { fontSize: '0.875rem' },
  notes: { fontSize: '0.8125rem', color: '#64748B', fontStyle: 'italic', marginBottom: 8 },
  actions: { display: 'flex', gap: 8, marginTop: 12, borderTop: '1px solid #E2E8F0', paddingTop: 12 },
};
