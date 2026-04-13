// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLang } from '../context/LangContext';
import LangText from '../components/LangText';
import API from '../api/axios';
import ServiceCard from '../components/ServiceCard';

const heroStats = [
  { value: '500+', label: { en: 'Happy Clients', hi: 'Khush Graahaak' } },
  { value: '4', label: { en: 'Services', hi: 'Sevaen' } },
  { value: '5⭐', label: { en: 'Rating', hi: 'Rating' } },
  { value: '🏠', label: { en: 'Home Service', hi: 'Ghar Par Service' } },
];

const serviceCategories = [
  {
    emoji: '💆',
    color: '#e8637a',
    name: { en: 'Facial', hi: 'Facial' },
    desc: { en: 'Glow treatments & cleanup', hi: 'Glow aur safai ke liye chamakdar twacha' },
  },
  {
    emoji: '👰',
    color: '#c9973a',
    name: { en: 'Bridal', hi: 'Dulhan' },
    desc: { en: 'Wedding & engagement looks', hi: 'Shaadi aur sagai ke liye shandar look' },
  },
  {
    emoji: '🌿',
    color: '#4caf50',
    name: { en: 'Mehndi', hi: 'Mehndi' },
    desc: { en: 'Beautiful henna designs', hi: 'Haath aur pairon par khoobsurat mehndi design' },
  },
  {
    emoji: '🧵',
    color: '#9c27b0',
    name: { en: 'Stitching', hi: 'Silai' },
    desc: { en: 'Custom tailoring & blouses', hi: 'Kapdon ki silai aur custom fitting' },
  },
  {
    emoji: '✂️',
    color: '#1e88e5',
    name: { en: 'Haircutting', hi: 'Haircutting' },
    desc: { en: 'Trendy cuts, layers & styling', hi: 'Trendy cuts, layers & styling' },
  },
];

const whyCards = [
  {
    icon: '🏠',
    title: { en: 'Home Service', hi: 'Ghar Par Service' },
    desc: {
      en: 'We come to you! Book home service for bridal, mehndi & more.',
      hi: 'Ghar par service — bridal, mehndi aur aur bhi upalabdh.',
    },
  },
  {
    icon: '💎',
    title: { en: 'Premium Quality', hi: 'Premium Quality' },
    desc: {
      en: 'Only the best products. Your skin deserves the finest care.',
      hi: 'Sirf behtareen products; twacha ko best care milta hai.',
    },
  },
  {
    icon: '📅',
    title: { en: 'Easy Booking', hi: 'Asaan Booking' },
    desc: {
      en: 'Book in seconds. Choose date, time & pay online or cash.',
      hi: 'Seconds mein booking; date, time aur payment chunen.',
    },
  },
  {
    icon: '👩‍🎨',
    title: { en: 'Expert Artists', hi: 'Expert Kalaakar' },
    desc: {
      en: 'Trained professionals with years of experience.',
      hi: 'Anubhavi kalaakar jinhe barso ka tajurba hai.',
    },
  },
  {
    icon: '💰',
    title: { en: 'Best Prices', hi: 'Behtareen Daam' },
    desc: {
      en: 'Transparent pricing. No hidden charges. Ever.',
      hi: 'Poore rupan se spasht daam, kabhi chhupa kharch nahi.',
    },
  },
  {
    icon: '⭐',
    title: { en: '5-Star Rated', hi: '5-Star Rated' },
    desc: {
      en: 'Hundreds of happy brides and satisfied clients.',
      hi: 'Sau se zyada khush brides aur graahaak hum par bharosa karte hain.',
    },
  },
];

const testimonialEntries = [
  {
    name: 'Priya Sharma',
    text: {
      en: 'Amazing bridal makeup! I felt like a queen on my special day.',
      hi: 'Shaandar bridal makeup! Meri shaadi ke din mein rani jaisa mehsoos kiya.',
    },
    rating: 5,
    loc: 'Gorakhpur',
  },
  {
    name: 'Anjali Singh',
    text: {
      en: 'The mehndi artist was incredible. Everyone loved the designs!',
      hi: 'Mehndi artist kamaal thi. Sabko inke designs bahut pasand aaye!',
    },
    rating: 5,
    loc: 'Lucknow',
  },
  {
    name: 'Sunita Yadav',
    text: {
      en: 'Home service was so convenient. Gold facial made my skin glow!',
      hi: 'Ghar par service bahut aaramdayak thi. Gold facial se twacha chamak gayi!',
    },
    rating: 5,
    loc: 'Gorakhpur',
  },
];

