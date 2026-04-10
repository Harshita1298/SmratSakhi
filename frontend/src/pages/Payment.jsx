// src/pages/Payment.jsx — Razorpay Integration
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function Payment() {
  const { bookingId } = useParams();
  const { user }      = useAuth();
  const navigate      = useNavigate();
  const [booking, setBooking] = useState(null);
  const [paying, setPaying]   = useState(false);

  useEffect(() => {
    API.get(`/bookings/${bookingId}`).then(({ data }) => setBooking(data.booking)).catch(() => navigate('/my-bookings'));
  }, [bookingId]);

  // Load Razorpay script
  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const handlePay = async () => {
    const ready = await loadRazorpay();
    if (!ready) { toast.error('Razorpay failed to load. Check your connection.'); return; }

    setPaying(true);
    try {
      const { data } = await API.post('/payment/create-order', { bookingId });
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Smart Sakhi',
        description: 'Beauty Service Booking',
        order_id: data.orderId,
        prefill: { name: user?.name, contact: user?.phone },
        theme: { color: '#e8637a' },
        handler: async (response) => {
          try {
            await API.post('/payment/verify', { ...response, bookingId });
            toast.success('Payment successful! 🎉');
            navigate('/my-bookings');
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: { ondismiss: () => { setPaying(false); toast('Payment cancelled.', { icon: 'ℹ️' }); } },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initiation failed');
      setPaying(false);
    }
  };

  if (!booking) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 500 }}>
        <div style={styles.card}>
          {/* Success icon */}
          <div style={styles.topBanner}>
            <div style={styles.bookIcon}>📋</div>
            <h2 style={styles.bookTitle}>Booking Confirmed!</h2>
            <p style={styles.bookSub}>Complete your payment to secure the appointment</p>
          </div>

          {/* Booking details */}
          <div style={styles.details}>
            <Row label="Customer"     value={booking.customerName} />
            <Row label="Date"         value={new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
            <Row label="Time"         value={booking.timeSlot || '—'} />
            <Row label="Service Type" value={booking.bookingType === 'home' ? '🏠 Home Service' : '🪑 Parlour Visit'} />
            <Row label="Services"     value={booking.services.map(s => s.name).join(', ')} />
          </div>

          <div className="divider" />

          {/* Payment summary */}
          <div style={styles.payRow}><span>Total Amount</span><span style={{ fontWeight: 700 }}>₹{booking.totalAmount}</span></div>
          <div style={styles.payRow}><span style={{ color: '#2e7d32' }}>Advance Paid</span><span style={{ color: '#2e7d32' }}>₹{booking.advancePaid}</span></div>
          <div style={{ ...styles.payRow, fontSize: 22, fontWeight: 700, color: 'var(--rose)', borderTop: '2px solid #f0dde2', marginTop: 8, paddingTop: 12 }}>
            <span>Amount Due</span>
            <span style={{ fontFamily: "'Playfair Display', serif" }}>₹{booking.remainingAmount}</span>
          </div>

          {booking.remainingAmount > 0 ? (
            <button
              onClick={handlePay}
              disabled={paying}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 17, marginTop: 24 }}
            >
              {paying ? 'Opening Payment…' : `Pay ₹${booking.remainingAmount} Now →`}
            </button>
          ) : (
            <div style={styles.paidBadge}>✅ Fully Paid</div>
          )}

          <button onClick={() => navigate('/my-bookings')} style={styles.skipBtn}>
            Pay Later (Cash) →
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 15, borderBottom: '1px solid #f8f0f2' }}>
      <span style={{ color: '#7a5560' }}>{label}</span>
      <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}

const styles = {
  card: { background: '#fff', borderRadius: 20, border: '1px solid #f0dde2', overflow: 'hidden', boxShadow: '0 8px 40px rgba(232,99,122,0.12)' },
  topBanner: { background: 'linear-gradient(135deg, #e8637a, #c94d65)', padding: '32px 28px', textAlign: 'center', color: '#fff' },
  bookIcon: { fontSize: 40, marginBottom: 10 },
  bookTitle: { fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 6 },
  bookSub: { opacity: 0.85, fontSize: 15 },
  details: { padding: '20px 24px' },
  payRow: { display: 'flex', justifyContent: 'space-between', padding: '6px 24px', fontSize: 16 },
  paidBadge: { margin: '20px 24px', background: '#e8f5e9', color: '#2e7d32', padding: '14px', borderRadius: 10, textAlign: 'center', fontWeight: 600, fontSize: 16 },
  skipBtn: { display: 'block', width: '100%', textAlign: 'center', padding: '14px', color: '#7a5560', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, borderTop: '1px solid #f0dde2', marginTop: 4 },
};
