import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/StatsCard';
import BookingCard from '../../components/BookingCard';
import Loader from '../../components/Loader';
import { showNotification } from '../../components/Notification';

export default function NurseDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    API.get('/bookings').then((r) => setBookings(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      showNotification(`Booking ${status}.`, 'success');
      fetchBookings();
    } catch (err) { showNotification(err.response?.data?.error || 'Failed.', 'error'); }
  };

  if (loading) return <Loader />;

  const pending = bookings.filter((b) => b.status === 'pending');
  const accepted = bookings.filter((b) => b.status === 'accepted');
  const completed = bookings.filter((b) => b.status === 'completed');
  const earnings = completed.reduce((s, b) => s + (b.hourly_rate || 50) * (b.duration_hours || 1), 0);

  return (
    <div className="animate-fade-in-up">
      <div className="page-header"><h1>Nurse Dashboard</h1><p>Manage your appointments and schedule.</p></div>

      <div className="grid-4 stagger" style={{ marginBottom: 32 }}>
        <StatsCard icon="⏳" label="Pending Requests" value={pending.length} color="#F59E0B" bgColor="#FEF3C7" />
        <StatsCard icon="📋" label="Accepted" value={accepted.length} color="#0066CC" bgColor="#E8F4FD" />
        <StatsCard icon="✅" label="Completed" value={completed.length} color="#10B981" bgColor="#D1FAE5" />
        <StatsCard icon="💰" label="Total Earnings" value={`$${earnings}`} color="#6366F1" bgColor="#E0E7FF" />
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16 }}>Pending Requests ({pending.length})</h2>
      {pending.length === 0 ? (
        <div className="card-flat" style={{ textAlign: 'center', padding: 32, color: '#64748B', marginBottom: 24 }}>No pending requests.</div>
      ) : (
        pending.map((b) => (
          <BookingCard key={b.booking_id} booking={b} actions={
            <>
              <button className="btn btn-success btn-sm" onClick={() => updateStatus(b.booking_id, 'accepted')}>Accept</button>
              <button className="btn btn-danger btn-sm" onClick={() => updateStatus(b.booking_id, 'rejected')}>Reject</button>
            </>
          } />
        ))
      )}

      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16, marginTop: 24 }}>Upcoming ({accepted.length})</h2>
      {accepted.length === 0 ? (
        <div className="card-flat" style={{ textAlign: 'center', padding: 32, color: '#64748B' }}>No upcoming appointments.</div>
      ) : (
        accepted.map((b) => (
          <BookingCard key={b.booking_id} booking={b} actions={
            <button className="btn btn-primary btn-sm" onClick={() => updateStatus(b.booking_id, 'completed')}>Mark Complete</button>
          } />
        ))
      )}
    </div>
  );
}
