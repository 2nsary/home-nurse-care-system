import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showNotification } from '../components/Notification';

export default function Register() {
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({ full_name: '', email: '', password: '', phone: '', address: '', date_of_birth: '', specialization: 'General Care', experience: '', hourly_rate: '', bio: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!form.full_name || !form.email || !form.password) { setError('Name, email, and password are required.'); return; }
    setLoading(true);
    try {
      const payload = { ...form, role };
      if (role === 'nurse') { payload.experience = parseInt(payload.experience) || 0; payload.hourly_rate = parseFloat(payload.hourly_rate) || 50; }
      const user = await register(payload);
      showNotification('Registration successful!', 'success');
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.left}>
        <div style={s.leftContent} className="animate-fade-in">
          <span style={{ fontSize: '3rem' }}>🏥</span>
          <h1 style={s.leftTitle}>Join NurseCare</h1>
          <p style={s.leftDesc}>Create your account and start connecting with professional home healthcare services.</p>
        </div>
      </div>
      <div style={s.right}>
        <form onSubmit={handleSubmit} style={s.form} className="animate-fade-in-up">
          <h2 style={s.formTitle}>Create Account</h2>
          {error && <div style={s.error}>{error}</div>}

          <div style={s.roleToggle}>
            <button type="button" onClick={() => setRole('patient')} style={{ ...s.roleBtn, ...(role === 'patient' ? s.roleBtnActive : {}) }}>🏠 Patient</button>
            <button type="button" onClick={() => setRole('nurse')} style={{ ...s.roleBtn, ...(role === 'nurse' ? s.roleBtnActive : {}) }}>👩‍⚕️ Nurse</button>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="John Doe" value={form.full_name} onChange={(e) => set('full_name', e.target.value)} />
          </div>
          <div style={s.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Phone</label>
              <input className="form-input" placeholder="01XXXXXXXXX" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={(e) => set('password', e.target.value)} />
          </div>

          {role === 'patient' && (
            <>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-input" placeholder="Your home address" value={form.address} onChange={(e) => set('address', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input className="form-input" type="date" value={form.date_of_birth} onChange={(e) => set('date_of_birth', e.target.value)} />
              </div>
            </>
          )}

          {role === 'nurse' && (
            <>
              <div style={s.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Specialization</label>
                  <select className="form-select" value={form.specialization} onChange={(e) => set('specialization', e.target.value)}>
                    <option>General Care</option><option>Elderly Care</option><option>Pediatric Care</option>
                    <option>Post-Surgery Care</option><option>Chronic Disease Management</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Experience (yrs)</label>
                  <input className="form-input" type="number" min="0" placeholder="0" value={form.experience} onChange={(e) => set('experience', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Hourly Rate ($)</label>
                <input className="form-input" type="number" min="0" placeholder="50" value={form.hourly_rate} onChange={(e) => set('hourly_rate', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea className="form-textarea" placeholder="Tell patients about yourself..." value={form.bio} onChange={(e) => set('bio', e.target.value)} rows={3}></textarea>
              </div>
            </>
          )}

          <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
          <p style={s.switchLink}>Already have an account? <Link to="/login" style={{ color: '#0066CC', fontWeight: 600 }}>Sign In</Link></p>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', minHeight: '100vh' },
  left: { flex: '0 0 40%', background: 'linear-gradient(135deg, #0066CC, #00B4D8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 },
  leftContent: { color: '#FFF', maxWidth: 360 },
  leftTitle: { fontSize: '2.25rem', fontWeight: 800, margin: '16px 0 12px' },
  leftDesc: { fontSize: '1rem', opacity: 0.9, lineHeight: 1.6 },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 40px', background: '#F8FAFC', overflowY: 'auto' },
  form: { width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16 },
  formTitle: { fontSize: '1.75rem', fontWeight: 800, color: '#1E293B' },
  error: { background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: 8, fontSize: '0.8125rem' },
  roleToggle: { display: 'flex', gap: 8, background: '#F0F4F8', padding: 4, borderRadius: 10 },
  roleBtn: { flex: 1, padding: '10px 16px', border: 'none', borderRadius: 8, background: 'transparent', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: '#64748B', fontFamily: 'Inter, sans-serif', transition: 'all 150ms' },
  roleBtnActive: { background: '#FFFFFF', color: '#0066CC', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  row: { display: 'flex', gap: 12 },
  switchLink: { textAlign: 'center', fontSize: '0.875rem', color: '#64748B' },
};
