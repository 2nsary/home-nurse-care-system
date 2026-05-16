import React from 'react';
import { useNavigate } from 'react-router-dom';

function StarRating({ rating, count }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(<span key={i} style={{ color: i <= Math.round(rating) ? '#FFC107' : '#E2E8F0' }}>★</span>);
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.9rem' }}>
      {stars}
      <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: 4 }}>({count})</span>
    </div>
  );
}

export default function NurseCard({ nurse }) {
  const navigate = useNavigate();
  const initials = (nurse.full_name || 'N').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="card" style={styles.card}>
      <div style={styles.top}>
        <div className="avatar avatar-lg" style={{ fontSize: '1.1rem' }}>{initials}</div>
        <div style={styles.availability}>
          <span className={`status-dot ${nurse.availability ? 'online' : 'offline'}`}></span>
          <span style={{ fontSize: '0.75rem', color: nurse.availability ? '#10B981' : '#94A3B8', fontWeight: 600 }}>
            {nurse.availability ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
      <h3 style={styles.name}>{nurse.full_name}</h3>
      <span className="badge badge-primary" style={{ marginBottom: 8 }}>{nurse.specialization}</span>
      <StarRating rating={nurse.avg_rating || 0} count={nurse.review_count || 0} />
      <p style={styles.bio}>{nurse.bio || 'Experienced healthcare professional.'}</p>
      <div style={styles.meta}>
        <div><span style={styles.metaLabel}>Experience</span><span style={styles.metaValue}>{nurse.experience} yrs</span></div>
        <div><span style={styles.metaLabel}>Rate</span><span style={styles.metaValue}>${nurse.hourly_rate}/hr</span></div>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}
        onClick={() => navigate(`/patient/book/${nurse.nurse_id}`)}
        disabled={!nurse.availability}>
        {nurse.availability ? 'Book Now' : 'Unavailable'}
      </button>
    </div>
  );
}

const styles = {
  card: { display: 'flex', flexDirection: 'column', padding: 24 },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  availability: { display: 'flex', alignItems: 'center', gap: 6 },
  name: { fontSize: '1.125rem', fontWeight: 700, marginBottom: 4, color: '#1E293B' },
  bio: { fontSize: '0.8125rem', color: '#64748B', lineHeight: 1.5, marginTop: 8, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  meta: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #E2E8F0' },
  metaLabel: { display: 'block', fontSize: '0.6875rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.03em' },
  metaValue: { fontSize: '0.9375rem', fontWeight: 700, color: '#1E293B' },
};
