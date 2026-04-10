// Notifications — Admin sends to all or specific users
const mongoose = require('mongoose');
const S = new mongoose.Schema({
  title:    { type: String, required: true },
  message:  { type: String, required: true },
  emoji:    { type: String, default: '💄' },
  type:     { type: String, enum: ['offer','booking','gallery','general','festival'], default: 'general' },
  targetAll:{ type: Boolean, default: true },
  targetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  readBy:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  link:     { type: String },  // deep link e.g. /offers
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model('Notification', S);
