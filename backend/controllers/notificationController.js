const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find({
      isActive: true,
      $or: [{ targetAll: true }, { targetUsers: req.user.id }],
    }).sort({ createdAt: -1 }).limit(30);
    const unread = notifs.filter(n => !n.readBy.includes(req.user.id)).length;
    res.json({ success: true, notifications: notifs, unread });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};

exports.markRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { $addToSet: { readBy: req.user.id } });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};

exports.createNotification = async (req, res) => {
  try {
    const notif = await Notification.create(req.body);
    res.status(201).json({ success: true, notif });
  } catch(e) { res.status(400).json({ success:false, message:e.message }); }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const notifs = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, notifications: notifs });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};
