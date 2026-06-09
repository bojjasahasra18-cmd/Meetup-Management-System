/**
 * src/controllers/meetupController.js
 * Handles CRUD operations, history lookup, and registration data export for Meetups.
 */

const Meetup = require('../models/Meetup');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const { Parser } = require('json2csv');

/**
 * @desc    Get all meetups
 * @route   GET /api/meetups
 * @access  Public
 */
const getAllMeetups = async (req, res, next) => {
  try {
    const meetups = await Meetup.find().populate('adminId', 'name email profession company');
    res.status(200).json({
      success: true,
      count: meetups.length,
      meetups,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single meetup by ID
 * @route   GET /api/meetups/:id
 * @access  Public
 */
const getMeetupById = async (req, res, next) => {
  try {
    const meetup = await Meetup.findById(req.params.id).populate('adminId', 'name email profession company');
    if (!meetup) {
      return res.status(404).json({ message: 'Meetup not found' });
    }
    res.status(200).json({
      success: true,
      meetup,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new meetup
 * @route   POST /api/meetups
 * @access  Private (organizer / admin)
 */
const createMeetup = async (req, res, next) => {
  try {
    const {
      title,
      banner,
      description,
      date,
      startTime,
      endTime,
      venue,
      googleMapsLink,
      capacity,
      registrationDeadline,
    } = req.body;

    const meetup = await Meetup.create({
      title,
      banner: banner || '',
      description,
      date,
      startTime,
      endTime,
      venue,
      googleMapsLink: googleMapsLink || '',
      capacity,
      registrationDeadline,
      adminId: req.user._id,
    });

    res.status(201).json({
      success: true,
      meetup,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing meetup
 * @route   PUT /api/meetups/:id
 * @access  Private (organizer who owns meetup / admin)
 */
const updateMeetup = async (req, res, next) => {
  try {
    let meetup = await Meetup.findById(req.params.id);
    if (!meetup) {
      return res.status(404).json({ message: 'Meetup not found' });
    }

    // Check permissions: creator of the meetup or platform admin
    if (meetup.adminId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this meetup' });
    }

    meetup = await Meetup.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      meetup,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a meetup
 * @route   DELETE /api/meetups/:id
 * @access  Private (organizer who owns meetup / admin)
 */
const deleteMeetup = async (req, res, next) => {
  try {
    const meetup = await Meetup.findById(req.params.id);
    if (!meetup) {
      return res.status(404).json({ message: 'Meetup not found' });
    }

    // Check permissions
    if (meetup.adminId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this meetup' });
    }

    await meetup.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Meetup removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get completed meetups (Meetup History)
 * @route   GET /api/history
 * @access  Private
 */
const getHistory = async (req, res, next) => {
  try {
    // A completed meetup is defined as one whose event date is in the past
    const completedMeetups = await Meetup.find({
      date: { $lt: new Date() },
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: completedMeetups.length,
      meetups: completedMeetups,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export attendee list and registration responses to CSV
 * @route   GET /api/meetups/:id/export
 * @access  Private (organizer / admin)
 */
const exportMeetupCSV = async (req, res, next) => {
  try {
    const meetupId = req.params.id;

    const meetup = await Meetup.findById(meetupId);
    if (!meetup) {
      return res.status(404).json({ message: 'Meetup not found' });
    }

    // Check permissions
    if (meetup.adminId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to export registration data for this meetup' });
    }

    // Fetch all registrations for this meetup, populating user details
    const registrations = await Registration.find({ meetupId })
      .populate('userId', 'name email profession company');

    // Fetch all check-in attendance records for this meetup
    const attendances = await Attendance.find({ meetupId, status: 'checked-in' });
    const checkedInUserIds = new Set(attendances.map((att) => att.userId.toString()));

    // Map data to CSV layout
    const csvData = registrations.map((reg, index) => {
      const user = reg.userId || {};
      const hasCheckedIn = checkedInUserIds.has(user._id?.toString() || '');

      return {
        'S.No': index + 1,
        'Attendee Name': user.name || 'N/A',
        'Attendee Email': user.email || 'N/A',
        'Profession': user.profession || 'N/A',
        'Company': user.company || 'N/A',
        'Why Attend': reg.whyAttend || '',
        'What to Learn': reg.learn || '',
        'Contribution': reg.contribute || '',
        'Registered At': reg.registeredAt ? new Date(reg.registeredAt).toISOString() : '',
        'Attendance Status': hasCheckedIn ? 'Checked-In' : 'Absent',
      };
    });

    const fields = [
      'S.No',
      'Attendee Name',
      'Attendee Email',
      'Profession',
      'Company',
      'Why Attend',
      'What to Learn',
      'Contribution',
      'Registered At',
      'Attendance Status',
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment(`meetup-${meetupId}-registrations.csv`);
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMeetups,
  getMeetupById,
  createMeetup,
  updateMeetup,
  deleteMeetup,
  getHistory,
  exportMeetupCSV,
};