const ctaCopy = {
  title: { en: 'Ready to Look Your Best?', hi: 'Taiyaar ho apni khoobsurati dikhane ke liye?' },
  sub: {
    en: 'Book your appointment today and experience the Smart Sakhi difference!',
    hi: 'Aaj hi appointment book kariye aur Smart Sakhi ka farq mehsoos kariye!',
  },
  button: { en: 'Book Now →', hi: 'Abhi Book Kariye →' },
};

export default function Home() {
  const { lang } = useLang();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    API.get('/services').then(({ data }) => {
      // Pick 1 from each category as featured
      const picks = serviceCategories
        .map(cat => data.services.find(s => s.category === cat.name.en))
        .filter(Boolean);
      setFeatured(picks);
    }).catch(() => {});
  }, []);

  const pick = (pair) => pair?.[lang] ?? pair?.en ?? '';

  const localizedCategories = serviceCategories.map(cat => ({
    ...cat,
    displayName: pick(cat.name),
    displayDesc: pick(cat.desc),
  }));

  const featureList = whyCards.map(card => ({
    ...card,
    titleText: pick(card.title),
    descText: pick(card.desc),
  }));

  const testimonialsList = testimonialEntries.map(entry => ({
    ...entry,
    text: pick(entry.text),
  }));

  return (
    <div className="page" style={{ paddingTop: 'var(--nav-height)' }}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div className="container" style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <LangText
              hi="✨ Gorakhpur ki pasandida beauty studio"
              en="✨ Gorakhpur's Favourite Beauty Studio"
            />
          </div>
          <h1 style={styles.heroTitle}>
            <LangText hi="Sundar Dikhiye," en="Look Beautiful," />
            <br />
            <em style={{ color: 'var(--rose)' }}>
              <LangText hi="Khoobsoorat Mahsoos Kariye" en="Feel Confident" />
            </em>
          </h1>
          <p style={styles.heroSub}>
            <LangText
            hi="Smart Sakhi ke haathon se premium beauty services — ghar par ya parlour mein. Bridal makeup, Mehndi, facial aur silai, sab ek jagah."
              en="Premium beauty services at your doorstep or our parlour. Bridal makeup, Mehndi, Facials & Stitching — all in one place."
            />
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/services" className="btn btn-primary btn-lg">
              <LangText hi="Services Dekhiye →" en="Browse Services →" />
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              <LangText hi="Abhi Join Kijiye" en="Join Free" />
            </Link>
          </div>
          <div style={styles.heroStats}>
            {heroStats.map(stat => (
              <div key={stat.label.en} style={styles.stat}>
                <div style={styles.statVal}>{stat.value}</div>
                <div style={styles.statLbl}>{pick(stat.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section style={styles.section}>
        <div className="container">
          <div style={styles.sectionHead}>
            <h2 style={styles.sectionTitle}>Our Services</h2>
            <p style={styles.sectionSub}>Expert beauty care for every occasion</p>
          </div>
          <div className="grid-4">
            {localizedCategories.map(cat => (
              <Link to={`/services?category=${cat.name.en}`} key={cat.name.en} style={{ ...styles.catCard, '--c': cat.color }}>
                <div style={{ ...styles.catIcon, background: cat.color + '22', color: cat.color }}>{cat.emoji}</div>
                <h3 style={styles.catName}>{cat.displayName}</h3>
                <p style={styles.catDesc}>{cat.displayDesc}</p>
                <span style={{ ...styles.catLink, color: cat.color }}>
                  <LangText hi="Sab Dekhiye →" en="Explore →" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Services ─────────────────────────────── */}
      {featured.length > 0 && (
        <section style={{ ...styles.section, background: '#fff5f7' }}>
          <div className="container">
            <div style={styles.sectionHead}>
              <h2 style={styles.sectionTitle}>
                <LangText hi="Lokpriya Services" en="Popular Services" />
              </h2>
              <p style={styles.sectionSub}>
                <LangText hi="Sabse zyada booked" en="Most booked by our clients" />
              </p>
            </div>
            <div className="grid-4">
              {featured.map(s => <ServiceCard key={s._id} service={s} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link to="/services" className="btn btn-outline btn-lg">
                <LangText hi="Sab Dekhiye" en="View All Services" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Why Choose Us ─────────────────────────────────── */}
      <section style={styles.section}>
        <div className="container">
          <div style={styles.sectionHead}>
            <h2 style={styles.sectionTitle}>
              <LangText hi="Hum Kyun Khaas Hain? 💕" en="Why Smart Sakhi? 💕" />
            </h2>
          </div>
          <div className="grid-3">
            {featureList.map(card => (
              <div key={card.title.en} style={styles.featureCard}>
                <div style={styles.featureIcon}>{card.icon}</div>
                <h3 style={styles.featureTitle}>{card.titleText}</h3>
                <p style={styles.featureDesc}>{card.descText}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section style={{ ...styles.section, background: 'linear-gradient(135deg, #fff5f7, #fdf3e3)' }}>
        <div className="container">
          <div style={styles.sectionHead}>
            <h2 style={styles.sectionTitle}>
              <LangText hi="Hamare Graahaak Kya Kehte Hain" en="What Our Clients Say" />
            </h2>
          </div>
          <div className="grid-3">
            {testimonialsList.map(t => (
              <div key={t.name} style={styles.testimonialCard}>
                <div style={styles.stars}>{'⭐'.repeat(t.rating)}</div>
                <p style={styles.testimonialText}>"{t.text}"</p>
                <div style={styles.testimonialAuthor}>
                  <div style={styles.authorAvatar}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#7a5560' }}>📍 {t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section style={styles.ctaSection}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ ...styles.sectionTitle, color: '#fff', marginBottom: 12 }}>
            <LangText hi={ctaCopy.title.hi} en={ctaCopy.title.en} />
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 28, fontSize: 17 }}>
            <LangText hi={ctaCopy.sub.hi} en={ctaCopy.sub.en} />
          </p>
          <Link to="/services" className="btn" style={{ background: '#fff', color: 'var(--rose)', fontSize: 17, padding: '14px 36px' }}>
            <LangText hi={ctaCopy.button.hi} en={ctaCopy.button.en} />
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer style={styles.footer}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>💄</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 6 }}>Smart Sakhi</h3>
          <p style={{ color: '#7a5560', fontSize: 14 }}>
            <LangText
              hi="Gorakhpur, Uttar Pradesh • Somvaar–Shanivaar 9 AM–8 PM"
              en="Gorakhpur, Uttar Pradesh • Mon–Sat 9AM–8PM"
            />
          </p>
          <p style={{ color: '#c0a0a8', fontSize: 12, marginTop: 20 }}>
            <LangText hi="© 2025 Smart Sakhi. Dil se banaya gaya." en="© 2025 Smart Sakhi. Made with 💕" />
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  hero: { position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg, #fff5f7 0%, #fdf3e3 100%)' },
  heroBg: { position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(232,99,122,0.12) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(201,151,58,0.1) 0%, transparent 50%)' },
  heroContent: { position: 'relative', zIndex: 1, paddingTop: 40, paddingBottom: 60 },
  heroBadge: { display: 'inline-block', background: 'var(--rose-light)', color: 'var(--rose-dark)', padding: '6px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20 },
  heroTitle: { fontSize: 'clamp(36px, 6vw, 70px)', fontFamily: "'Playfair Display', serif", marginBottom: 18, lineHeight: 1.15, color: '#1a0a0f' },
  heroSub: { fontSize: 18, color: '#7a5560', marginBottom: 32, lineHeight: 1.7, maxWidth: 520 },
  heroStats: { display: 'flex', gap: 32, marginTop: 48, flexWrap: 'wrap' },
  stat: { textAlign: 'center' },
  statVal: { fontSize: 26, fontWeight: 700, color: 'var(--rose)', fontFamily: "'Playfair Display', serif" },
  statLbl: { fontSize: 12, color: '#7a5560', fontWeight: 500 },
  section: { padding: '72px 0' },
  sectionHead: { textAlign: 'center', marginBottom: 48 },
  sectionTitle: { fontSize: 36, marginBottom: 10 },
  sectionSub: { color: '#7a5560', fontSize: 17 },
  catCard: { background: '#fff', borderRadius: 16, padding: '28px 20px', border: '1px solid #f0dde2', textAlign: 'center', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', display: 'block' },
  catIcon: { width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 14px' },
  catName: { fontSize: 18, marginBottom: 6 },
  catDesc: { fontSize: 13, color: '#7a5560', marginBottom: 12 },
  catLink: { fontSize: 13, fontWeight: 600 },
  featureCard: { background: '#fff', borderRadius: 16, padding: '28px 22px', border: '1px solid #f0dde2', textAlign: 'center' },
  featureIcon: { fontSize: 36, marginBottom: 14 },
  featureTitle: { fontSize: 18, marginBottom: 8 },
  featureDesc: { fontSize: 14, color: '#7a5560', lineHeight: 1.6 },
  testimonialCard: { background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #f0dde2' },
  stars: { fontSize: 16, marginBottom: 12 },
  testimonialText: { fontSize: 14, color: '#3d1f28', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: 10 },
  authorAvatar: { width: 36, height: 36, borderRadius: '50%', background: 'var(--rose)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  ctaSection: { background: 'linear-gradient(135deg, #e8637a, #c94d65)', padding: '80px 0' },
  footer: { background: '#1a0a0f', padding: '40px 0', color: '#fff' },
};
