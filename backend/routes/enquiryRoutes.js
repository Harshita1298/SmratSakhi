const router = require('express').Router();
const { submitEnquiry, getEnquiries, replyEnquiry } = require('../controllers/enquiryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.post('/', protect, submitEnquiry);
router.get('/admin', protect, adminOnly, getEnquiries);
router.put('/admin/:id/reply', protect, adminOnly, replyEnquiry);
module.exports = router;
