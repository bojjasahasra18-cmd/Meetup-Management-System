/**
 * src/models/Meetup.js
 * Mongoose schema and model for the Meetup entity.
 * Represents a scheduled meetup event created by an admin or organizer.
 */

const mongoose = require('mongoose');

const meetupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Meetup title is required'],
      trim: true,
    },
    banner: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Meetup description is required'],
    },
    date: {
      type: Date,
      required: [true, 'Meetup date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue/location description is required'],
    },
    googleMapsLink: {
      type: String,
      default: '',
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1 attendee'],
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required'],
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin/Organizer reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Meetup', meetupSchema);
