const Post = require('../models/Post');
const { uploadImage } = require('../utils/cloudinary');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Serialize a post for the API response.
 */
const serializePost = (post, currentUserId) => {
  const userId = currentUserId ? String(currentUserId) : null;

  return {
    _id: post._id,
    text: post.text,
    image: post.image,
    createdAt: post.createdAt,
    user: {
      _id: post.user._id,
      name: post.user.name,
      avatar: post.user.avatar,
    },
    likes: post.likes || [],
    likesCount: (post.likes || []).length,
    commentsCount: (post.comments || []).length,
    comments: (post.comments || []).map((c) => ({
      _id: c._id,
      text: c.text,
      createdAt: c.createdAt,
      user: c.user && c.user._id
        ? { _id: c.user._id, name: c.user.name, avatar: c.user.avatar }
        : null,
    })),
    likedByMe: userId
      ? (post.likes || []).some((id) => String(id) === userId)
      : false,
  };
};

/**
 * POST /api/posts
 * Body: FormData with optional 'text' and optional 'image' file.
 * Creates a new post. At least one of text/image is required.
 */
exports.createPost = asyncHandler(async (req, res) => {
  const text = (req.body.text || '').trim();

  if (!text && !req.file) {
    return res
      .status(400)
      .json({ message: 'A post must contain text, an image, or both' });
  }

  let imageUrl = '';
  if (req.file) {
    imageUrl = await uploadImage(req.file.buffer);
  }

  const post = await Post.create({
    user: req.user._id,
    text,
    image: imageUrl,
  });

  const populated = await Post.findById(post._id).populate('user', 'name avatar');
  res.status(201).json({ post: serializePost(populated, req.user._id) });
});

/**
 * GET /api/posts?cursor=<postId>&limit=10
 * Public feed of all posts, newest first, cursor-based pagination.
 * Each response contains the nextCursor to load the following page.
 */
exports.getFeed = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  const cursor = req.query.cursor;

  const query = {};
  if (cursor) {
    const cursorPost = await Post.findById(cursor).select('createdAt _id');
    if (cursorPost) {
      query.$or = [
        { createdAt: { $lt: cursorPost.createdAt } },
        {
          createdAt: cursorPost.createdAt,
          _id: { $lt: cursorPost._id },
        },
      ];
    }
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
    .populate('user', 'name avatar')
    .populate('comments.user', 'name avatar');

  const hasMore = posts.length > limit;
  const pagePosts = hasMore ? posts.slice(0, limit) : posts;

  const nextCursor = hasMore ? pagePosts[pagePosts.length - 1]._id : null;

  res.json({
    posts: pagePosts.map((p) => serializePost(p, req.user?._id)),
    nextCursor,
    hasMore,
  });
});

/**
 * POST /api/posts/:id/like
 * Toggles the like state for the authenticated user on a post.
 */
exports.toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const userId = req.user._id;
  const hasLiked = post.likes.some((id) => String(id) === String(userId));

  if (hasLiked) {
    post.likes = post.likes.filter((id) => String(id) !== String(userId));
  } else {
    post.likes.push(userId);
  }

  await post.save();

  res.json({
    liked: !hasLiked,
    likesCount: post.likes.length,
  });
});

/**
 * POST /api/posts/:id/comment
 * Body: { text }
 * Adds a comment to a post and stores the commenting user's reference.
 */
exports.addComment = asyncHandler(async (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const comment = { user: req.user._id, text };
  post.comments.push(comment);
  await post.save();

  const savedComment = post.comments[post.comments.length - 1];

  res.status(201).json({
    comment: {
      _id: savedComment._id,
      text: savedComment.text,
      createdAt: savedComment.createdAt,
      user: { _id: req.user._id, name: req.user.name, avatar: req.user.avatar },
    },
    commentsCount: post.comments.length,
  });
});

/**
 * GET /api/posts/:id
 * Fetch a single post with full details (e.g. after leaving a comment).
 */
exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('user', 'name avatar')
    .populate('comments.user', 'name avatar');
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json({ post: serializePost(post, req.user?._id) });
});