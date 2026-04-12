import { useMemo, useState } from 'react';
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
  const navLinks = useMemo(() => [
    { to: '/', label: t('home') },
    { to: '/services', label: t('services') },
    { to: '/gallery', label: t('gallery') },
    { to: '/offers', label: t('offers') },
    { to: '/reviews', label: t('reviews') },
    { to: '/enquiry', label: t('enquiry') },
  ], [t]);
  const handleNavClick = () => {
    setMobileOpen(false);
    setMenuOpen(false);
  };
  const userLinks = useMemo(() => {
    const links = [
      { to: '/profile', label: t('myProfile') },
      { to: '/my-bookings', label: t('myBookings') },
      { to: '/wallet', label: t('myWallet') },
    ];
    if (isAdmin) links.push({ to: '/admin', label: t('adminPanel') });
    return links;
  }, [t, isAdmin]);
  const handleLogout = () => {
    logout();
    navigate('/');
    handleNavClick();
  };
  const loginRedirect = user?.role === 'admin' ? '/admin' : '/';

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo} onClick={handleNavClick}>
          <div style={styles.logoIcon}>💄</div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: '#1a0a0f', lineHeight: 1.1 }}>Sakhi</div>
            <div style={{ fontSize: 8, color: '#e8637a', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>Beauty Parlour</div>
          </div>
        </Link>

        <div style={styles.links} className="nav-links">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className={active(link.to)} onClick={handleNavClick}>
              {link.label}
            </Link>
          ))}
        </div>

        <div style={styles.actions} className="nav-actions">
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

        <button
          className="mobile-hamburger"
          type="button"
          aria-label="Open navigation menu"
          style={styles.mobileButton}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {mobileOpen && <div style={styles.mobileBackdrop} onClick={handleNavClick} />}

  <div style={{ ...styles.mobileMenu, ...(mobileOpen ? styles.mobileMenuOpen : {}) }}>
        <div style={styles.mobileMenuHeader}>
          <div>
            <strong style={{ fontSize: 16 }}>Sakhi</strong>
            <div style={styles.mobileMenuTagline}>
              <LangText hi="Menu" en="Menu" />
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} style={styles.closeButton} aria-label="Close menu">✕</button>
        </div>

        <div style={styles.mobileSection}>
          <div style={styles.mobileSectionTitle}>
            <LangText hi="Menu" en="Menu" />
          </div>
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className={active(link.to)} style={styles.mobileLink} onClick={handleNavClick}>
              {link.label}
            </Link>
          ))}
        </div>

        <div style={styles.mobileSection}>
          <div style={styles.mobileSectionTitle}>
            <LangText hi="Account" en="Account" />
          </div>
          <div style={styles.mobileAccountRow}>
            <LangToggle />
            {user && (
              <div style={styles.cartWrapper} onClick={handleNavClick}>
                <CartIcon />
              </div>
            )}
            {user && (
              <Link to="/notifications" style={styles.mobileIconLink} onClick={handleNavClick}>
                🔔 {t('notifications')}
              </Link>
            )}
          </div>
          {user ? (
            <>
              {userLinks.map(link => (
                <Link key={link.to} to={link.to} style={styles.mobileUserLink} onClick={handleNavClick}>
                  {link.label}
                </Link>
              ))}
              <button type="button" onClick={handleLogout} style={styles.mobileLogoutButton}>
                {t('logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm" style={styles.mobileUserLink} onClick={handleNavClick}>{t('login')}</Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={styles.mobileUserLink} onClick={handleNavClick}>{t('register')}</Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        .nav-link { color: var(--muted); font-size: 13px; font-weight: 500; padding: 5px 3px; border-bottom: 2px solid transparent; transition: all 0.15s; white-space: nowrap; }
        .nav-link:hover, .nav-link.active { color: var(--rose); border-bottom-color: var(--rose); }
        .mobile-hamburger span {
          display: block;
          width: 20px;
          height: 2px;
          background: #c94d65;
          margin: 3px 0;
          transition: transform 0.2s;
        }
        @media (max-width: 960px) {
          .nav-links { display: none !important; }
          .nav-actions { display: none !important; }
          .mobile-hamburger { display: flex !important; }
        }
        @media (min-width: 961px) {
          .mobile-hamburger { display: none !important; }
          .mobile-menu, .mobile-backdrop { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

const ADMIN_LINKS = [
  { to: '/admin', label: '📊 Dashboard' },
  { to: '/admin/add-booking', label: '+ Booking' },
  { to: '/admin/bookings', label: '📋 Bookings' },
  { to: '/admin/gallery', label: '📸 Posts' },
  { to: '/admin/offers', label: '🎉 Offers' },
  { to: '/admin/reviews', label: '⭐ Reviews' },
  { to: '/admin/enquiries', label: '📩 Enquiries' },
  { to: '/admin/notifications', label: '🔔 Notify' },
  { to: '/admin/services', label: '💄 Services' },
  { to: '/admin/reports', label: '📈 Reports' },
  { to: '/admin/profile', label: '👤 Profile' },
];

// ── Admin Navbar ───────────────────────────────────────────────
function AdminNav() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const closeAdminMenu = () => setAdminMenuOpen(false);
  const active = (p) => ({ ...aS.link, ...(location.pathname === p ? aS.activeLink : {}) });

  return (
    <nav style={aS.nav}>
      <div style={aS.inner}>
        <Link to="/admin" style={aS.logo}>
          <div style={{ width: 28, height: 28, background: '#e8637a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>💄</div>
          <span>Sakhi <span style={{ color: '#c9973a', fontSize: 10 }}>ADMIN</span></span>
        </Link>
        <div style={aS.links} className="admin-links">
          {ADMIN_LINKS.map(link => (
            <Link key={link.to} to={link.to} style={active(link.to)} onClick={closeAdminMenu}>
              {link.label}
            </Link>
          ))}
        </div>
        <div style={aS.actions} className="admin-actions">
          <LangToggle />
          <Link to="/" style={aS.userViewLink} onClick={closeAdminMenu}>
            <LangText hi="← उपयोगकर्ता दृश्य" en="← User View" />
          </Link>
          <button onClick={() => { logout(); navigate('/'); }} style={aS.logoutBtn}>
            <LangText hi="लॉग आउट" en="Logout" />
          </button>
          <button
            className="admin-hamburger"
            type="button"
            aria-label="Open admin menu"
            style={aS.hamburger}
            onClick={() => setAdminMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {adminMenuOpen && <div style={styles.mobileBackdrop} className="admin-mobile-backdrop" onClick={closeAdminMenu} />}
      <div style={{ ...aS.mobileMenu, ...(adminMenuOpen ? aS.mobileMenuOpen : {}) }} className="admin-mobile-menu">
        <div style={aS.mobileHeader}>
          <strong style={{ fontSize: 16 }}>Admin Links</strong>
          <button onClick={closeAdminMenu} style={styles.closeButton} aria-label="Close admin menu">✕</button>
        </div>
        <div style={aS.mobileLinks}>
          {ADMIN_LINKS.map(link => (
            <Link key={link.to} to={link.to} style={active(link.to)} onClick={closeAdminMenu}>
              {link.label}
            </Link>
          ))}
        </div>
        <div style={aS.mobileActions}>
          <LangToggle />
          <Link to="/" style={aS.mobileAction} onClick={closeAdminMenu}>
            <LangText hi="← उपयोगकर्ता दृश्य" en="← User View" />
          </Link>
          <button onClick={() => { logout(); navigate('/'); }} style={aS.mobileAction} type="button">
            <LangText hi="लॉग आउट" en="Logout" />
          </button>
        </div>
      </div>

      <style>{`
        .admin-links { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .admin-actions { align-items: center; }
        .admin-hamburger span {
          display: block;
          width: 20px;
          height: 2px;
          background: #fff;
          margin: 3px 0;
          transition: transform 0.2s;
        }
        @media (max-width: 960px) {
          .admin-links { display: none !important; }
          .admin-actions { gap: 4px; }
          .admin-hamburger { display: flex !important; }
        }
        @media (min-width: 961px) {
          .admin-hamburger { display: none !important; }
          .admin-mobile-menu, .admin-mobile-backdrop { display: none !important; }
        }
      `}</style>
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
  mobileButton: { display: 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, border: 'none', background: 'transparent', padding: 6, cursor: 'pointer', borderRadius: 12, flexShrink: 0 },
  mobileBackdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 98 },
  mobileMenu: {
    position: 'fixed',
    top: 'var(--nav-height)',
    left: 0,
    right: 0,
    zIndex: 99,
    background: '#fff',
    borderBottom: '1px solid var(--border)',
    boxShadow: '0 12px 40px rgba(26,10,15,0.1)',
    transform: 'translateY(-16px)',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 0.25s ease, transform 0.25s ease',
  },
  mobileMenuOpen: {
    transform: 'translateY(0)',
    opacity: 1,
    pointerEvents: 'auto',
  },
  mobileMenuHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--border)' },
  mobileMenuTagline: { fontSize: 12, color: '#7a5560', marginTop: 4 },
  closeButton: { border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, lineHeight: 1 },
  mobileSection: { padding: '16px', borderBottom: '1px solid var(--border)' },
  mobileSectionTitle: { fontSize: 11, fontWeight: 600, letterSpacing: 1, color: '#7a5560', marginBottom: 10, textTransform: 'uppercase' },
  mobileLink: {
    width: '100%',
    borderRadius: 14,
    padding: '12px 16px',
    border: '1px solid var(--border)',
    marginBottom: 10,
    display: 'block',
    textAlign: 'center',
  },
  mobileAccountRow: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12 },
  mobileIconLink: { color: '#c94d65', fontWeight: 600, textDecoration: 'none', fontSize: 14 },
  cartWrapper: { display: 'inline-flex' },
  mobileUserLink: {
    borderRadius: 12,
    border: '1px solid var(--border)',
    padding: '10px 12px',
    textAlign: 'center',
    color: '#3d1f28',
    fontWeight: 600,
    textDecoration: 'none',
    background: '#fff',
    width: '100%',
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
    marginBottom: 8,
  },
  mobileLogoutButton: {
    borderRadius: 12,
    border: 'none',
    padding: '10px 12px',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 600,
    background: '#e8637a',
    width: '100%',
    cursor: 'pointer',
    marginTop: 10,
  },
};

const aS = {
  nav:      { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#1a0a0f', borderBottom: '1px solid #2d1420', height: 'var(--nav-height)' },
  inner:    { maxWidth: 1600, margin: '0 auto', padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' },
  logo:     { fontFamily: "'Playfair Display',serif", fontSize: 15, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 },
  links:    { display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1, justifyContent: 'center' },
  link:     { padding: '6px 10px', borderRadius: 8, fontSize: 12, color: '#c8a4ae', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' },
  activeLink:{ background: 'rgba(232,99,122,0.2)', color: '#e8637a' },
  logoutBtn:{ padding: '6px 12px', background: 'rgba(232,99,122,0.15)', color: '#e8637a', border: '1px solid rgba(232,99,122,0.3)', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontFamily: "'Poppins',sans-serif" },
  actions:  { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  userViewLink: { fontSize: 11, color: '#7a5560', padding: '5px 10px', background: '#2d1420', borderRadius: 8, textDecoration: 'none' },
  hamburger: { display: 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, border: 'none', background: 'transparent', padding: 6, cursor: 'pointer' },
  mobileMenu: {
    position: 'fixed',
    top: 'var(--nav-height)',
    left: 0,
    right: 0,
    zIndex: 99,
    background: '#1a0a0f',
    borderTop: '1px solid #2d1420',
    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
    transform: 'translateY(-16px)',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 0.25s ease, transform 0.25s ease',
  },
  mobileMenuOpen: {
    transform: 'translateY(0)',
    opacity: 1,
    pointerEvents: 'auto',
  },
  mobileHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #2d1420', color: '#fff' },
  mobileLinks: { display: 'flex', flexDirection: 'column', gap: 10, padding: '16px' },
  mobileActions: { display: 'flex', flexDirection: 'column', gap: 12, padding: '16px', borderTop: '1px solid #2d1420' },
  mobileAction: { borderRadius: 12, border: '1px solid #2d1420', padding: '10px 12px', textAlign: 'center', color: '#fff', fontWeight: 600, textDecoration: 'none', background: '#2d1420', cursor: 'pointer' },
};
