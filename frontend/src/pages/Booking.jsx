// src/pages/Booking.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import LangText from '../components/LangText';

const timeSlots = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'];

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: '',
    timeSlot: '',
    bookingType: 'parlour',
    paymentMode: 'cash',
    advancePaid: 0,
    notes: '',
  });

  useEffect(() => {
    API.get('/cart').then(({ data }) => {
      if (!data.cart?.items?.length) { toast.error('Your cart is empty'); navigate('/services'); }
      else setCart(data.cart);
    });
  }, []);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.timeSlot) { toast.error('Please select date and time'); return; }
    setLoading(true);
    try {
      const { data } = await API.post('/bookings', form);
      toast.success('Booking confirmed! 🎉');
      if (form.paymentMode === 'online') navigate(`/payment/${data.booking._id}`);
      else navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!cart) return <div className="page"><div className="spinner" /></div>;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 style={styles.title}>
          <LangText hi="Booking Pukka Kariye 📅" en="Confirm Booking 📅" />
        </h1>
        <p style={styles.sub}>
          <LangText hi="Apni pasand ki date, time aur service type chuniye" en="Choose your preferred date, time and service type" />
        </p>

        {/* Cart summary */}
        <div style={styles.cartSummary}>
          <h3 style={{ fontSize: 16, marginBottom: 12, color: '#7a5560' }}>
            <LangText hi="Chuni hui services" en="Services Selected" />
          </h3>
          {cart.items.map(i => (
            <div key={i.serviceId} style={styles.summaryItem}>
              <span>{i.name}</span>
              <span style={{ color: 'var(--rose)', fontWeight: 600 }}>₹{i.price}</span>
            </div>
          ))}
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
            <span><LangText hi="Kul" en="Total" /></span>
            <span style={{ color: 'var(--rose)', fontFamily: "'Playfair Display', serif" }}>₹{cart.totalPrice}</span>
          </div>
        </div>

        <form onSubmit={submit} style={styles.form}>
          {/* Date & Time */}
          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">
                <LangText hi="📅 Appointment Tarikh *" en="📅 Appointment Date *" />
              </label>
              <input className="form-input" type="date" name="date" value={form.date} onChange={handle} min={today} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">
                <LangText hi="⏰ Samay Slot *" en="⏰ Time Slot *" />
              </label>
              <select className="form-input form-select" name="timeSlot" value={form.timeSlot} onChange={handle}>
                <option value="">Select time</option>
                {timeSlots.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Service Type */}
          <div className="form-group">
            <label className="form-label">
              <LangText hi="📍 Service Ka Prakar *" en="📍 Service Type *" />
            </label>
            <div style={styles.typeToggle}>
              {[{ val: 'parlour', label: '🪑 Parlour Visit', desc: 'Visit our salon' }, { val: 'home', label: '🏠 Home Service', desc: 'We come to you' }].map(opt => (
                <div
                  key={opt.val}
                  onClick={() => setForm(f => ({ ...f, bookingType: opt.val }))}
                  style={{ ...styles.typeOption, ...(form.bookingType === opt.val ? styles.typeActive : {}) }}
                >
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{opt.label.split(' ')[0]}</div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{opt.label.slice(3)}</div>
                  <div style={{ fontSize: 12, color: form.bookingType === opt.val ? 'rgba(255,255,255,0.8)' : '#7a5560' }}>{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Mode */}
          <div className="form-group">
            <label className="form-label">
              <LangText hi="💳 Bhugtaan Ka Tarika *" en="💳 Payment Mode *" />
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ val: 'cash', label: '💵 Cash' }, { val: 'online', label: '💳 Online' }, { val: 'upi', label: '📱 UPI' }].map(pm => (
                <button
                  key={pm.val}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, paymentMode: pm.val }))}
                  style={{ ...styles.pmBtn, ...(form.paymentMode === pm.val ? styles.pmActive : {}) }}
                >
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Advance */}
          <div className="form-group">
            <label className="form-label">
              <LangText hi="💰 Agrim Bhugtaan (vikalp)" en="💰 Advance Payment (optional)" />
            </label>
            <input className="form-input" type="number" name="advancePaid" value={form.advancePaid} onChange={handle} placeholder="0" min="0" max={cart.totalPrice} />
            <div style={{ fontSize: 12, color: '#7a5560', marginTop: 4 }}>Remaining: ₹{cart.totalPrice - (Number(form.advancePaid) || 0)}</div>
          </div>

          {/* Address for home service */}
          {form.bookingType === 'home' && (
            <div className="form-group">
            <label className="form-label">
              <LangText hi="🏠 Aapka Pata *" en="🏠 Your Address *" />
            </label>
              <textarea className="form-input" name="notes" value={form.notes} onChange={handle} rows={3} placeholder="Enter full address for home service…" />
            </div>
          )}

          {form.bookingType !== 'home' && (
            <div className="form-group">
              <label className="form-label">
                <LangText hi="📝 Notes (vikalp)" en="📝 Notes (optional)" />
              </label>
              <textarea className="form-input" name="notes" value={form.notes} onChange={handle} rows={2} placeholder="Any special requests or notes…" />
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 17 }} disabled={loading}>
            {loading ? 'Confirming…' : form.paymentMode === 'online' ? 'Confirm & Pay Online →' : 'Confirm Booking →'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: 34, marginBottom: 8 },
  sub: { color: '#7a5560', marginBottom: 28 },
  cartSummary: { background: '#fff5f7', border: '1px solid #f0dde2', borderRadius: 14, padding: '20px 24px', marginBottom: 28 },
  summaryItem: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 15 },
  form: { background: '#fff', border: '1px solid #f0dde2', borderRadius: 16, padding: '28px 32px', boxShadow: '0 4px 20px rgba(232,99,122,0.08)' },
  row: { display: 'flex', gap: 16 },
  typeToggle: { display: 'flex', gap: 12 },
  typeOption: { flex: 1, border: '2px solid #f0dde2', borderRadius: 12, padding: '16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: '#fff' },
  typeActive: { border: '2px solid var(--rose)', background: 'var(--rose)', color: '#fff' },
  pmBtn: { flex: 1, padding: '12px', border: '1.5px solid #f0dde2', borderRadius: 10, background: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, transition: 'all 0.2s' },
  pmActive: { border: '1.5px solid var(--rose)', background: 'var(--rose-light)', color: 'var(--rose-dark)', fontWeight: 600 },
};
