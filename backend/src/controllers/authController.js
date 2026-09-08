const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const asyncHandler = require('../utils/asyncHandler');

/**
 * POST /api/auth/signup
 * Body: { name, email, password }
 * Creates a new user account and returns an auth token.
 */
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const user = await User.create({ name, email, passwordHash: password });

  const token = signToken(user._id);

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
  });
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns an auth token for a valid email/password pair.
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(user._id);

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
  });
});

/**
 * GET /api/auth/me
 * Returns the currently authenticated user.
 */
exports.getMe = asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    },
  });
});