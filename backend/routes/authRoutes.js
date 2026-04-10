// routes/authRoutes.js
const router = require('express').Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;

// Google OAuth route
const { googleLogin } = require('../controllers/googleAuthController');
router.post('/google', googleLogin);

// Password change
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await require('../models/User').findById(req.user.id).select('+password');
    if (!await user.matchPassword(currentPassword))
      return res.status(401).json({ success: false, message: 'Current password galat hai' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password change ho gaya!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
