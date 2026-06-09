/**
 * src/controllers/connectionController.js
 * Manages networking connections and connection requests between users.
 */

const Connection = require('../models/Connection');
const User = require('../models/User');

/**
 * @desc    Send a connection request to another user
 * @route   POST /api/connections/send
 * @access  Private
 */
const sendConnectionRequest = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: 'receiverId is required' });
    }

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: 'You cannot send a connection request to yourself' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Recipient user not found' });
    }

    // Check if connection request already exists in either direction
    const existingConnection = await Connection.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({
        message: `Connection already exists with status: ${existingConnection.status}`
      });
    }

    const connection = await Connection.create({
      senderId,
      receiverId,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Connection request sent',
      connection
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Accept a pending connection request
 * @route   POST /api/connections/accept
 * @access  Private
 */
const acceptConnectionRequest = async (req, res, next) => {
  try {
    const receiverId = req.user._id;
    const { senderId } = req.body;

    if (!senderId) {
      return res.status(400).json({ message: 'senderId is required' });
    }

    // Find the pending request sent by the senderId to the current user
    const connection = await Connection.findOne({
      senderId,
      receiverId,
      status: 'pending'
    });

    if (!connection) {
      return res.status(404).json({ message: 'Pending connection request not found' });
    }

    connection.status = 'accepted';
    await connection.save();

    res.status(200).json({
      success: true,
      message: 'Connection request accepted',
      connection
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all active (accepted) connections for the authenticated user
 * @route   GET /api/connections/my
 * @access  Private
 */
const getMyConnections = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find all accepted connections where the user is either sender or receiver
    const connections = await Connection.find({
      status: 'accepted',
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
    .populate('senderId', 'name email profession company profilePicture')
    .populate('receiverId', 'name email profession company profilePicture');

    // Extract details of the other user in each connection
    const connectedUsers = connections.map(conn => {
      const isSender = conn.senderId._id.toString() === userId.toString();
      const otherUser = isSender ? conn.receiverId : conn.senderId;
      return {
        connectionId: conn._id,
        user: otherUser
      };
    });

    res.status(200).json({
      success: true,
      count: connectedUsers.length,
      connections: connectedUsers
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendConnectionRequest,
  acceptConnectionRequest,
  getMyConnections
};
