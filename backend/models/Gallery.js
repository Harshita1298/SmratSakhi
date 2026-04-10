// Gallery — Admin posts photos, reels, before/after
const mongoose = require('mongoose');
const S = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  imageUrl:    { type: String, required: true },   // photo URL
  videoUrl:    { type: String },                    // reel/video URL
  type:        { type: String, enum: ['photo','reel','before_after'], default: 'photo' },
  beforeImage: { type: String },  // for before_after type
  afterImage:  { type: String },
  category:    { type: String, enum: ['Facial','Bridal','Mehndi','Silai','Hair Cutting','General'], default: 'General' },
  tags:        [String],
  likes:       { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  instagramUrl:{ type: String },
  youtubeUrl:  { type: String },
}, { timestamps: true });
module.exports = mongoose.model('Gallery', S);
