// frontend/src/pages/admin/AdminReviews.jsx
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import LangText from '../../components/LangText';
import StarRating from '../../components/StarRating';
import AdminLayout from '../../layouts/AdminLayout';

const TABS = ['all', 'pending', 'approved', 'rejected'];

export default function AdminReviews() {
  const [reviews, setReviews]   = useState([]);
  const [counts, setCounts]     = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState('pending');
  const [rejectId, setRejectId] = useState(null);
  const [rejectNote, setRejectNote] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/reviews/admin?status=${tab}`);
      setReviews(data.reviews);
      setCounts(data.statusCounts);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [tab]);

  const approve = async (id) => {
    try {
      await API.put(`/reviews/admin/${id}/approve`);
      setReviews(prev => prev.filter(r => r._id !== id));
      setCounts(c => ({ ...c, pending: c.pending - 1, approved: c.approved + 1 }));
      toast.success('Review approved & published! ✅');
    } catch { toast.error('Failed'); }
  };

  const reject = async () => {
    try {
      await API.put(`/reviews/admin/${rejectId}/reject`, { adminNote: rejectNote });
      setReviews(prev => prev.filter(r => r._id !== rejectId));
      setCounts(c => ({ ...c, pending: c.pending - 1, rejected: c.rejected + 1 }));
      setRejectId(null); setRejectNote('');
      toast.success('Review reject ho gaya');
    } catch { toast.error('Failed'); }
  };

  const toggle = async (id, cur) => {
    try {
      const { data } = await API.put(`/reviews/admin/${id}/toggle`);
      setReviews(prev => prev.map(r => r._id === id ? { ...r, isPublished: data.review.isPublished } : r));
      toast.success(data.message);
    } catch { toast.error('Failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete karna chahte ho?')) return;
    try {
      await API.delete(`/reviews/admin/${id}`);
      setReviews(prev => prev.filter(r => r._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  return (
    <AdminLayout
      title={<LangText hi="Reviews" en="Reviews" />}
      subtitle={<LangText hi="Graahaakon ki reviews dekhiye aur approve kariye" en="Manage customer reviews" />}
    >
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 style={s.title}>Reviews Management ⭐</h1>

        {/* Tab bar with counts */}
        <div style={s.tabRow}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}>
              {t === 'all' ? 'Sab' : t.charAt(0).toUpperCase() + t.slice(1)}
              {t !== 'all' && counts[t] > 0 && (
                <span style={{ ...s.tabBadge, background: t === 'pending' ? '#f57c00' : t === 'approved' ? '#2e7d32' : '#c62828' }}>
                  {counts[t]}
                </span>
              )}
            </button>
          ))}
        </div>

        {counts.pending > 0 && tab === 'pending' && (
          <div style={s.pendingAlert}>
            ⏳ <strong>{counts.pending} reviews</strong> approval ka wait kar rahi hain — approve ya reject karein
          </div>
        )}

        {loading ? <div className="spinner" /> : reviews.length === 0 ? (
          <div className="empty-state">
            <div className="icon">⭐</div>
            <h3>Is tab mein koi review nahi</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reviews.map(rv => (
              <div key={rv._id} style={{ ...s.card, borderLeft: `4px solid ${rv.status === 'approved' ? '#2e7d32' : rv.status === 'rejected' ? '#c62828' : '#f57c00'}` }}>
                <div style={s.cardTop}>
                  {/* Customer info */}
                  <div style={s.avatar}>{rv.avatarLetter || rv.customerName?.[0]?.toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={s.name}>{rv.customerName}</div>
                    {rv.phone && <div style={s.meta}>📱 {rv.phone}</div>}
                    {rv.email && <div style={s.meta}>✉️ {rv.email}</div>}
                    <div style={s.meta}>🏷️ {rv.serviceCategory} • {rv.source} • {new Date(rv.createdAt).toLocaleDateString('en-IN')}</div>
                  </div>
                  {/* Rating */}
                  <div style={{ textAlign: 'right' }}>
                    <StarRating value={rv.rating} readOnly size={16} />
                    <div style={{ marginTop: 4 }}>
                      <span style={{ ...s.statusBadge, background: rv.status === 'approved' ? '#e8f5e9' : rv.status === 'rejected' ? '#fce4ec' : '#fff8e1', color: rv.status === 'approved' ? '#2e7d32' : rv.status === 'rejected' ? '#c62828' : '#f57c00' }}>
                        {rv.status}
                      </span>
                    </div>
                    {rv.status === 'approved' && (
                      <div style={{ marginTop: 4, fontSize: 11, color: rv.isPublished ? '#2e7d32' : '#7a5560' }}>
                        {rv.isPublished ? '🌐 Published' : '👁️ Hidden'}
                      </div>
                    )}
                  </div>
                </div>

                {rv.title && <div style={s.reviewTitle}>"{rv.title}"</div>}
                <p style={s.reviewText}>{rv.comment}</p>
                {rv.adminNote && <div style={s.adminNote}>Admin note: {rv.adminNote}</div>}

                {/* Actions */}
                <div style={s.actions}>
                  {rv.status === 'pending' && (
                    <>
                      <button onClick={() => approve(rv._id)} style={s.approveBtn}>✅ Approve & Publish</button>
                      <button onClick={() => setRejectId(rv._id)} style={s.rejectBtn}>❌ Reject</button>
                    </>
                  )}
                  {rv.status === 'approved' && (
                    <button onClick={() => toggle(rv._id, rv.isPublished)} style={s.toggleBtn}>
                      {rv.isPublished ? '👁️ Unpublish' : '🌐 Publish'}
                    </button>
                  )}
                  {rv.status === 'rejected' && (
                    <button onClick={() => approve(rv._id)} style={s.approveBtn}>↩️ Approve</button>
                  )}
                  <button onClick={() => del(rv._id)} style={s.deleteBtn}>🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        {rejectId && (
          <div style={s.modalOverlay}>
            <div style={s.modal}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 16 }}>Review Reject Karo</h3>
              <div className="form-group">
                <label className="form-label">Reason (optional)</label>
                <textarea className="form-input" rows={3} value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="Kyun reject kar rahe ho? (admin ke liye note)" />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button onClick={reject} style={s.rejectBtn}>❌ Confirm Reject</button>
                <button onClick={() => setRejectId(null)} className="btn btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

const s = {
  title:    { fontSize: 30, fontFamily: "'Playfair Display', serif", marginBottom: 20, color: '#1a0a0f' },
  tabRow:   { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  tab:      { padding: '8px 18px', border: '1.5px solid #f0dde2', borderRadius: 20, background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: 'var(--muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 },
  tabActive:{ background: 'var(--rose)', color: '#fff', borderColor: 'var(--rose)' },
  tabBadge: { color: '#fff', fontSize: 11, fontWeight: 700, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  pendingAlert: { background: '#fff8e1', border: '1px solid #f0c060', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#8a6400', marginBottom: 16 },
  card:     { background: '#fff', border: '1px solid #f0dde2', borderRadius: 14, padding: '16px 20px' },
  cardTop:  { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  avatar:   { width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #e8637a, #c94d65)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, flexShrink: 0 },
  name:     { fontSize: 15, fontWeight: 700, color: '#1a0a0f', marginBottom: 3 },
  meta:     { fontSize: 12, color: 'var(--muted)' },
  statusBadge: { padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 },
  reviewTitle: { fontSize: 15, fontWeight: 700, fontStyle: 'italic', color: '#1a0a0f', marginBottom: 6, paddingTop: 8, borderTop: '1px solid #f0dde2' },
  reviewText:  { fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 },
  adminNote:   { fontSize: 12, color: '#7a5560', background: '#fdf3e3', padding: '6px 10px', borderRadius: 6, marginTop: 8 },
  actions:  { display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0dde2', flexWrap: 'wrap' },
  approveBtn: { padding: '8px 16px', background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" },
  rejectBtn:  { padding: '8px 16px', background: '#fce4ec', color: '#c62828', border: '1px solid #ef9a9a', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" },
  toggleBtn:  { padding: '8px 16px', background: '#e3f2fd', color: '#1565c0', border: '1px solid #90caf9', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" },
  deleteBtn:  { padding: '8px 14px', background: 'transparent', color: '#c62828', border: '1px solid #f0dde2', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif" },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(26,10,15,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modal:      { background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
};
