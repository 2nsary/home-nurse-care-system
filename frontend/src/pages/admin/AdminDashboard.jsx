import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import StatsCard from '../../components/StatsCard';
import Loader from '../../components/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get('/admin/stats'), API.get('/admin/reports')])
      .then(([s, r]) => { setStats(s.data); setRecent(r.data.slice(0, 10)); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="animate-fade-in-up">
      <div className="page-header"><h1>Admin Dashboard</h1><p>System overview and key metrics.</p></div>

      <div className="grid-4 stagger" style={{ marginBottom: 32 }}>
        <StatsCard icon="👥" label="Total Users" value={stats?.total_users || 0} />
        <StatsCard icon="🏠" label="Patients" value={stats?.total_patients || 0} color="#10B981" bgColor="#D1FAE5" />
        <StatsCard icon="👩‍⚕️" label="Nurses" value={stats?.total_nurses || 0} color="#6366F1" bgColor="#E0E7FF" />
        <StatsCard icon="💰" label="Revenue" value={`$${(stats?.total_revenue || 0).toFixed(0)}`} color="#F59E0B" bgColor="#FEF3C7" />
      </div>

      <div className="grid-4 stagger" style={{ marginBottom: 32 }}>
        <StatsCard icon="📋" label="Total Bookings" value={stats?.total_bookings || 0} />
        <StatsCard icon="⏳" label="Pending" value={stats?.pending_bookings || 0} color="#F59E0B" bgColor="#FEF3C7" />
        <StatsCard icon="✅" label="Completed" value={stats?.completed_bookings || 0} color="#10B981" bgColor="#D1FAE5" />
        <StatsCard icon="❌" label="Cancelled" value={stats?.cancelled_bookings || 0} color="#EF4444" bgColor="#FEE2E2" />
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16 }}>Recent Bookings</h2>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>ID</th><th>Patient</th><th>Nurse</th><th>Date</th><th>Duration</th><th>Status</th></tr></thead>
          <tbody>
            {recent.map((b) => (
              <tr key={b.booking_id}>
                <td>#{b.booking_id}</td>
                <td>{b.patient_name}</td>
                <td>{b.nurse_name}</td>
                <td>{b.booking_date} {b.booking_time}</td>
                <td>{b.duration_hours}h</td>
                <td><span className={`badge badge-${b.status === 'completed' ? 'success' : b.status === 'pending' ? 'warning' : b.status === 'accepted' ? 'primary' : 'danger'}`}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
