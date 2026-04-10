// backend/controllers/googleAuthController.js
// Google OAuth — verify token from frontend (Google Sign-In)
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt  = require('jsonwebtoken');
const crypto = require('crypto');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

// @route POST /api/auth/google
// @desc  Google token verify karo aur user login/register karo
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ success: false, message: 'Google token required' });

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, name, picture, sub: googleId } = payload;

    // Check if user already exists by email
    let user = await User.findOne({ email });

    if (user) {
      // Already registered — just login
      const token = generateToken(user._id);
      return res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, phone: user.phone, role: user.role, email: user.email },
        isNew: false,
      });
    }

    // New user — auto-register with Google data
    // Generate a random secure password (they won't use it, Google se login karenge)
    const randomPassword = crypto.randomBytes(16).toString('hex');

    user = await User.create({
      name,
      email,
      phone: '', // Google se phone nahi milta — baad mein add kar sakte hain
      password: randomPassword,
      googleId,
      profilePicture: picture,
      role: 'user',
    });

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, phone: user.phone, role: user.role, email: user.email },
      isNew: true,
      message: `Welcome ${name}! Smart Sakhi mein aapka swagat hai! 💄`,
    });

  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(401).json({ success: false, message: 'Google login failed. Token invalid ya expire ho gaya.' });
  }
};
