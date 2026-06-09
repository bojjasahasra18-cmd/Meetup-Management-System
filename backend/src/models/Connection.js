/**
 * src/models/Connection.js
 * Mongoose schema and model for the Connection entity.
 * Represents a connection (follow/friend/networking request) between two users.
 */

const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender reference is required'],
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver reference is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate connection documents between the same sender and receiver
connectionSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

module.exports = mongoose.model('Connection', connectionSchema);
