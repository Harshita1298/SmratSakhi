# 🚀 Smart Sakhi App — Complete Production Guide
# Ranjana Ji ke liye — Step by Step Hindi mein

---

## 📱 PLAY STORE PAR PUBLISH KARNA

### Step 1: Google Play Developer Account Banao (Ek Baar)
```
1. https://play.google.com/console par jaao
2. "Get Started" click karo
3. Gmail account se login karo
4. $25 USD ek baar fee pay karo (lifetime)
5. Developer name rakho: "Sakhi Beauty Parlour"
6. Address: Jaitpur, Khajni Road, Gorakhpur, UP 273001
7. Phone: +91 9936657399
```

### Step 2: App Build Karo (APK/AAB file)
```bash
# EAS CLI install karo
npm install -g eas-cli

# Expo mein login karo
eas login

# smart-sakhi-mobile folder mein jaao
cd smart-sakhi-mobile

# Build configure karo
eas build:configure

# Android AAB build karo (Play Store ke liye)
eas build --platform android --profile production

# 15-20 minute mein AAB file ready ho jaayegi
# Download link milega — download kar lo
```

### Step 3: App Signing (Important!)
```bash
# app.json mein ye check karo:
{
  "expo": {
    "android": {
      "package": "com.sakhibeauty.parlour",  ← unique hona chahiye
      "versionCode": 1
    }
  }
}
```

### Step 4: Play Console mein App Create Karo
```
1. play.google.com/console mein login karo
2. "Create app" click karo
3. App name: "Smart Sakhi - Beauty Booking"
4. Language: Hindi
5. Type: App
6. Category: Lifestyle
7. Free app select karo
8. Declarations submit karo
```

### Step 5: Store Listing Bharо
```
App name:    Smart Sakhi - Beauty Booking
Short desc:  Sakhi Beauty Parlour, Gorakhpur ki official booking app
Full desc:   [Neeche diya hai]
Category:    Lifestyle
Tags:        beauty, salon, mehndi, bridal, makeup, gorakhpur

SCREENSHOTS: 
- Kam se kam 2 phone screenshots (1080x1920 ya 1080x2340)
- Apne phone mein app chalao, screenshots lo
- Feature graphic: 1024x500 pixels

RATINGS: Content Rating questionnaire bharo
- Age: 3+
```

### Full Description (Copy-Paste karo):
```
Smart Sakhi - Gorakhpur ki #1 Beauty Booking App!

Sakhi Beauty Parlour ki official app par aapka swagat hai. 
Ranjana Ji ke 20+ saalon ke experience ke saath, hum laate hain 
aapke liye premium beauty services — aapke ghar ya hamare parlour mein.

SERVICES:
✨ Facial & Skin Treatments — Basic se Gold Facial tak
👰 Bridal Makeup — Engagement se Full Bridal Package
🌿 Mehndi — Simple se Full Bridal Mehndi
🧵 Stitching & Tailoring — Blouse, Salwar Suit, Lehenga

APP KE FEATURES:
📅 Easy Booking — Date, time, service sab ek jagah
🏠 Home Service — Hum aate hain aapke ghar
💳 Safe Payment — Razorpay, UPI, Cash
💬 AI Chatbot — Hindi & English mein help
⭐ Reviews — Clients ki sacchi raay
📊 Booking History — Sab bookings ek jagah

AWARDS:
🥇 Best Bridal Beautician — Gorakhpur 2022
🥇 Excellence in Mehndi Art — UP State

📍 Jaitpur, Khajni Road, Gorakhpur, UP
📞 +91 9936657399
⏰ Mon-Sun: 9 AM - 8 PM
```

### Step 6: App Upload & Review
```
1. Release > Production > Create new release
2. AAB file upload karo
3. Release notes likhо: "Smart Sakhi pehla version launch!"
4. "Review release" click karo
5. "Start rollout to Production" 
6. Google 2-3 din mein review karega
7. Approve hone par Play Store par live!
```

---

## 🌐 WEBSITE HOSTING (WEB APP)

