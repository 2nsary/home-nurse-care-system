import React, { useEffect, useState } from 'react';

let notifyFn = null;

export function showNotification(message, type = 'success') {
  if (notifyFn) notifyFn({ message, type, id: Date.now() });
}

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notifyFn = (n) => {
      setNotifications((prev) => [...prev, n]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((x) => x.id !== n.id));
      }, 4000);
    };
    return () => { notifyFn = null; };
  }, []);

  if (!notifications.length) return null;

  return (
    <div style={styles.container}>
      {notifications.map((n) => (
        <div key={n.id} style={{ ...styles.toast, ...styles[n.type] }} className="animate-slide-in-right">
          <span style={styles.icon}>{n.type === 'success' ? '✓' : n.type === 'error' ? '✕' : 'ℹ'}</span>
          <span>{n.message}</span>
          <button style={styles.close} onClick={() => setNotifications((p) => p.filter((x) => x.id !== n.id))}>×</button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed', top: 20, right: 20, zIndex: 9999,
    display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400,
  },
  toast: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 16px', borderRadius: 10,
    background: '#FFFFFF', boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
    fontSize: '0.875rem', fontWeight: 500, color: '#1E293B',
    border: '1px solid #E2E8F0',
  },
  icon: {
    width: 24, height: 24, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
  },
  close: {
    marginLeft: 'auto', background: 'none', border: 'none',
    fontSize: '1.2rem', cursor: 'pointer', color: '#94A3B8', padding: 4,
  },
  success: { borderLeft: '4px solid #10B981' },
  error: { borderLeft: '4px solid #EF4444' },
  info: { borderLeft: '4px solid #0066CC' },
};
