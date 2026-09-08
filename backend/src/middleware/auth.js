const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

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

module.exports = { protect };