### Option A: Vercel (FREE — Sabse Aasaan ✅)
```bash
# Frontend deploy
npm install -g vercel
cd smart-sakhi/frontend
vercel

# Automatically:
# - Build hoga
# - Live URL milega: https://smart-sakhi.vercel.app
# - HTTPS free
# - Custom domain bhi set kar sakte ho

# Environment variables Vercel dashboard mein set karo:
VITE_API_URL=https://your-backend.railway.app/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Option B: Backend Deploy — Railway (FREE tier)
```bash
# Railway.app par free account banao
npm install -g @railway/cli
railway login

cd smart-sakhi/backend
railway init
railway up

# Environment variables Railway dashboard mein set karo:
MONGO_URI=mongodb+srv://...  (MongoDB Atlas)
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
CLIENT_URL=https://smart-sakhi.vercel.app
```

### Option C: MongoDB Atlas (FREE)
```
1. mongodb.com/atlas par jaao
2. Free account banao
3. "Create a cluster" — M0 Free tier
4. India (Mumbai) region select karo
5. Database user banao
6. Connection string copy karo
7. Ye string MONGO_URI mein daalo
```

### Custom Domain (Optional — ₹500-1000/year)
```
1. GoDaddy ya Namecheap par domain kharido
   Suggestions: sakhibeauty.in, sakhibeautyparlour.com

2. Vercel mein "Add Domain" mein domain add karo

3. DNS records set karo (Vercel batayega)

4. 24 ghante mein SSL certificate auto-install
```

---

## 🔒 PRIVACY & LEGAL (Play Store ke liye Zaroori)

### Privacy Policy URL (Zaroori!)
```
Aapki web app mein:
/privacy-policy page already bana hua hai

URL hoga: https://smart-sakhi.vercel.app/privacy-policy

Ye URL Play Store submission mein daalna zaroori hai.
```

### Data Safety Form (Play Console)
```
Play Console > Policy > App content > Data safety

Fill karo:
- Location: No
- Personal info (name, email): Yes — collected, not shared
- Financial info: No (Razorpay handles it)
- Health info: No  
- Messages: No
- Photos/Videos: No
- Data encrypted in transit: Yes
- Users can request deletion: Yes
```

---

## 📲 APP STORE (iOS) — OPTIONAL

### Requirements:
```
- Mac computer zaroori
- Apple Developer Account — $99/year
- Xcode install hona chahiye

Commands:
eas build --platform ios --profile production
```

---

## 🎨 LOGO FILES — KAHAN USE KAREIN

```
Play Store Icon:    512x512 PNG (circle shape)
Splash Screen:      1242x2688 PNG (pink background + logo)
Feature Graphic:    1024x500 PNG
App Notification:   96x96 PNG (white icon, transparent bg)
Favicon (web):      32x32 PNG

Logo SVG code:
src/assets/logo.svg — already in project

Convert karna ho to:
https://cloudconvert.com/svg-to-png — free online tool
```

---

## 💰 COST SUMMARY

```
Play Store Account:  $25 (ek baar) ≈ ₹2,100
Domain (.in):        ₹500-800/year
Hosting (Vercel):    FREE
Backend (Railway):   FREE (500 hrs/month)
Database (Atlas):    FREE (512 MB)
SSL Certificate:     FREE (auto)
─────────────────────────────
Total First Year:    ≈ ₹2,600-3,000
After That:          ≈ ₹500-800/year (sirf domain)
```

---

## ✅ LAUNCH CHECKLIST

```
□ MongoDB Atlas account banao
□ Backend Railway par deploy karo
□ Frontend Vercel par deploy karo
□ .env variables sab set karo
□ Razorpay Live keys daalo (test se live par switch)
□ Google Client ID set karo
□ Privacy Policy URL live karo
□ Play Store account banao ($25)
□ App screenshots lo (5-8)
□ Feature graphic banao (1024x500)
□ AAB build karo
□ Play Console mein upload karo
□ 2-3 din wait karo — LIVE! 🎉
```

---

## 📞 HELP CHAHIYE?

```
Ranjana Ji, agar koi step mein problem aaye:

1. Backend error:  Terminal mein error copy karo
2. Build fail:     eas build --platform android --profile preview
                   (pehle test build karo)
3. Play Store reject: Reason padhо — usually minor fix hota hai

YouTube tutorials:
- "Expo EAS Build Android 2024"
- "Deploy React app Vercel free"
- "MongoDB Atlas setup Hindi"
```
