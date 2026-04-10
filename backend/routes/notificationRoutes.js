const router = require('express').Router();
const { getMyNotifications, markRead, createNotification, getAllNotifications } = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.get('/', protect, getMyNotifications);
router.put('/:id/read', protect, markRead);
router.get('/admin', protect, adminOnly, getAllNotifications);
router.post('/admin', protect, adminOnly, createNotification);
module.exports = router;
