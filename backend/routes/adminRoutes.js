// routes/adminRoutes.js
const router = require('express').Router();
const {
  getDashboardStats, getAllBookings, createManualBooking,
  updateBooking, deleteBooking, getReports, getAllUsers,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes are protected + admin-only
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/bookings', getAllBookings);
router.post('/bookings', createManualBooking);
router.put('/bookings/:id', updateBooking);
router.delete('/bookings/:id', deleteBooking);
router.get('/reports', getReports);
router.get('/users', getAllUsers);

module.exports = router;
