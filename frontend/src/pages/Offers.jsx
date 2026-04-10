import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    API.get('/offers').then(({ data }) => setOffers(data.offers)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const copy = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    toast.success(`${code} copy ho gaya! Booking mein use kariye 🎉`);
    setTimeout(() => setCopied(''), 3000);
  };

  const daysLeft = (till) => {
    const d = Math.ceil((new Date(till) - Date.now()) / (1000 * 60 * 60 * 24));
    return d > 0 ? `${d} din baaki` : 'Aaj expire';
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={s.title}>🎉 Khaas Offers & Chhoot</h1>
        <p style={s.sub}>Apna favourite offer chuniye aur coupon use kariye booking mein!</p>

        {loading ? <div className="spinner" /> : offers.length === 0 ? (
          <div className="empty-state"><div className="icon">🎉</div><h3>Abhi koi offer nahi</h3><p>Jald nayi offers aayengi!</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {offers.map(offer => (
              <div key={offer._id} style={{ ...s.card, borderLeft: `5px solid ${offer.bannerColor}` }}>
                <div style={s.offerTop}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 36 }}>{offer.emoji}</span>
                    <div>
                      <h2 style={s.offerTitle}>{offer.title}</h2>
                      {offer.occasion && <span style={{ ...s.pill, background: offer.bannerColor + '22', color: offer.bannerColor }}>{offer.occasion}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ ...s.discount, color: offer.bannerColor }}>
                      {offer.discountType === 'percent' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                    </div>
                    <div style={{ fontSize: 12, color: '#7a5560' }}>{daysLeft(offer.validTill)}</div>
                  </div>
                </div>

                <p style={s.desc}>{offer.description}</p>

                {offer.minAmount > 0 && <p style={s.condition}>Minimum booking: ₹{offer.minAmount}</p>}
                {offer.maxDiscount && <p style={s.condition}>Maximum discount: ₹{offer.maxDiscount}</p>}

                {offer.couponCode && (
                  <div style={s.couponBox}>
                    <div style={s.couponCode}>{offer.couponCode}</div>
                    <button onClick={() => copy(offer.couponCode)} style={{ ...s.copyBtn, background: copied === offer.couponCode ? '#e8f5e9' : offer.bannerColor, color: copied === offer.couponCode ? '#2e7d32' : '#fff' }}>
                      {copied === offer.couponCode ? '✓ Copied!' : '📋 Copy Kariye'}
                    </button>
                  </div>
                )}

                <Link to="/services" className="btn btn-primary" style={{ marginTop: 12, fontSize: 13, padding: '9px 20px' }}>
                  Abhi Book Kariye →
                </Link>
              </div>
            ))}
          </div>
        )}

        <div style={s.infoBox}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", marginBottom: 10 }}>Coupon Kaise Use Karein?</h3>
          {['Services chuniye aur Cart mein jodiye', 'Booking page par "Coupon" daalo', 'Coupon code copy karke paste kariye', 'Discount turant apply ho jaayega!'].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#e8637a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: 14, color: '#7a5560' }}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  title:    { fontSize: 34, fontFamily: "'Playfair Display',serif", marginBottom: 8 },
  sub:      { color: '#7a5560', marginBottom: 28 },
  card:     { background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', boxShadow: '0 4px 16px rgba(232,99,122,0.06)' },
  offerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 10 },
  offerTitle: { fontSize: 20, fontFamily: "'Playfair Display',serif", marginBottom: 4 },
  pill:     { fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 20 },
  discount: { fontSize: 28, fontWeight: 800, fontFamily: "'Playfair Display',serif" },
  desc:     { fontSize: 14, color: '#7a5560', marginBottom: 10, lineHeight: 1.6 },
  condition:{ fontSize: 12, color: '#7a5560', background: '#fafafa', padding: '4px 10px', borderRadius: 6, display: 'inline-block', marginBottom: 4 },
  couponBox:{ display: 'flex', alignItems: 'center', gap: 10, background: '#fafafa', border: '2px dashed #f0dde2', borderRadius: 10, padding: '10px 14px', marginTop: 10, flexWrap: 'wrap' },
  couponCode:{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: '#1a0a0f', letterSpacing: 3, flex: 1 },
  copyBtn:  { padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", transition: 'all 0.2s' },
  infoBox:  { background: '#fff5f7', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginTop: 24 },
};
