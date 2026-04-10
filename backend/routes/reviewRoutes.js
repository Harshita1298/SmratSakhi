// backend/routes/reviewRoutes.js
const router = require('express').Router();
const {
  submitReview,
  getPublishedReviews,
  getAllReviews,
  approveReview,
  rejectReview,
  togglePublish,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public — published reviews dekho
router.get('/', getPublishedReviews);

// User — review submit karo (login optional but preferred)
router.post('/', protect, submitReview);

// Admin routes
router.get('/admin',                protect, adminOnly, getAllReviews);
router.put('/admin/:id/approve',    protect, adminOnly, approveReview);
router.put('/admin/:id/reject',     protect, adminOnly, rejectReview);
router.put('/admin/:id/toggle',     protect, adminOnly, togglePublish);
router.delete('/admin/:id',         protect, adminOnly, deleteReview);

module.exports = router;
