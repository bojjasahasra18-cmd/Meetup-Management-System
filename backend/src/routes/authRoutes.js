/**
 * src/routes/authRoutes.js
 * Route definitions for authentication endpoints.
 * Maps HTTP methods + paths to controller functions.
 */

const express = require('express');
const router  = express.Router();

const {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// ── Public Routes ──────────────────────────────────────────────────────────────
router.post('/register', register);   // POST /api/auth/register
router.post('/login',    login);      // POST /api/auth/login

// ── Protected Routes (require valid JWT) ──────────────────────────────────────
router.get('/me',              protect, getMe);           // GET  /api/auth/me
router.put('/me',              protect, updateMe);        // PUT  /api/auth/me
router.put('/change-password', protect, changePassword);  // PUT  /api/auth/change-password

module.exports = router;
