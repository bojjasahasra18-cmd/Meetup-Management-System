/**
 * src/controllers/registrationController.js
 * Manages user registration requests for meetup events.
 */

const Registration = require('../models/Registration');
const Meetup = require('../models/Meetup');

/**
 * @desc    Register the authenticated user for a meetup
 * @route   POST /api/meetups/:id/register
 * @access  Private
 */
const registerForMeetup = async (req, res, next) => {
  try {
    const meetupId = req.params.id;
    const userId = req.user._id;
    const { whyAttend, learn, contribute } = req.body;

    // 1. Verify meetup existence
    const meetup = await Meetup.findById(meetupId);
    if (!meetup) {
      return res.status(404).json({ message: 'Meetup not found' });
    }

    // 2. Check registration deadline
    if (new Date() > new Date(meetup.registrationDeadline)) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    // 3. Prevent duplicate registration
    const existingRegistration = await Registration.findOne({ userId, meetupId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this meetup' });
    }

    // 4. Check capacity (count existing registrations)
    const registeredCount = await Registration.countDocuments({ meetupId });
    if (registeredCount >= meetup.capacity) {
      return res.status(400).json({ message: 'Meetup capacity is full' });
    }

    // 5. Create the registration record
    const registration = await Registration.create({
      userId,
      meetupId,
      whyAttend: whyAttend || '',
      learn: learn || '',
      contribute: contribute || '',
      registeredAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Successfully registered for meetup',
      registration,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForMeetup,
};
