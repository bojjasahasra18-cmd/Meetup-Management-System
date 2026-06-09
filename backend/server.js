/**
 * server.js
 * Entry point for the Meetup Management System backend.
 * Loads environment variables, connects to MongoDB, and starts the HTTP server.
 */

const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running in ${
          process.env.NODE_ENV || 'development'
        } mode on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
  });