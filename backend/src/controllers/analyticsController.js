/**
 * src/controllers/analyticsController.js
 * Computes meetup metrics and platform activity analytics using MongoDB aggregation pipelines.
 */

const Meetup = require('../models/Meetup');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

/**
 * @desc    Get meetup metrics (Total registrations, total check-ins, percentage, most active users)
 * @route   GET /api/meetups/:id/analytics
 * @access  Private
 */
const getMeetupAnalytics = async (req, res, next) => {
  try {
    const meetupId = new mongoose.Types.ObjectId(req.params.id);

    const meetup = await Meetup.findById(meetupId);
    if (!meetup) {
      return res.status(404).json({ message: 'Meetup not found' });
    }

    // 1. Aggregation pipeline to count registrations
    const regStats = await Registration.aggregate([
      { $match: { meetupId } },
      { $count: 'count' },
    ]);
    const totalRegistrations = regStats.length > 0 ? regStats[0].count : 0;

    // 2. Aggregation pipeline to count actual check-ins
    const checkinStats = await Attendance.aggregate([
      { $match: { meetupId, status: 'checked-in' } },
      { $count: 'count' },
    ]);
    const totalCheckIns = checkinStats.length > 0 ? checkinStats[0].count : 0;

    // Attendance rate
    const attendancePercentage = totalRegistrations > 0
      ? parseFloat(((totalCheckIns / totalRegistrations) * 100).toFixed(2))
      : 0;

    // 3. Aggregation pipeline to find the most active members on the platform (by number of check-ins)
    const mostActiveMembers = await Attendance.aggregate([
      { $match: { status: 'checked-in' } },
      {
        $group: {
          _id: '$userId',
          checkInCount: { $sum: 1 },
        },
      },
      { $sort: { checkInCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          checkInCount: 1,
          name: '$user.name',
          profession: '$user.profession',
          company: '$user.company',
          profilePicture: '$user.profilePicture',
        },
      },
    ]);

const domainStats = await Registration.aggregate([
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $unwind: '$user',
  },
  {
    $group: {
      _id: '$user.lookingFor',
      count: { $sum: 1 },
    },
  },
  {
    $sort: {
      count: -1,
    },
  },
]);

    res.status(200).json({
      success: true,
      analytics: {
        totalRegistrations,
        totalCheckIns,
        attendancePercentage,
        mostActiveMembers,
        domainStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMeetupAnalytics,
};
