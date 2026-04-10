// Enquiry — Customer sends enquiry / message
const mongoose = require('mongoose');
const S = new mongoose.Schema({
  name:     { type: String, required: true },
  phone:    { type: String, required: true },
  email:    { type: String },
  message:  { type: String, required: true },
  service:  { type: String },  // konsi service ke baare mein
  status:   { type: String, enum: ['new','replied','closed'], default: 'new' },
  adminReply:{ type: String },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });
module.exports = mongoose.model('Enquiry', S);
