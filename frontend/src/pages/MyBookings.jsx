// src/pages/MyBookings.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const statusConfig = {
  pending:     { label: 'Pending',     bg: '#fff8e1', color: '#f57c00' },
  confirmed:   { label: 'Confirmed',   bg: '#e8f5e9', color: '#2e7d32' },
  'in-progress': { label: 'In Progress', bg: '#f3e5f5', color: '#6a1b9a' },
  completed:   { label: 'Completed',   bg: '#e3f2fd', color: '#1565c0' },
  cancelled:   { label: 'Cancelled',   bg: '#fce4ec', color: '#c62828' },
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    API.get('/bookings/my').then(({ data }) => setBookings(data.bookings)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch { toast.error('Cannot cancel'); }
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Bookings 📅</h1>
          <Link to="/services" className="btn btn-primary btn-sm">+ Book More</Link>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📅</div>
            <h3>No bookings yet</h3>
            <p>Start by browsing our beauty services</p>
            <Link to="/services" className="btn btn-primary" style={{ marginTop: 20 }}>Browse Services</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {bookings.map(b => {
              const sc = statusConfig[b.status] || statusConfig.pending;
              return (
                <div key={b._id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div>
                      <div style={styles.cardDate}>
                        📅 {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {b.timeSlot && <span style={{ marginLeft: 10, color: '#7a5560' }}>⏰ {b.timeSlot}</span>}
                      </div>
                      <div style={{ fontSize: 13, color: '#7a5560', marginTop: 2 }}>
                        {b.bookingType === 'home' ? '🏠 Home Service' : '🪑 Parlour Visit'}
                      </div>
                    </div>
                    <span style={{ ...styles.badge, background: sc.bg, color: sc.color }}>{sc.label}</span>
                  </div>

                  <div style={styles.services}>
                    {b.services.map((s, i) => (
                      <span key={i} style={styles.serviceTag}>{s.name}</span>
                    ))}
                  </div>

                  <div style={styles.cardBottom}>
                    <div style={styles.payInfo}>
                      <span>Total: <strong>₹{b.totalAmount}</strong></span>
                      <span style={{ color: '#2e7d32' }}>Paid: ₹{b.advancePaid}</span>
                      {b.remainingAmount > 0 && <span style={{ color: '#f57c00' }}>Due: ₹{b.remainingAmount}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {b.remainingAmount > 0 && b.status !== 'cancelled' && (
                        <Link to={`/payment/${b._id}`} className="btn btn-primary btn-sm">Pay Now</Link>
                      )}
                      {['pending', 'confirmed'].includes(b.status) && (
                        <button onClick={() => cancel(b._id)} className="btn btn-sm" style={{ color: '#c62828', borderColor: '#c62828', border: '1px solid' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 32 },
  card: { background: '#fff', border: '1px solid #f0dde2', borderRadius: 14, padding: '18px 22px', boxShadow: '0 2px 12px rgba(232,99,122,0.06)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardDate: { fontSize: 16, fontWeight: 600, color: '#1a0a0f' },
  badge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  services: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 },
  serviceTag: { background: '#fce8ec', color: '#c94d65', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 },
  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f8f0f2', paddingTop: 12 },
  payInfo: { display: 'flex', gap: 16, fontSize: 14 },
};
