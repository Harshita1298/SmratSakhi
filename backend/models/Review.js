// backend/models/Review.js — Customer Review Schema
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Who gave the review
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customerName: { type: String, required: true, trim: true },
  phone:        { type: String },
  email:        { type: String },
  avatarLetter: { type: String }, // first letter of name

  // Review content
  rating:       { type: Number, required: true, min: 1, max: 5 },
  title:        { type: String, trim: true },
  comment:      { type: String, required: true, trim: true, maxlength: 500 },

  // What service they used
  serviceCategory: {
    type: String,
    enum: ['Facial', 'Bridal', 'Mehndi', 'Stitching', 'General'],
    default: 'General',
  },

  // Admin control
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  isPublished: { type: Boolean, default: false },
  adminNote:   { type: String }, // admin ka reason for reject

  // Linked booking (optional)
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },

  // Source
  source: { type: String, enum: ['app', 'google', 'manual'], default: 'app' },

}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
