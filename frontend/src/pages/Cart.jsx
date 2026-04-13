// src/pages/Cart.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import LangText from '../components/LangText';
const categoryEmoji = { Facial: '💆', Bridal: '👰', Mehndi: '🌿', Stitching: '🧵' ,Haircutting: '✂️'};


export default function Cart() {
  const [cart, setCart]     = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = () => {
    setLoading(true);
    API.get('/cart').then(({ data }) => setCart(data.cart)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(fetchCart, []);

  const remove = async (serviceId) => {
    try {
      const { data } = await API.delete(`/cart/remove/${serviceId}`);
      setCart(data.cart);
      window.dispatchEvent(new Event('cart-updated'));
      toast.success('Removed from cart');
    } catch { toast.error('Failed to remove'); }
  };

  const clear = async () => {
    try {
      await API.delete('/cart/clear');
      setCart({ items: [], totalPrice: 0 });
      window.dispatchEvent(new Event('cart-updated'));
      toast.success('Cart cleared');
    } catch { toast.error('Failed to clear'); }
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  const items = cart?.items || [];
  const total = cart?.totalPrice || 0;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <LangText hi="Aapka Cart 🛒" en="Your Cart 🛒" />
          </h1>
          {items.length > 0 && (
            <button onClick={clear} className="btn btn-outline btn-sm" style={{ color: '#c62828', borderColor: '#c62828' }}>
              <LangText hi="Sab Hatao" en="Clear All" />
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🛒</div>
            <h3><LangText hi="Cart khali hai" en="Your cart is empty" /></h3>
            <p><LangText hi="Booking shuru karne ke liye services jodiye" en="Add beauty services to get started" /></p>
            <Link to="/services" className="btn btn-primary" style={{ marginTop: 20 }}>
              <LangText hi="Services Dekhiye" en="Browse Services" />
            </Link>
          </div>
        ) : (
          <>
            <div style={styles.itemsList}>
              {items.map(item => (
                <div key={item.serviceId} style={styles.item}>
                  <div style={styles.itemIcon}>{categoryEmoji[item.category] || '💄'}</div>
                  <div style={styles.itemInfo}>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <span className="badge badge-rose">{item.category}</span>
                  </div>
                  <div style={styles.itemPrice}>₹{item.price}</div>
                  <button onClick={() => remove(item.serviceId)} style={styles.removeBtn}>✕</button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={styles.summary}>
              <div style={styles.summaryRow}>
                <span><LangText hi="Services" en="Services" /> ({items.length})</span>
                <span>₹{total}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={{ color: '#2e7d32' }}><LangText hi="Chhoot" en="Discount" /></span>
                <span style={{ color: '#2e7d32' }}>₹0</span>
              </div>
              <div className="divider" />
              <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: 20 }}>
                <span><LangText hi="Kul Rakam" en="Total" /></span>
                <span style={{ color: 'var(--rose)', fontFamily: "'Playfair Display', serif" }}>₹{total}</span>
              </div>

              <button
                onClick={() => navigate('/booking')}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '16px', marginTop: 20, fontSize: 17 }}
              >
                <LangText hi="Booking Kariye →" en="Proceed to Booking →" />
              </button>
              <Link to="/services" style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 14, color: '#7a5560' }}>
                <LangText hi="+ Aur services jodiye" en="+ Add more services" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  title: { fontSize: 32 },
  itemsList: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 },
  item: { background: '#fff', border: '1px solid #f0dde2', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(232,99,122,0.06)' },
  itemIcon: { width: 52, height: 52, background: 'var(--rose-light)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 },
  itemInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: 6 },
  itemName: { fontSize: 16, fontFamily: "'Playfair Display', serif" },
  itemPrice: { fontSize: 20, fontWeight: 700, color: 'var(--rose)', fontFamily: "'Playfair Display', serif", flexShrink: 0 },
  removeBtn: { background: '#fce4ec', border: 'none', color: '#c62828', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: 12, flexShrink: 0 },
  summary: { background: '#fff', border: '1px solid #f0dde2', borderRadius: 16, padding: '24px 28px', boxShadow: '0 4px 20px rgba(232,99,122,0.08)' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, fontSize: 16 },
};
