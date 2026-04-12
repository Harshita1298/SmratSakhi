// src/pages/admin/Dashboard.jsx — Reviews, Offers, Posts sab dikhengi yahan
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LangText from '../../components/LangText';
import { useLang } from '../../context/LangContext';
import API from '../../api/axios';

const SC = { pending:'#f57c00', confirmed:'#2e7d32', 'in-progress':'#7b1fa2', completed:'#1565c0', cancelled:'#c62828' };
const SB = { pending:'#fff8e1', confirmed:'#e8f5e9', 'in-progress':'#f3e5f5', completed:'#e3f2fd', cancelled:'#fce4ec' };

const adminNavItems = [
  { to: '/admin', icon: '📊', labelHi: 'Dashboard', labelEn: 'Dashboard' },
  { to: '/admin/add-booking', icon: '📝', labelHi: 'Booking', labelEn: 'Booking' },
  { to: '/admin/bookings', icon: '📋', labelHi: 'Bookings', labelEn: 'Bookings' },
  { to: '/admin/gallery', icon: '📸', labelHi: 'Posts', labelEn: 'Posts' },
  { to: '/admin/offers', icon: '🎉', labelHi: 'Offers', labelEn: 'Offers' },
  { to: '/admin/reviews', icon: '⭐', labelHi: 'Reviews', labelEn: 'Reviews' },
  { to: '/admin/enquiries', icon: '📩', labelHi: 'Enquiries', labelEn: 'Enquiries' },
  { to: '/admin/notifications', icon: '🔔', labelHi: 'Notify', labelEn: 'Notify' },
  { to: '/admin/services', icon: '💄', labelHi: 'Services', labelEn: 'Services' },
  { to: '/admin/reports', icon: '📈', labelHi: 'Reports', labelEn: 'Reports' },
];

