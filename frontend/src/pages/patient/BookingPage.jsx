import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { showNotification } from '../../components/Notification';
import Loader from '../../components/Loader';

export default function BookingPage() {
  const { nurseId } = useParams();
  const navigate = useNavigate();
  const [nurse, setNurse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ booking_date: '', booking_time: '09:00', duration_hours: 1, notes: '' });

  useEffect(() => {
    API.get(`/nurses/${nurseId}`).then((r) => setNurse(r.data)).catch(() => showNotification('Nurse not found', 'error')).finally(() => setLoading(false));
  }, [nurseId]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const total = nurse ? (nurse.hourly_rate || 50) * form.duration_hours : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.booking_date) { showNotification('Please select a date.', 'error'); return; }
    setSubmitting(true);
    try {
      await API.post('/bookings', { nurse_id: parseInt(nurseId), ...form, duration_hours: parseInt(form.duration_hours) });
      showNotification('Booking created successfully!', 'success');
      navigate('/patient/bookings');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Booking failed.', 'error');
    } finally { setSubmitting(false); }
  };

  if (loading) return <Loader />;
  if (!nurse) return <div className="empty-state"><h3>Nurse not found</h3></div>;

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header"><h1>Book Appointment</h1><p>Schedule a home care session with {nurse.full_name}.</p></div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <form onSubmit={handleSubmit} style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: '1.125rem', fontWeight: 700 }}>Appointment Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={form.booking_date} onChange={(e) => set('booking_date', e.target.value)} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <select className="form-select" value={form.booking_time} onChange={(e) => set('booking_time', e.target.value)}>
                  {['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Duration (hours)</label>
                <select className="form-select" value={form.duration_hours} onChange={(e) => set('duration_hours', e.target.value)}>
                  {[1,2,3,4,5,6,7,8].map(h => <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <textarea className="form-textarea" placeholder="Any specific requirements..." value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3}></textarea>
              </div>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={submitting} style={{ width: '100%' }}>
            {submitting ? 'Booking...' : `Confirm Booking — $${total.toFixed(2)}`}
          </button>
        </form>

        <div style={{ flex: '0 0 280px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div className="avatar avatar-lg">{(nurse.full_name || 'N')[0]}</div>
              <div>
                <h4 style={{ fontWeight: 700 }}>{nurse.full_name}</h4>
                <span className="badge badge-primary">{nurse.specialization}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.8125rem', color: '#475569' }}>
              <div>🕐 {nurse.experience} years experience</div>
              <div>⭐ {nurse.avg_rating || 0} ({nurse.review_count || 0} reviews)</div>
              <div>💰 ${nurse.hourly_rate}/hr</div>
            </div>
            <hr className="divider" />
            <div style={{ fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Rate</span><span>${nurse.hourly_rate}/hr</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Duration</span><span>{form.duration_hours}h</span></div>
              <hr className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.125rem' }}><span>Total</span><span style={{ color: '#0066CC' }}>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
