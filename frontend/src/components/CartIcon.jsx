// src/components/CartIcon.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

export default function CartIcon() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    API.get('/cart').then(({ data }) => setCount(data.cart?.items?.length || 0)).catch(() => {});
    // Listen for cart updates via custom event
    const handler = () => API.get('/cart').then(({ data }) => setCount(data.cart?.items?.length || 0)).catch(() => {});
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  return (
    <Link to="/cart" style={styles.wrap}>
      <span style={styles.icon}>🛒</span>
      {count > 0 && <span style={styles.badge}>{count}</span>}
    </Link>
  );
}

const styles = {
  wrap: { position: 'relative', display: 'inline-flex', padding: '8px', borderRadius: '50%', background: 'var(--rose-light)', transition: 'background 0.2s' },
  icon: { fontSize: 20 },
  badge: { position: 'absolute', top: 2, right: 2, width: 16, height: 16, background: 'var(--rose)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};
