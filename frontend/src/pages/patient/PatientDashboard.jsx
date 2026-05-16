import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/StatsCard';
import BookingCard from '../../components/BookingCard';
import Loader from '../../components/Loader';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/bookings').then((r) => setBookings(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const pending = bookings.filter((b) => b.status === 'pending').length;
  const accepted = bookings.filter((b) => b.status === 'accepted').length;
  const completed = bookings.filter((b) => b.status === 'completed').length;
  const recent = bookings.slice(0, 5);

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <h1>Patient Dashboard</h1>
        <p>Welcome back, {user?.full_name}! Here's your care overview.</p>
      </div>

      <div className="grid-4 stagger" style={{ marginBottom: 32 }}>
        <StatsCard icon="📋" label="Total Bookings" value={bookings.length} />
        <StatsCard icon="⏳" label="Pending" value={pending} color="#F59E0B" bgColor="#FEF3C7" />
        <StatsCard icon="✅" label="Accepted" value={accepted} color="#0066CC" bgColor="#E8F4FD" />
        <StatsCard icon="🎉" label="Completed" value={completed} color="#10B981" bgColor="#D1FAE5" />
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 600px' }}>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>Recent Bookings</h2>
            <Link to="/patient/bookings" style={s.viewAll}>View All →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state"><div className="icon">📋</div><h3>No bookings yet</h3><p>Find a nurse and book your first appointment.</p>
              <Link to="/patient/search" className="btn btn-primary" style={{ marginTop: 16 }}>Find Nurses</Link></div>
          ) : (
            recent.map((b) => <BookingCard key={b.booking_id} booking={b} />)
          )}
        </div>

        <div style={{ flex: '0 0 300px' }}>
          <div className="card" style={{ textAlign: 'center', padding: 32 }}>
            <span style={{ fontSize: '2.5rem' }}>🔍</span>
            <h3 style={{ marginTop: 12, marginBottom: 8, fontSize: '1.125rem' }}>Find a Nurse</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: 16 }}>Browse our network of qualified professionals.</p>
            <Link to="/patient/search" className="btn btn-gradient" style={{ width: '100%' }}>Search Nurses</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: '1.25rem', fontWeight: 700 },
  viewAll: { fontSize: '0.8125rem', fontWeight: 600, color: '#0066CC' },
};
