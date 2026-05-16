import React from 'react';

export default function Modal({ isOpen, onClose, title, children, width = 500 }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth: width }} onClick={(e) => e.stopPropagation()} className="animate-scale-in">
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)',
    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1000, padding: 20,
  },
  modal: {
    background: '#FFFFFF', borderRadius: 16, width: '100%',
    boxShadow: '0 25px 50px rgba(0,0,0,0.15)', overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 20px', borderBottom: '1px solid #E2E8F0',
  },
  title: { fontSize: '1.125rem', fontWeight: 700, color: '#1E293B' },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '1.5rem',
    color: '#94A3B8', cursor: 'pointer', padding: 4, lineHeight: 1,
  },
  body: { padding: 20 },
};
