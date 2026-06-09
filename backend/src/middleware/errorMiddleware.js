/**
 * src/middleware/errorMiddleware.js
 * Centralized error handling middleware for Express.
 *
 * - notFound     → catches any request that didn't match a route (404).
 * - errorHandler → formats all thrown errors into a consistent JSON response.
 */

/**
 * Middleware: Handle 404 Not Found for unmatched routes.
 * Creates an Error and passes it to the next error handler.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware: Global error handler.
 * Catches errors forwarded via next(error) from any route or middleware.
 * Returns a consistent JSON error shape in all environments.
 *
 * In production, stack traces are hidden.
 */
const errorHandler = (err, req, res, next) => {
  // If the status is still 200 when an error occurs, set it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only expose stack trace in development
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
