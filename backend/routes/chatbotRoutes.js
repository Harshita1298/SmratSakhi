// routes/chatbotRoutes.js
const router = require('express').Router();
const { generateReply } = require('../utils/chatbot');

// @route POST /api/chatbot/message
router.post('/message', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ success: false, message: 'Message required' });
  const reply = generateReply(message);
  res.json({ success: true, reply });
});

module.exports = router;
