import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import Loader from '../../components/Loader';
import { showNotification } from '../../components/Notification';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get('/admin/users').then((r) => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const deleteUser = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers((p) => p.filter((u) => u.user_id !== id));
      showNotification('User deleted.', 'success');
    } catch (err) { showNotification(err.response?.data?.error || 'Failed.', 'error'); }
  };

  const filtered = filter === 'all' ? users : users.filter((u) => u.role === filter);

  if (loading) return <Loader />;

  return (
    <div className="animate-fade-in-up">
      <div className="page-header"><h1>Manage Users</h1><p>View and manage all system users.</p></div>

      <div className="tabs">
        {['all', 'patient', 'nurse', 'admin'].map((t) => (
          <button key={t} className={`tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}s ({t === 'all' ? users.length : users.filter(u => u.role === t).length})
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.user_id}>
                <td>#{u.user_id}</td>
                <td style={{ fontWeight: 600 }}>{u.full_name}</td>
                <td>{u.email}</td>
                <td>{u.phone || '—'}</td>
                <td><span className={`badge badge-${u.role === 'admin' ? 'info' : u.role === 'nurse' ? 'primary' : 'success'}`}>{u.role}</span></td>
                <td style={{ fontSize: '0.8125rem', color: '#64748B' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                <td>{u.role !== 'admin' && <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.user_id, u.full_name)}>Delete</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
