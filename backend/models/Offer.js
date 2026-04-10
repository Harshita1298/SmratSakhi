// Offers — Festival offers, discounts
const mongoose = require('mongoose');
const S = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  discountType:{ type: String, enum: ['percent','flat'], default: 'percent' },
  discountValue:{ type: Number, required: true },  // 20 = 20% ya ₹20
  couponCode:  { type: String, uppercase: true },
  minAmount:   { type: Number, default: 0 },
  maxDiscount: { type: Number },
  validFrom:   { type: Date, required: true },
  validTill:   { type: Date, required: true },
  occasion:    { type: String },  // Diwali, Eid, etc.
  bannerColor: { type: String, default: '#e8637a' },
  emoji:       { type: String, default: '🎉' },
  applicableOn:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }], // empty = all
  isActive:    { type: Boolean, default: true },
  usageCount:  { type: Number, default: 0 },
  usageLimit:  { type: Number, default: 1000 },
}, { timestamps: true });
module.exports = mongoose.model('Offer', S);
