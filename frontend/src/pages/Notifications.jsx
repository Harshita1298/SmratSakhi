import { useState, useEffect } from 'react';
import API from '../api/axios';

const typeConfig = { offer:'🎉', booking:'📅', gallery:'📸', general:'💄', festival:'🪔' };

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/notifications').then(({ data }) => setNotifs(data.notifications)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    await API.put(`/notifications/${id}/read`).catch(() => {});
    setNotifs(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: 32, fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>🔔 Notifications</h1>
        <p style={{ color: '#7a5560', marginBottom: 24 }}>Sakhi Beauty ke latest updates</p>
        {loading ? <div className="spinner" /> : notifs.length === 0 ? (
          <div className="empty-state"><div className="icon">🔔</div><h3>Koi notification nahi</h3></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notifs.map(n => (
              <div key={n._id} onClick={() => markRead(n._id)} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', cursor: 'pointer', borderLeft: '4px solid #e8637a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 22 }}>{n.emoji || typeConfig[n.type] || '💄'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: '#7a5560' }}>{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: '#7a5560', lineHeight: 1.6 }}>{n.message}</p>
                {n.link && <a href={n.link} style={{ fontSize: 13, color: '#e8637a', fontWeight: 600, marginTop: 8, display: 'inline-block' }}>Dekhiye →</a>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
