import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import BookingCard from '../../components/BookingCard';
import Loader from '../../components/Loader';
import { showNotification } from '../../components/Notification';

export default function ManageSchedule() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get('/bookings').then((r) => setBookings(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      showNotification(`Booking ${status}.`, 'success');
      const res = await API.get('/bookings');
      setBookings(res.data);
    } catch (err) { showNotification(err.response?.data?.error || 'Failed.', 'error'); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return <Loader />;

  return (
    <div className="animate-fade-in-up">
      <div className="page-header"><h1>My Schedule</h1><p>View and manage all your appointments.</p></div>

      <div className="tabs">
        {['all', 'pending', 'accepted', 'completed', 'rejected', 'cancelled'].map((t) => (
          <button key={t} className={`tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><div className="icon">📅</div><h3>No appointments</h3></div>
      ) : (
        filtered.map((b) => (
          <BookingCard key={b.booking_id} booking={b} actions={
            <>
              {b.status === 'pending' && <>
                <button className="btn btn-success btn-sm" onClick={() => updateStatus(b.booking_id, 'accepted')}>Accept</button>
                <button className="btn btn-danger btn-sm" onClick={() => updateStatus(b.booking_id, 'rejected')}>Reject</button>
              </>}
              {b.status === 'accepted' && <button className="btn btn-primary btn-sm" onClick={() => updateStatus(b.booking_id, 'completed')}>Complete</button>}
            </>
          } />
        ))
      )}
    </div>
  );
}
