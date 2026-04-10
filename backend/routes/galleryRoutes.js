const router = require('express').Router();
const { getGallery, createPost, updatePost, deletePost, likePost } = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.get('/', getGallery);
router.post('/:id/like', likePost);
router.post('/', protect, adminOnly, createPost);
router.put('/:id', protect, adminOnly, updatePost);
router.delete('/:id', protect, adminOnly, deletePost);
module.exports = router;
