import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { LangProvider } from './context/LangContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LangProvider>
        <AuthProvider>
          <App />
          <Toaster position="top-center" toastOptions={{
            style: { fontFamily: "'Poppins', sans-serif", background: '#fff', color: '#3d1f28', border: '1px solid #f0dde2', borderRadius: '12px' },
            success: { iconTheme: { primary: '#e8637a', secondary: '#fff' } },
          }} />
        </AuthProvider>
      </LangProvider>
    </BrowserRouter>
  </React.StrictMode>
);
