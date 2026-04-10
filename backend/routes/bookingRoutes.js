// routes/bookingRoutes.js
const router = require('express').Router();
const { getMyBookings, createBooking, getBooking, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyBookings);
router.post('/', protect, createBooking);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
