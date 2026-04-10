import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const CATS = ['Facial','Bridal','Mehndi','Silai','Hair Cutting','General'];
const EMPTY = { title:'', description:'', imageUrl:'', videoUrl:'', type:'photo', beforeImage:'', afterImage:'', category:'Bridal', instagramUrl:'', youtubeUrl:'', isPublished:true };

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { API.get('/gallery').then(({ data }) => setItems(data.items)).catch(() => {}); }, []);

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) { toast.error('Title aur Image URL zaroori hai'); return; }
    setSaving(true);
    try {
      if (editId) {
        const { data } = await API.put(`/gallery/${editId}`, form);
        setItems(prev => prev.map(i => i._id === editId ? data.post : i));
        toast.success('Update ho gaya!');
      } else {
        const { data } = await API.post('/gallery', form);
        setItems(prev => [data.post, ...prev]);
        toast.success('Post add ho gayi! Notification bhi gayi 📳');
      }
      setShowForm(false); setEditId(null); setForm(EMPTY);
    } catch(err) { toast.error(err.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm('Delete karein?')) return;
    await API.delete(`/gallery/${id}`);
    setItems(prev => prev.filter(i => i._id !== id));
    toast.success('Delete ho gaya');
  };

  const catColors = { Facial:'#e8637a', Bridal:'#c9973a', Mehndi:'#2e7d32', Silai:'#7b1fa2', 'Hair Cutting':'#1565c0', General:'#616161' };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 1100 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h1 style={{ fontSize:28, fontFamily:"'Playfair Display',serif" }}>📸 Gallery Manage Kariye</h1>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY); }} className="btn btn-primary">+ Nayi Post</button>
        </div>

        {showForm && (
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:16, padding:24, marginBottom:24 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", marginBottom:18 }}>{editId ? 'Post Edit Kariye' : 'Nayi Post Add Kariye'}</h3>
            <form onSubmit={save}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div className="form-group"><label className="form-label">Title *</label><input className="form-input" value={form.title} onChange={e => handle('title', e.target.value)} placeholder="Bridal look..." /></div>
                <div className="form-group">
                  <label className="form-label">Type *</label>
                  <select className="form-input form-select" value={form.type} onChange={e => handle('type', e.target.value)}>
                    <option value="photo">📷 Photo</option>
                    <option value="reel">🎬 Reel/Video</option>
                    <option value="before_after">✨ Before & After</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Image URL *</label><input className="form-input" value={form.imageUrl} onChange={e => handle('imageUrl', e.target.value)} placeholder="https://..." /></div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input form-select" value={form.category} onChange={e => handle('category', e.target.value)}>{CATS.map(c => <option key={c}>{c}</option>)}</select>
                </div>
                {form.type === 'before_after' && (<>
                  <div className="form-group"><label className="form-label">Before Image URL</label><input className="form-input" value={form.beforeImage} onChange={e => handle('beforeImage', e.target.value)} placeholder="Before photo URL" /></div>
                  <div className="form-group"><label className="form-label">After Image URL</label><input className="form-input" value={form.afterImage} onChange={e => handle('afterImage', e.target.value)} placeholder="After photo URL" /></div>
                </>)}
                <div className="form-group"><label className="form-label">Instagram URL</label><input className="form-input" value={form.instagramUrl} onChange={e => handle('instagramUrl', e.target.value)} placeholder="https://instagram.com/p/..." /></div>
                <div className="form-group"><label className="form-label">YouTube URL</label><input className="form-input" value={form.youtubeUrl} onChange={e => handle('youtubeUrl', e.target.value)} placeholder="https://youtube.com/..." /></div>
                <div className="form-group" style={{ gridColumn:'span 2' }}><label className="form-label">Description</label><textarea className="form-input" rows={2} value={form.description} onChange={e => handle('description', e.target.value)} placeholder="Kuch likhiye..." /></div>
              </div>
              <div style={{ display:'flex', gap:10, marginTop:4 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Save ho raha hai...' : editId ? 'Update Kariye' : '📸 Post Kariye (Notification jayegi!)'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
          {items.map(item => (
            <div key={item._id} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
              <div style={{ position:'relative', height:140 }}>
                <img src={item.imageUrl} alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                <span style={{ position:'absolute', top:6, left:6, background: catColors[item.category]||'#e8637a', color:'#fff', fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:20 }}>{item.category}</span>
              </div>
              <div style={{ padding:'10px 12px' }}>
                <div style={{ fontSize:13, fontWeight:700, marginBottom:4 }}>{item.title}</div>
                <div style={{ fontSize:11, color:'#7a5560', marginBottom:8 }}>♥ {item.likes} likes</div>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={() => { setForm({...EMPTY,...item}); setEditId(item._id); setShowForm(true); }} style={{ flex:1, background:'#fdf3e3', color:'#c9973a', border:'none', borderRadius:6, padding:'5px', fontSize:11, cursor:'pointer', fontWeight:600 }}>✏️ Edit</button>
                  <button onClick={() => del(item._id)} style={{ flex:1, background:'#fce4ec', color:'#c62828', border:'none', borderRadius:6, padding:'5px', fontSize:11, cursor:'pointer', fontWeight:600 }}>🗑️ Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
