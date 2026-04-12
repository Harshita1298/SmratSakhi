// src/pages/admin/ManageServices.jsx
import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import LangText from '../../components/LangText';
import AdminLayout from '../../layouts/AdminLayout';

const categories = ['Facial', 'Bridal', 'Mehndi', 'Stitching'];
const categoryEmoji = { Facial: '💆', Bridal: '👰', Mehndi: '🌿', Stitching: '🧵' };
const emptyForm = { name: '', category: 'Facial', description: '', price: '', duration: '1 hour', availableFor: ['home', 'parlour'], isAvailable: true };

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [filterCat, setFilterCat] = useState('All');

  const fetchServices = () => {
    API.get('/services').then(({ data }) => setServices(data.services)).finally(() => setLoading(false));
  };
  useEffect(fetchServices, []);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'availableFor') {
      setForm(f => {
        const arr = f.availableFor.includes(value)
          ? f.availableFor.filter(v => v !== value)
          : [...f.availableFor, value];
        return { ...f, availableFor: arr };
      });
    } else if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const openEdit = (s) => {
    setForm({ name: s.name, category: s.category, description: s.description || '', price: s.price, duration: s.duration, availableFor: s.availableFor, isAvailable: s.isAvailable });
    setEditId(s._id);
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) { toast.error('Name and price required'); return; }
    setSaving(true);
    try {
      if (editId) {
        const { data } = await API.put(`/services/${editId}`, form);
        setServices(prev => prev.map(s => s._id === editId ? data.service : s));
        toast.success('Service updated!');
      } else {
        const { data } = await API.post('/services', form);
        setServices(prev => [...prev, data.service]);
        toast.success('Service added!');
      }
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id) => {
    if (!confirm('Delete this service?')) return;
    try {
      await API.delete(`/services/${id}`);
      setServices(prev => prev.filter(s => s._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  const filtered = filterCat === 'All' ? services : services.filter(s => s.category === filterCat);

  return (
    <AdminLayout
      title={<LangText hi="Services" en="Services" />}
      subtitle={<LangText hi="Mukammal services list aur updates" en="Full list of services & updates" />}
      actions={[{ to:'/admin/add-booking', label:<LangText hi="+ Booking Jodiye" en="+ Add Booking" />, variant:'primary', style:{ fontSize:13 } }]}
    >
      <div className="container" style={{ maxWidth: 1100 }}>
        <div style={styles.header}>
          <h1 style={styles.title}>💄 Manage Services</h1>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }} className="btn btn-primary">
            + Add Service
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>{editId ? 'Edit Service' : 'Add New Service'}</h3>
            <form onSubmit={submit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Service Name *</label>
                  <input className="form-input" name="name" value={form.name} onChange={handle} placeholder="e.g. Gold Facial" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input form-select" name="category" value={form.category} onChange={handle}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input className="form-input" type="number" name="price" value={form.price} onChange={handle} placeholder="499" min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input className="form-input" name="duration" value={form.duration} onChange={handle} placeholder="1 hour" />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-input" name="description" value={form.description} onChange={handle} rows={2} placeholder="Brief description…" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
                <div>
                  <label className="form-label" style={{ marginBottom: 8 }}>Available For</label>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {['home', 'parlour'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                        <input type="checkbox" name="availableFor" value={opt} checked={form.availableFor.includes(opt)} onChange={handle} />
                        {opt === 'home' ? '🏠 Home Service' : '🪑 Parlour Visit'}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="form-label" style={{ marginBottom: 8 }}>Availability</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                    <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handle} />
                    Service is Active
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : editId ? 'Update Service' : 'Add Service'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {['All', ...categories].map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              style={{ ...styles.filterBtn, ...(filterCat === c ? { background: 'var(--rose)', color: '#fff', borderColor: 'var(--rose)' } : {}) }}>
              {categoryEmoji[c] || ''} {c}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? <div className="spinner" /> : (
          <div className="grid-4">
            {filtered.map(s => (
              <div key={s._id} style={{ ...styles.serviceCard, opacity: s.isAvailable ? 1 : 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span className="badge badge-rose">{s.category}</span>
                  {!s.isAvailable && <span className="badge badge-gray">Inactive</span>}
                </div>
                <div style={styles.serviceEmoji}>{categoryEmoji[s.category]}</div>
                <h3 style={styles.serviceName}>{s.name}</h3>
                <p style={styles.serviceDesc}>{s.description}</p>
                <div style={styles.serviceMeta}>
                  <span>⏱ {s.duration}</span>
                  {s.availableFor?.includes('home') && <span>🏠</span>}
                  {s.availableFor?.includes('parlour') && <span>🪑</span>}
                </div>
                <div style={styles.serviceFooter}>
                  <span style={styles.servicePrice}>₹{s.price}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(s)} style={styles.editBtn}>✏️</button>
                    <button onClick={() => deleteService(s._id)} style={styles.delBtn}>🗑</button>
                  </div>
                </div>
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
  title: { fontSize: 30 },
  formCard: { background: '#fff', border: '1px solid #f0dde2', borderRadius: 16, padding: '24px 28px', marginBottom: 24 },
  formTitle: { fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 20, color: '#1a0a0f' },
  filterBtn: { padding: '7px 16px', border: '1.5px solid #f0dde2', borderRadius: 20, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" },
  serviceCard: { background: '#fff', border: '1px solid #f0dde2', borderRadius: 14, padding: '16px' },
  serviceEmoji: { fontSize: 30, marginBottom: 8 },
  serviceName: { fontSize: 16, fontFamily: "'Playfair Display', serif", marginBottom: 6 },
  serviceDesc: { fontSize: 12, color: '#7a5560', marginBottom: 10, lineHeight: 1.5, minHeight: 32 },
  serviceMeta: { display: 'flex', gap: 8, fontSize: 12, color: '#7a5560', marginBottom: 12 },
  serviceFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0dde2', paddingTop: 10 },
  servicePrice: { fontSize: 20, fontWeight: 700, color: 'var(--rose)', fontFamily: "'Playfair Display', serif" },
  editBtn: { background: '#fdf3e3', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  delBtn: { background: '#fce4ec', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 14 },
};
