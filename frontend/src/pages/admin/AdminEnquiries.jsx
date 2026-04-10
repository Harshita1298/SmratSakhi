import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [tab, setTab] = useState('new');
  const [replyId, setReplyId] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`/enquiries/admin?status=${tab}`).then(({ data }) => setEnquiries(data.enquiries)).catch(() => {}).finally(() => setLoading(false));
  }, [tab]);

  const sendReply = async (id) => {
    if (!reply.trim()) { toast.error('Reply likhiye'); return; }
    try {
      await API.put(`/enquiries/admin/${id}/reply`, { reply });
      setEnquiries(prev => prev.filter(e => e._id !== id));
      setReplyId(null); setReply('');
      toast.success('Reply send ho gayi!');
    } catch { toast.error('Reply failed'); }
  };

  const TABS = [{ id:'new', l:'🆕 Nayi', c:'new' }, { id:'replied', l:'✅ Answered', c:'replied' }, { id:'all', l:'Sab', c:'all' }];

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 style={{ fontSize:28, fontFamily:"'Playfair Display',serif", marginBottom:20 }}>📩 Enquiries</h1>
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          {TABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:'8px 16px', border:'1.5px solid var(--border)', borderRadius:20, background:tab===t.id?'#e8637a':'#fff', color:tab===t.id?'#fff':'var(--muted)', cursor:'pointer', fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>{t.l}</button>)}
        </div>
        {loading ? <div className="spinner" /> : enquiries.length === 0 ? (
          <div className="empty-state"><div className="icon">📩</div><h3>Koi enquiry nahi</h3></div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {enquiries.map(e => (
              <div key={e._id} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:14, padding:'16px 20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:10, marginBottom:10 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15 }}>{e.name}</div>
                    <div style={{ fontSize:13, color:'#7a5560' }}>📱 {e.phone} {e.email ? `• ✉️ ${e.email}` : ''}</div>
                    {e.service && <span style={{ background:'#fce8ec', color:'#c94d65', fontSize:11, fontWeight:600, padding:'2px 9px', borderRadius:20, marginTop:4, display:'inline-block' }}>{e.service}</span>}
                  </div>
                  <div style={{ fontSize:11, color:'#7a5560' }}>{new Date(e.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</div>
                </div>
                <p style={{ fontSize:14, color:'#7a5560', background:'#fafafa', padding:'10px 14px', borderRadius:8, marginBottom:10 }}>{e.message}</p>
                {e.adminReply && <div style={{ background:'#e8f5e9', padding:'8px 12px', borderRadius:8, fontSize:13, color:'#2e7d32', marginBottom:10 }}>✅ Aapka Jawab: {e.adminReply}</div>}
                {e.status !== 'replied' && (
                  replyId === e._id ? (
                    <div>
                      <textarea className="form-input" rows={2} value={reply} onChange={x => setReply(x.target.value)} placeholder="Reply likhiye..." style={{ marginBottom:8 }} />
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={() => sendReply(e._id)} className="btn btn-primary btn-sm">Reply Bhejiye</button>
                        <button onClick={() => setReplyId(null)} className="btn btn-sm" style={{ border:'1px solid var(--border)' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setReplyId(e._id); setReply(''); }} style={{ background:'#e8f5e9', color:'#2e7d32', border:'none', borderRadius:8, padding:'8px 16px', cursor:'pointer', fontSize:13, fontWeight:600 }}>✍️ Reply Kariye</button>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
