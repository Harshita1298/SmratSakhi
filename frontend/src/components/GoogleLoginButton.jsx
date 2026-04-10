// frontend/src/components/GoogleLoginButton.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function GoogleLoginButton({ label = 'Google se login karo' }) {
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();
  const divRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Google Identity Services script
    if (document.getElementById('google-gsi-script')) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.id = 'google-gsi-script';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !GOOGLE_CLIENT_ID || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
    });

    window.google.accounts.id.renderButton(divRef.current, {
      theme: 'outline',
      size: 'large',
      width: divRef.current?.offsetWidth || 320,
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left',
    });
  }, [scriptLoaded]);

  const handleCredentialResponse = async (response) => {
    try {
      const { data } = await API.post('/auth/google', { idToken: response.credential });
      // Store token & user same as normal login
      localStorage.setItem('sakhi_token', data.token);
      localStorage.setItem('sakhi_user', JSON.stringify(data.user));
      // Refresh auth context
      window.location.href = data.user.role === 'admin' ? '/admin' : '/';
      toast.success(data.isNew
        ? `Welcome ${data.user.name}! 🌸 Smart Sakhi mein aapka swagat hai!`
        : `Welcome back, ${data.user.name}! 💄`
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google login failed');
    }
  };

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div style={styles.disabled}>
        <span>🔑</span>
        <span style={{ fontSize: 13, color: '#7a5560' }}>Google login setup pending (VITE_GOOGLE_CLIENT_ID missing)</span>
      </div>
    );
  }

  return <div ref={divRef} style={{ width: '100%', minHeight: 44 }} />;
}

const styles = {
  disabled: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#fafafa', border: '1px dashed #f0dde2', borderRadius: 8 },
};
