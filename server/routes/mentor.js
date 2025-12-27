import express from 'express';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/mentor/list
// @desc    Get list of available mentors
// @access  Public
router.get('/list', async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' })
      .select('name email profile')
      .limit(20);

    res.json({ mentors });
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/mentor/book-session
// @desc    Book a mentor session (optional feature)
// @access  Private
router.post('/book-session', authenticate, async (req, res) => {
  try {
    const { mentorId, sessionType, scheduledAt, duration = 30 } = req.body;

    if (!mentorId || !sessionType || !scheduledAt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify mentor exists
    const mentor = await User.findOne({ _id: mentorId, role: 'mentor' });
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    // Check if slot is available (basic check - can be enhanced)
    const conflictingBooking = await Booking.findOne({
      mentorId,
      scheduledAt: new Date(scheduledAt),
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingBooking) {
      return res.status(400).json({ error: 'Time slot not available' });
    }

    const booking = new Booking({
      studentId: req.user._id,
      mentorId,
      sessionType,
      scheduledAt: new Date(scheduledAt),
      duration,
      status: 'pending'
    });

    await booking.save();
    await booking.populate('mentorId', 'name email profile');
    await booking.populate('studentId', 'name email');

    res.status(201).json({ 
      booking,
      message: 'Booking created successfully!'
    });
  } catch (error) {
    console.error('Book session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/mentor/my-bookings
// @desc    Get user's bookings (as student or mentor)
// @access  Private
router.get('/my-bookings', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [
        { studentId: req.user._id },
        { mentorId: req.user._id }
      ]
    })
      .populate('studentId', 'name email')
      .populate('mentorId', 'name email profile')
      .sort({ scheduledAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/mentor/booking/:id/confirm
// @desc    Confirm a booking
// @access  Private
router.put('/booking/:id/confirm', authenticate, async (req, res) => {
  try {
    const { meetingLink } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify user owns the booking
    if (booking.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    booking.status = 'confirmed';
    if (meetingLink) booking.meetingLink = meetingLink;

    await booking.save();
    res.json({ booking });
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/mentor/booking/:id/feedback
// @desc    Add feedback after session
// @access  Private
router.post('/booking/:id/feedback', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    booking.feedback = { rating, comment };
    booking.status = 'completed';
    await booking.save();

    res.json({ booking });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

