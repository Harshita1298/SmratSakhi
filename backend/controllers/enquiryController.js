const Enquiry = require('../models/Enquiry');
const Notification = require('../models/Notification');

exports.submitEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create({
      ...req.body,
      userId: req.user?._id || null,
    });
    // Admin ko notification
    await Notification.create({
      title: `Nayi enquiry: ${req.body.name}`,
      message: req.body.message.slice(0, 100),
      emoji: '📩',
      type: 'general',
      targetAll: false,
    });
    res.status(201).json({ success: true, message: 'Aapki enquiry mil gayi! Hum jald sampark karenge 🙏' });
  } catch(e) { res.status(400).json({ success:false, message:e.message }); }
};

exports.getEnquiries = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, enquiries });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};

exports.replyEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { adminReply: req.body.reply, status: 'replied' },
      { new: true }
    );
    res.json({ success: true, enquiry });
  } catch(e) { res.status(400).json({ success:false, message:e.message }); }
};
