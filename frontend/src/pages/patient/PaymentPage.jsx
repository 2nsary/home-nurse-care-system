import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import Loader from '../../components/Loader';

export default function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/payments').then((r) => setPayments(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const total = payments.filter(p => p.payment_status === 'completed').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="animate-fade-in-up">
      <div className="page-header"><h1>Payment History</h1><p>Track all your payment transactions.</p></div>

      <div className="card" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, padding: 24 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: 4 }}>Total Spent</p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0066CC' }}>${total.toFixed(2)}</p>
        </div>
        <div>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: 4 }}>Transactions</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{payments.length}</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="empty-state"><div className="icon">💳</div><h3>No payments yet</h3></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Booking</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.payment_id}>
                  <td>#{p.payment_id}</td>
                  <td>#{p.booking_id}</td>
                  <td style={{ fontWeight: 700 }}>${p.amount.toFixed(2)}</td>
                  <td style={{ textTransform: 'capitalize' }}>{p.payment_method?.replace('_', ' ')}</td>
                  <td><span className={`badge ${p.payment_status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{p.payment_status}</span></td>
                  <td style={{ fontSize: '0.8125rem', color: '#64748B' }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
