import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import BookingCard from '../../components/BookingCard';
import Loader from '../../components/Loader';
import { showNotification } from '../../components/Notification';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get('/bookings').then((r) => setBookings(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cancelBooking = async (id) => {
    try {
      await API.put(`/bookings/${id}/status`, { status: 'cancelled' });
      setBookings((p) => p.map((b) => b.booking_id === id ? { ...b, status: 'cancelled' } : b));
      showNotification('Booking cancelled.', 'info');
    } catch (err) { showNotification(err.response?.data?.error || 'Failed.', 'error'); }
  };

  const payBooking = async (id) => {
    try {
      await API.post('/payments', { booking_id: id });
      showNotification('Payment processed!', 'success');
      const res = await API.get('/bookings');
      setBookings(res.data);
    } catch (err) { showNotification(err.response?.data?.error || 'Payment failed.', 'error'); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return <Loader />;

  return (
    <div className="animate-fade-in-up">
      <div className="page-header"><h1>My Bookings</h1><p>Track and manage all your care appointments.</p></div>

      <div className="tabs">
        {['all', 'pending', 'accepted', 'completed', 'cancelled'].map((t) => (
          <button key={t} className={`tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)} {t !== 'all' && `(${bookings.filter(b => b.status === t).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><div className="icon">📋</div><h3>No bookings found</h3></div>
      ) : (
        filtered.map((b) => (
          <BookingCard key={b.booking_id} booking={b} actions={
            <>
              {(b.status === 'pending' || b.status === 'accepted') && <button className="btn btn-danger btn-sm" onClick={() => cancelBooking(b.booking_id)}>Cancel</button>}
              {(b.status === 'accepted' || b.status === 'completed') && !b.payment && <button className="btn btn-success btn-sm" onClick={() => payBooking(b.booking_id)}>Pay Now</button>}
              {b.payment && <span className="badge badge-success">Paid — ${b.payment.amount}</span>}
            </>
          } />
        ))
      )}
    </div>
  );
}
