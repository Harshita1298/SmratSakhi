// frontend/src/pages/Reviews.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLang, T } from '../context/LangContext';
import LangText from '../components/LangText';
import StarRating from '../components/StarRating';

const REVIEW_CATEGORIES = [
  { key: 'all', label: { hi: 'Sab', en: 'All' }, emoji: '⭐' },
  { key: 'Facial', label: { hi: 'Facial', en: 'Facial' }, emoji: '💆' },
  { key: 'Bridal', label: { hi: 'Dulhan', en: 'Bridal' }, emoji: '👰' },
  { key: 'Mehndi', label: { hi: 'Mehndi', en: 'Mehndi' }, emoji: '🌿' },
  { key: 'Stitching', label: { hi: 'Silai', en: 'Stitching' }, emoji: '🧵' },
  { key: 'General', label: { hi: 'General', en: 'General' }, emoji: '💄' },
];

const catEmoji = { Facial: '💆', Bridal: '👰', Mehndi: '🌿', Stitching: '🧵', General: '💄' };

export default function Reviews() {
  const { user } = useAuth();
  const { lang } = useLang();
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState({ avgRating: '0', totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    rating: 0, title: '', comment: '', serviceCategory: 'General', customerName: user?.name || '',
  });
  const translate = (hi, en) => (lang === 'hi' ? hi : en);
  const ratingWords = lang === 'hi' ? T.ratingWords : T.ratingWordsEn;

  useEffect(() => { fetchReviews(); }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/reviews' : `/reviews?category=${filter}`;
      const { data } = await API.get(url);
      setReviews(data.reviews);
      setMeta({ avgRating: data.avgRating, totalCount: data.totalCount });
    } catch (e) {}
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating) { toast.error(translate('Star rating dena zaroori hai ⭐', 'Star rating is required ⭐')); return; }
    if (!form.comment.trim()) { toast.error(translate('Review likhna zaroori hai', 'Please write a review')); return; }
    if (!user && !form.customerName.trim()) { toast.error(translate('Aapka naam likhein', 'Enter your name')); return; }
    setSubmitting(true);
    try {
      await API.post('/reviews', form);
      setSubmitted(true);
      setShowForm(false);
      setForm({ rating: 0, title: '', comment: '', serviceCategory: 'General', customerName: user?.name || '' });
      toast.success(translate('Review submit ho gaya! Admin approval ke baad publish hoga 🙏', 'Review submitted! It will appear after admin approval 🙏'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submit failed');
    }
    setSubmitting(false);
  };

  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    star: r,
    count: reviews.filter(rv => rv.rating === r).length,
    pct: reviews.length ? Math.round((reviews.filter(rv => rv.rating === r).length / reviews.length) * 100) : 0,
  }));

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>

        {/* ── Header ──────────────────────────── */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>
              <LangText hi="Customer Reviews ⭐" en="Customer Reviews ⭐" />
            </h1>
            <p style={s.sub}>
              <LangText hi="Hamare clients ki sacchi raay — unke khaas anubhav" en="Real feedback from our clients — their special experiences" />
            </p>
          </div>
          {!submitted && (
            <button onClick={() => user ? setShowForm(f => !f) : (window.location.href = '/login')} className="btn btn-primary">
              {showForm
                ? <LangText hi="Band Karo" en="Close" />
                : <LangText hi="✍️ Review Likho" en="✍️ Write a Review" />
              }
            </button>
          )}
        </div>

        {/* ── Rating Summary ───────────────────── */}
        <div style={s.summaryBox}>
          <div style={s.avgBox}>
            <div style={s.avgNum}>{meta.avgRating}</div>
            <StarRating value={Math.round(Number(meta.avgRating))} readOnly size={22} />
            <div style={s.avgTotal}>
              {meta.totalCount} <LangText hi="समीक्षा" en="reviews" />
            </div>
          </div>
          <div style={s.distBox}>
            {ratingDist.map(d => (
              <div key={d.star} style={s.distRow}>
                <span style={s.distLabel}>{d.star} ★</span>
                <div style={s.distTrack}>
                  <div style={{ ...s.distFill, width: `${d.pct}%` }} />
                </div>
                <span style={s.distCount}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Submit Form ──────────────────────── */}
        {showForm && (
          <div style={s.formCard}>
            <h3 style={s.formTitle}>
              <LangText hi="Apna Review Likho 💕" en="Share Your Review 💕" />
            </h3>
            <form onSubmit={handleSubmit}>
              {!user && (
                <div className="form-group">
                  <label className="form-label">
                    <LangText hi="Aapka Naam *" en="Your Name *" />
                  </label>
                  <input
                    className="form-input"
                    value={form.customerName}
                    onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                    placeholder={translate('Apna naam likhein', 'Type your name')}
                  />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">
                  <LangText hi="Rating dein *" en="Give a Rating *" />
                </label>
                <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} size={36} />
                {form.rating > 0 && (
                  <div style={{ marginTop: 6, fontSize: 13, color: 'var(--muted)' }}>
                    {ratingWords[form.rating] || ''}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">
                  <LangText hi="Service Category" en="Service Category" />
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {REVIEW_CATEGORIES.filter(catOpt => catOpt.key !== 'all').map(catOpt => (
                    <button
                      key={catOpt.key}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, serviceCategory: catOpt.key }))}
                      style={{ ...s.catChip, ...(form.serviceCategory === catOpt.key ? s.catChipActive : {}) }}
                    >
                      <span style={{ marginRight: 4 }}>{catEmoji[catOpt.key]}</span>
                      <LangText hi={catOpt.label.hi} en={catOpt.label.en} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <LangText hi="Review Title (optional)" en="Review Title (optional)" />
                </label>
                <input
                  className="form-input"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder={translate('Ek line mein bataiye...', 'Summarize in one line...')}
                  maxLength={80}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <LangText hi="Aapka Anubhav *" en="Your Experience *" />
                </label>
                <textarea
                  className="form-input"
                  value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  rows={4}
                  placeholder={translate('Apna experience share karein — kya pasand aaya, kya nahi...', 'Share what you loved — or didn’t — about the service')}
                  maxLength={500}
                />
                <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'right', marginTop: 4 }}>{form.comment.length}/500</div>
              </div>
              <div style={s.formNotice}>
                <LangText
                  hi="ℹ️ Aapka review admin approval ke baad publish hoga. Shukriya aapke feedback ke liye! 🙏"
                  en="ℹ️ Your review will appear after admin approval. Thank you for the feedback! 🙏"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }} disabled={submitting}>
                {submitting
                  ? translate('Submit ho raha hai...', 'Submitting...')
                  : translate('Review Submit Karo →', 'Submit Review →')}
              </button>
            </form>
          </div>
        )}

        {/* Submitted success */}
        {submitted && (
          <div style={s.successBox}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif" }}>
              <LangText hi="Bahut Shukriya!" en="Thank You!" />
            </h3>
            <p style={{ color: 'var(--muted)', marginTop: 6 }}>
              <LangText
                hi="Aapka review hamein mila. Admin review karke jald publish karengi."
                en="We have received your review. Admin will publish it soon."
              />
            </p>
          </div>
        )}

        {/* ── Filter Chips ─────────────────────── */}
        <div style={s.filterRow}>
          {REVIEW_CATEGORIES.map(catOpt => (
            <button
              key={catOpt.key}
              onClick={() => setFilter(catOpt.key)}
              style={{ ...s.chip, ...(filter === catOpt.key ? s.chipActive : {}) }}
            >
              {catOpt.emoji && <span>{catOpt.emoji} </span>}
              <LangText hi={catOpt.label.hi} en={catOpt.label.en} />
            </button>
          ))}
        </div>

        {/* ── Reviews List ─────────────────────── */}
        {loading ? <div className="spinner" /> : reviews.length === 0 ? (
          <div className="empty-state">
            <div className="icon">⭐</div>
            <h3>
              <LangText hi="Koi review nahi mila" en="No reviews yet" />
            </h3>
            <p>
              <LangText hi="Pehle review dene wale bano!" en="Be the first to leave a review!" />
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {reviews.map(rv => <ReviewCard key={rv._id} review={rv} lang={lang} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review, lang }) {
  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 3600) {
      const value = Math.floor(diff / 60);
      return lang === 'hi' ? `${value} minute pehle` : `${value} minutes ago`;
    }
    if (diff < 86400) {
      const value = Math.floor(diff / 3600);
      return lang === 'hi' ? `${value} ghante pehle` : `${value} hours ago`;
    }
    if (diff < 2592000) {
      const value = Math.floor(diff / 86400);
      return lang === 'hi' ? `${value} din pehle` : `${value} days ago`;
    }
    return new Date(date).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div style={s.reviewCard}>
      <div style={s.reviewTop}>
        <div style={s.reviewAvatar}>{review.avatarLetter || review.customerName?.[0]?.toUpperCase()}</div>
        <div style={{ flex: 1 }}>
          <div style={s.reviewName}>{review.customerName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StarRating value={review.rating} readOnly size={14} />
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{timeAgo(review.createdAt)}</span>
          </div>
        </div>
        <div style={s.reviewCatBadge}>
          <span>{catEmoji[review.serviceCategory]}</span>
          <span style={{ marginLeft: 4 }}>{getCategoryLabel(review.serviceCategory, lang)}</span>
        </div>
      </div>
      {review.title && <div style={s.reviewTitle}>{review.title}</div>}
      <p style={s.reviewComment}>{review.comment}</p>
    </div>
  );
}

function getCategoryLabel(key, lang) {
  const entry = REVIEW_CATEGORIES.find(cat => cat.key === key);
  if (!entry) return key;
  return lang === 'hi' ? entry.label.hi : entry.label.en;
}

const s = {
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  title:      { fontSize: 36, fontFamily: "'Playfair Display', serif" },
  sub:        { color: 'var(--muted)', marginTop: 4 },
  summaryBox: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 20 },
  avgBox:     { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, borderRight: '1px solid var(--border)' },
  avgNum:     { fontSize: 52, fontWeight: 700, color: '#f59e0b', fontFamily: "'Playfair Display', serif", lineHeight: 1 },
  avgTotal:   { fontSize: 13, color: 'var(--muted)' },
  distBox:    { display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', paddingLeft: 16 },
  distRow:    { display: 'flex', alignItems: 'center', gap: 10 },
  distLabel:  { fontSize: 13, color: 'var(--muted)', minWidth: 32 },
  distTrack:  { flex: 1, height: 8, background: '#f0dde2', borderRadius: 4, overflow: 'hidden' },
  distFill:   { height: '100%', background: '#f59e0b', borderRadius: 4, transition: 'width 0.5s' },
  distCount:  { fontSize: 12, color: 'var(--muted)', minWidth: 24, textAlign: 'right' },
  formCard:   { background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 28, marginBottom: 20, boxShadow: '0 4px 20px rgba(232,99,122,0.08)' },
  formTitle:  { fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 20, color: '#1a0a0f' },
  catChip:    { padding: '7px 14px', border: '1.5px solid var(--border)', borderRadius: 20, background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif" },
  catChipActive: { background: 'var(--rose)', color: '#fff', borderColor: 'var(--rose)' },
  formNotice: { background: '#fdf3e3', border: '1px solid #f0c060', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#8a6400', marginBottom: 14 },
  successBox: { background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 20 },
  filterRow:  { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 },
  chip:       { padding: '7px 16px', border: '1.5px solid var(--border)', borderRadius: 20, background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: 'var(--muted)', fontWeight: 500 },
  chipActive: { background: 'var(--rose)', color: '#fff', borderColor: 'var(--rose)' },
  reviewCard: { background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 22px', boxShadow: '0 2px 10px rgba(232,99,122,0.06)' },
  reviewTop:  { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 },
  reviewAvatar: { width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #e8637a, #c94d65)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, flexShrink: 0 },
  reviewName: { fontSize: 15, fontWeight: 600, color: '#1a0a0f', marginBottom: 3 },
  reviewCatBadge: { background: '#fce8ec', color: '#c94d65', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  reviewTitle: { fontSize: 15, fontWeight: 700, color: '#1a0a0f', marginBottom: 6 },
  reviewComment: { fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 },
};
