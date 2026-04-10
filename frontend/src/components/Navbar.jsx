import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import CartIcon from './CartIcon';
import LangToggle from './LangToggle';
import LangText from './LangText';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (location.pathname.startsWith('/admin')) return <AdminNav />;
  const active = (p) => location.pathname === p ? 'nav-link active' : 'nav-link';

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo} onClick={() => setMobileOpen(false)}>
          <div style={styles.logoIcon}>💄</div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: '#1a0a0f', lineHeight: 1.1 }}>Sakhi</div>
            <div style={{ fontSize: 8, color: '#e8637a', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>Beauty Parlour</div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div style={styles.links}>
          <Link to="/"         className={active('/')}>{t('home')}</Link>
          <Link to="/services" className={active('/services')}>{t('services')}</Link>
          <Link to="/gallery"  className={active('/gallery')}>{t('gallery')}</Link>
          <Link to="/offers"   className={active('/offers')}>{t('offers')}</Link>
          <Link to="/reviews"  className={active('/reviews')}>{t('reviews')}</Link>
          <Link to="/enquiry"  className={active('/enquiry')}>{t('enquiry')}</Link>
        </div>

        {/* Right Actions */}
        <div style={styles.actions}>
          {/* Language Toggle */}
          <LangToggle />

          {user && <CartIcon />}

          {user && (
            <Link to="/notifications" style={styles.iconBtn} title="Notifications">🔔</Link>
          )}

          {user ? (
            <div style={{ position: 'relative' }}>
              <button style={styles.userBtn} onClick={() => setMenuOpen(!menuOpen)}>
                {user.profilePicture
                  ? <img src={user.profilePicture} alt="" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }} />
                  : <span style={styles.avatar}>{user.name?.[0]?.toUpperCase()}</span>
                }
                <span style={{ fontSize: 13 }}>{user.name?.split(' ')[0]}</span>
                <span style={{ fontSize: 10 }}>▾</span>
              </button>
              {menuOpen && (
                <div style={styles.dropdown} onClick={() => setMenuOpen(false)}>
                  <Link to="/profile"       style={styles.dropItem}>👤 {t('myProfile')}</Link>
                  <Link to="/my-bookings"   style={styles.dropItem}>📅 {t('myBookings')}</Link>
                  <Link to="/wallet"        style={styles.dropItem}>🪙 {t('myWallet')}</Link>
                  <Link to="/notifications" style={styles.dropItem}>🔔 {t('notifications')}</Link>
                  {isAdmin && <Link to="/admin" style={styles.dropItem}>⚙️ {t('adminPanel')}</Link>}
                  <div style={{ borderTop: '1px solid #f0dde2', margin: '4px 0' }} />
                  <button onClick={() => { logout(); navigate('/'); }} style={{ ...styles.dropItem, color: '#e8637a', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', display: 'block', padding: '9px 12px' }}>🚪 {t('logout')}</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login"    className="btn btn-outline btn-sm">{t('login')}</Link>
              <Link to="/register" className="btn btn-primary btn-sm">{t('register')}</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .nav-link { color: var(--muted); font-size: 13px; font-weight: 500; padding: 5px 3px; border-bottom: 2px solid transparent; transition: all 0.15s; white-space: nowrap; }
        .nav-link:hover, .nav-link.active { color: var(--rose); border-bottom-color: var(--rose); }
      `}</style>
    </nav>
  );
}

// ── Admin Navbar ───────────────────────────────────────────────
function AdminNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const active = (p) => ({ ...aS.link, ...(location.pathname === p ? aS.activeLink : {}) });

  return (
    <nav style={aS.nav}>
      <div style={aS.inner}>
        <Link to="/admin" style={aS.logo}>
          <div style={{ width: 28, height: 28, background: '#e8637a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>💄</div>
          <span>Sakhi <span style={{ color: '#c9973a', fontSize: 10 }}>ADMIN</span></span>
        </Link>
        <div style={aS.links}>
          <Link to="/admin"               style={active('/admin')}>📊 Dashboard</Link>
          <Link to="/admin/add-booking"   style={active('/admin/add-booking')}>+ Booking</Link>
          <Link to="/admin/bookings"      style={active('/admin/bookings')}>📋 Bookings</Link>
          <Link to="/admin/gallery"       style={active('/admin/gallery')}>📸 Posts</Link>
          <Link to="/admin/offers"        style={active('/admin/offers')}>🎉 Offers</Link>
          <Link to="/admin/reviews"       style={active('/admin/reviews')}>⭐ Reviews</Link>
          <Link to="/admin/enquiries"     style={active('/admin/enquiries')}>📩 Enquiries</Link>
          <Link to="/admin/notifications" style={active('/admin/notifications')}>🔔 Notify</Link>
          <Link to="/admin/services"      style={active('/admin/services')}>💄 Services</Link>
          <Link to="/admin/reports"       style={active('/admin/reports')}>📈 Reports</Link>
          <Link to="/admin/profile"       style={active('/admin/profile')}>👤 Profile</Link>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <LangToggle />
          <Link to="/" style={{ fontSize: 11, color: '#7a5560', padding: '5px 10px', background: '#2d1420', borderRadius: 8 }}>
            <LangText hi="← उपयोगकर्ता दृश्य" en="← User View" />
          </Link>
          <button onClick={() => { logout(); navigate('/'); }} style={aS.logoutBtn}>
            <LangText hi="लॉग आउट" en="Logout" />
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav:      { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,251,252,0.97)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #f0dde2', height: 'var(--nav-height)' },
  container:{ maxWidth: 1400, margin: '0 auto', padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between' },
  logo:     { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, textDecoration: 'none' },
  logoIcon: { width: 34, height: 34, background: '#e8637a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
  links:    { display: 'flex', gap: 16, alignItems: 'center', flex: 1, justifyContent: 'center', flexWrap: 'wrap' },
  actions:  { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  iconBtn:  { width: 34, height: 34, borderRadius: '50%', background: '#fce8ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, textDecoration: 'none' },
  userBtn:  { display: 'flex', alignItems: 'center', gap: 6, background: '#fce8ec', border: 'none', padding: '6px 11px', borderRadius: 20, cursor: 'pointer', color: '#c94d65', fontWeight: 600, fontFamily: "'Poppins',sans-serif" },
  avatar:   { width: 26, height: 26, borderRadius: '50%', background: '#e8637a', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 },
  dropdown: { position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#fff', border: '1px solid #f0dde2', borderRadius: 14, boxShadow: '0 8px 32px rgba(232,99,122,0.15)', minWidth: 200, padding: '8px', zIndex: 200 },
  dropItem: { display: 'block', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: '#3d1f28', textDecoration: 'none' },
};

const aS = {
  nav:      { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#1a0a0f', borderBottom: '1px solid #2d1420', height: 'var(--nav-height)' },
  inner:    { maxWidth: 1600, margin: '0 auto', padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' },
  logo:     { fontFamily: "'Playfair Display',serif", fontSize: 15, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 },
  links:    { display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1, justifyContent: 'center' },
  link:     { padding: '6px 10px', borderRadius: 8, fontSize: 12, color: '#c8a4ae', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' },
  activeLink:{ background: 'rgba(232,99,122,0.2)', color: '#e8637a' },
  logoutBtn:{ padding: '6px 12px', background: 'rgba(232,99,122,0.15)', color: '#e8637a', border: '1px solid rgba(232,99,122,0.3)', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" },
};
