// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', address: '', city: 'Gorakhpur' });

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.password) { toast.error('Name, phone and password are required'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    const res = await register(form);
    if (res.success) {
      toast.success('Welcome to Smart Sakhi! 💄');
      navigate('/');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={{ fontSize: 36 }}>💄</div>
          <h2 style={styles.title}>Join Smart Sakhi</h2>
          <p style={styles.sub}>Create your account to book beauty services</p>
        </div>

        <form onSubmit={submit} style={styles.form}>
          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Full Name *</label>
              <input className="form-input" name="name" value={form.name} onChange={handle} placeholder="Your full name" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Phone Number *</label>
              <input className="form-input" name="phone" value={form.phone} onChange={handle} placeholder="10-digit mobile" type="tel" maxLength={10} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email (optional)</label>
            <input className="form-input" name="email" value={form.email} onChange={handle} placeholder="your@email.com" type="email" />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="form-input" name="password" value={form.password} onChange={handle} placeholder="Minimum 6 characters" type="password" />
          </div>

          <div style={styles.row}>
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Address</label>
              <input className="form-input" name="address" value={form.address} onChange={handle} placeholder="Mohalla / Colony" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">City</label>
              <select className="form-input form-select" name="city" value={form.city} onChange={handle}>
                <option>Gorakhpur</option>
                <option>Lucknow</option>
                <option>Varanasi</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating Account…' : 'Create Account →'}
          </button>
        </form>

        <div style={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--rose)', fontWeight: 600 }}>Sign In</Link>
        </div>
        <Link to="/" style={styles.backLink}>← Back to Home</Link>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fff5f7, #fdf3e3)', padding: '80px 20px 40px' },
  card: { background: '#fff', borderRadius: 20, padding: '40px 44px', width: '100%', maxWidth: 620, boxShadow: '0 12px 48px rgba(232,99,122,0.15)' },
  header: { textAlign: 'center', marginBottom: 28 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a0a0f', marginBottom: 6, marginTop: 8 },
  sub: { color: '#7a5560', fontSize: 15 },
  form: {},
  row: { display: 'flex', gap: 16 },
  switchText: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#7a5560' },
  backLink: { textAlign: 'center', display: 'block', marginTop: 12, fontSize: 13, color: '#c0a0a8' },
};
