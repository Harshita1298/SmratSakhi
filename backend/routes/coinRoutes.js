const router = require('express').Router();
const { getWallet, redeemCoins } = require('../controllers/coinController');
const { protect } = require('../middleware/authMiddleware');
router.get('/wallet', protect, getWallet);
router.post('/redeem', protect, redeemCoins);
module.exports = router;
