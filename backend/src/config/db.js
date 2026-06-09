/**
 * src/config/db.js
 * MongoDB connection configuration using Mongoose.
 * Reads the connection URI from the MONGO_URI environment variable.
 * Call connectDB() once at application startup (in server.js).
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit with failure if DB connection cannot be established
  }
};

module.exports = connectDB;
