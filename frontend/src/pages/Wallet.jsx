import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function Wallet() {
  const [wallet, setWallet] = useState({ balance: 0, history: [] });
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState(50);

  useEffect(() => {
    API.get('/coins/wallet').then(({ data }) => setWallet(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const redeem = async () => {
    if (wallet.balance < redeemAmount) { toast.error('Itne coins nahi hain'); return; }
    setRedeeming(true);
    try {
      const { data } = await API.post('/coins/redeem', { coins: redeemAmount });
      setWallet(w => ({ ...w, balance: data.newBalance }));
      toast.success(data.message);
    } catch(err) { toast.error(err.response?.data?.message || 'Redeem failed'); }
    setRedeeming(false);
  };

  const rupees = Math.floor(wallet.balance / 10);

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 600 }}>
        <h1 style={{ fontSize: 34, fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>🪙 Mera Wallet</h1>
        <p style={{ color: '#7a5560', marginBottom: 24 }}>Booking karo, coins kamaao, discount pao!</p>

        {loading ? <div className="spinner" /> : (<>
          {/* Balance Card */}
          <div style={{ background: 'linear-gradient(135deg, #e8637a, #c94d65)', borderRadius: 20, padding: 28, color: '#fff', marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 8 }}>Aapke Coins</div>
            <div style={{ fontSize: 56, fontWeight: 800, fontFamily: "'Playfair Display',serif" }}>🪙 {wallet.balance}</div>
            <div style={{ fontSize: 16, opacity: 0.9, marginTop: 8 }}>= ₹{rupees} ki chhoot</div>
            <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 16px', fontSize: 13 }}>
              10 coins = ₹1 • Minimum 50 coins redeem kar sakte hain
            </div>
          </div>

          {/* Redeem */}
          {wallet.balance >= 50 && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", marginBottom: 14 }}>Coins Redeem Kariye</h3>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                <input type="range" min={50} max={Math.min(wallet.balance, 500)} step={10} value={redeemAmount} onChange={e => setRedeemAmount(Number(e.target.value))} style={{ flex: 1 }} />
                <span style={{ fontSize: 16, fontWeight: 700, color: '#e8637a', minWidth: 60 }}>{redeemAmount} coins</span>
              </div>
              <div style={{ fontSize: 13, color: '#7a5560', marginBottom: 14 }}>= ₹{Math.floor(redeemAmount / 10)} ki chhoot milegi!</div>
              <button onClick={redeem} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={redeeming}>{redeeming ? 'Redeem ho raha hai...' : `🪙 ${redeemAmount} Coins Redeem Kariye`}</button>
            </div>
          )}

          {/* Earn more */}
          <div style={{ background: '#fdf3e3', border: '1px solid #f0c060', borderRadius: 14, padding: 18, marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", marginBottom: 10 }}>Aur Coins Kamaaiye! 💰</h3>
            {[['📅 Booking kariye', 'Har ₹100 par 10 coins'], ['⭐ Review dijiye', '50 bonus coins'], ['👰 Bridal book kariye', 'Double coins!']].map(([t, d]) => (
              <div key={t} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5e8cc', fontSize: 14 }}>
                <span>{t}</span><span style={{ color: '#c9973a', fontWeight: 600 }}>{d}</span>
              </div>
            ))}
            <Link to="/services" className="btn btn-gold" style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>Booking Kariye →</Link>
          </div>

          {/* History */}
          {wallet.history?.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", marginBottom: 14 }}>Transaction History</h3>
              {wallet.history.slice(0, 10).map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0dde2', fontSize: 14 }}>
                  <div><div style={{ fontWeight: 600 }}>{h.reason}</div><div style={{ fontSize: 12, color: '#7a5560' }}>{new Date(h.date).toLocaleDateString('en-IN')}</div></div>
                  <div style={{ fontWeight: 700, color: h.amount > 0 ? '#2e7d32' : '#c62828' }}>{h.amount > 0 ? '+' : ''}{h.amount} 🪙</div>
                </div>
              ))}
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}
