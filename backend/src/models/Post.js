const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxlength: [300, 'Comment cannot exceed 300 characters'],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Post model - a feed item that can contain text and/or an image.
 * likes    : references the users who liked the post
 * comments : embedded list of {user, text, createdAt} comments
 */
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: [1000, 'Post cannot exceed 1000 characters'],
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

/**
 * Validate that a post contains at least text or an image.
 */
postSchema.pre('validate', function (next) {
  if (!this.text && !this.image) {
    const error = new Error('A post must contain text or an image');
    error.name = 'ValidationError';
    return next(error);
  }
  next();
});

// Index for cursor-based pagination on the feed (sorted by createdAt desc).
postSchema.index({ createdAt: -1, _id: -1 });

module.exports = mongoose.model('Post', postSchema);