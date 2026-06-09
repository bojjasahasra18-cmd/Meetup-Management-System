/**
 * src/controllers/attendanceController.js
 * Handles user check-in operations and retrieves live attendee lists.
 */

const Attendance = require('../models/Attendance');
const Registration = require('../models/Registration');
const Meetup = require('../models/Meetup');

/**
 * @desc    Check-in the authenticated user for a meetup
 * @route   POST /api/meetups/:id/checkin
 * @access  Private
 */
const checkInAttendee = async (req, res, next) => {
  try {
    const meetupId = req.params.id;
    const userId = req.user._id;

    // Check if meetup exists
    const meetup = await Meetup.findById(meetupId);
    if (!meetup) {
      return res.status(404).json({ message: 'Meetup not found' });
    }

    // 1. Only registered users can check in
    const isRegistered = await Registration.findOne({ userId, meetupId });
    if (!isRegistered) {
      return res.status(400).json({ message: 'Only registered users can check in' });
    }

    // 2. Prevent double check-in
    const existingAttendance = await Attendance.findOne({ userId, meetupId });
    if (existingAttendance) {
      return res.status(400).json({ message: 'You are already checked in for this meetup' });
    }

    // 3. Save check-in details
    const attendance = await Attendance.create({
      userId,
      meetupId,
      checkedInAt: new Date(),
      status: 'checked-in',
    });

    res.status(201).json({
      success: true,
      message: 'Successfully checked in',
      attendance,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get live attendees of a meetup
 * @route   GET /api/meetups/:id/attendees
 * @access  Private
 */
const getLiveAttendees = async (req, res, next) => {
  try {
    const meetupId = req.params.id;

    const attendances = await Attendance.find({ meetupId })
      .populate('userId', 'name profession company profilePicture');

    const attendees = attendances
      .filter((att) => att.userId) // filter out if user profile is deleted
      .map((att) => ({
        name: att.userId.name,
        profession: att.userId.profession,
        company: att.userId.company,
        profilePicture: att.userId.profilePicture,
      }));

    res.status(200).json({
      success: true,
      count: attendees.length,
      attendees,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkInAttendee,
  getLiveAttendees,
};
