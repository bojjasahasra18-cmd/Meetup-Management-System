/**
 * src/routes/connectionRoutes.js
 * Route definitions for user connections (networking).
 */

const express = require('express');
const router  = express.Router();

const {
  sendConnectionRequest,
  acceptConnectionRequest,
  getMyConnections
} = require('../controllers/connectionController');

const { protect } = require('../middleware/authMiddleware');

// All connection routes require authentication
router.use(protect);

router.post('/send',   sendConnectionRequest);   // POST /api/connections/send
router.post('/accept', acceptConnectionRequest); // POST /api/connections/accept
router.get('/my',      getMyConnections);        // GET  /api/connections/my

module.exports = router;
