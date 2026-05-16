import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import Loader from '../../components/Loader';

export default function Reports() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get('/admin/reports'), API.get('/admin/stats')])
      .then(([r, s]) => { setBookings(r.data); setStats(s.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const statusCounts = { pending: 0, accepted: 0, completed: 0, rejected: 0, cancelled: 0 };
  bookings.forEach((b) => { if (statusCounts[b.status] !== undefined) statusCounts[b.status]++; });

  return (
    <div className="animate-fade-in-up">
      <div className="page-header"><h1>Reports</h1><p>System analytics and booking reports.</p></div>

      <div className="grid-2" style={{ marginBottom: 32 }}>
        <div className="card">
          <h3 style={s.cardTitle}>Revenue Summary</h3>
          <div style={s.bigStat}>
            <span style={s.bigNum}>${(stats?.total_revenue || 0).toFixed(2)}</span>
            <span style={s.bigLabel}>Total Revenue</span>
          </div>
          <div style={s.metaRow}>
            <div><span style={s.metaLabel}>Total Bookings</span><span style={s.metaVal}>{stats?.total_bookings || 0}</span></div>
            <div><span style={s.metaLabel}>Completed</span><span style={s.metaVal}>{stats?.completed_bookings || 0}</span></div>
            <div><span style={s.metaLabel}>Avg per Booking</span><span style={s.metaVal}>${stats?.completed_bookings ? ((stats.total_revenue || 0) / stats.completed_bookings).toFixed(2) : '0'}</span></div>
          </div>
        </div>

        <div className="card">
          <h3 style={s.cardTitle}>Booking Status Breakdown</h3>
          <div style={s.bars}>
            {Object.entries(statusCounts).map(([status, count]) => {
              const pct = bookings.length ? Math.round((count / bookings.length) * 100) : 0;
              const colors = { pending: '#F59E0B', accepted: '#0066CC', completed: '#10B981', rejected: '#EF4444', cancelled: '#94A3B8' };
              return (
                <div key={status} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: 4 }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{status}</span>
                    <span style={{ color: '#64748B' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 8, background: '#F0F4F8', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: colors[status], borderRadius: 4, transition: 'width 0.5s ease' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16 }}>All Bookings Report</h2>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>ID</th><th>Patient</th><th>Nurse</th><th>Specialization</th><th>Date</th><th>Hours</th><th>Amount</th><th>Status</th><th>Payment</th></tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.booking_id}>
                <td>#{b.booking_id}</td>
                <td>{b.patient_name}</td>
                <td>{b.nurse_name}</td>
                <td>{b.nurse_specialization}</td>
                <td>{b.booking_date}</td>
                <td>{b.duration_hours}h</td>
                <td style={{ fontWeight: 600 }}>${((b.hourly_rate || 50) * (b.duration_hours || 1)).toFixed(2)}</td>
                <td><span className={`badge badge-${b.status === 'completed' ? 'success' : b.status === 'pending' ? 'warning' : b.status === 'accepted' ? 'primary' : 'danger'}`}>{b.status}</span></td>
                <td>{b.payment ? <span className="badge badge-success">Paid</span> : <span className="badge badge-neutral">Unpaid</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const s = {
  cardTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: 16 },
  bigStat: { textAlign: 'center', marginBottom: 20, padding: 16 },
  bigNum: { display: 'block', fontSize: '2.5rem', fontWeight: 800, color: '#0066CC' },
  bigLabel: { fontSize: '0.875rem', color: '#64748B' },
  metaRow: { display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #E2E8F0', paddingTop: 16 },
  metaLabel: { display: 'block', fontSize: '0.6875rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 },
  metaVal: { fontSize: '1.125rem', fontWeight: 700 },
  bars: { padding: '8px 0' },
};
