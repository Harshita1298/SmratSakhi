// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [show, setShow] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.phone || !form.password) { toast.error('Please fill all fields'); return; }
    const res = await login(form.phone, form.password);
    if (res.success) {
      toast.success('Welcome back! 💄');
      // Admin ko /admin page par, user ko home par bhejo
      navigate(res.role === 'admin' ? '/admin' : '/');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Left panel */}
        <div style={styles.left}>
          <div style={styles.logo}>💄</div>
          <h1 style={styles.brand}>Smart Sakhi</h1>
          <p style={styles.tagline}>Your beauty, our passion</p>
          <div style={styles.features}>
            {['💆 Facial & Skin Treatments', '👰 Bridal Packages', '🌿 Mehndi Designs', '🧵 Custom Stitching', '🏠 Home Service Available'].map(f => (
              <div key={f} style={styles.featureItem}>{f}</div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={styles.right}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.sub}>Sign in to book your beauty appointment</p>

          <form onSubmit={submit} style={{ marginTop: 28 }}>
            <div className="form-group">
              <label className="form-label">📱 Phone Number</label>
              <input
                className="form-input"
                name="phone"
                value={form.phone}
                onChange={handle}
                placeholder="Enter your phone number"
                type="tel"
                maxLength={10}
              />
            </div>
            <div className="form-group">
              <label className="form-label">🔒 Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  name="password"
                  value={form.password}
                  onChange={handle}
                  placeholder="Enter your password"
                  type={show ? 'text' : 'password'}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShow(s => !s)} style={styles.eyeBtn}>
                  {show ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '14px' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div style={styles.demo}>
            <strong>Demo Admin:</strong> 9999999999 / admin123
          </div>

          <div style={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--rose)', fontWeight: 600 }}>Sign Up Free</Link>
          </div>

          <Link to="/" style={styles.backLink}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fff5f7, #fdf3e3)', padding: 20 },
  card: { background: '#fff', borderRadius: 24, overflow: 'hidden', width: '100%', maxWidth: 860, display: 'grid', gridTemplateColumns: '1fr 1fr', boxShadow: '0 20px 80px rgba(232,99,122,0.2)', minHeight: 560 },
  left: { background: 'linear-gradient(145deg, #e8637a, #c94d65)', padding: '48px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  logo: { fontSize: 48, marginBottom: 12 },
  brand: { fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#fff', marginBottom: 8 },
  tagline: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 36 },
  features: { display: 'flex', flexDirection: 'column', gap: 12 },
  featureItem: { color: 'rgba(255,255,255,0.9)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', padding: '8px 14px', borderRadius: 8 },
  right: { padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 30, color: '#1a0a0f', marginBottom: 6 },
  sub: { color: '#7a5560', fontSize: 15 },
  eyeBtn: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 },
  demo: { background: '#fdf3e3', border: '1px solid #f0dde2', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#7a5560', marginTop: 16 },
  switchText: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#7a5560' },
  backLink: { textAlign: 'center', display: 'block', marginTop: 16, fontSize: 13, color: '#c0a0a8' },
};
// Note: GoogleLoginButton is imported in Login.jsx — add this to the form:
// import GoogleLoginButton from '../components/GoogleLoginButton';
// Then add before the switchText div:
// <div style={{ textAlign:'center', color:'var(--muted)', fontSize:13, margin:'16px 0' }}>— ya —</div>
// <GoogleLoginButton />
