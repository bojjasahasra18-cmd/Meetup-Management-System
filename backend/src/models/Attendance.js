/**
 * src/models/Attendance.js
 * Mongoose schema and model for the Attendance entity.
 * Tracks user check-in status and timestamps for a meetup.
 */

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    meetupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meetup',
      required: [true, 'Meetup reference is required'],
    },
    checkedInAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['checked-in', 'absent'],
      default: 'checked-in',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent double check-in
attendanceSchema.index({ userId: 1, meetupId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
