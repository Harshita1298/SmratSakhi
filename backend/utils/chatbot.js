// Sakhi Beauty — AI Chatbot (Poori Hindi + English)
const isHindi = (m) => /[\u0900-\u097F]/.test(m) || /(kya|hai|kaise|karo|chahiye|kitna|kab|kahan|ghar|bata|hoga|nahi|bhi|aur|meri|mera|aap|accha|theek|shukriya|namaste|haan|yaar|bhai|didi|ji|mere|teri|unka|wali|wala)/.test(m.toLowerCase());

const R = {
  hi: {
    greet: '🌸 Namaste! Main hoon Sakhi — aapki beauty assistant!\n\nMujhse ye sab poochh sakti hain:\n💆 Facial services\n👰 Bridal makeup\n🌿 Mehndi\n🧵 Silai\n✂️ Baal kataai\n🎉 Offers aur chhoot\n💰 Prices\n📅 Booking\n🏠 Ghar par service\n🪙 Loyalty coins\n\nKaise help karoon? 😊',
    facial: '💆 Facial Services:\n• Basic Cleanup — ₹299 (45 min)\n• Fruit Facial — ₹499 (1 ghanta)\n• D-Tan — ₹399 (1 ghanta)\n• Gold Facial — ₹799 (1.5 ghanta)\n• Anti-Ageing — ₹999 (1.5 ghanta)\n\n🏠 Ghar par bhi available!\nKaunsa facial chahiye? 😊',
    bridal: '👰 Bridal Packages:\n• Engagement Makeup — ₹1999\n• Bridal Makeup Basic — ₹3999\n• Bridal HD Premium — ₹6999\n• Full Bridal Package — ₹9999\n• Party Makeup — ₹999\n\n💍 Sab packages mein ghar par service!\nShaadi mubarak ho! 🎉',
    mehndi: '🌿 Mehndi Services:\n• Simple Mehndi — ₹299\n• Arabic Design — ₹799\n• Bridal Mehndi — ₹1499\n• Pairon ki Mehndi — ₹399\n\n🏠 Artist aapke ghar aayengi!\nKaunsa design chahiye? 🌸',
    silai: '🧵 Silai Services:\n• Blouse Silai — ₹299 (3 din)\n• Salwar Suit — ₹499 (4 din)\n• Lehenga Blouse — ₹599 (5 din)\n• Alteration — ₹99 (2 din)\n\nApna kapda laaiye ya hum source karenge!',
    hair: '✂️ Baal Kataai Services:\n• Simple Cut — ₹150 (30 min)\n• Styling Cut — ₹299 (45 min)\n• Trimming — ₹99 (20 min)\n• Hair Wash + Blow Dry — ₹199\n• Smoothening — ₹1499\n• Mehndi Rangaai — ₹299\n\n🏠 Ghar par bhi available!',
    price: '💰 Prices:\n💆 Facial — ₹299 se ₹999\n👰 Bridal — ₹999 se ₹9999\n🌿 Mehndi — ₹299 se ₹1499\n🧵 Silai — ₹99 se ₹599\n✂️ Baal Kataai — ₹99 se ₹1499\n\n✅ Koi hidden charge nahi!\nKisi specific service ki keemat jaanni hai?',
    offer: '🎉 Aaj ke Offers:\n• SAKHI20 — Pehli booking par 20% chhoot\n• DIWALI500 — ₹500 off Bridal services par\n\nOffer page par jaaiye aur coupon use kariye! 🎊',
    coin: '🪙 Loyalty Coins:\n• Har ₹100 ki booking par 10 coins milte hain\n• 50 coins = ₹5 ki chhoot\n• 100 coins = ₹10 ki chhoot\n\nJitna book karein, utne coins kamaaiye!\nApna wallet Profile mein dekh sakte hain 😊',
    booking: '📅 Booking Kaise Karein:\n1. Services mein jaiye\n2. Cart mein jodiye\n3. Booking confirm kariye\n4. Date, time, Ghar ya Parlour chuniye\n5. Payment kariye\n6. Confirmation message aayegi ✅\n\nShuru karein! →',
    home: '🏠 Ghar Par Service:\n• Bridal Makeup ✅\n• Mehndi ✅\n• Facial ✅\n• Baal Kataai ✅\n\n📍 Gorakhpur area mein available\n⏰ Subah 8 baje se shaam 7 baje tak\n\nBooking mein "Ghar Par Service" choose kariye!',
    contact: '📞 Sampark:\n\nSakhi Beauty Parlour\n📍 Jaitpur, Khajni Road, Gorakhpur\n📱 +91 9936657399\n💬 WhatsApp bhi kar sakte hain\n⏰ Somvaar–Ravivar: 9 AM–8 PM\n\n🏠 Ghar par bhi aate hain!',
    thanks: '😊 Bahut shukriya! Aap bahut khoobsoorat hain!\n\nKoi aur sawaal ho to batayein. 💕',
    enquiry: '📩 Enquiry Bhejiye:\nProfile > Enquiry mein jaakar apna sawaal likhiye.\n\nYa sidha call kariye: +91 9936657399 📞',
    gallery: '📸 Hamare Kaam Dekhiye:\nGallery page mein Ranjana Ji ke banaye bridal, mehndi aur facial ke photos dekh sakte hain!\n\nInstagram par bhi follow kariye: @sakhibeautyparlour 💄',
    default: '🌸 Maafi chahti hoon, samjha nahi!\n\nMujhse ye poochh sakte hain:\n💆 Facial | 👰 Bridal | 🌿 Mehndi\n🧵 Silai | ✂️ Baal Kataai\n🎉 Offers | 💰 Prices | 📅 Booking\n\nYa call kariye: +91 9936657399 😊',
  },
  en: {
    greet: '🌸 Namaste! I am Sakhi, your beauty assistant!\n\nI can help you with:\n💆 Facial treatments\n👰 Bridal packages\n🌿 Mehndi designs\n🧵 Stitching\n✂️ Hair Cutting\n🎉 Offers & discounts\n💰 Pricing\n📅 Booking\n🏠 Home service\n🪙 Loyalty coins\n\nHow can I help you? 😊',
    facial: '💆 Facial Services:\n• Basic Cleanup — ₹299 (45 min)\n• Fruit Facial — ₹499 (1 hr)\n• D-Tan — ₹399 (1 hr)\n• Gold Facial — ₹799 (1.5 hr)\n• Anti-Ageing — ₹999 (1.5 hr)\n\n🏠 Home service available! Which facial interests you?',
    bridal: '👰 Bridal Packages:\n• Engagement Makeup — ₹1999\n• Bridal Makeup Basic — ₹3999\n• Bridal HD Premium — ₹6999\n• Full Bridal Package — ₹9999\n• Party Makeup — ₹999\n\n💍 All packages include home service option! Congratulations! 🎉',
    mehndi: '🌿 Mehndi Services:\n• Simple Mehndi — ₹299\n• Arabic Design — ₹799\n• Bridal Mehndi — ₹1499\n• Feet Mehndi — ₹399\n\n🏠 Artist comes to your home! Which design would you like? 🌸',
    hair: '✂️ Hair Cutting Services:\n• Simple Cut — ₹150 (30 min)\n• Styling Cut — ₹299 (45 min)\n• Trimming — ₹99 (20 min)\n• Hair Wash + Blow Dry — ₹199\n• Smoothening — ₹1499\n• Mehndi Colour — ₹299\n\n🏠 Home service available!',
    price: '💰 Price Range:\n💆 Facial — ₹299 to ₹999\n👰 Bridal — ₹999 to ₹9999\n🌿 Mehndi — ₹299 to ₹1499\n🧵 Stitching — ₹99 to ₹599\n✂️ Hair Cutting — ₹99 to ₹1499\n\n✅ No hidden charges! Which service?',
    offer: '🎉 Current Offers:\n• SAKHI20 — 20% off on first booking\n• DIWALI500 — ₹500 off on Bridal services\n\nVisit Offers page and use coupon code! 🎊',
    coin: '🪙 Loyalty Coins:\n• Earn 10 coins per ₹100 booking\n• 50 coins = ₹5 discount\n• 100 coins = ₹10 discount\n\nMore you book, more you earn!\nCheck your wallet in Profile 😊',
    booking: '📅 How to Book:\n1. Browse Services\n2. Add to Cart\n3. Confirm Booking\n4. Choose date, time, Home/Parlour\n5. Pay online/cash\n6. Get confirmation ✅\n\nStart now! →',
    home: '🏠 Home Service Available:\n• Bridal Makeup ✅\n• Mehndi ✅\n• Facial ✅\n• Hair Cutting ✅\n\n📍 Available in Gorakhpur area\n⏰ 8 AM – 7 PM daily\n\nSelect "Home Service" while booking!',
    contact: '📞 Contact:\n\nSakhi Beauty Parlour\n📍 Jaitpur, Khajni Road, Gorakhpur\n📱 +91 9936657399\n💬 WhatsApp available\n⏰ Mon–Sun: 9 AM–8 PM\n\n🏠 Home service also available!',
    thanks: '😊 Thank you so much! You are beautiful!\n\nAny other questions? I am here! 💕',
    enquiry: '📩 Send Enquiry:\nGo to Profile > Enquiry section to send your message.\n\nOr call directly: +91 9936657399 📞',
    gallery: '📸 See Our Work:\nVisit Gallery page to see Ranjana Ji\'s bridal, mehndi and facial work!\n\nFollow on Instagram: @sakhibeautyparlour 💄',
    silai: '🧵 Stitching Services:\n• Blouse — ₹299 (3 days)\n• Salwar Suit — ₹499 (4 days)\n• Lehenga Blouse — ₹599 (5 days)\n• Alteration — ₹99 (2 days)\n\nBring your fabric or we help source it!',
    default: '🌸 I did not understand, sorry!\n\nAsk me about:\n💆 Facial | 👰 Bridal | 🌿 Mehndi\n🧵 Stitching | ✂️ Hair Cutting\n🎉 Offers | 💰 Prices | 📅 Booking\n\nOr call: +91 9936657399 😊',
  },
};

