// backend/controllers/reviewController.js
const Review = require('../models/Review');

// ── USER: Submit review ───────────────────────────────────────
// @route POST /api/reviews
exports.submitReview = async (req, res) => {
  try {
    const { rating, title, comment, serviceCategory, bookingId } = req.body;

    if (!rating || !comment)
      return res.status(400).json({ success: false, message: 'Rating aur comment zaroori hai' });

    const review = await Review.create({
      userId:          req.user?._id || null,
      customerName:    req.user?.name || req.body.customerName || 'Anonymous',
      phone:           req.user?.phone || req.body.phone,
      email:           req.user?.email || req.body.email,
      avatarLetter:    (req.user?.name || req.body.customerName || 'A')[0].toUpperCase(),
      rating:          Number(rating),
      title,
      comment,
      serviceCategory: serviceCategory || 'General',
      bookingId:       bookingId || null,
      status:          'pending',
      isPublished:     false,
      source:          'app',
    });

    res.status(201).json({
      success: true,
      message: 'Aapka review submit ho gaya! Admin approval ke baad publish hoga. Shukriya! 🙏',
      review,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUBLIC: Get published reviews ─────────────────────────────
// @route GET /api/reviews
exports.getPublishedReviews = async (req, res) => {
  try {
    const { category, limit = 20, page = 1 } = req.query;
    const filter = { isPublished: true, status: 'approved' };
    if (category && category !== 'All') filter.serviceCategory = category;

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-phone -email -adminNote');

    const total = await Review.countDocuments(filter);

    // Calculate average rating
    const avgResult = await Review.aggregate([
      { $match: { isPublished: true, status: 'approved' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const avgRating = avgResult[0]?.avgRating?.toFixed(1) || '0';
    const totalCount = avgResult[0]?.count || 0;

    res.json({ success: true, total, reviews, avgRating, totalCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADMIN: Get all reviews (pending + approved + rejected) ────
// @route GET /api/admin/reviews
exports.getAllReviews = async (req, res) => {
  try {
    const { status, page = 1, limit = 30 } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const counts = await Review.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const statusCounts = { pending: 0, approved: 0, rejected: 0 };
    counts.forEach(c => { statusCounts[c._id] = c.count; });

    res.json({ success: true, reviews, statusCounts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADMIN: Approve review ─────────────────────────────────────
// @route PUT /api/admin/reviews/:id/approve
exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', isPublished: true, adminNote: '' },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Review nahi mila' });
    res.json({ success: true, message: 'Review approved aur publish ho gaya! ✅', review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADMIN: Reject review ──────────────────────────────────────
// @route PUT /api/admin/reviews/:id/reject
exports.rejectReview = async (req, res) => {
  try {
    const { adminNote } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', isPublished: false, adminNote },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Review nahi mila' });
    res.json({ success: true, message: 'Review reject ho gaya', review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADMIN: Toggle publish/unpublish ──────────────────────────
// @route PUT /api/admin/reviews/:id/toggle
exports.togglePublish = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review nahi mila' });
    review.isPublished = !review.isPublished;
    await review.save();
    res.json({ success: true, message: review.isPublished ? 'Published ✅' : 'Unpublished', review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADMIN: Delete review ──────────────────────────────────────
// @route DELETE /api/admin/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review delete ho gaya' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
