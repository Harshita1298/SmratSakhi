// controllers/adminController.js — Admin Panel Logic
const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');

// ── Dashboard Stats ───────────────────────────────────────
// @route GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalBookings, todayBookings, totalUsers, totalServices, revenueResult] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
      User.countDocuments({ role: 'user' }),
      Service.countDocuments({ isAvailable: true }),
      Booking.aggregate([
        { $match: { paymentStatus: { $in: ['paid', 'partial'] } } },
        { $group: { _id: null, total: { $sum: '$advancePaid' } } },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    // Today's revenue
    const todayRevenue = await Booking.aggregate([
      { $match: { date: { $gte: today, $lt: tomorrow }, paymentStatus: { $in: ['paid', 'partial'] } } },
      { $group: { _id: null, total: { $sum: '$advancePaid' } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalBookings,
        todayBookings,
        totalUsers,
        totalServices,
        totalRevenue,
        todayRevenue: todayRevenue[0]?.total || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── All Bookings ──────────────────────────────────────────
// @route GET /api/admin/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Booking.countDocuments(filter);
    res.json({ success: true, total, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Manual Diary Entry (Admin adds booking manually) ─────
// @route POST /api/admin/bookings
exports.createManualBooking = async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, createdBy: 'admin' });
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route PUT /api/admin/bookings/:id
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route DELETE /api/admin/bookings/:id
exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Reports ───────────────────────────────────────────────
// @route GET /api/admin/reports
exports.getReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = {};
    if (startDate && endDate) {
      match.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Daily earnings
    const dailyEarnings = await Booking.aggregate([
      { $match: { ...match, paymentStatus: { $in: ['paid', 'partial'] } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          earnings: { $sum: '$advancePaid' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 30 },
    ]);

    // Category wise
    const categoryStats = await Booking.aggregate([
      { $match: match },
      { $unwind: '$services' },
      { $group: { _id: '$services.category', count: { $sum: 1 }, revenue: { $sum: '$services.price' } } },
    ]);

    res.json({ success: true, dailyEarnings, categoryStats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Users ─────────────────────────────────────────────────
// @route GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
