import { Link, useLocation } from 'react-router-dom';
import LangText from '../components/LangText';
import { useLang } from '../context/LangContext';

const adminNavItems = [
  { to: '/admin', icon: '📊', labelHi: 'Dashboard', labelEn: 'Dashboard' },
  { to: '/admin/add-booking', icon: '📝', labelHi: 'Booking', labelEn: 'Booking' },
  { to: '/admin/bookings', icon: '📋', labelHi: 'Bookings', labelEn: 'Bookings' },
  { to: '/admin/gallery', icon: '📸', labelHi: 'Posts', labelEn: 'Posts' },
  { to: '/admin/offers', icon: '🎉', labelHi: 'Offers', labelEn: 'Offers' },
  { to: '/admin/reviews', icon: '⭐', labelHi: 'Reviews', labelEn: 'Reviews' },
  { to: '/admin/enquiries', icon: '📩', labelHi: 'Enquiries', labelEn: 'Enquiries' },
  { to: '/admin/notifications', icon: '🔔', labelHi: 'Notify', labelEn: 'Notify' },
  { to: '/admin/services', icon: '💄', labelHi: 'Services', labelEn: 'Services' },
  { to: '/admin/reports', icon: '📈', labelHi: 'Reports', labelEn: 'Reports' },
];

export default function AdminLayout({ title, subtitle, children, actions = [] }) {
  const { lang, changeLang } = useLang();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const headerActions = [
    { to: '/profile', label: <LangText hi="उपयोगकर्ता खाते" en="User Account" />, variant: 'outline' },
    { to: '/admin', label: <LangText hi="डैशबोर्ड" en="Dashboard" />, variant: 'outline' },
    ...actions,
  ];

  const commonClass = (variant) => variant === 'primary' ? 'btn btn-primary' : 'btn btn-outline btn-sm';

  return (
    <div className="page">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__header">
            <div className="admin-header__brand">Sakhi Beauty Parlour</div>
            <p style={{ fontSize: 11, color: '#7a5560' }}><LangText hi="Admin Panel" en="Admin Panel" /></p>
          </div>
          <div className="admin-sidebar__nav">
            {adminNavItems.map(nav => (
              <Link
                key={nav.to}
                to={nav.to}
                className={`admin-sidebar__link ${isActive(nav.to) ? 'active' : ''}`}
              >
                <span style={{ marginRight: 6 }}>{nav.icon}</span>
                <LangText hi={nav.labelHi} en={nav.labelEn} />
              </Link>
            ))}
          </div>
        </aside>
        <div className="admin-layout__content">
          <div className="container" style={{ maxWidth: 1200 }}>
            <div className="admin-header">
              <div>
                {typeof title === 'string' ? <h1 style={{ fontSize: 26, fontFamily: "'Playfair Display',serif" }}>{title}</h1> : title}
                {subtitle && <p style={{ fontSize: 13, color: '#7a5560' }}>{subtitle}</p>}
              </div>
              <div className="admin-header-actions">
                <div className="lang-switcher">
                  <span className="lang-switcher__label"><LangText hi="भाषा" en="Language" /></span>
                  {[
                    { value: 'en', label: <LangText hi="अंग्रेज़ी" en="English" /> },
                    { value: 'hi', label: <LangText hi="हिंदी" en="Hindi" /> },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`lang-switcher__btn ${lang === opt.value ? 'active' : ''}`}
                      onClick={() => opt.value !== lang && changeLang(opt.value)}
                      aria-pressed={lang === opt.value}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {headerActions.map(action => (
                  <Link
                    key={action.to}
                    to={action.to}
                    className={commonClass(action.variant)}
                    style={action.style}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
