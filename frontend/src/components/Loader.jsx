import React from 'react';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>{text}</p>
      <style>{`
        @keyframes loader-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    gap: '1rem',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '4px solid #E2E8F0',
    borderTopColor: '#0066CC',
    borderRadius: '50%',
    animation: 'loader-spin 0.8s linear infinite',
  },
  text: {
    color: '#64748B',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
};