export default function Dashboard() {
  const { lang, changeLang } = useLang();
  const location = useLocation();
  const [stats, setStats]   = useState(null);
  const [books, setBooks]   = useState([]);
  const [revs, setRevs]     = useState([]);
  const [offers, setOffers] = useState([]);
  const [posts, setPosts]   = useState([]);
  const [enqs, setEnqs]     = useState([]);
  const [load, setLoad]     = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/admin/stats'),
      API.get('/admin/bookings?limit=5'),
      API.get('/reviews/admin?status=pending'),
      API.get('/offers'),
      API.get('/gallery?limit=4'),
      API.get('/enquiries/admin?status=new'),
    ]).then(([s,b,r,o,g,e]) => {
      setStats(s.data.stats);
      setBooks(b.data.bookings);
      setRevs(r.data.reviews);
      setOffers(o.data.offers);
      setPosts(g.data.items);
      setEnqs(e.data.enquiries);
    }).catch(()=>{}).finally(()=>setLoad(false));
  }, []);

  const hi = (h,en) => lang==='hi'?h:en;

  if(load) return <div className="page"><div className="spinner"/></div>;

  const statCards = stats ? [
    { l:hi("Aaj ki Bookings","Today's Bookings"), v:stats.todayBookings, i:'📅', c:'#e8637a' },
    { l:hi("Aaj ki Kamaai","Today's Revenue"),   v:`₹${stats.todayRevenue||0}`, i:'💰', c:'#c9973a' },
    { l:hi("Kul Bookings","Total Bookings"),      v:stats.totalBookings,  i:'📋', c:'#7b1fa2' },
    { l:hi("Kul Kamaai","Total Revenue"),         v:`₹${(stats.totalRevenue||0).toLocaleString('en-IN')}`, i:'💵', c:'#2e7d32' },
    { l:hi("Graahaak","Customers"),               v:stats.totalUsers,     i:'👥', c:'#1565c0' },
    { l:hi("Services","Services"),                v:stats.totalServices,  i:'💄', c:'#e65100' },
  ] : [];

  const approve = async (id) => {
    await API.put(`/reviews/admin/${id}/approve`);
    setRevs(p=>p.filter(x=>x._id!==id));
  };
  const reject = async (id) => {
    await API.put(`/reviews/admin/${id}/reject`,{adminNote:''});
    setRevs(p=>p.filter(x=>x._id!==id));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="page">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__header">
            <div style={sx.sidebarTitle}>Smart Sakhi</div>
            <p style={sx.sidebarSubtitle}>{lang === 'hi' ? 'Admin Panel' : 'Admin Panel'}</p>
          </div>
          <div className="admin-sidebar__nav">
            {adminNavItems.map(nav => (
              <Link
                key={nav.to}
                to={nav.to}
                className={`admin-sidebar__link ${isActive(nav.to) ? 'active' : ''}`}
              >
                <span style={{ marginRight: 6 }}>{nav.icon}</span>
                <LangText hi={nav.labelHi} en={nav.labelEn} />
              </Link>
            ))}
          </div>
        </aside>
        <div className="admin-layout__content">
          <div className="container" style={{maxWidth:1200}}>
            <div className="admin-header">
              <div>
                <p className="admin-header__brand">Sakhi Beauty Parlour</p>
                <h1 style={{fontSize:26,fontFamily:"'Playfair Display',serif"}}>{hi('Dashboard 👋','Dashboard 👋')}</h1>
                <p style={{fontSize:13,color:'#7a5560'}}>{hi('Namaste Smart Sakhi! Aaj ka poora overview.','Welcome Smart Sakhi! Here is today\'s complete overview.')}</p>
              </div>
              <div className="admin-header-actions">
                <div className="lang-switcher">
                  <span className="lang-switcher__label"><LangText hi="भाषा" en="Language" /></span>
                  {[
                    { value: 'en', label: <LangText hi="अंग्रेज़ी" en="English" /> },
                    { value: 'hi', label: <LangText hi="हिंदी" en="Hindi" /> },
                  ].map(opt=>(
                    <button
                      key={opt.value}
                      type="button"
                      className={`lang-switcher__btn ${lang===opt.value?'active':''}`}
                      onClick={()=>opt.value!==lang && changeLang(opt.value)}
                      aria-pressed={lang===opt.value}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <Link to="/profile" className="btn btn-outline btn-sm">
                  <LangText hi="उपयोगकर्ता खाते" en="User Account" />
                </Link>
                <Link to="/admin/add-booking" className="btn btn-primary" style={{fontSize:13}}>+ {hi('Booking Jodiye','Add Booking')}</Link>
              </div>
            </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:10,marginBottom:14}}>
          {statCards.map(sc=>(
            <div key={sc.l} style={{background:'#fff',border:'1px solid #f0dde2',borderRadius:12,padding:'12px 8px',textAlign:'center'}}>
              <div style={{width:34,height:34,borderRadius:9,background:sc.c+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,margin:'0 auto 7px'}}>{sc.i}</div>
              <div style={{fontSize:19,fontWeight:700,color:sc.c,fontFamily:"'Playfair Display',serif",marginBottom:2}}>{sc.v??'—'}</div>
              <div style={{fontSize:9,color:'#7a5560'}}>{sc.l}</div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
          {revs.length>0&&(
            <Link to="/admin/reviews" style={{flex:1,minWidth:200,display:'flex',alignItems:'center',gap:10,background:'#fff8e1',border:'1px solid #f0c060',borderRadius:12,padding:'11px 14px',textDecoration:'none'}}>
              <span style={{fontSize:18}}>⭐</span>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:'#8a6400'}}>{revs.length} {hi('reviews approve kariye','reviews need approval')}</div><div style={{fontSize:11,color:'#a07800'}}>{hi('Dashboard se approve/reject kariye','Approve or reject below')}</div></div>
              <span style={{color:'#f57c00',fontWeight:700}}>→</span>
            </Link>
          )}
          {enqs.length>0&&(
            <Link to="/admin/enquiries" style={{flex:1,minWidth:200,display:'flex',alignItems:'center',gap:10,background:'#e3f2fd',border:'1px solid #90caf9',borderRadius:12,padding:'11px 14px',textDecoration:'none'}}>
              <span style={{fontSize:18}}>📩</span>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:'#1565c0'}}>{enqs.length} {hi('nayi enquiry','new enquiries')}</div></div>
              <span style={{color:'#1565c0',fontWeight:700}}>→</span>
            </Link>
          )}
        </div>

        {/* Two Column Layout */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>

          {/* LEFT */}
          <div>
            {/* Bookings */}
            <div style={sx.sec}>
              <div style={sx.secH}><span style={sx.secT}>📋 {hi('Haal ki Bookings','Recent Bookings')}</span><Link to="/admin/bookings" style={sx.all}>{hi('Sab →','All →')}</Link></div>
              {books.length===0?<p style={sx.empty}>{hi('Koi booking nahi','No bookings')}</p>:books.map(b=>(
                <div key={b._id} style={sx.row}>
                  <div style={sx.av}>{b.customerName?.[0]?.toUpperCase()}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={sx.nm}>{b.customerName}</div>
                    <div style={sx.mt} className="text-ellipsis">{b.services.map(sv=>sv.name).join(', ')}</div>
                    <div style={sx.mt}>📅 {new Date(b.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}{b.timeSlot?` • ${b.timeSlot}`:''}</div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:'#e8637a'}}>₹{b.totalAmount}</div>
                    <span style={{padding:'2px 7px',borderRadius:20,fontSize:9,fontWeight:700,background:SB[b.status]||'#fafafa',color:SC[b.status]||'#666'}}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Reviews */}
            <div style={sx.sec}>
              <div style={sx.secH}><span style={sx.secT}>⭐ {hi('Reviews Approve Kariye','Approve Reviews')}</span><Link to="/admin/reviews" style={sx.all}>{hi('Sab →','All →')}</Link></div>
              {revs.length===0
                ?<div style={{textAlign:'center',padding:'12px 0'}}><div style={{fontSize:28,marginBottom:6}}>✅</div><p style={sx.empty}>{hi('Koi pending review nahi!','No pending reviews!')}</p></div>
                :revs.slice(0,3).map(r=>(
                  <div key={r._id} style={sx.row}>
                    <div style={{...sx.av,fontSize:12}}>{r.avatarLetter||r.customerName?.[0]?.toUpperCase()}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={sx.nm}>{r.customerName}</div>
                      <div style={{fontSize:11,color:'#f59e0b'}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                      <div style={{...sx.mt,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.comment}</div>
                    </div>
                    <div style={{display:'flex',gap:4,flexShrink:0}}>
                      <button onClick={()=>approve(r._id)} style={{width:28,height:28,background:'#e8f5e9',border:'none',borderRadius:7,cursor:'pointer',fontSize:13}}>✅</button>
                      <button onClick={()=>reject(r._id)} style={{width:28,height:28,background:'#fce4ec',border:'none',borderRadius:7,cursor:'pointer',fontSize:13}}>❌</button>
                    </div>
                  </div>
              ))}
            </div>

            {/* Enquiries */}
            {enqs.length>0&&(
              <div style={sx.sec}>
                <div style={sx.secH}><span style={sx.secT}>📩 {hi('Enquiries','Enquiries')}</span><Link to="/admin/enquiries" style={sx.all}>{hi('Sab →','All →')}</Link></div>
                {enqs.slice(0,2).map(e=>(
                  <div key={e._id} style={sx.row}>
                    <div style={{...sx.av,background:'#1565c0'}}>{e.name[0].toUpperCase()}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={sx.nm}>{e.name} <span style={sx.mt}>📱 {e.phone}</span></div>
                      {e.service&&<span style={{background:'#fce8ec',color:'#c94d65',fontSize:10,fontWeight:600,padding:'1px 6px',borderRadius:20}}>{e.service}</span>}
                      <div style={{...sx.mt,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.message}</div>
                    </div>
                    <Link to="/admin/enquiries" style={{background:'#e3f2fd',color:'#1565c0',fontSize:11,fontWeight:600,padding:'5px 9px',borderRadius:7,textDecoration:'none',flexShrink:0}}>{hi('Reply','Reply')}</Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div>
            {/* Active Offers */}
            <div style={sx.sec}>
              <div style={sx.secH}><span style={sx.secT}>🎉 {hi('Active Offers','Active Offers')}</span><Link to="/admin/offers" style={sx.all}>{hi('Manage →','Manage →')}</Link></div>
              {offers.length===0?(
                <div style={{textAlign:'center',padding:'14px 0'}}>
                  <div style={{fontSize:32,marginBottom:8}}>🎉</div>
                  <p style={sx.empty}>{hi('Koi offer nahi — banayiye!','No offers — create one!')}</p>
                  <Link to="/admin/offers" className="btn btn-primary btn-sm" style={{fontSize:12}}>+ {hi('Nayi Offer','Create Offer')}</Link>
                </div>
              ):offers.map(o=>(
                <div key={o._id} style={{...sx.row,paddingLeft:8,borderLeft:`3px solid ${o.bannerColor}`}}>
                  <span style={{fontSize:20,flexShrink:0}}>{o.emoji}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={sx.nm}>{o.title}</div>
                    <div style={sx.mt}>{o.couponCode&&<span style={{fontFamily:'monospace',fontWeight:700,color:o.bannerColor}}>{o.couponCode}</span>} • {o.discountType==='percent'?`${o.discountValue}% off`:`₹${o.discountValue} off`}</div>
                    <div style={{fontSize:10,color:'#2e7d32',fontWeight:600}}>✅ Active</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Posts */}
            <div style={sx.sec}>
              <div style={sx.secH}><span style={sx.secT}>📸 {hi('Haal ki Posts','Recent Posts')}</span><Link to="/admin/gallery" style={sx.all}>{hi('Manage →','Manage →')}</Link></div>
              {posts.length===0?(
                <div style={{textAlign:'center',padding:'14px 0'}}>
                  <div style={{fontSize:32,marginBottom:8}}>📸</div>
                  <p style={sx.empty}>{hi('Koi post nahi — Insta jaisi post kariye!','No posts — post like Instagram!')}</p>
                  <Link to="/admin/gallery" className="btn btn-primary btn-sm" style={{fontSize:12}}>+ {hi('Pehli Post','Add First Post')}</Link>
                </div>
              ):(
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
                  {posts.map(p=>(
                    <div key={p._id} style={{position:'relative',borderRadius:10,overflow:'hidden',height:90}}>
                      <img src={p.imageUrl} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.background='#fce8ec';}} />
                      <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,0.65),transparent)',display:'flex',alignItems:'flex-end',padding:'5px 7px'}}>
                        <span style={{color:'#fff',fontSize:9,fontWeight:600,lineHeight:1.2}}>{p.title}</span>
                      </div>
                      {p.type==='reel'&&<div style={{position:'absolute',top:5,right:5,background:'rgba(0,0,0,0.65)',color:'#fff',fontSize:8,padding:'1px 5px',borderRadius:4}}>▶ Reel</div>}
                      <div style={{position:'absolute',top:5,left:5,background:'rgba(0,0,0,0.55)',color:'#fff',fontSize:8,padding:'1px 5px',borderRadius:4}}>♥ {p.likes}</div>
                    </div>
                  ))}
                </div>
              )}
              <Link to="/admin/gallery" className="btn btn-outline btn-sm" style={{width:'100%',justifyContent:'center',fontSize:12}}>📸 {hi('Nayi Post / Reel Kariye','Add New Post / Reel')}</Link>
            </div>

            {/* Quick Actions */}
            <div style={sx.sec}>
              <div style={{...sx.secT,marginBottom:10}}>{hi('Quick Kaam','Quick Actions')}</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:7}}>
                {[
                  {to:'/admin/add-booking',  i:'📝',l:hi('Booking','Booking')},
                  {to:'/admin/gallery',       i:'📸',l:hi('Post','Post')},
                  {to:'/admin/offers',        i:'🎉',l:hi('Offer','Offer')},
                  {to:'/admin/notifications', i:'🔔',l:hi('Notify','Notify')},
                  {to:'/admin/services',      i:'💄',l:hi('Service','Service')},
                  {to:'/admin/profile',       i:'👤',l:hi('Profile','Profile')},
                ].map(q=>(
                  <Link key={q.to} to={q.to} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,background:'#fafafa',border:'1px solid #f0dde2',borderRadius:10,padding:'10px 6px',textDecoration:'none',color:'#1a0a0f'}}>
                    <span style={{fontSize:18}}>{q.i}</span>
                    <span style={{fontSize:10,fontWeight:600}}>{q.l}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

const sx = {
  sec:  { background:'#fff', border:'1px solid #f0dde2', borderRadius:12, padding:'14px', marginBottom:14 },
  secH: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  secT: { fontSize:13, fontWeight:700, color:'#1a0a0f' },
  all:  { fontSize:11, color:'#e8637a', fontWeight:600, textDecoration:'none' },
  empty:{ fontSize:12, color:'#7a5560', textAlign:'center' },
  row:  { display:'flex', gap:8, alignItems:'flex-start', padding:'8px 0', borderBottom:'1px solid #fafafa' },
  av:   { width:32, height:32, borderRadius:'50%', background:'#e8637a', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, flexShrink:0 },
  nm:   { fontSize:12, fontWeight:700, color:'#1a0a0f' },
  mt:   { fontSize:10, color:'#7a5560', marginTop:1 },
  sidebarTitle: { fontSize:18, fontWeight:700, color:'#1a0a0f' },
  sidebarSubtitle: { fontSize:11, color:'#7a5560', marginTop:2 },
};
