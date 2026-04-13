// src/components/ServiceCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const categoryEmoji = { Facial: '💆', Bridal: '👰', Mehndi: '🌿', Stitching: '🧵' ,Haircutting: '✂️'};
const categoryColor = { Facial: '#e8637a', Bridal: '#c9973a', Mehndi: '#4caf50', Stitching: '#9c27b0', Haircutting: '#1e88e5' };

export default function ServiceCard({ service, onCartUpdate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try {
      await API.post('/cart/add', { serviceId: service._id });
      setAdded(true);
      toast.success(`${service.name} added to cart! 🛒`);
      window.dispatchEvent(new Event('cart-updated'));
      onCartUpdate?.();
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === 'Service already in cart') {
        toast('Already in cart!', { icon: '🛒' });
        setAdded(true);
      } else {
        toast.error(msg || 'Failed to add');
      }
    } finally {
      setAdding(false);
    }
  };

  const accent = categoryColor[service.category] || '#e8637a';

  return (
    <div style={{ ...styles.card, '--accent': accent }}>
      {/* Category badge */}
      <div style={{ ...styles.categoryBar, background: accent }}>
        <span>{categoryEmoji[service.category]}</span>
        <span style={styles.categoryText}>{service.category}</span>
      </div>

      <div style={styles.body}>
        <h3 style={styles.name}>{service.name}</h3>
        <p style={styles.desc}>{service.description}</p>

        <div style={styles.meta}>
          {service.duration && <span style={styles.metaItem}>⏱ {service.duration}</span>}
          {service.availableFor?.includes('home') && <span style={styles.metaItem}>🏠 Home</span>}
          {service.availableFor?.includes('parlour') && <span style={styles.metaItem}>🪑 Parlour</span>}
        </div>

        <div style={styles.footer}>
          <div style={styles.price}>
            <span style={styles.priceLabel}>From</span>
            <span style={{ ...styles.priceValue, color: accent }}>₹{service.price}</span>
          </div>
          <button
            style={{ ...styles.addBtn, background: added ? '#e8f5e9' : accent, color: added ? '#2e7d32' : '#fff' }}
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? '...' : added ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #f0dde2', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 12px rgba(232,99,122,0.08)', cursor: 'default' },
  categoryBar: { padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 },
  categoryText: { fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: 1, textTransform: 'uppercase' },
  body: { padding: '16px 18px 18px' },
  name: { fontSize: 17, fontFamily: "'Playfair Display', serif", marginBottom: 6, color: '#1a0a0f' },
  desc: { fontSize: 13, color: '#7a5560', lineHeight: 1.5, marginBottom: 12, minHeight: 38 },
  meta: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 },
  metaItem: { fontSize: 12, background: '#fce8ec', color: '#c94d65', padding: '3px 8px', borderRadius: 20, fontWeight: 500 },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  price: { display: 'flex', flexDirection: 'column' },
  priceLabel: { fontSize: 11, color: '#7a5560', fontWeight: 500 },
  priceValue: { fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif" },
  addBtn: { padding: '9px 18px', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', minWidth: 80 },
};
