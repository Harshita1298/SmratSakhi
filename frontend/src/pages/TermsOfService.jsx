// frontend/src/pages/TermsOfService.jsx
export default function TermsOfService() {
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 760 }}>
        <div style={s.header}>
          <h1 style={s.title}>Terms of Service</h1>
          <p style={s.sub}>Smart Sakhi App — Sakhi Beauty Parlour</p>
          <p style={s.date}>Effective Date: January 1, 2025</p>
        </div>

        {[
          { title: '1. App Ka Istemal', content: `Smart Sakhi App ko use karke aap ye terms accept karte hain. Ye app Sakhi Beauty Parlour, Gorakhpur ke beauty services book karne ke liye hai. App ka galat istemal karna (jaise fake bookings, spam) mana hai.` },
          { title: '2. Account Responsibility', content: `Aapka account sirf aapka hai. Apna password kisi ko mat batayein. Agar koi aapka account misuse kare, hume turant batayein. Sab account activity aapki responsibility hai.` },
          { title: '3. Booking Policy', content: `Booking karne ke baad:\n• Confirmation SMS aayegi\n• Cancellation — appointment se 2 ghante pehle kar sakte hain\n• Last minute cancellation (1 ghante ke andar) par advance refund nahi hoga\n• No-show par advance refund nahi hoga\n• Parlour 15 minute se zyada late hone par full refund milega` },
          { title: '4. Payment Policy', content: `• Online payment 100% secure — Razorpay se process hoti hai\n• Cash payment parlour mein ya home service par\n• Advance payment — booking confirm hone par hi liya jaata hai\n• Refund 5-7 business days mein bank account mein aata hai\n• Razorpay charges (if any) refundable nahi hain` },
          { title: '5. Service Quality', content: `Hum best quality dene ki koshish karte hain. Agar koi service se santushti nahi hai:\n• Same din batayein — hum resolve karenge\n• Valid complaint par free re-service ya partial refund milega\n• Results vary kar sakte hain — individual skin type ke anusar` },
          { title: '6. Reviews', content: `Reviews submit karte samay:\n• Sacchi aur apni experience share karein\n• Doosron ke baare mein galat ya hateful content mat likhein\n• Admin ko review approve ya reject karne ka adhikar hai\n• Fake reviews account ban ka reason ban sakta hai` },
          { title: '7. Liability', content: `Sakhi Beauty Parlour responsible nahi hai:\n• Products se allergic reactions (please pehle batayein)\n• Expectations jo realistic nahi hain\n• Third party payment issues\n• App downtime ya technical issues` },
          { title: '8. Terms Change', content: `Hum ye terms badal sakte hain. Bade changes mein notification milegi. App use karte rehna = nai terms accept karna.` },
          { title: '9. Governing Law', content: `Ye agreement Indian law ke anusar hoga. Kisi bhi dispute ko Gorakhpur, UP courts mein resolve kiya jaayega.` },
          { title: '10. Contact', content: `Sakhi Beauty Parlour\nJaitpur, Khajni Road, Gorakhpur, UP 273001\nPhone: +91 9936657399\nMon–Sun: 9 AM – 8 PM` },
        ].map((s2, i) => (
          <div key={i} style={s.section}>
            <h2 style={s.sectionTitle}>{s2.title}</h2>
            <p style={s.sectionText}>{s2.content}</p>
          </div>
        ))}

        <div style={s.footer}>© 2025 Sakhi Beauty Parlour. All rights reserved.</div>
      </div>
    </div>
  );
}
const s = {
  header:{ marginBottom:32, paddingBottom:20, borderBottom:'1px solid var(--border)' },
  title:{ fontSize:36, fontFamily:"'Playfair Display',serif", marginBottom:8 },
  sub:{ color:'var(--rose)', fontWeight:600, marginBottom:4 },
  date:{ color:'var(--muted)', fontSize:13 },
  section:{ marginBottom:28, paddingBottom:28, borderBottom:'1px solid var(--border)' },
  sectionTitle:{ fontSize:20, fontFamily:"'Playfair Display',serif", marginBottom:10 },
  sectionText:{ fontSize:14, color:'var(--muted)', lineHeight:1.8, whiteSpace:'pre-line' },
  footer:{ textAlign:'center', padding:'20px 0', color:'var(--muted)', fontSize:13 },
};
