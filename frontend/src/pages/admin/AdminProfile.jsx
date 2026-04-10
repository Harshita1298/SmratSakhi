// src/pages/admin/AdminProfile.jsx
// Ranjana Ji ki poori profile — details, photo, social links
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminProfile() {
  const { user, updateUser } = useAuth();
  const { lang } = useLang();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name:    user?.name    || 'Ranjana Ji',
    phone:   user?.phone   || '9936657399',
    email:   user?.email   || 'ranjana@sakhibeauty.in',
    address: user?.address || 'Jaitpur, Khajni Road, Gorakhpur, UP',
    city:    user?.city    || 'Gorakhpur',
    pincode: user?.pincode || '273001',
    bio:     user?.bio     || '20+ saalon se Gorakhpur mein beauty seva kar rahi hoon. Bridal makeup, mehndi, silai — sab meri expertise hai.',
    experience: user?.experience || '20+ Years',
    profilePicture: user?.profilePicture || '',
    socialLinks: {
      instagram: user?.socialLinks?.instagram || 'https://instagram.com/sakhibeautyparlour',
      youtube:   user?.socialLinks?.youtube   || 'https://youtube.com/@sakhibeauty',
      facebook:  user?.socialLinks?.facebook  || '',
      whatsapp:  user?.socialLinks?.whatsapp  || 'https://wa.me/919936657399',
    },
  });
  const [imagePreview, setImagePreview] = useState(user?.profilePicture || '');
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, totalClients: 0 });

  useEffect(() => {
    API.get('/admin/stats').then(({ data }) => {
      if (data.stats) setStats(data.stats);
    }).catch(() => {});
  }, []);

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSocial = (k, v) => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [k]: v } }));

  const handleImageUrl = (e) => {
    const url = e.target.value;
    handle('profilePicture', url);
    setImagePreview(url);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put('/auth/profile', form);
      if (updateUser) updateUser(data.user);
      localStorage.setItem('sakhi_user', JSON.stringify({ ...user, ...form }));
      toast.success(lang === 'hi' ? 'Profile save ho gayi! ✅' : 'Profile saved! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
    setSaving(false);
  };

  const TABS = [
    { id: 'profile',  label: '👤 Personal Info' },
    { id: 'social',   label: '📱 Social Links' },
    { id: 'stats',    label: '📊 Stats' },
  ];

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>

        {/* ── Profile Header ─────────────────────────── */}
        <div style={s.profileHero}>
          <div style={s.heroBg} />
          <div style={s.heroContent}>
            {/* Photo */}
            <div style={s.photoSection}>
              <div style={s.photoWrap}>
                {imagePreview
                  ? <img src={imagePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onError={() => setImagePreview('')} />
                  : <span style={{ fontSize: 52 }}>👩‍🦱</span>
                }
              </div>
              <div style={s.verifiedBadge}>✅</div>
            </div>

            {/* Info */}
            <div style={s.heroInfo}>
              <div style={s.heroName}>{form.name}</div>
              <div style={s.heroRole}>{lang === 'hi' ? 'Founder & Head Beautician' : 'Founder & Head Beautician'}</div>
              <div style={s.heroLocation}>📍 {form.address || 'Gorakhpur, UP'}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                <span style={s.heroBadge}>🏆 Award Winner</span>
                <span style={s.heroBadge}>📅 {form.experience}</span>
                <span style={{ ...s.heroBadge, background: 'rgba(201,151,58,0.3)' }}>💄 Expert</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={s.heroStats}>
              {[
                { n: stats.totalBookings || '500+', l: lang === 'hi' ? 'Bookings' : 'Bookings' },
                { n: `₹${((stats.totalRevenue || 0) / 1000).toFixed(0)}K+`, l: lang === 'hi' ? 'Kamaai' : 'Revenue' },
                { n: stats.totalClients || '248+', l: lang === 'hi' ? 'Graahaak' : 'Clients' },
              ].map((st, i) => (
                <div key={i} style={s.heroStat}>
                  <div style={s.heroStatN}>{st.n}</div>
                  <div style={s.heroStatL}>{st.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ ...s.tab, ...(tab === t.id ? s.tabActive : {}) }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Personal Info Tab ──────────────────────── */}
        {tab === 'profile' && (
          <div style={s.card}>
            <h3 style={s.cardTitle}>{lang === 'hi' ? 'Personal Jaankari' : 'Personal Information'}</h3>
            <form onSubmit={saveProfile}>

              {/* Photo URL */}
              <div className="form-group">
                <label className="form-label">{lang === 'hi' ? 'Profile Photo URL' : 'Profile Photo URL'}</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fce8ec', border: '2px solid #e8637a', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {imagePreview
                      ? <img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImagePreview('')} />
                      : <span style={{ fontSize: 24 }}>👩‍🦱</span>
                    }
                  </div>
                  <input className="form-input" value={form.profilePicture} onChange={handleImageUrl} placeholder="https://... (photo ka link paste kariye)" style={{ flex: 1 }} />
                </div>
                <div style={{ fontSize: 12, color: '#7a5560', marginTop: 4 }}>
                  {lang === 'hi'
                    ? 'Photo upload ke liye: Google Photos mein photo upload kariye, link copy kariye, yahan paste kariye'
                    : 'To upload photo: Upload to Google Photos, copy link, paste here'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">{lang === 'hi' ? 'Poora Naam *' : 'Full Name *'}</label>
                  <input className="form-input" value={form.name} onChange={e => handle('name', e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">{lang === 'hi' ? 'Phone *' : 'Phone *'}</label>
                  <input className="form-input" value={form.phone} onChange={e => handle('phone', e.target.value)} maxLength={10} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={e => handle('email', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">{lang === 'hi' ? 'Parlour Ka Pata' : 'Parlour Address'}</label>
                <textarea className="form-input" rows={2} value={form.address} onChange={e => handle('address', e.target.value)} placeholder="Jaitpur, Khajni Road, Gorakhpur, UP" />
              </div>

              <div style={{ display: 'flex', gap: 14 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">{lang === 'hi' ? 'Sheher' : 'City'}</label>
                  <input className="form-input" value={form.city} onChange={e => handle('city', e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">{lang === 'hi' ? 'Anubhav' : 'Experience'}</label>
                  <input className="form-input" value={form.experience} onChange={e => handle('experience', e.target.value)} placeholder="20+ Years" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{lang === 'hi' ? 'Apne Baare Mein Likhiye (Bio)' : 'About You (Bio)'}</label>
                <textarea className="form-input" rows={3} value={form.bio} onChange={e => handle('bio', e.target.value)} placeholder="Apne kaam aur expertise ke baare mein likhiye..." />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }} disabled={saving}>
                {saving ? (lang === 'hi' ? 'Save ho raha hai...' : 'Saving...') : (lang === 'hi' ? '✅ Profile Save Kariye' : '✅ Save Profile')}
              </button>
            </form>
          </div>
        )}

        {/* ── Social Links Tab ───────────────────────── */}
        {tab === 'social' && (
          <div style={s.card}>
            <h3 style={s.cardTitle}>{lang === 'hi' ? 'Social Media Links' : 'Social Media Links'}</h3>
            <div style={{ background: '#fdf3e3', border: '1px solid #f0c060', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#8a6400' }}>
              💡 {lang === 'hi' ? 'Ye links Gallery page par aur About page par dikhenge. Users directly aapke social media par ja sakenge!' : 'These links will show on Gallery and About pages. Users can visit your social media directly!'}
            </div>
            <form onSubmit={saveProfile}>
              {[
                { key: 'instagram', icon: '📷', label: 'Instagram', placeholder: 'https://instagram.com/sakhibeautyparlour' },
                { key: 'youtube',   icon: '▶️', label: 'YouTube',   placeholder: 'https://youtube.com/@sakhibeauty' },
                { key: 'facebook',  icon: '📘', label: 'Facebook',  placeholder: 'https://facebook.com/...' },
                { key: 'whatsapp',  icon: '💬', label: 'WhatsApp',  placeholder: 'https://wa.me/919936657399' },
              ].map(s2 => (
                <div key={s2.key} className="form-group">
                  <label className="form-label">{s2.icon} {s2.label}</label>
                  <input className="form-input" value={form.socialLinks[s2.key]} onChange={e => handleSocial(s2.key, e.target.value)} placeholder={s2.placeholder} />
                </div>
              ))}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }} disabled={saving}>
                {saving ? '...' : (lang === 'hi' ? '✅ Social Links Save Kariye' : '✅ Save Social Links')}
              </button>
            </form>

            {/* Preview */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#7a5560', marginBottom: 12 }}>{lang === 'hi' ? 'Preview — Kuch aisa dikhega:' : 'Preview — Will look like this:'}</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {form.socialLinks.instagram && <a href={form.socialLinks.instagram} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', color: '#fff', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>📷 Instagram</a>}
                {form.socialLinks.youtube && <a href={form.socialLinks.youtube} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ff0000', color: '#fff', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>▶ YouTube</a>}
                {form.socialLinks.facebook && <a href={form.socialLinks.facebook} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1877f2', color: '#fff', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>📘 Facebook</a>}
                {form.socialLinks.whatsapp && <a href={form.socialLinks.whatsapp} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#25d366', color: '#fff', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>💬 WhatsApp</a>}
              </div>
            </div>
          </div>
        )}

        {/* ── Stats Tab ──────────────────────────────── */}
        {tab === 'stats' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
              {[
                { icon: '📅', val: stats.totalBookings, label: lang === 'hi' ? 'Kul Bookings' : 'Total Bookings', color: '#e8637a' },
                { icon: '💰', val: `₹${((stats.totalRevenue || 0) / 1000).toFixed(1)}K`, label: lang === 'hi' ? 'Kul Kamaai' : 'Total Revenue', color: '#c9973a' },
                { icon: '👥', val: stats.totalClients, label: lang === 'hi' ? 'Kul Graahaak' : 'Total Clients', color: '#2e7d32' },
                { icon: '📋', val: stats.todayBookings || 0, label: lang === 'hi' ? 'Aaj ki Bookings' : "Today's Bookings", color: '#7b1fa2' },
                { icon: '💵', val: `₹${stats.todayRevenue || 0}`, label: lang === 'hi' ? 'Aaj ki Kamaai' : "Today's Revenue", color: '#1565c0' },
                { icon: '⭐', val: '4.9', label: lang === 'hi' ? 'Average Rating' : 'Average Rating', color: '#f59e0b' },
              ].map((st, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 18, textAlign: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: st.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, margin: '0 auto 10px' }}>{st.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: st.color, fontFamily: "'Playfair Display',serif", marginBottom: 4 }}>{st.val ?? '—'}</div>
                  <div style={{ fontSize: 11, color: '#7a5560' }}>{st.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", marginBottom: 14 }}>
                {lang === 'hi' ? '🏆 Awards & Certifications' : '🏆 Awards & Certifications'}
              </h3>
              {[
                { icon: '🥇', text: lang === 'hi' ? 'Best Bridal Beautician — Gorakhpur 2022' : 'Best Bridal Beautician — Gorakhpur 2022' },
                { icon: '🥇', text: lang === 'hi' ? 'Mehndi Art mein Shreshthata — UP State' : 'Excellence in Mehndi Art — UP State' },
                { icon: '🥇', text: lang === 'hi' ? 'Community Beauty Champion — Jaitpur' : 'Community Beauty Champion — Jaitpur' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < 2 ? '1px solid #fafafa' : 'none', alignItems: 'center' }}>
                  <span style={{ fontSize: 20 }}>{a.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{a.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  profileHero: { position: 'relative', background: '#1a0a0f', borderRadius: 20, marginBottom: 24, overflow: 'hidden' },
  heroBg:      { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #e8637a20, #c9973a20)', pointerEvents: 'none' },
  heroContent: { position: 'relative', padding: '28px 24px', display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' },
  photoSection:{ position: 'relative', flexShrink: 0 },
  photoWrap:   { width: 100, height: 100, borderRadius: '50%', background: '#fce8ec', border: '3px solid #e8637a', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  verifiedBadge:{ position: 'absolute', bottom: 2, right: 2, width: 24, height: 24, borderRadius: '50%', background: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, border: '2px solid #1a0a0f' },
  heroInfo:    { flex: 1, minWidth: 200 },
  heroName:    { fontSize: 24, fontWeight: 700, color: '#fff', fontFamily: "'Playfair Display',serif", marginBottom: 4 },
  heroRole:    { fontSize: 13, color: '#f0c4cf', marginBottom: 4 },
  heroLocation:{ fontSize: 12, color: '#c8a4ae' },
  heroBadge:   { background: 'rgba(232,99,122,0.25)', color: '#f0c4cf', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 },
  heroStats:   { display: 'flex', gap: 20 },
  heroStat:    { textAlign: 'center' },
  heroStatN:   { fontSize: 22, fontWeight: 700, color: '#e8637a', fontFamily: "'Playfair Display',serif" },
  heroStatL:   { fontSize: 10, color: '#c8a4ae' },
  tab:         { padding: '8px 16px', border: '1.5px solid var(--border)', borderRadius: 20, background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: "'Poppins',sans-serif", color: 'var(--muted)', fontWeight: 500 },
  tabActive:   { background: '#e8637a', color: '#fff', borderColor: '#e8637a' },
  card:        { background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 28px', boxShadow: '0 2px 12px rgba(232,99,122,0.06)' },
  cardTitle:   { fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 20 },
};
