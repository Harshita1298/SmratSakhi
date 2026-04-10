const Booking = require('../models/Booking');
const Cart    = require('../models/Cart');
const Coin    = require('../models/Coin');
const User    = require('../models/User');

const awardCoins = async (userId, amount, bookingId) => {
  try {
    const earned = Math.floor(amount / 100) * 10;
    if (earned <= 0) return;
    let wallet = await Coin.findOne({ userId });
    if (!wallet) wallet = new Coin({ userId, balance: 0, history: [] });
    wallet.balance += earned;
    wallet.history.push({ amount: earned, type: 'earned', reason: `Booking se ${earned} coins mile (₹${amount} booking)`, bookingId });
    await wallet.save();
    await User.findByIdAndUpdate(userId, { coinBalance: wallet.balance });
  } catch(e) { console.log('Coin award error:', e.message); }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({ success: true, bookings });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};

exports.createBooking = async (req, res) => {
  try {
    const { date, timeSlot, bookingType, paymentMode, advancePaid, notes, couponDiscount, coinsUsed } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || !cart.items.length) return res.status(400).json({ success:false, message:'Cart khaali hai' });

    const user = req.user;
    const baseTotal = cart.totalPrice;
    const discount  = (Number(couponDiscount) || 0) + (Number(coinsUsed) ? Math.floor(Number(coinsUsed) / 10) : 0);
    const totalAmount = Math.max(baseTotal - discount, 0);

    const booking = await Booking.create({
      customerName: user.name, phone: user.phone, address: user.address,
      userId: user.id, date, timeSlot, services: cart.items,
      bookingType, totalAmount, advancePaid: Number(advancePaid) || 0,
      paymentMode, notes, createdBy: 'user',
    });

    // Award coins
    if (user.id) await awardCoins(user.id, totalAmount, booking._id);

    // Deduct coins if used
    if (coinsUsed > 0) {
      let wallet = await Coin.findOne({ userId: user.id });
      if (wallet && wallet.balance >= coinsUsed) {
        wallet.balance -= coinsUsed;
        wallet.history.push({ amount: -coinsUsed, type: 'redeemed', reason: `Booking mein discount ke liye`, bookingId: booking._id });
        await wallet.save();
        await User.findByIdAndUpdate(user.id, { coinBalance: wallet.balance });
      }
    }

    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [], totalPrice: 0 });
    res.status(201).json({ success:true, booking });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success:false, message:'Booking nahi mili' });
    if (booking.userId?.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success:false, message:'Permission nahi hai' });
    res.json({ success:true, booking });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success:false, message:'Booking nahi mili' });
    if (booking.userId?.toString() !== req.user.id)
      return res.status(403).json({ success:false, message:'Permission nahi hai' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success:true, booking });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};
