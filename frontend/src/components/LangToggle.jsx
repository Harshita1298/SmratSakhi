// src/components/LangToggle.jsx
import { useLang } from '../context/LangContext';

export default function LangToggle() {
  const { lang, changeLang } = useLang();

  return (
    <div style={styles.wrap}>
      <button
        onClick={() => changeLang('hi')}
        style={{ ...styles.btn, ...(lang === 'hi' ? styles.active : {}) }}
        title="Hindi mein badliye"
      >
        हि
      </button>
      <button
        onClick={() => changeLang('en')}
        style={{ ...styles.btn, ...(lang === 'en' ? styles.active : {}) }}
        title="Switch to English"
      >
        EN
      </button>
    </div>
  );
}

const styles = {
  wrap:   { display: 'flex', background: '#f0dde2', borderRadius: 20, padding: 2, gap: 2 },
  btn:    { width: 30, height: 26, borderRadius: 18, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, background: 'transparent', color: '#7a5560', fontFamily: "'Poppins', sans-serif", transition: 'all 0.15s' },
  active: { background: '#e8637a', color: '#fff', boxShadow: '0 1px 4px rgba(232,99,122,0.3)' },
};
