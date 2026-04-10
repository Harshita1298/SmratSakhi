// controllers/cartController.js
const Cart = require('../models/Cart');
const Service = require('../models/Service');

// @route GET /api/cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = { items: [], totalPrice: 0 };
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/cart/add
exports.addToCart = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

    // Prevent duplicate
    const already = cart.items.find(i => i.serviceId.toString() === serviceId);
    if (already) return res.status(400).json({ success: false, message: 'Service already in cart' });

    cart.items.push({
      serviceId: service._id,
      name: service.name,
      category: service.category,
      price: service.price,
    });

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route DELETE /api/cart/remove/:serviceId
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.serviceId.toString() !== req.params.serviceId);
    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route DELETE /api/cart/clear
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [], totalPrice: 0 });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
