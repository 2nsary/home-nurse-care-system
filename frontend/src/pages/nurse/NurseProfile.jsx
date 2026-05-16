import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { showNotification } from '../../components/Notification';

export default function NurseProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    API.get('/auth/me').then((r) => {
      const p = r.data.profile || {};
      setProfile(p);
      setForm({ full_name: r.data.full_name, phone: r.data.phone, specialization: p.specialization, experience: p.experience, hourly_rate: p.hourly_rate, bio: p.bio || '', availability: p.availability });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put('/nurses/profile', form);
      showNotification('Profile updated!', 'success');
    } catch (err) { showNotification(err.response?.data?.error || 'Failed.', 'error'); }
    finally { setSaving(false); }
  };

  const toggleAvailability = async () => {
    try {
      const res = await API.put('/nurses/availability', { availability: !form.availability });
      set('availability', res.data.availability);
      showNotification(res.data.message, 'success');
    } catch (err) { showNotification('Failed.', 'error'); }
  };

  if (loading) return <Loader />;

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="page-header"><h1>My Profile</h1><p>Update your professional information.</p></div>

      <div className="card" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="avatar avatar-xl">{(user?.full_name || 'N')[0]}</div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user?.full_name}</h3>
            <span className="badge badge-primary">{profile?.specialization}</span>
          </div>
        </div>
        <button className={`btn ${form.availability ? 'btn-success' : 'btn-ghost'}`} onClick={toggleAvailability}>
          <span className={`status-dot ${form.availability ? 'online' : 'offline'}`}></span>
          {form.availability ? 'Available' : 'Unavailable'}
        </button>
      </div>

      <form onSubmit={handleSave} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 4 }}>Edit Profile</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.full_name || ''} onChange={(e) => set('full_name', e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Phone</label>
            <input className="form-input" value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Specialization</label>
            <select className="form-select" value={form.specialization || ''} onChange={(e) => set('specialization', e.target.value)}>
              <option>General Care</option><option>Elderly Care</option><option>Pediatric Care</option>
              <option>Post-Surgery Care</option><option>Chronic Disease Management</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: '0 0 120px' }}>
            <label className="form-label">Experience</label>
            <input className="form-input" type="number" value={form.experience || 0} onChange={(e) => set('experience', parseInt(e.target.value))} />
          </div>
          <div className="form-group" style={{ flex: '0 0 120px' }}>
            <label className="form-label">Rate ($/hr)</label>
            <input className="form-input" type="number" value={form.hourly_rate || 0} onChange={(e) => set('hourly_rate', parseFloat(e.target.value))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea className="form-textarea" value={form.bio || ''} onChange={(e) => set('bio', e.target.value)} rows={4}></textarea>
        </div>
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
}
