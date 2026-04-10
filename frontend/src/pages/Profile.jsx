// src/pages/Profile.jsx — Complete Profile with tabs
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name:user?.name||'', email:user?.email||'', phone:user?.phone||'', address:user?.address||'', city:user?.city||'Gorakhpur', pincode:user?.pincode||'' });
  const [pass, setPass] = useState({ current:'', newPass:'', confirm:'' });
  const [bank, setBank] = useState({ accountName:user?.bankDetails?.accountName||'', accountNumber:user?.bankDetails?.accountNumber||'', ifscCode:user?.bankDetails?.ifscCode||'', bankName:user?.bankDetails?.bankName||'' });
  const [bookings, setBookings] = useState([]);

  useEffect(() => { API.get('/bookings/my').then(({data})=>setBookings(data.bookings)).catch(()=>{}); }, []);

  const saveProfile = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await API.put('/auth/profile', profile); toast.success('Profile update ho gaya! ✅'); localStorage.setItem('sakhi_user', JSON.stringify({...user,...profile})); }
    catch(err){ toast.error(err.response?.data?.message||'Update failed'); } setSaving(false);
  };
  const savePassword = async (e) => {
    e.preventDefault();
    if(pass.newPass!==pass.confirm){toast.error('Password match nahi karta');return;}
    if(pass.newPass.length<6){toast.error('Min 6 characters');return;}
    setSaving(true);
    try{ await API.put('/auth/password',{currentPassword:pass.current,newPassword:pass.newPass}); toast.success('Password change ho gaya!'); setPass({current:'',newPass:'',confirm:''}); }
    catch(err){ toast.error(err.response?.data?.message||'Failed'); } setSaving(false);
  };
  const saveBank = async(e) => {
    e.preventDefault(); setSaving(true);
    try{ await API.put('/auth/profile',{bankDetails:bank}); toast.success('Bank details save ho gayi!'); }
    catch(err){ toast.error('Save failed'); } setSaving(false);
  };

  const TABS=[{id:'profile',l:'👤 Profile'},{id:'security',l:'🔒 Security'},{id:'bank',l:'🏦 Bank'},{id:'bookings',l:`📅 Bookings (${bookings.length})`}];

  return (
    <div className="page">
      <div className="container" style={{maxWidth:720}}>
        <div style={s.avatarCard}>
          <div style={s.av}>{user?.name?.[0]?.toUpperCase()}</div>
          <div style={{flex:1}}>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,marginBottom:4}}>{user?.name}</h2>
            <p style={{fontSize:14,color:'#7a5560'}}>📱 {user?.phone||'Phone add karein'}</p>
            <div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap'}}>
              {user?.role==='admin'&&<span style={s.badge('#fdf3e3','#c9973a')}>⚙️ Admin</span>}
              {user?.isGoogleUser&&<span style={s.badge('#e3f2fd','#1565c0')}>🔍 Google</span>}
            </div>
          </div>
          <button onClick={()=>{logout();navigate('/');}} style={{background:'#fce4ec',color:'#c62828',border:'1px solid #ef9a9a',padding:'8px 14px',borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>🚪 Logout</button>
        </div>

        <div style={{display:'flex',gap:6,marginBottom:18,flexWrap:'wrap'}}>
          {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'8px 14px',border:'1.5px solid var(--border)',borderRadius:20,background:tab===t.id?'var(--rose)':'#fff',color:tab===t.id?'#fff':'var(--muted)',cursor:'pointer',fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>{t.l}</button>)}
        </div>

        {tab==='profile'&&(
          <div style={s.card}>
            <h3 style={s.ct}>Personal Information</h3>
            <form onSubmit={saveProfile}>
              <div style={{display:'flex',gap:14}}>
                <div className="form-group" style={{flex:1}}><label className="form-label">Full Name *</label><input className="form-input" value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} placeholder="Poora naam"/></div>
                <div className="form-group" style={{flex:1}}><label className="form-label">Phone</label><input className="form-input" value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} placeholder="10-digit" maxLength={10}/></div>
              </div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))} placeholder="your@email.com"/></div>
              <div className="form-group"><label className="form-label">Address</label><textarea className="form-input" rows={2} value={profile.address} onChange={e=>setProfile(p=>({...p,address:e.target.value}))} placeholder="Mohalla, colony..."/></div>
              <div style={{display:'flex',gap:14}}>
                <div className="form-group" style={{flex:2}}><label className="form-label">City</label><select className="form-input form-select" value={profile.city} onChange={e=>setProfile(p=>({...p,city:e.target.value}))}>{['Gorakhpur','Lucknow','Varanasi','Ayodhya','Prayagraj','Other'].map(c=><option key={c}>{c}</option>)}</select></div>
                <div className="form-group" style={{flex:1}}><label className="form-label">Pincode</label><input className="form-input" value={profile.pincode} onChange={e=>setProfile(p=>({...p,pincode:e.target.value}))} placeholder="273001" maxLength={6}/></div>
              </div>
              <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:14}} disabled={saving}>{saving?'Saving...':'✅ Save Profile'}</button>
            </form>
          </div>
        )}

        {tab==='security'&&(
          <div style={s.card}>
            <h3 style={s.ct}>Password Change Karo 🔒</h3>
            {user?.isGoogleUser?<div style={s.info}>🔍 Aap Google se login karte hain — Google account settings se password manage karein.</div>:(
              <form onSubmit={savePassword}>
                <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" value={pass.current} onChange={e=>setPass(p=>({...p,current:e.target.value}))} placeholder="Purana password"/></div>
                <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" value={pass.newPass} onChange={e=>setPass(p=>({...p,newPass:e.target.value}))} placeholder="Naya password (min 6)"/></div>
                <div className="form-group"><label className="form-label">Confirm Password</label><input className="form-input" type="password" value={pass.confirm} onChange={e=>setPass(p=>({...p,confirm:e.target.value}))} placeholder="Dobara naya password"/>{pass.confirm&&pass.newPass!==pass.confirm&&<p style={{color:'#c62828',fontSize:12,marginTop:4}}>❌ Match nahi karta</p>}</div>
                <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:14}} disabled={saving}>{saving?'Saving...':'🔒 Password Change Karo'}</button>
              </form>
            )}
          </div>
        )}

        {tab==='bank'&&(
          <div style={s.card}>
            <h3 style={s.ct}>Bank Details 🏦</h3>
            <div style={s.info}>Optional — refund ya payment receive karne ke liye.</div>
            <form onSubmit={saveBank}>
              <div className="form-group"><label className="form-label">Account Holder Name</label><input className="form-input" value={bank.accountName} onChange={e=>setBank(b=>({...b,accountName:e.target.value}))} placeholder="Jaise passbook par likha hai"/></div>
              <div className="form-group"><label className="form-label">Account Number</label><input className="form-input" value={bank.accountNumber} onChange={e=>setBank(b=>({...b,accountNumber:e.target.value}))} placeholder="Bank account number"/></div>
              <div style={{display:'flex',gap:14}}>
                <div className="form-group" style={{flex:1}}><label className="form-label">IFSC Code</label><input className="form-input" value={bank.ifscCode} onChange={e=>setBank(b=>({...b,ifscCode:e.target.value.toUpperCase()}))} placeholder="SBIN0001234"/></div>
                <div className="form-group" style={{flex:1}}><label className="form-label">Bank Name</label><input className="form-input" value={bank.bankName} onChange={e=>setBank(b=>({...b,bankName:e.target.value}))} placeholder="SBI, HDFC..."/></div>
              </div>
              <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:14}} disabled={saving}>{saving?'Saving...':'🏦 Bank Details Save Karo'}</button>
            </form>
          </div>
        )}

        {tab==='bookings'&&(
          <div>{bookings.length===0?(<div className="empty-state"><div className="icon">📅</div><h3>Koi booking nahi</h3><Link to="/services" className="btn btn-primary" style={{marginTop:20}}>Services Dekho</Link></div>):bookings.map(b=>(
            <div key={b._id} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'16px 20px',marginBottom:12}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div><div style={{fontWeight:600,fontSize:15}}>📅 {new Date(b.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div><div style={{fontSize:13,color:'#7a5560',marginTop:2}}>{b.timeSlot} • {b.bookingType==='home'?'🏠 Home':'🪑 Parlour'}</div></div>
                <span style={{padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:700,background:b.status==='completed'?'#e8f5e9':b.status==='cancelled'?'#fce4ec':'#fff8e1',color:b.status==='completed'?'#2e7d32':b.status==='cancelled'?'#c62828':'#f57c00'}}>{b.status}</span>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:10}}>{b.services.map((sv,i)=><span key={i} style={{background:'#fce8ec',color:'#c94d65',padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:500}}>{sv.name}</span>)}</div>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:10,borderTop:'1px solid var(--border)',paddingTop:10}}>
                <span style={{fontSize:13,color:'#7a5560'}}>Paid: ₹{b.advancePaid}{b.remainingAmount>0&&<span style={{color:'#f57c00'}}> • Due: ₹{b.remainingAmount}</span>}</span>
                <span style={{fontSize:18,fontWeight:700,color:'var(--rose)'}}>₹{b.totalAmount}</span>
              </div>
            </div>
          ))}</div>
        )}
      </div>
    </div>
  );
}

const s={
  avatarCard:{background:'#fff',border:'1px solid var(--border)',borderRadius:16,padding:'20px 24px',display:'flex',alignItems:'center',gap:18,marginBottom:20},
  av:{width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,#e8637a,#c94d65)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,fontWeight:700,flexShrink:0},
  card:{background:'#fff',border:'1px solid var(--border)',borderRadius:16,padding:'24px 28px',boxShadow:'0 2px 12px rgba(232,99,122,0.08)'},
  ct:{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:20},
  info:{background:'#e3f2fd',border:'1px solid #90caf9',borderRadius:8,padding:'10px 14px',fontSize:13,color:'#1565c0',marginBottom:16},
  badge:(bg,c)=>({background:bg,color:c,padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:700}),
};

// Language tab add karo Profile mein — user already has tabs system
// In Profile.jsx TABS array add: { id:'language', l:'🌐 Bhaasha / Language' }
// Then add tab content:
// {tab === 'language' && <LanguageTab />}
