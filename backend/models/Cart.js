// models/Cart.js — Cart Schema
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
      name:      { type: String },
      category:  { type: String },
      price:     { type: Number },
    },
  ],
  totalPrice: { type: Number, default: 0 },
}, { timestamps: true });

// Auto-calculate total price
cartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce((sum, item) => sum + item.price, 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
