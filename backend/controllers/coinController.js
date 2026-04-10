const Coin = require('../models/Coin');
const User = require('../models/User');

// Earn coins on booking (10 coins per ₹100)
exports.earnCoins = async (userId, amount, bookingId) => {
  const earned = Math.floor(amount / 100) * 10;
  if (earned <= 0) return 0;
  let wallet = await Coin.findOne({ userId });
  if (!wallet) wallet = new Coin({ userId, balance: 0, history: [] });
  wallet.balance += earned;
  wallet.history.push({ amount: earned, type: 'earned', reason: `Booking se ${earned} coins mile`, bookingId });
  await wallet.save();
  await User.findByIdAndUpdate(userId, { coinBalance: wallet.balance });
  return earned;
};

exports.getWallet = async (req, res) => {
  try {
    let wallet = await Coin.findOne({ userId: req.user.id });
    if (!wallet) wallet = { balance: 0, history: [] };
    res.json({ success: true, balance: wallet.balance, history: wallet.history });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};

exports.redeemCoins = async (req, res) => {
  try {
    const { coins } = req.body;
    const wallet = await Coin.findOne({ userId: req.user.id });
    if (!wallet || wallet.balance < coins) return res.status(400).json({ success:false, message: 'Itne coins nahi hain' });
    if (coins < 50) return res.status(400).json({ success:false, message: 'Kam se kam 50 coins redeem kar sakte hain' });
    const discount = Math.floor(coins / 10); // 10 coins = ₹1
    wallet.balance -= coins;
    wallet.history.push({ amount: -coins, type: 'redeemed', reason: `₹${discount} discount ke liye ${coins} coins use kiye` });
    await wallet.save();
    await User.findByIdAndUpdate(req.user.id, { coinBalance: wallet.balance });
    res.json({ success: true, discount, newBalance: wallet.balance, message: `${coins} coins se ₹${discount} ka discount mila!` });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};
