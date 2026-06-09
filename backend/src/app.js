/**
 * src/app.js
 * Express application setup.
 * Configures middleware (CORS, JSON parsing) and mounts all route modules.
 * Does NOT start the HTTP server — that is handled by server.js.
 */

const express = require('express');
const cors = require('cors');

const authRoutes         = require('./routes/authRoutes');
const meetupRoutes       = require('./routes/meetupRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const attendanceRoutes   = require('./routes/attendanceRoutes');
const analyticsRoutes    = require('./routes/analyticsRoutes');
const connectionRoutes   = require('./routes/connectionRoutes');

const { protect } = require('./middleware/authMiddleware');
const { getHistory } = require('./controllers/meetupController');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ── Global Middleware ──────────────────────────────────────────────────────────
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);              // Enable Cross-Origin Resource Sharing
app.use(express.json());        // Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Meetup Management API is running 🚀' });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/meetups',       meetupRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/attendance',    attendanceRoutes);
app.use('/api/analytics',     analyticsRoutes);
app.use('/api/connections',   connectionRoutes);
app.get('/api/history',       protect, getHistory);

// ── Error Handling Middleware (must be last) ───────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
