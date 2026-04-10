// src/api/axios.js — Axios instance with auth header injection
import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('sakhi_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sakhi_token');
      localStorage.removeItem('sakhi_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
