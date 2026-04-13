// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(() => {
    const stored = localStorage.getItem('sakhi_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('sakhi_token') || null);
  const [loading, setLoading] = useState(false);

  // Persist to localStorage on change
  useEffect(() => {
    if (token) localStorage.setItem('sakhi_token', token);
    else       localStorage.removeItem('sakhi_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('sakhi_user', JSON.stringify(user));
    else      localStorage.removeItem('sakhi_user');
  }, [user]);

  const login = async (phone, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { phone, password });
      setToken(data.token);
      setUser(data.user);
      return { success: true, role: data.user.role };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed',
        errorType: err.response?.data?.errorType || null,
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (form) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
