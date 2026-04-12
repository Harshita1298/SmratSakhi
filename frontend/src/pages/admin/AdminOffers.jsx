import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import LangText from '../../components/LangText';
import AdminLayout from '../../layouts/AdminLayout';

const EMPTY = { title:'', description:'', discountType:'percent', discountValue:'', couponCode:'', minAmount:'0', maxDiscount:'', validFrom:'', validTill:'', occasion:'', emoji:'🎉', bannerColor:'#e8637a', isActive:true };

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { API.get('/offers/admin').then(({ data }) => setOffers(data.offers)).catch(() => {}); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!form.title || !form.discountValue || !form.validFrom || !form.validTill) { toast.error('Sab zaroori fields bhariye'); return; }
    setSaving(true);
    try {
      if (editId) {
        const { data } = await API.put(`/offers/admin/${editId}`, form);
        setOffers(prev => prev.map(o => o._id === editId ? data.offer : o));
        toast.success('Offer update ho gaya!');
      } else {
        const { data } = await API.post('/offers/admin', form);
        setOffers(prev => [data.offer, ...prev]);
        toast.success('Offer add ho gaya! Users ko notification gayi 🎉');
      }
      setShowForm(false); setEditId(null); setForm(EMPTY);
    } catch(err) { toast.error(err.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm('Delete karein?')) return;
    await API.delete(`/offers/admin/${id}`);
    setOffers(prev => prev.filter(o => o._id !== id));
    toast.success('Delete ho gaya');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <AdminLayout
      title={<LangText hi="Offers" en="Offers" />}
      subtitle={<LangText hi="Chhoot aur coupon manage kijiye" en="Manage offers and discounts" />}
      actions={[{ to:'/admin/add-booking', label:<LangText hi="+ Booking Jodiye" en="+ Add Booking" />, variant:'primary', style:{ fontSize:13 } }]}
    >
      <div className="container" style={{ maxWidth: 900 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h1 style={{ fontSize:28, fontFamily:"'Playfair Display',serif" }}>🎉 Offers Manage Kariye</h1>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY); }} className="btn btn-primary">+ Nayi Offer</button>
        </div>

        {showForm && (
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:16, padding:24, marginBottom:24 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", marginBottom:18 }}>{editId ? 'Offer Edit' : 'Nayi Offer — Users ko Notification Jayegi!'}</h3>
            <form onSubmit={save}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div className="form-group"><label className="form-label">Title *</label><input className="form-input" value={form.title} onChange={e => handle('title', e.target.value)} placeholder="Diwali Special..." /></div>
                <div className="form-group"><label className="form-label">Occasion</label><input className="form-input" value={form.occasion} onChange={e => handle('occasion', e.target.value)} placeholder="Diwali, Eid, Grand Opening..." /></div>
                <div className="form-group">
                  <label className="form-label">Discount Type</label>
                  <select className="form-input form-select" value={form.discountType} onChange={e => handle('discountType', e.target.value)}>
                    <option value="percent">% Percent Off</option>
                    <option value="flat">₹ Flat Off</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Discount Value *</label><input className="form-input" type="number" value={form.discountValue} onChange={e => handle('discountValue', e.target.value)} placeholder={form.discountType === 'percent' ? '20 = 20%' : '500 = ₹500 off'} /></div>
                <div className="form-group"><label className="form-label">Coupon Code</label><input className="form-input" value={form.couponCode} onChange={e => handle('couponCode', e.target.value.toUpperCase())} placeholder="DIWALI500" /></div>
                <div className="form-group"><label className="form-label">Min Booking (₹)</label><input className="form-input" type="number" value={form.minAmount} onChange={e => handle('minAmount', e.target.value)} placeholder="0" /></div>
                <div className="form-group"><label className="form-label">Valid From *</label><input className="form-input" type="date" value={form.validFrom} onChange={e => handle('validFrom', e.target.value)} min={today} /></div>
                <div className="form-group"><label className="form-label">Valid Till *</label><input className="form-input" type="date" value={form.validTill} onChange={e => handle('validTill', e.target.value)} min={form.validFrom || today} /></div>
                <div className="form-group"><label className="form-label">Emoji</label><input className="form-input" value={form.emoji} onChange={e => handle('emoji', e.target.value)} placeholder="🎉" /></div>
                <div className="form-group"><label className="form-label">Banner Color</label><input type="color" value={form.bannerColor} onChange={e => handle('bannerColor', e.target.value)} style={{ width:'100%', height:42, border:'1px solid var(--border)', borderRadius:8, padding:4 }} /></div>
                <div className="form-group" style={{ gridColumn:'span 2' }}><label className="form-label">Description *</label><textarea className="form-input" rows={2} value={form.description} onChange={e => handle('description', e.target.value)} placeholder="Offer ka vivaran..." /></div>
              </div>
              <div style={{ display:'flex', gap:10, marginTop:4 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Save ho raha hai...' : editId ? 'Update' : '🎉 Offer Launch Kariye!'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {offers.map(offer => (
            <div key={offer._id} style={{ background:'#fff', border:`1px solid var(--border)`, borderLeft:`4px solid ${offer.bannerColor}`, borderRadius:14, padding:'16px 20px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:10 }}>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <span style={{ fontSize:28 }}>{offer.emoji}</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:16 }}>{offer.title}</div>
                    <div style={{ fontSize:12, color:'#7a5560' }}>{offer.discountType === 'percent' ? `${offer.discountValue}% off` : `₹${offer.discountValue} off`} • Code: {offer.couponCode || 'N/A'}</div>
                    <div style={{ fontSize:11, color:'#7a5560' }}>Valid: {new Date(offer.validFrom).toLocaleDateString('en-IN')} – {new Date(offer.validTill).toLocaleDateString('en-IN')}</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => { setForm({...EMPTY,...offer,validFrom:offer.validFrom?.split('T')[0],validTill:offer.validTill?.split('T')[0]}); setEditId(offer._id); setShowForm(true); }} style={{ background:'#fdf3e3', color:'#c9973a', border:'none', borderRadius:8, padding:'7px 14px', cursor:'pointer', fontSize:13, fontWeight:600 }}>✏️ Edit</button>
                  <button onClick={() => del(offer._id)} style={{ background:'#fce4ec', color:'#c62828', border:'none', borderRadius:8, padding:'7px 14px', cursor:'pointer', fontSize:13, fontWeight:600 }}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
