import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showNotification } from '../components/Notification';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      showNotification('Login successful!', 'success');
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.left} className="animate-fade-in">
        <div style={s.leftContent}>
          <span style={{ fontSize: '3rem' }}>🏥</span>
          <h1 style={s.leftTitle}>NurseCare</h1>
          <p style={s.leftDesc}>Professional home healthcare at your fingertips. Login to manage your bookings and care.</p>
          <div style={s.stats}>
            <div><strong>500+</strong> Nurses</div>
            <div><strong>10K+</strong> Patients</div>
            <div><strong>4.9★</strong> Rating</div>
          </div>
        </div>
      </div>
      <div style={s.right}>
        <form onSubmit={handleSubmit} style={s.form} className="animate-fade-in-up">
          <div>
            <h2 style={s.formTitle}>Welcome Back</h2>
            <p style={s.formSub}>Sign in to your account</p>
          </div>
          {error && <div style={s.error}>{error}</div>}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p style={s.switchLink}>
            Don't have an account? <Link to="/register" style={{ color: '#0066CC', fontWeight: 600 }}>Create Account</Link>
          </p>
          <div style={s.demoCreds}>
            <p style={s.demoTitle}>Demo Credentials:</p>
            <p>Patient: <strong>omar@patient.com</strong> / patient123</p>
            <p>Nurse: <strong>sarah@homenurse.com</strong> / nurse123</p>
            <p>Admin: <strong>admin@homenurse.com</strong> / admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { display: 'flex', minHeight: '100vh' },
  left: { flex: '0 0 45%', background: 'linear-gradient(135deg, #0066CC 0%, #00B4D8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 },
  leftContent: { color: '#FFF', maxWidth: 400 },
  leftTitle: { fontSize: '2.5rem', fontWeight: 800, margin: '16px 0 12px' },
  leftDesc: { fontSize: '1.0625rem', opacity: 0.9, lineHeight: 1.6, marginBottom: 32 },
  stats: { display: 'flex', gap: 24, fontSize: '0.9375rem', opacity: 0.85 },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: '#F8FAFC' },
  form: { width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 20 },
  formTitle: { fontSize: '1.75rem', fontWeight: 800, color: '#1E293B' },
  formSub: { fontSize: '0.9375rem', color: '#64748B', marginTop: 4 },
  error: { background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: 8, fontSize: '0.8125rem', fontWeight: 500 },
  switchLink: { textAlign: 'center', fontSize: '0.875rem', color: '#64748B' },
  demoCreds: { background: '#F0F4F8', borderRadius: 10, padding: 14, fontSize: '0.75rem', color: '#64748B', lineHeight: 1.7 },
  demoTitle: { fontWeight: 600, color: '#475569', marginBottom: 4 },
};
