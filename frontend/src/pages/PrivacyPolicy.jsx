// frontend/src/pages/PrivacyPolicy.jsx
export default function PrivacyPolicy() {
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 760 }}>
        <div style={s.header}>
          <h1 style={s.title}>Privacy Policy</h1>
          <p style={s.sub}>Sakhi Beauty Parlour — Smart Sakhi App</p>
          <p style={s.date}>Last updated: January 1, 2025</p>
        </div>

        {[
          {
            title: '1. Hamari App Kaun Chalati Hai?',
            content: `Smart Sakhi App ko Sakhi Beauty Parlour, Jaitpur, Khajni Road, Gorakhpur, Uttar Pradesh chalati hai. Ranjana Ji is app ki owner hain. Kisi bhi sawaal ke liye humse contact karein: +91 9936657399.`
          },
          {
            title: '2. Hum Kaun Si Information Lete Hain?',
            content: `Hum ye information lete hain:
• Aapka naam, phone number aur email address
• Aapka address (home service ke liye)
• Booking history aur service preferences
• Payment information (Razorpay se process hota hai — hum card details store nahi karte)
• Google account info (agar aap Google se login karte hain)
• App usage data (crash reports, performance)`
          },
          {
            title: '3. Hum Ye Information Kyun Lete Hain?',
            content: `Ye information humein zaroorat hai:
• Aapki beauty service bookings confirm karne ke liye
• Home service ke liye aapka address jaanne ke liye
• Payment process karne ke liye
• Booking confirmation SMS/notification bhejne ke liye
• App improve karne ke liye
• Aapki review publish karne ke liye (approval ke baad)`
          },
          {
            title: '4. Aapki Information Kisi Ko Di Jaati Hai?',
            content: `Hum aapki personal information KABHI BHI kisi third party ko bechte nahi hain.

Hum sirf in companies ke saath share karte hain:
• Razorpay — payment process karne ke liye (unki privacy policy: razorpay.com/privacy)
• Google — agar aap Google se login karte hain
• Firebase — push notifications ke liye (optional)

Ye sab companies internationally recognized privacy standards follow karti hain.`
          },
          {
            title: '5. Aapka Data Kitna Safe Hai?',
            content: `Hum aapki information protect karne ke liye:
• JWT tokens se secure authentication
• HTTPS encrypted connections
• MongoDB Atlas secure cloud storage (India/Singapore servers)
• Passwords bcrypt hashing se encrypt hain
• Admin panel sirf authorized persons ke liye

Koi bhi system 100% secure nahi hota — agar koi issue ho to hume turant batayein.`
          },
          {
            title: '6. Aapke Adhikar (Your Rights)',
            content: `Aap ye kar sakte hain kabhi bhi:
• Apni profile information update kar sakte hain (Profile tab se)
• Apna account delete karwa sakte hain (humse contact karke)
• Apna data export karwa sakte hain
• Marketing messages se opt-out kar sakte hain
• Koi bhi stored data ke baare mein jaankari le sakte hain`
          },
          {
            title: '7. Bachon Ki Privacy',
            content: `Hamari app 13 saal se kam umra ke bachon ke liye nahi hai. Hum jaante bujhte 13 saal se kam umra ke bachon ka data collect nahi karte. Agar aapko lagta hai kisi bachche ne account banaya hai, to please humse contact karein.`
          },
          {
            title: '8. Cookies aur App Permissions',
            content: `Hamari app ye permissions maang sakti hai:
• Camera — profile photo ke liye (optional)
• Notifications — booking reminders ke liye (optional, hamesha off kar sakte hain)
• Internet — app chalane ke liye (zaroori)

Hum location permission nahi lete. Home service ke liye aap address manually type karte hain.`
          },
          {
            title: '9. Policy Mein Changes',
            content: `Agar hum is policy mein koi bada change karte hain, to hum:
• App mein notification bhejenge
• Is page par "Last updated" date update karenge

App use karte rehna = nai policy se agreement.`
          },
          {
            title: '10. Humse Contact Karein',
            content: `Koi bhi sawaal ya complaint ke liye:

Sakhi Beauty Parlour
Jaitpur, Khajni Road, Gorakhpur, UP - 273001
Phone/WhatsApp: +91 9936657399
Working Hours: Monday-Sunday, 9 AM - 8 PM`
          },
        ].map((section, i) => (
          <div key={i} style={s.section}>
            <h2 style={s.sectionTitle}>{section.title}</h2>
            <p style={s.sectionText}>{section.content}</p>
          </div>
        ))}

        <div style={s.footer}>
          <p>© 2025 Sakhi Beauty Parlour, Gorakhpur. Sab adhikar surakshit hain.</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  header:      { marginBottom: 32, paddingBottom: 20, borderBottom: '1px solid var(--border)' },
  title:       { fontSize: 36, fontFamily: "'Playfair Display', serif", marginBottom: 8 },
  sub:         { color: 'var(--rose)', fontWeight: 600, marginBottom: 4 },
  date:        { color: 'var(--muted)', fontSize: 13 },
  section:     { marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid var(--border)' },
  sectionTitle:{ fontSize: 20, fontFamily: "'Playfair Display', serif", marginBottom: 10, color: '#1a0a0f' },
  sectionText: { fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, whiteSpace: 'pre-line' },
  footer:      { textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: 13 },
};
