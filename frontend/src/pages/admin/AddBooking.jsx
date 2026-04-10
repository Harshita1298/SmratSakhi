// src/pages/admin/AddBooking.jsx — Digital Diary Entry
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const timeSlots = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM'];

export default function AddBooking() {
  const navigate = useNavigate();
  const [allServices, setAllServices] = useState([]);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    customerName: '',
    fatherName: '',
    phone: '',
    address: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '',
    bookingType: 'parlour',
    totalAmount: 0,
    advancePaid: 0,
    paymentMode: 'cash',
    notes: '',
    status: 'confirmed',
  });
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    API.get('/services').then(({ data }) => setAllServices(data.services));
  }, []);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Toggle service selection
  const toggleService = (service) => {
    const exists = selectedServices.find(s => s.serviceId === service._id);
    if (exists) {
      const updated = selectedServices.filter(s => s.serviceId !== service._id);
      setSelectedServices(updated);
      setForm(f => ({ ...f, totalAmount: updated.reduce((sum, s) => sum + s.price, 0) }));
    } else {
      const updated = [...selectedServices, { serviceId: service._id, name: service.name, category: service.category, price: service.price }];
      setSelectedServices(updated);
      setForm(f => ({ ...f, totalAmount: updated.reduce((sum, s) => sum + s.price, 0) }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.phone || !form.date) { toast.error('Customer name, phone and date are required'); return; }
    if (selectedServices.length === 0) { toast.error('Please select at least one service'); return; }

    setSaving(true);
    try {
      await API.post('/admin/bookings', { ...form, services: selectedServices });
      toast.success('✅ Booking added to diary!');
      navigate('/admin/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add booking');
    } finally {
      setSaving(false);
    }
  };

  const remaining = Number(form.totalAmount) - Number(form.advancePaid);
  const categoryEmoji = { Facial: '💆', Bridal: '👰', Mehndi: '🌿', Stitching: '🧵' };
  const groupedServices = allServices.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>📝 Add Booking</h1>
            <p style={styles.sub}>Manual diary entry — record customer bookings directly</p>
          </div>
        </div>

        <form onSubmit={submit}>
          <div style={styles.grid}>
            {/* Left: Customer Info */}
            <div>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>👤 Customer Information</h3>

                <div className="form-group">
                  <label className="form-label">Customer Name *</label>
                  <input className="form-input" name="customerName" value={form.customerName} onChange={handle} placeholder="Full name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Father's Name</label>
                  <input className="form-input" name="fatherName" value={form.fatherName} onChange={handle} placeholder="Father's / Husband's name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input className="form-input" name="phone" value={form.phone} onChange={handle} placeholder="10-digit mobile" type="tel" maxLength={10} />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea className="form-input" name="address" value={form.address} onChange={handle} placeholder="Full address" rows={2} />
                </div>
              </div>

              {/* Date & Time */}
              <div style={{ ...styles.card, marginTop: 16 }}>
                <h3 style={styles.cardTitle}>📅 Appointment Details</h3>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Date *</label>
                    <input className="form-input" type="date" name="date" value={form.date} onChange={handle} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Time Slot</label>
                    <select className="form-input form-select" name="timeSlot" value={form.timeSlot} onChange={handle}>
                      <option value="">Select time</option>
                      {timeSlots.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Service Type</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[{ v: 'parlour', l: '🪑 Parlour' }, { v: 'home', l: '🏠 Home' }].map(o => (
                      <button key={o.v} type="button"
                        onClick={() => setForm(f => ({ ...f, bookingType: o.v }))}
                        style={{ ...styles.toggleBtn, ...(form.bookingType === o.v ? styles.toggleActive : {}) }}>
                        {o.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input form-select" name="status" value={form.status} onChange={handle}>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-input" name="notes" value={form.notes} onChange={handle} placeholder="Special instructions…" rows={2} />
                </div>
              </div>
            </div>

            {/* Right: Services + Payment */}
            <div>
              {/* Service Selection */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>💄 Select Services</h3>
                {Object.entries(groupedServices).map(([cat, services]) => (
                  <div key={cat} style={{ marginBottom: 16 }}>
                    <div style={styles.catLabel}>{categoryEmoji[cat]} {cat}</div>
                    {services.map(s => {
                      const selected = selectedServices.some(ss => ss.serviceId === s._id);
                      return (
                        <div key={s._id} onClick={() => toggleService(s)}
                          style={{ ...styles.serviceRow, ...(selected ? styles.serviceSelected : {}) }}>
                          <div style={styles.serviceCheck}>{selected ? '✓' : ''}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500, fontSize: 14 }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: '#7a5560' }}>{s.duration}</div>
                          </div>
                          <div style={{ fontWeight: 700, color: 'var(--rose)' }}>₹{s.price}</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                {selectedServices.length > 0 && (
                  <div style={styles.selectedSummary}>
                    <strong>{selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected</strong>
                    <span>Total: ₹{form.totalAmount}</span>
                  </div>
                )}
              </div>

              {/* Payment */}
              <div style={{ ...styles.card, marginTop: 16 }}>
                <h3 style={styles.cardTitle}>💳 Payment Details</h3>

                <div className="form-group">
                  <label className="form-label">Total Amount (₹) *</label>
                  <input className="form-input" type="number" name="totalAmount" value={form.totalAmount} onChange={handle} min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Advance Paid (₹)</label>
                  <input className="form-input" type="number" name="advancePaid" value={form.advancePaid} onChange={handle} min="0" max={form.totalAmount} />
                </div>

                <div style={styles.paymentSummary}>
                  <div style={styles.payRow}><span>Total Amount</span><strong>₹{form.totalAmount}</strong></div>
                  <div style={styles.payRow}><span style={{ color: '#2e7d32' }}>Advance Paid</span><strong style={{ color: '#2e7d32' }}>₹{form.advancePaid || 0}</strong></div>
                  <div className="divider" style={{ margin: '8px 0' }} />
                  <div style={{ ...styles.payRow, color: remaining > 0 ? '#f57c00' : '#2e7d32', fontWeight: 700, fontSize: 17 }}>
                    <span>Remaining</span><span>₹{remaining}</span>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: 12 }}>
                  <label className="form-label">Payment Mode</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[{ v: 'cash', l: '💵 Cash' }, { v: 'online', l: '💳 Online' }, { v: 'upi', l: '📱 UPI' }].map(o => (
                      <button key={o.v} type="button"
                        onClick={() => setForm(f => ({ ...f, paymentMode: o.v }))}
                        style={{ ...styles.toggleBtn, flex: 1, ...(form.paymentMode === o.v ? styles.toggleActive : {}) }}>
                        {o.l}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 17, marginTop: 8 }} disabled={saving}>
                  {saving ? 'Saving…' : '✅ Save to Diary'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  header: { marginBottom: 28 },
  title: { fontSize: 32, color: '#1a0a0f' },
  sub: { color: '#7a5560', marginTop: 4 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  card: { background: '#fff', border: '1px solid #f0dde2', borderRadius: 16, padding: '22px 24px' },
  cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 18, color: '#1a0a0f', paddingBottom: 12, borderBottom: '1px solid #f0dde2' },
  toggleBtn: { flex: 1, padding: '10px', border: '1.5px solid #f0dde2', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
  toggleActive: { background: 'var(--rose-light)', borderColor: 'var(--rose)', color: 'var(--rose-dark)', fontWeight: 700 },
  catLabel: { fontSize: 12, fontWeight: 700, color: '#7a5560', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 4 },
  serviceRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1.5px solid #f0dde2', borderRadius: 8, cursor: 'pointer', marginBottom: 6, transition: 'all 0.15s', background: '#fafafa' },
  serviceSelected: { background: 'var(--rose-light)', borderColor: 'var(--rose)' },
  serviceCheck: { width: 20, height: 20, borderRadius: '50%', background: 'var(--rose)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 },
  selectedSummary: { display: 'flex', justifyContent: 'space-between', background: '#fce8ec', padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: 'var(--rose-dark)', marginTop: 4 },
  paymentSummary: { background: '#fafafa', border: '1px solid #f0dde2', borderRadius: 10, padding: '14px' },
  payRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 15 },
};
