// src/pages/Services.jsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import { useLang } from '../context/LangContext';
import LangText from '../components/LangText';

const FILTERS = [
  { key: 'All', emoji: '', label: { en: 'All', hi: 'Sab' } },
  { key: 'Facial', emoji: '💆', label: { en: 'Facial', hi: 'Facial' } },
  { key: 'Bridal', emoji: '👰', label: { en: 'Bridal', hi: 'Dulhan' } },
  { key: 'Mehndi', emoji: '🌿', label: { en: 'Mehndi', hi: 'Mehndi' } },
  { key: 'Haircutting', emoji: '✂️', label: { en: 'Haircutting', hi: 'Haircutting' } },
  { key: 'Stitching', emoji: '🧵', label: { en: 'Stitching', hi: 'Silai' } },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch]     = useState('');
  const activeCategory          = searchParams.get('category') || 'All';
  const { lang } = useLang();
  const searchPlaceholder = lang === 'hi' ? '🔍 Services khojein…' : '🔍 Search services…';
  const countLabel = (count) => lang === 'hi'
    ? `${count} service${count !== 1 ? 's' : ''} mil gaye`
    : `${count} service${count !== 1 ? 's' : ''} found`;
  const filterLabel = (item) => item.label[lang] ?? item.label.en;

  useEffect(() => {
    setLoading(true);
    const url = activeCategory !== 'All' ? `/services?category=${activeCategory}` : '/services';
    API.get(url).then(({ data }) => setServices(data.services)).catch(() => {}).finally(() => setLoading(false));
  }, [activeCategory]);

  const filtered = services.filter(s =>
    search === '' || s.name.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase())
  );

  const setCategory = (cat) => {
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            <LangText hi="Hamari Services" en="Our Services" />
          </h1>
          <p style={styles.sub}>
            <LangText hi="Aapke liye perfect beauty treatment book kariye" en="Book the perfect beauty treatment for you" />
          </p>
        </div>

        {/* Search + Filter */}
        <div style={styles.controls}>
          <input
            className="form-input"
            style={{ maxWidth: 320 }}
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={styles.filters}>
            {FILTERS.map(filter => (
              <button
                key={filter.key}
                onClick={() => setCategory(filter.key)}
                style={{
                  ...styles.filterBtn,
                  ...(activeCategory === filter.key ? styles.filterActive : {}),
                }}
              >
                {filter.emoji && <span style={{ marginRight: 4 }}>{filter.emoji}</span>}
                {filterLabel(filter)}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={styles.count}>
          {loading
            ? <LangText hi="Services load ho rahe hain…" en="Loading services…" />
            : countLabel(filtered.length)}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">💄</div>
            <h3><LangText hi="Koi service nahi mila" en="No services found" /></h3>
            <p>
              <LangText
                hi="Apni search ya filter badal kar dekhiye"
                en="Try adjusting your search or filter"
              />
            </p>
            <Link to="/services" className="btn btn-primary" style={{ marginTop: 20 }}>
              <LangText hi="Services Dekhiye" en="Browse Services" />
            </Link>
          </div>
        ) : (
          <div className="grid-4">
            {filtered.map(s => <ServiceCard key={s._id} service={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: { textAlign: 'center', marginBottom: 36 },
  title: { fontSize: 42, color: '#1a0a0f', marginBottom: 10 },
  sub: { color: '#7a5560', fontSize: 17 },
  controls: { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 },
  filters: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  filterBtn: { padding: '9px 18px', border: '1.5px solid #f0dde2', borderRadius: 24, background: '#fff', color: '#7a5560', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" },
  filterActive: { background: 'var(--rose)', color: '#fff', borderColor: 'var(--rose)' },
  count: { fontSize: 14, color: '#7a5560', marginBottom: 24 },
};
