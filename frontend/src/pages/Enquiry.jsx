import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { useLang } from '../context/LangContext';
import LangText from '../components/LangText';

const SERVICES = [
  { key: 'Facial', label: { en: 'Facial', hi: 'Facial' } },
  { key: 'Bridal Makeup', label: { en: 'Bridal Makeup', hi: 'Bridal Makeup' } },
  { key: 'Mehndi', label: { en: 'Mehndi', hi: 'Mehndi' } },
  { key: 'Silai', label: { en: 'Silai', hi: 'Silai' } },
  { key: 'Hair Cutting', label: { en: 'Hair Cutting', hi: 'Baal Kataai' } },
  { key: 'Kuch aur', label: { en: 'Something else', hi: 'Kuch aur' } },
];

export default function Enquiry() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '', service: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { lang } = useLang();
  const namePlaceholder = lang === 'hi' ? 'Poora naam' : 'Full name';
  const phonePlaceholder = lang === 'hi' ? '10-digit' : '10-digit';
  const emailPlaceholder = lang === 'hi' ? 'optional' : 'optional';
  const messagePlaceholder = lang === 'hi' ? 'Koi bhi sawaal ya requirement likhiye...' : 'Any questions or requirement, write here...';
  const serviceLabel = (option) => option.label[lang] ?? option.label.en;

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) { toast.error('Naam, phone aur message zaroori hai'); return; }
    setLoading(true);
    try {
      await API.post('/enquiries', form);
      setSent(true);
    } catch(err) { toast.error(err.response?.data?.message || 'Send failed'); }
    setLoading(false);
  };

  if (sent) return (
    <div className="page">
      <div className="container" style={{ maxWidth: 500 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 40, textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🙏</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", marginBottom: 10 }}>
            <LangText hi="Bahut Shukriya!" en="Thank you!" />
          </h2>
          <p style={{ color: '#7a5560', marginBottom: 20, lineHeight: 1.7 }}>
            <LangText hi="Aapki enquiry mil gayi. Smart Sakhi jald hi" en="We received your enquiry. Smart Sakhi will reach out soon at" />
            {' '}
            <strong>+91 9936657399</strong>
            {' '}
            <LangText hi="se sampark karengi!" en="." />
          </p>
          <button onClick={() => setSent(false)} className="btn btn-primary" style={{ margin: '0 auto' }}>
            <LangText hi="Ek aur enquiry bhejen" en="Send another enquiry" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 620 }}>
        <h1 style={{ fontSize: 34, fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>
          <LangText hi="📩 Enquiry Kariye" en="📩 Send an Enquiry" />
        </h1>
        <p style={{ color: '#7a5560', marginBottom: 28 }}>
          <LangText hi="Koi bhi sawaal ho — hum 24 ghante mein jawab denge!" en="Have any questions? We'll reply within 24 hours!" />
        </p>

        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 28, boxShadow: '0 4px 16px rgba(232,99,122,0.08)' }}>
          <form onSubmit={submit}>
            <div style={{ display: 'flex', gap: 14 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">
                  <LangText hi="Aapka Naam *" en="Your Name *" />
                </label>
                <input className="form-input" value={form.name} onChange={e => handle('name', e.target.value)} placeholder={namePlaceholder} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">
                  <LangText hi="Phone *" en="Phone *" />
                </label>
                <input className="form-input" value={form.phone} onChange={e => handle('phone', e.target.value)} placeholder={phonePlaceholder} maxLength={10} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                <LangText hi="Email" en="Email" />
              </label>
              <input className="form-input" type="email" value={form.email} onChange={e => handle('email', e.target.value)} placeholder={emailPlaceholder} />
            </div>
            <div className="form-group">
              <label className="form-label">
                <LangText hi="Kis Service Ke Baare Mein?" en="Which service is this about?" />
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {SERVICES.map(option => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => handle('service', option.key)}
                    style={{
                      padding: '6px 14px',
                      border: '1.5px solid var(--border)',
                      borderRadius: 20,
                      background: form.service === option.key ? '#e8637a' : '#fff',
                      color: form.service === option.key ? '#fff' : '#7a5560',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontFamily: "'DM Sans',sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {serviceLabel(option)}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                <LangText hi="Aapka Message *" en="Your Message *" />
              </label>
              <textarea className="form-input" rows={4} value={form.message} onChange={e => handle('message', e.target.value)} placeholder={messagePlaceholder} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }} disabled={loading}>
              {loading
                ? <LangText hi="Bhej rahe hain..." en="Sending..." />
                : <LangText hi="📩 Enquiry Bhejiye →" en="📩 Send Enquiry →" />}
            </button>
          </form>
        </div>

        <div style={{ background: '#fdf3e3', border: '1px solid #f0c060', borderRadius: 14, padding: '16px 20px', marginTop: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            <LangText hi="📞 Seedha Baat Kariye" en="📞 Talk to us directly" />
          </div>
          <div style={{ fontSize: 14, color: '#7a5560' }}>
            <LangText hi="📱 +91 9936657399 (Call / WhatsApp)" en="📱 +91 9936657399 (Call / WhatsApp)" />
            <br />
            <LangText hi="⏰ Somvaar–Ravivar: 9 AM – 8 PM" en="⏰ Mon–Sun: 9 AM – 8 PM" />
            <br />
            <LangText hi="📍 Jaitpur, Khajni Road, Gorakhpur" en="📍 Jaitpur, Khajni Road, Gorakhpur" />
          </div>
        </div>
      </div>
    </div>
  );
}
