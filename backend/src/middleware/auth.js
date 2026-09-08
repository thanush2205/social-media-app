const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Optional auth middleware - used on public endpoints.
 * If a valid Bearer token is present it attaches the user to req.user,
 * but it never rejects the request (the endpoint stays public).
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const payload = verifyToken(authHeader.split(' ')[1]);
      if (payload) {
        const user = await User.findById(payload.id).select(
          'name email avatar createdAt'
        );
        if (user) req.user = user;
      }
    }
  } catch {
    // ignore - the endpoint remains public
  }
  next();
};

/**
 * Auth middleware - protects routes by verifying the Bearer token
 * and attaching the authenticated user to req.user.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }

    const user = await User.findById(payload.id).select(
      'name email avatar createdAt'
    );
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token validation failed' });
  }
};

module.exports = { protect, optionalAuth };