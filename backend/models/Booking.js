// models/Booking.js — Booking / Digital Diary Schema
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Customer info
  customerName: { type: String, required: true },
  fatherName:   { type: String },
  phone:        { type: String, required: true },
  address:      { type: String },

  // Linked user (if booked through app)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  // Booking date & time
  date: { type: Date, required: true },
  timeSlot: { type: String },           // e.g. "10:00 AM"

  // Services booked (array of service refs + name + price snapshot)
  services: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
      name:      { type: String, required: true },
      category:  { type: String },
      price:     { type: Number, required: true },
    },
  ],

  // Booking type
  bookingType: {
    type: String,
    enum: ['home', 'parlour'],
    required: true,
    default: 'parlour',
  },

  // Payment
  totalAmount:     { type: Number, required: true },
  advancePaid:     { type: Number, default: 0 },
  remainingAmount: { type: Number },
  paymentMode:     { type: String, enum: ['cash', 'online', 'upi'], default: 'cash' },
  paymentStatus:   { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },

  notes: { type: String },

  // Who created (admin manual or user)
  createdBy: { type: String, enum: ['admin', 'user'], default: 'user' },

}, { timestamps: true });

// Auto-calculate remaining amount
bookingSchema.pre('save', function (next) {
  this.remainingAmount = this.totalAmount - this.advancePaid;
  if (this.advancePaid >= this.totalAmount) this.paymentStatus = 'paid';
  else if (this.advancePaid > 0)            this.paymentStatus = 'partial';
  else                                       this.paymentStatus = 'pending';
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
