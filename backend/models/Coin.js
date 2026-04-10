// Loyalty Coins — User earns coins on each booking
const mongoose = require('mongoose');
const S = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  balance:   { type: Number, default: 0 },
  history: [{
    amount:    Number,
    type:      { type: String, enum: ['earned','redeemed','bonus','expired'] },
    reason:    String,
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    date:      { type: Date, default: Date.now },
  }],
}, { timestamps: true });
module.exports = mongoose.model('Coin', S);
