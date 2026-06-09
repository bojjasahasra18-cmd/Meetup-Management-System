/**
 * src/middleware/authMiddleware.js
 * JWT-based authentication and role-based authorization middleware.
 *
 * - protect     → verifies the JWT token; attaches req.user on success.
 * - authorizeRoles(...roles) → restricts a route to specific user roles.
 */

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: Verify JWT and attach the authenticated user to req.user.
 * Expects the token in the Authorization header: "Bearer <token>"
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // Verify the token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach fresh user document (without password) to the request
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

/**
 * Middleware factory: Restrict access to users with specific roles.
 * Must be used AFTER the protect middleware.
 *
 * Usage: router.get('/admin', protect, authorizeRoles('admin'), handler)
 *
 * @param  {...string} roles - Allowed role names (e.g. 'admin', 'organizer')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
