// src/context/LangContext.jsx
// Hindi aur English dono bhashaaon ka support
import { createContext, useContext, useState, useEffect } from 'react';

const LangContext = createContext();

// ── Poora translation dictionary ─────────────────────────────
export const T = {
  // Navbar
  home:        { hi: 'Home',        en: 'Home' },
  services:    { hi: 'Services',    en: 'Services' },
  gallery:     { hi: 'Gallery',     en: 'Gallery' },
  offers:      { hi: 'Offers 🎉',  en: 'Offers 🎉' },
  reviews:     { hi: 'Reviews',     en: 'Reviews' },
  enquiry:     { hi: 'Enquiry',     en: 'Contact' },
  login:       { hi: 'Login',       en: 'Login' },
  register:    { hi: 'Register',    en: 'Register' },
  logout:      { hi: 'Logout',      en: 'Logout' },
  myProfile:   { hi: 'Meri Profile', en: 'My Profile' },
  myBookings:  { hi: 'Meri Bookings', en: 'My Bookings' },
  myWallet:    { hi: 'Mera Wallet', en: 'My Wallet' },
  notifications: { hi: 'Notifications', en: 'Notifications' },
  adminPanel:  { hi: 'Admin Panel', en: 'Admin Panel' },
  adminDashboard: { hi: 'Dashboard', en: 'Dashboard' },
  adminAddBooking: { hi: '+ Booking', en: '+ Booking' },
  adminBookings: { hi: 'Bookings', en: 'Bookings' },
  adminGallery: { hi: 'Posts', en: 'Posts' },
  adminOffers: { hi: 'Offers', en: 'Offers' },
  adminReviews: { hi: 'Reviews', en: 'Reviews' },
  adminEnquiries: { hi: 'Enquiries', en: 'Enquiries' },
  adminNotifications: { hi: 'Notify', en: 'Notify' },
  adminServices: { hi: 'Services', en: 'Services' },
  adminReports: { hi: 'Reports', en: 'Reports' },
  adminProfileLabel: { hi: 'Profile', en: 'Profile' },
  adminLinksTitle: { hi: 'Admin Links', en: 'Admin Links' },
  adminAccountTitle: { hi: 'Account', en: 'Account' },

  // Home Page
  heroTitle1:  { hi: 'Sundar Dikhiye,', en: 'Look Beautiful,' },
  heroTitle2:  { hi: 'Khoobsoorat Mahsoos Kariye', en: 'Feel Confident' },
  heroSub:     { hi: 'Smart Sakhi ke haathon se — Mehndi, Bridal, Facial, Silai, Hair Cutting\nGhar par bhi service milti hai!', en: 'Expert beauty services by Smart Sakhi — Mehndi, Bridal, Facial, Stitching, Hair Cutting\nHome service also available!' },
  heroBadge:   { hi: "Gorakhpur ki Trusted Beauty Parlour — 20+ Saal", en: "Gorakhpur's Trusted Beauty Parlour — 20+ Years" },
  browseBtn:   { hi: 'Services Dekhiye →', en: 'Browse Services →' },
  aboutBtn:    { hi: 'Hamare Baare Mein', en: 'About Us' },
  yearsExp:    { hi: 'Saal Ka Anubhav', en: 'Years Experience' },
  happyClients:{ hi: 'Khush Graahaak',  en: 'Happy Clients' },
  bridalLooks: { hi: 'Dulhan Sajaayi',  en: 'Bridal Looks' },
  ourServices: { hi: 'Hamari Services', en: 'Our Services' },
  seeAll:      { hi: 'Sab Dekhiye →',  en: 'See All →' },
  whyUs:       { hi: 'Hum Kyun Khaas Hain? 💕', en: 'Why Choose Us? 💕' },
  homeService: { hi: 'Ghar Par Service', en: 'Home Service' },
  homeServiceSub: { hi: 'Aapke ghar aate hain', en: 'We come to you' },
  premiumQuality: { hi: 'Premium Quality', en: 'Premium Quality' },
  premiumSub:  { hi: 'Behtareen products', en: 'Best products only' },
  starRating:  { hi: '5 Star Rating', en: '5 Star Rating' },
  starSub:     { hi: 'Khush graahaak', en: 'Happy clients' },
  latestPosts: { hi: 'Smart Sakhi ki Nayi Posts', en: 'Latest from Smart Sakhi' },
  activeOffers:{ hi: 'Aaj ke Khaas Offers 🎉', en: 'Today\'s Special Offers 🎉' },
  bookNow:     { hi: 'Book Kariye →', en: 'Book Now →' },
  viewAll:     { hi: 'Sab Dekhiye →', en: 'View All →' },
  testimonials:{ hi: 'Hamare Graahaak Kya Kehte Hain', en: 'What Our Clients Say' },

  // Services
  addToCart:   { hi: '+ Jodiye', en: '+ Add' },
  added:       { hi: '✓ Jod Diya', en: '✓ Added' },
  from:        { hi: 'se shuru', en: 'onwards' },
  duration:    { hi: 'samay', en: 'duration' },
  homeAvail:   { hi: '🏠 Ghar Par', en: '🏠 Home' },
  parlourAvail:{ hi: '🪑 Parlour', en: '🪑 Parlour' },

  // Cart
  yourCart:    { hi: 'Aapka Cart 🛒', en: 'Your Cart 🛒' },
  clearAll:    { hi: 'Sab Hatao', en: 'Clear All' },
  cartEmpty:   { hi: 'Cart khaali hai', en: 'Your cart is empty' },
  cartEmptySub:{ hi: 'Services add karein booking ke liye', en: 'Add services to get started' },
  total:       { hi: 'Kul Rakam', en: 'Total' },
  proceedBook: { hi: 'Booking Kariye →', en: 'Proceed to Booking →' },
  addMore:     { hi: '+ Aur services jodiye', en: '+ Add more services' },
  remove:      { hi: 'Hatao', en: 'Remove' },

  // Booking
  confirmBooking: { hi: 'Booking Confirm Kariye 📅', en: 'Confirm Booking 📅' },
  selectDate:  { hi: 'Tarikh Chuniye', en: 'Select Date' },
  selectTime:  { hi: 'Samay Chuniye', en: 'Select Time Slot' },
  serviceType: { hi: 'Service Ka Prakar', en: 'Service Type' },
  parlourVisit:{ hi: '🪑 Parlour Visit', en: '🪑 Parlour Visit' },
  homeVisit:   { hi: '🏠 Ghar Par Service', en: '🏠 Home Service' },
  paymentMode: { hi: 'Bhugtaan Ka Tarika', en: 'Payment Mode' },
  cash:        { hi: '💵 Naqdaa', en: '💵 Cash' },
  online:      { hi: '💳 Online', en: '💳 Online' },
  upi:         { hi: '📱 UPI', en: '📱 UPI' },
  advance:     { hi: '💰 Agrim Bhugtaan (₹)', en: '💰 Advance Payment (₹)' },
  notes:       { hi: 'Koi vishesh jaankari', en: 'Special notes' },
  confirmBtn:  { hi: 'Booking Confirm Kariye →', en: 'Confirm Booking →' },
  bookingConfirmed: { hi: 'Booking Ho Gayi!', en: 'Booking Confirmed!' },
  smsConfirm:  { hi: 'Confirmation SMS aapke phone par bheja gaya ✅', en: 'Confirmation SMS sent to your phone ✅' },
  homeNow:     { hi: 'Home par Jaiye', en: 'Go to Home' },

  // Reviews
  writeReview: { hi: 'Review Likhiye ✍️', en: 'Write a Review ✍️' },
  ratingLabel: { hi: 'Rating Dijiye *', en: 'Give Rating *' },
  yourName:    { hi: 'Aapka Naam', en: 'Your Name' },
  yourReview:  { hi: 'Aapka Review *', en: 'Your Review *' },
  reviewPlaceholder: { hi: 'Aapka anubhav kaisa raha...', en: 'Share your experience...' },
  submitReview:{ hi: 'Review Submit Kariye →', en: 'Submit Review →' },
  pendingApproval: { hi: 'Admin se approve hone ke baad show hoga', en: 'Will be shown after admin approval' },
  reviewSubmitted: { hi: 'Review submit ho gaya!', en: 'Review submitted!' },
  ratingWords: ['', 'Bahut bura 😞', 'Theek tha 😐', 'Accha laga 🙂', 'Bahut accha 😊', 'Zabardast! 🤩'],
  ratingWordsEn: ['', 'Very bad 😞', 'Okay 😐', 'Good 🙂', 'Very good 😊', 'Excellent! 🤩'],

  // About
  ourStory:    { hi: '🌸 Hamari Kahani', en: '🌸 Our Story' },
  aboutRanjana:{ hi: '👩 Smart Sakhi ke Baare Mein', en: '👩 About Smart Sakhi' },
  awards:      { hi: '🏆 Puraskar aur Pramaanpatra', en: '🏆 Awards & Certifications' },
  contact:     { hi: '📞 Sampark Kariye', en: '📞 Contact Us' },
  callNow:     { hi: '📞 Abhi Call Kariye', en: '📞 Call Now' },
  whatsapp:    { hi: '💬 WhatsApp Kariye', en: '💬 WhatsApp' },
  address:     { hi: 'Pata', en: 'Address' },
  phone:       { hi: 'Call / WhatsApp', en: 'Call / WhatsApp' },
  timings:     { hi: 'Kaam ke Ghante', en: 'Working Hours' },
  timingsVal:  { hi: 'Somvaar–Ravivar: 9 AM – 8 PM', en: 'Monday–Sunday: 9 AM – 8 PM' },
  homeServiceAvail: { hi: 'Ghar Par Service Uplabdh', en: 'Home Service Available' },
  homeServiceDesc:  { hi: 'Bridal, Mehndi aur khaas maukon par ghar aate hain', en: 'Available for Bridal, Mehndi & special occasions' },
  founderRole: { hi: 'Founder & Head Beautician', en: 'Founder & Head Beautician' },
  servingYears:{ hi: '20+ saalon se seva mein', en: 'Serving for 20+ years' },

  // Profile
  personalInfo:{ hi: 'Vyaktigat Jaankari', en: 'Personal Information' },
  fullName:    { hi: 'Poora Naam *', en: 'Full Name *' },
  phoneNum:    { hi: 'Phone', en: 'Phone' },
  email:       { hi: 'Email', en: 'Email' },
  myAddress:   { hi: 'Mera Pata', en: 'My Address' },
  city:        { hi: 'Sheher', en: 'City' },
  pincode:     { hi: 'PIN Code', en: 'Pincode' },
  saveProfile: { hi: '✅ Profile Bachaaiye', en: '✅ Save Profile' },
  security:    { hi: '🔒 Suraksha', en: '🔒 Security' },
  bankDetails: { hi: '🏦 Bank Details', en: '🏦 Bank Details' },
  language:    { hi: '🌐 Bhaasha', en: '🌐 Language' },
  selectLang:  { hi: 'Apni Bhaasha Chuniye', en: 'Select Language' },
  hindi:       { hi: 'हिंदी', en: 'Hindi' },
  english:     { hi: 'English', en: 'English' },
  langSaved:   { hi: 'Bhaasha badal gayi! ✅', en: 'Language changed! ✅' },

  // Wallet
  myCoins:     { hi: 'Aapke Coins', en: 'Your Coins' },
  coinsDiscount:{ hi: 'ki chhoot', en: 'discount' },
  redeemCoins: { hi: 'Coins Redeem Kariye', en: 'Redeem Coins' },
  earnMore:    { hi: 'Aur Coins Kamaaiye!', en: 'Earn More Coins!' },
  txnHistory:  { hi: 'Transaction History', en: 'Transaction History' },

  // Offers
  copyCode:    { hi: '📋 Copy Kariye', en: '📋 Copy Code' },
  copied:      { hi: '✓ Copy Ho Gaya!', en: '✓ Copied!' },
  daysLeft:    { hi: 'din baaki', en: 'days left' },
  offerExpired:{ hi: 'Aaj expire', en: 'Expires today' },
  howToUse:    { hi: 'Coupon Kaise Use Karein?', en: 'How to Use Coupon?' },
  minBooking:  { hi: 'Minimum booking:', en: 'Minimum booking:' },
  maxDiscount: { hi: 'Maximum discount:', en: 'Maximum discount:' },
  offersEmpty: { hi: 'Abhi koi offer nahi', en: 'No offers right now' },
  offersEmptySub: { hi: 'Jald nayi offers aayengi!', en: 'New offers coming soon!' },

  // Enquiry
  sendEnquiry: { hi: '📩 Enquiry Kariye', en: '📩 Send Enquiry' },
  enquirySub:  { hi: 'Koi bhi sawaal ho — hum jald jawab denge!', en: 'Any questions? We will reply soon!' },
  aboutService:{ hi: 'Kis Service Ke Baare Mein?', en: 'Which Service?' },
  yourMessage: { hi: 'Aapka Message *', en: 'Your Message *' },
  sendBtn:     { hi: '📩 Enquiry Bhejiye →', en: '📩 Send Enquiry →' },
  enquiryDone: { hi: 'Bahut Shukriya!', en: 'Thank You!' },
  enquiryDoneSub: { hi: 'Smart Sakhi jald sampark karegi!', en: 'Smart Sakhi will contact you soon!' },

  // General
  loading:     { hi: 'Load ho raha hai...', en: 'Loading...' },
  noData:      { hi: 'Koi data nahi', en: 'No data found' },
  save:        { hi: 'Bachaaiye', en: 'Save' },
  cancel:      { hi: 'Raddh Kariye', en: 'Cancel' },
  edit:        { hi: 'Badliye', en: 'Edit' },
  delete:      { hi: 'Mitaaiye', en: 'Delete' },
  confirm:     { hi: 'Pakka Kariye', en: 'Confirm' },
  submit:      { hi: 'Submit Kariye', en: 'Submit' },
  close:       { hi: 'Band Kariye', en: 'Close' },
  yes:         { hi: 'Haan', en: 'Yes' },
  no:          { hi: 'Nahi', en: 'No' },
  required:    { hi: 'zaroori', en: 'required' },
};

// ── Provider ──────────────────────────────────────────────────
export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('sakhi_lang') || 'en');

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('sakhi_lang', l);
  };

  // t() — translate karo
  const t = (key) => {
    if (!T[key]) return key;
    if (Array.isArray(T[key])) return T[key]; // arrays as-is
    return T[key][lang] || T[key]['hi'] || key;
  };

  return (
    <LangContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
