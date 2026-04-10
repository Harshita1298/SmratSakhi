import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const EMPTY = { title:'', message:'', emoji:'💄', type:'general', targetAll:true, link:'' };

export default function AdminNotifications() {
  const [notifs, setNotifs] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { API.get('/notifications/admin').then(({ data }) => setNotifs(data.notifications)).catch(() => {}); }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) { toast.error('Title aur message zaroori hai'); return; }
    setSending(true);
    try {
      const { data } = await API.post('/notifications/admin', form);
      setNotifs(prev => [data.notif, ...prev]);
      toast.success('Notification sab users ko gayi! 🔔');
      setForm(EMPTY);
    } catch(err) { toast.error(err.response?.data?.message || 'Send failed'); }
    setSending(false);
  };

  const typeEmojis = { offer:'🎉', booking:'📅', gallery:'📸', general:'💄', festival:'🪔' };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontSize:28, fontFamily:"'Playfair Display',serif", marginBottom:20 }}>🔔 Notifications Bhejiye</h1>

        <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:16, padding:24, marginBottom:24 }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", marginBottom:18 }}>Nayi Notification — Sab Users Tak Pahunchegi!</h3>
          <form onSubmit={send}>
            <div style={{ display:'flex', gap:14 }}>
              <div className="form-group" style={{ flex:3 }}><label className="form-label">Title *</label><input className="form-input" value={form.title} onChange={e => handle('title', e.target.value)} placeholder="Diwali Offer! Special discount..." /></div>
              <div className="form-group" style={{ flex:1 }}><label className="form-label">Emoji</label><input className="form-input" value={form.emoji} onChange={e => handle('emoji', e.target.value)} placeholder="🎉" /></div>
            </div>
            <div className="form-group"><label className="form-label">Message *</label><textarea className="form-input" rows={3} value={form.message} onChange={e => handle('message', e.target.value)} placeholder="Users ko kya batana chahte hain..." /></div>
            <div style={{ display:'flex', gap:14 }}>
              <div className="form-group" style={{ flex:1 }}>
                <label className="form-label">Type</label>
                <select className="form-input form-select" value={form.type} onChange={e => handle('type', e.target.value)}>
                  <option value="general">💄 General</option>
                  <option value="offer">🎉 Offer</option>
                  <option value="gallery">📸 Gallery</option>
                  <option value="festival">🪔 Festival</option>
                  <option value="booking">📅 Booking</option>
                </select>
              </div>
              <div className="form-group" style={{ flex:1 }}><label className="form-label">Link (optional)</label><input className="form-input" value={form.link} onChange={e => handle('link', e.target.value)} placeholder="/offers ya /gallery" /></div>
            </div>
            <div style={{ background:'#fdf3e3', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#8a6400', marginBottom:14 }}>
              📳 Ye notification app mein aane par <strong>sab users</strong> ko dikhegi!
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding:'12px 24px' }} disabled={sending}>{sending ? 'Bhej rahe hain...' : `${form.emoji || '💄'} Notification Bhejiye →`}</button>
          </form>
        </div>

        <h3 style={{ fontFamily:"'Playfair Display',serif", marginBottom:12 }}>Pehle Ki Notifications</h3>
        {notifs.length === 0 ? <div className="empty-state"><div className="icon">🔔</div><h3>Koi notification nahi</h3></div> : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {notifs.map(n => (
              <div key={n._id} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:12, padding:'14px 18px' }}>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <span style={{ fontSize:20 }}>{n.emoji}</span>
                  <div style={{ flex:1 }}><div style={{ fontWeight:700 }}>{n.title}</div><div style={{ fontSize:12, color:'#7a5560' }}>{n.message}</div></div>
                  <div style={{ fontSize:11, color:'#7a5560' }}>{new Date(n.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
