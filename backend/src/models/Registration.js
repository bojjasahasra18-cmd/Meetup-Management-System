/**
 * src/models/Registration.js
 * Mongoose schema and model for the Registration entity.
 * Records that a User has registered for a specific Meetup.
 * Enforces unique registration per user per meetup.
 */

const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
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
    whyAttend: {
      type: String,
      default: '',
    },
    learn: {
      type: String,
      default: '',
    },
    contribute: {
      type: String,
      default: '',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce one registration per user per meetup
registrationSchema.index({ userId: 1, meetupId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
