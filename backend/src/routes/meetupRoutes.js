/**
 * src/routes/meetupRoutes.js
 * Route definitions for meetup CRUD and related actions.
 */

const express = require('express');
const router  = express.Router();

const {
  getAllMeetups,
  getMeetupById,
  createMeetup,
  updateMeetup,
  deleteMeetup,
  exportMeetupCSV,
} = require('../controllers/meetupController');

const { registerForMeetup } = require('../controllers/registrationController');
const { checkInAttendee, getLiveAttendees } = require('../controllers/attendanceController');
const { getMeetupAnalytics } = require('../controllers/analyticsController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// ── Public Routes ──────────────────────────────────────────────────────────────
router.get('/',    getAllMeetups);   // GET /api/meetups
router.get('/:id', getMeetupById);  // GET /api/meetups/:id

// ── Protected Routes (require authentication) ───────────────────────────────────
router.use(protect);

router.post('/:id/register',  registerForMeetup);  // POST /api/meetups/:id/register
router.post('/:id/checkin',   checkInAttendee);    // POST /api/meetups/:id/checkin
router.get('/:id/attendees',  getLiveAttendees);   // GET /api/meetups/:id/attendees
router.get('/:id/analytics',  getMeetupAnalytics); // GET /api/meetups/:id/analytics
router.get('/:id/export',     exportMeetupCSV);    // GET /api/meetups/:id/export

// Organizer / Admin only CRUD
router.post(
  '/',
  authorizeRoles('organizer', 'admin'),
  createMeetup
); // POST /api/meetups

router.put(
  '/:id',
  authorizeRoles('organizer', 'admin'),
  updateMeetup
); // PUT /api/meetups/:id

router.delete(
  '/:id',
  authorizeRoles('organizer', 'admin'),
  deleteMeetup
); // DELETE /api/meetups/:id

module.exports = router;
