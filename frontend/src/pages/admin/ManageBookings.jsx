// src/pages/admin/ManageBookings.jsx
import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import LangText from '../../components/LangText';
import AdminLayout from '../../layouts/AdminLayout';

const statuses = ['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
const statusColor = { pending: '#f57c00', confirmed: '#2e7d32', 'in-progress': '#6a1b9a', completed: '#1565c0', cancelled: '#c62828' };

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [editingId, setEditingId]   = useState(null);
  const [editStatus, setEditStatus] = useState('');

  const fetchBookings = () => {
    setLoading(true);
    let url = '/admin/bookings?limit=50';
    if (filter !== 'all') url += `&status=${filter}`;
    if (dateFilter) url += `&date=${dateFilter}`;
    API.get(url).then(({ data }) => setBookings(data.bookings)).finally(() => setLoading(false));
  };

  useEffect(fetchBookings, [filter, dateFilter]);

  const updateStatus = async (id) => {
    try {
      await API.put(`/admin/bookings/${id}`, { status: editStatus });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: editStatus } : b));
      setEditingId(null);
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const deleteBooking = async (id) => {
    if (!confirm('Delete this booking permanently?')) return;
    try {
      await API.delete(`/admin/bookings/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout
      title={<LangText hi="Bookings" en="Bookings" />}
      subtitle={<LangText hi="Diary mein sari bookings dekhiye" en="View all diary bookings" />}
      actions={[{ to:'/admin/add-booking', label:<LangText hi="+ Booking Jodiye" en="+ Add Booking" />, variant:'primary', style:{ fontSize:13 } }]}
    >
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>📋 All Bookings</h1>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                style={{ ...styles.filterBtn, ...(filter === s ? { background: 'var(--rose)', color: '#fff', borderColor: 'var(--rose)' } : {}) }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <input type="date" className="form-input" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ width: 180 }} />
        </div>

        {/* Count */}
        <div style={{ fontSize: 14, color: '#7a5560', marginBottom: 16 }}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</div>

        {loading ? <div className="spinner" /> : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No bookings found</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bookings.map(b => (
              <div key={b._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  {/* Customer */}
                  <div style={styles.customerInfo}>
                    <div style={styles.avatar}>{b.customerName?.[0]?.toUpperCase()}</div>
                    <div>
                      <div style={styles.customerName}>{b.customerName}</div>
                      {b.fatherName && <div style={styles.fatherName}>S/o D/o {b.fatherName}</div>}
                      <div style={{ fontSize: 13, color: '#7a5560' }}>📱 {b.phone}</div>
                      {b.address && <div style={{ fontSize: 12, color: '#7a5560' }}>📍 {b.address}</div>}
                    </div>
                  </div>

                  {/* Date/Type */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={styles.date}>{new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    <div style={{ fontSize: 13, color: '#7a5560' }}>{b.timeSlot || 'No time set'}</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>{b.bookingType === 'home' ? '🏠 Home' : '🪑 Parlour'}</div>
                  </div>

                  {/* Services */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {b.services.map((s, i) => <span key={i} style={styles.serviceTag}>{s.name}</span>)}
                    </div>
                  </div>

                  {/* Payment */}
                  <div style={{ textAlign: 'right', minWidth: 120 }}>
                    <div style={styles.amount}>₹{b.totalAmount}</div>
                    <div style={{ fontSize: 12, color: '#2e7d32' }}>Paid: ₹{b.advancePaid}</div>
                    {b.remainingAmount > 0 && <div style={{ fontSize: 12, color: '#f57c00' }}>Due: ₹{b.remainingAmount}</div>}
                    <div style={{ fontSize: 11, color: '#7a5560', marginTop: 2 }}>{b.paymentMode}</div>
                  </div>

                  {/* Status */}
                  <div style={{ minWidth: 120 }}>
                    {editingId === b._id ? (
                      <div>
                        <select className="form-input form-select" value={editStatus} onChange={e => setEditStatus(e.target.value)} style={{ padding: '6px', fontSize: 13, marginBottom: 6 }}>
                          {['pending','confirmed','in-progress','completed','cancelled'].map(s => <option key={s}>{s}</option>)}
                        </select>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => updateStatus(b._id)} className="btn btn-primary btn-sm">✓</button>
                          <button onClick={() => setEditingId(null)} className="btn btn-sm" style={{ border: '1px solid #f0dde2' }}>✕</button>
                        </div>
                      </div>
                    ) : (
                      <span
                        onClick={() => { setEditingId(b._id); setEditStatus(b.status); }}
                        style={{ ...styles.statusBadge, background: (statusColor[b.status] || '#999') + '20', color: statusColor[b.status] || '#999', cursor: 'pointer' }}
                        title="Click to change status"
                      >
                        {b.status}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                    <button onClick={() => deleteBooking(b._id)} style={styles.deleteBtn}>🗑</button>
                  </div>
                </div>

                {b.notes && <div style={styles.notes}>📝 {b.notes}</div>}
                <div style={styles.createdInfo}>Added by: {b.createdBy} • {new Date(b.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 30, color: '#1a0a0f' },
  filters: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  filterBtn: { padding: '7px 16px', border: '1.5px solid #f0dde2', borderRadius: 20, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" },
  card: { background: '#fff', border: '1px solid #f0dde2', borderRadius: 14, padding: '16px 20px', boxShadow: '0 2px 8px rgba(232,99,122,0.05)' },
  cardHeader: { display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' },
  customerInfo: { display: 'flex', gap: 12, alignItems: 'flex-start', minWidth: 180 },
  avatar: { width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #e8637a, #c94d65)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 },
  customerName: { fontWeight: 700, fontSize: 15, color: '#1a0a0f' },
  fatherName: { fontSize: 12, color: '#7a5560', marginTop: 2 },
  date: { fontSize: 15, fontWeight: 600, color: '#1a0a0f' },
  serviceTag: { background: '#fce8ec', color: '#c94d65', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  amount: { fontSize: 20, fontWeight: 800, color: 'var(--rose)', fontFamily: "'Playfair Display', serif" },
  statusBadge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, display: 'inline-block' },
  deleteBtn: { background: '#fce4ec', border: 'none', color: '#c62828', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 15 },
  notes: { fontSize: 13, color: '#7a5560', background: '#fafafa', padding: '8px 12px', borderRadius: 8, marginTop: 10 },
  createdInfo: { fontSize: 11, color: '#c0a0a8', marginTop: 8 },
};
