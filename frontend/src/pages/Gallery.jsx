import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const CATS = ['Sab', 'Facial', 'Bridal', 'Mehndi', 'Silai', 'Hair Cutting', 'General'];
const TYPES = ['Sab', 'photo', 'before_after', 'reel'];
const catEmoji = { Facial:'💆', Bridal:'👰', Mehndi:'🌿', Silai:'🧵', 'Hair Cutting':'✂️', General:'💄' };

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [cat, setCat]     = useState('Sab');
  const [type, setType]   = useState('Sab');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cat !== 'Sab') params.set('category', cat);
    if (type !== 'Sab') params.set('type', type);
    API.get(`/gallery?${params}`).then(({ data }) => setItems(data.items)).catch(() => {}).finally(() => setLoading(false));
  }, [cat, type]);

  const like = async (id) => {
    const { data } = await API.post(`/gallery/${id}/like`);
    setItems(prev => prev.map(i => i._id === id ? { ...i, likes: data.likes } : i));
    toast.success('♥ Pasand aaya!');
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 1100 }}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>📸 Hamare Kaam Ki Jhalak</h1>
            <p style={s.sub}>Ranjana Ji ke haathon ka jadoo — dekho aur inspire ho jaao</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="https://instagram.com/sakhibeautyparlour" target="_blank" rel="noreferrer" style={s.socialBtn} className="btn">📷 Instagram</a>
            <a href="https://youtube.com/@sakhibeauty" target="_blank" rel="noreferrer" style={{ ...s.socialBtn, background: '#ff0000' }} className="btn">▶ YouTube</a>
          </div>
        </div>

        {/* Category + Type filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ ...s.chip, ...(cat === c ? s.chipActive : {}) }}>
              {catEmoji[c] ? `${catEmoji[c]} ` : ''}{c}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => setType(t)} style={{ ...s.chip, fontSize: 12, ...(type === t ? { ...s.chipActive, background: '#c9973a', borderColor: '#c9973a' } : {}) }}>
              {t === 'photo' ? '📷 Photo' : t === 'reel' ? '🎬 Reel' : t === 'before_after' ? '✨ Before/After' : 'Sab'}
            </button>
          ))}
        </div>

        {loading ? <div className="spinner" /> : items.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📸</div>
            <h3>Abhi koi photo nahi</h3>
            <p>Admin jald photos add karengi!</p>
          </div>
        ) : (
          <div style={s.grid}>
            {items.map(item => (
              <div key={item._id} style={s.card} onClick={() => setSelected(item)}>
                {item.type === 'before_after' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 200 }}>
                    <div style={{ position: 'relative' }}>
                      <img src={item.beforeImage || item.imageUrl} alt="before" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                      <span style={s.beforeLabel}>Before</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <img src={item.afterImage || item.imageUrl} alt="after" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                      <span style={{ ...s.beforeLabel, background: '#e8637a', right: 6, left: 'auto' }}>After ✨</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                    {item.type === 'reel' && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 40, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>▶</span>
                      </div>
                    )}
                  </div>
                )}
                <div style={s.cardInfo}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={s.catPill}>{catEmoji[item.category]} {item.category}</span>
                    <button onClick={e => { e.stopPropagation(); like(item._id); }} style={s.likeBtn}>♥ {item.likes}</button>
                  </div>
                  <div style={s.cardTitle2}>{item.title}</div>
                  {item.description && <div style={{ fontSize: 12, color: '#7a5560', marginTop: 3 }}>{item.description}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div style={s.overlay} onClick={() => setSelected(null)}>
          <div style={s.lightbox} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={s.closeBtn}>✕</button>
            {selected.type === 'before_after' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div><div style={{ textAlign: 'center', fontWeight: 700, color: '#7a5560', marginBottom: 6, fontSize: 13 }}>Before</div><img src={selected.beforeImage || selected.imageUrl} alt="before" style={{ width: '100%', borderRadius: 10 }} /></div>
                <div><div style={{ textAlign: 'center', fontWeight: 700, color: '#e8637a', marginBottom: 6, fontSize: 13 }}>After ✨</div><img src={selected.afterImage || selected.imageUrl} alt="after" style={{ width: '100%', borderRadius: 10 }} /></div>
              </div>
            ) : (
              <img src={selected.imageUrl} alt={selected.title} style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: 10 }} />
            )}
            <div style={{ marginTop: 14 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", marginBottom: 6 }}>{selected.title}</h3>
              {selected.description && <p style={{ fontSize: 14, color: '#7a5560' }}>{selected.description}</p>}
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                {selected.instagramUrl && <a href={selected.instagramUrl} target="_blank" rel="noreferrer" style={s.socialBtn} className="btn btn-sm">📷 Instagram par dekho</a>}
                {selected.youtubeUrl && <a href={selected.youtubeUrl} target="_blank" rel="noreferrer" style={{ ...s.socialBtn, background: '#ff0000' }} className="btn btn-sm">▶ YouTube par dekho</a>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  header:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 },
  title:    { fontSize: 32, fontFamily: "'Playfair Display',serif" },
  sub:      { color: '#7a5560', marginTop: 4 },
  chip:     { padding: '7px 15px', border: '1.5px solid var(--border)', borderRadius: 20, background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans',sans-serif", color: 'var(--muted)', fontWeight: 500 },
  chipActive: { background: '#e8637a', color: '#fff', borderColor: '#e8637a' },
  grid:     { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 },
  card:     { background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 10px rgba(232,99,122,0.06)' },
  cardInfo: { padding: '12px 14px' },
  catPill:  { background: '#fce8ec', color: '#c94d65', padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  likeBtn:  { background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#e8637a', fontWeight: 600 },
  cardTitle2: { fontSize: 14, fontWeight: 700, color: '#1a0a0f', marginTop: 6 },
  beforeLabel: { position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 },
  overlay:  { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 },
  lightbox: { background: '#fff', borderRadius: 16, padding: 20, maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' },
  closeBtn: { position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#fce8ec', color: '#c94d65', cursor: 'pointer', fontSize: 14, fontWeight: 700 },
  socialBtn:{ background: '#e8637a', color: '#fff', fontSize: 12 },
};
