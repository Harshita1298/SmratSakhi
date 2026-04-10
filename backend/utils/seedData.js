require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('../models/User');
const Service  = require('../models/Service');
const Offer    = require('../models/Offer');
const connectDB = require('../config/db');

const services = [
  // Facial
  { name:'Basic Cleanup',       category:'Facial',       description:'Gehri safaai aur basic skin cleanup', price:299,  duration:'45 min', availableFor:['home','parlour'] },
  { name:'Fruit Facial',        category:'Facial',       description:'Tazgi dene wala fruit facial',         price:499,  duration:'1 ghanta', availableFor:['home','parlour'] },
  { name:'Gold Facial',         category:'Facial',       description:'Chamakti skin ke liye premium gold',   price:799,  duration:'1.5 ghanta', availableFor:['home','parlour'] },
  { name:'D-Tan Facial',        category:'Facial',       description:'Tan hatao, rang nikharo',              price:399,  duration:'1 ghanta', availableFor:['home','parlour'] },
  { name:'Anti-Ageing Facial',  category:'Facial',       description:'Jhurriyon ko kam karo',                price:999,  duration:'1.5 ghanta', availableFor:['home','parlour'] },
  // Bridal
  { name:'Engagement Makeup',   category:'Bridal',       description:'Sagai ke liye khoobsoorat look',      price:1999, duration:'2 ghante', availableFor:['home','parlour'] },
  { name:'Bridal Makeup Basic', category:'Bridal',       description:'Dulhan ke liye traditional look',     price:3999, duration:'3 ghante', availableFor:['home','parlour'] },
  { name:'Bridal HD Premium',   category:'Bridal',       description:'HD makeup airbrush ke saath',         price:6999, duration:'4 ghante', availableFor:['home','parlour'] },
  { name:'Full Bridal Package', category:'Bridal',       description:'Makeup, Mehndi, Hair — sab kuch',     price:9999, duration:'6 ghante', availableFor:['home','parlour'] },
  { name:'Party Makeup',        category:'Bridal',       description:'Party ke liye glamorous look',        price:999,  duration:'1.5 ghanta', availableFor:['home','parlour'] },
  // Mehndi
  { name:'Simple Mehndi',       category:'Mehndi',       description:'Haathon par sunder simple design',    price:299,  duration:'45 min', availableFor:['home','parlour'] },
  { name:'Arabic Mehndi',       category:'Mehndi',       description:'Modern Arabic patterns',              price:799,  duration:'2 ghante', availableFor:['home','parlour'] },
  { name:'Bridal Mehndi',       category:'Mehndi',       description:'Haath aur pair — full design',        price:1499, duration:'3 ghante', availableFor:['home','parlour'] },
  { name:'Feet Mehndi',         category:'Mehndi',       description:'Pairon par sunder mehndi',            price:399,  duration:'1 ghanta', availableFor:['home','parlour'] },
  // Silai
  { name:'Blouse Silai',        category:'Silai',        description:'Perfect fitting blouse',              price:299,  duration:'3 din',   availableFor:['parlour'] },
  { name:'Salwar Suit',         category:'Silai',        description:'Poora salwar kameez',                 price:499,  duration:'4 din',   availableFor:['parlour'] },
  { name:'Lehenga Blouse',      category:'Silai',        description:'Designer lehenga blouse',             price:599,  duration:'5 din',   availableFor:['parlour'] },
  { name:'Alteration',          category:'Silai',        description:'Kapde ki thodi si silai',             price:99,   duration:'2 din',   availableFor:['parlour'] },
  // Hair Cutting — NEW
  { name:'Simple Hair Cut',     category:'Hair Cutting', description:'Saade baal kataai',                   price:150,  duration:'30 min',  availableFor:['home','parlour'] },
  { name:'Styling Cut',         category:'Hair Cutting', description:'Fashion ke anusar baal kataai',       price:299,  duration:'45 min',  availableFor:['home','parlour'] },
  { name:'Hair Trimming',       category:'Hair Cutting', description:'Baalon ki nok safaai',                price:99,   duration:'20 min',  availableFor:['home','parlour'] },
  { name:'Hair Wash + Blow Dry',category:'Hair Cutting', description:'Dhoye aur sukhaye sundar baal',       price:199,  duration:'45 min',  availableFor:['home','parlour'] },
  { name:'Smoothening',         category:'Hair Cutting', description:'Baalon ko seedha aur chamakdaar',     price:1499, duration:'2 ghante', availableFor:['parlour'] },
  { name:'Mehandi Rangaai',     category:'Hair Cutting', description:'Baalon mein mehndi lagana',           price:299,  duration:'1 ghanta', availableFor:['home','parlour'] },
];

const offers = [
  {
    title: '🎉 Grand Opening Offer',
    description: 'Hamare app par pehli booking par 20% chhoot milegi!',
    discountType: 'percent', discountValue: 20,
    couponCode: 'SAKHI20',
    validFrom: new Date(), validTill: new Date(Date.now() + 90*24*60*60*1000),
    occasion: 'Grand Opening', emoji: '🎉', bannerColor: '#e8637a',
    minAmount: 299,
  },
  {
    title: '🪔 Diwali Special',
    description: 'Diwali ke mauqe par sabhi bridal services par ₹500 ki chhoot!',
    discountType: 'flat', discountValue: 500,
    couponCode: 'DIWALI500',
    validFrom: new Date(), validTill: new Date(Date.now() + 30*24*60*60*1000),
    occasion: 'Diwali', emoji: '🪔', bannerColor: '#c9973a',
    minAmount: 1999,
  },
];

const seed = async () => {
  await connectDB();
  await Service.deleteMany({});
  await User.deleteMany({ role: 'admin' });
  await Offer.deleteMany({});

  await Service.insertMany(services);
  console.log(`✅ ${services.length} services add ho gayi`);

  await Offer.insertMany(offers);
  console.log(`✅ ${offers.length} offers add ho gaaye`);

  await User.create({
    name: 'Ranjana Ji', phone: '9936657399',
    email: 'ranjana@sakhibeauty.in', password: 'sakhi@2025',
    role: 'admin', city: 'Gorakhpur',
    address: 'Jaitpur, Khajni Road, Gorakhpur UP',
    socialLinks: {
      instagram: 'https://instagram.com/sakhibeautyparlour',
      youtube:   'https://youtube.com/@sakhibeauty',
      whatsapp:  'https://wa.me/919936657399',
    },
  });

  // Also keep default admin
  await User.create({
    name: 'Admin', phone: '9999999999',
    password: 'admin123', role: 'admin',
  });

  console.log('✅ Admin users banaye gaye');
  console.log('   Ranjana Ji: 9936657399 / sakhi@2025');
  console.log('   Default:    9999999999 / admin123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
