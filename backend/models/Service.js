// models/Service.js — Service Schema
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['Facial', 'Bridal', 'Mehndi', 'Stitching', 'Silai', 'Hair Cutting'],
  },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: String, default: '1 hour' }, // e.g. "2 hours"
  image: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  availableFor: {
    type: [String],
    enum: ['home', 'parlour'],
    default: ['home', 'parlour'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
