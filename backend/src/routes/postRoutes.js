const express = require('express');
const {
  createPost,
  getFeed,
  toggleLike,
  addComment,
  getPost,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public: view the feed and individual posts.
router.get('/', getFeed);
router.get('/:id', getPost);

// Protected: create posts, like and comment.
router.post('/', protect, upload.single('image'), createPost);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);

module.exports = router;