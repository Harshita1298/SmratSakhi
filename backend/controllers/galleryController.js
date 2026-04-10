const Gallery = require('../models/Gallery');
const Notification = require('../models/Notification');

exports.getGallery = async (req, res) => {
  try {
    const { category, type } = req.query;
    const filter = { isPublished: true };
    if (category && category !== 'All') filter.category = category;
    if (type) filter.type = type;
    const items = await Gallery.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, items });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};

exports.createPost = async (req, res) => {
  try {
    const post = await Gallery.create(req.body);
    // Notification send karo
    await Notification.create({
      title: `Nayi post: ${post.title}`,
      message: post.description || 'Dekhiye hamare naaye kaam ki jhalak!',
      emoji: '📸',
      type: 'gallery',
      link: '/gallery',
    });
    res.status(201).json({ success: true, post });
  } catch(e) { res.status(400).json({ success:false, message:e.message }); }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, post });
  } catch(e) { res.status(400).json({ success:false, message:e.message }); }
};

exports.deletePost = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Delete ho gaya' });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Gallery.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    res.json({ success: true, likes: post.likes });
  } catch(e) { res.status(500).json({ success:false, message:e.message }); }
};
