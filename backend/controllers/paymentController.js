// controllers/paymentController.js — Razorpay Integration
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route POST /api/payment/create-order
exports.createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const options = {
      amount: booking.remainingAmount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${bookingId}`,
      notes: { bookingId: bookingId.toString() },
    };

    const order = await razorpay.orders.create(options);
    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSig !== razorpay_signature)
      return res.status(400).json({ success: false, message: 'Payment verification failed' });

    // Update booking
    const booking = await Booking.findById(bookingId);
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.advancePaid = booking.totalAmount; // full payment
    booking.paymentMode = 'online';
    booking.status = 'confirmed';
    await booking.save();

    res.json({ success: true, message: 'Payment verified', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
