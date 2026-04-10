const Offer = require('../models/Offer');

exports.getActiveOffers = async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({ isActive: true, validFrom: { $lte: now }, validTill: { $gte: now } });
    res.json({ success: true, offers });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};

exports.validateCoupon = async (req, res) => {
  try {
    const { couponCode, amount } = req.body;
    const now = new Date();
    const offer = await Offer.findOne({
      couponCode: couponCode.toUpperCase(),
      isActive: true,
      validFrom: { $lte: now },
      validTill: { $gte: now },
    });
    if (!offer) return res.status(404).json({ success: false, message: 'Coupon code galat ya expire ho gaya' });
    if (offer.usageCount >= offer.usageLimit) return res.status(400).json({ success: false, message: 'Coupon limit khatam ho gayi' });
    if (amount < offer.minAmount) return res.status(400).json({ success: false, message: `Minimum ₹${offer.minAmount} ki booking chahiye` });

    let discount = offer.discountType === 'percent'
      ? Math.min((amount * offer.discountValue) / 100, offer.maxDiscount || 99999)
      : offer.discountValue;

    res.json({ success: true, discount: Math.round(discount), offer: { title: offer.title, emoji: offer.emoji } });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};

exports.createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    const Notification = require('../models/Notification');
    await Notification.create({
      title: `${req.body.emoji || '🎉'} ${req.body.title}`,
      message: req.body.description,
      emoji: req.body.emoji || '🎉',
      type: 'offer',
      link: '/offers',
    });
    res.status(201).json({ success: true, offer });
  } catch(e) { res.status(400).json({ success:false, message:e.message }); }
};

exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json({ success: true, offers });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};

exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, offer });
  } catch(e) { res.status(400).json({ success:false, message:e.message }); }
};

exports.deleteOffer = async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Offer delete ho gaya' });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};