const generateReply = (message) => {
  const m = message.toLowerCase().trim();
  const lang = isHindi(message) ? 'hi' : 'en';
  const r = R[lang];

  if (/^(hi|hello|hey|namaste|namaskar|hii|salam|hy|namsate|pranam|good|kaise|kya hal)/.test(m)) return r.greet;
  if (/(thank|shukriya|dhanyawad|bahut accha|great|awesome|nice|khoob)/.test(m)) return r.thanks;
  if (/(bridal|bride|dulhan|shadi|shaadi|vivah|engagement|sagai)/.test(m)) return r.bridal;
  if (/(facial|face|glow|skin|cleanup|bleach|tan|nikhaar|rang)/.test(m)) return r.facial;
  if (/(mehndi|henna|mehendi|mehandi|heena)/.test(m)) return r.mehndi;
  if (/(silai|stitch|tailoring|blouse|suit|kapda|sewing|darzi|kurta|lehenga)/.test(m)) return r.silai;
  if (/(baal|hair|cutting|cut|trimming|smoothening|blow|kataai|rangaai)/.test(m)) return r.hair;
  if (/(offer|discount|coupon|chhoot|sale|deal|diwali|eid|festiv)/.test(m)) return r.offer;
  if (/(coin|loyalty|points|reward|wallet|kamao|redeem)/.test(m)) return r.coin;
  if (/(book|appointment|schedule|slot|kaise book|booking kaise)/.test(m)) return r.booking;
  if (/(price|cost|rate|kitna|kitne|charges|how much|paisa|rupay|fees)/.test(m)) return r.price;
  if (/(home|ghar|doorstep|ghar par|visit|aao|aana)/.test(m)) return r.home;
  if (/(contact|number|phone|call|whatsapp|address|kahan|location|sampark)/.test(m)) return r.contact;
  if (/(enquiry|question|sawaal|problem|complaint|feedback)/.test(m)) return r.enquiry;
  if (/(gallery|photo|work|design|dikhaiye|portfolio|instagram|youtube)/.test(m)) return r.gallery;
  return r.default;
};

const QUICK_REPLIES = [
  { text: '💆 Facial', query: 'facial services' },
  { text: '👰 Bridal', query: 'bridal packages' },
  { text: '🌿 Mehndi', query: 'mehndi designs' },
  { text: '✂️ Baal Kataai', query: 'hair cutting' },
  { text: '🎉 Offers', query: 'aaj ke offers' },
  { text: '🪙 Coins', query: 'loyalty coins' },
  { text: '🏠 Ghar Service', query: 'ghar par service' },
  { text: '💰 Price List', query: 'price list' },
];

module.exports = { generateReply, QUICK_REPLIES };
