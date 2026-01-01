import express from 'express';
import Mentor from '../models/Mentor.js';
import Booking from '../models/Booking.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/mentors - public list
router.get('/', async (_req, res) => {
  try {
    const mentors = await Mentor.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ mentors });
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/mentors/:id/availability - public
router.get('/:id/availability', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
    res.json({ availability: mentor.availability || [] });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/mentors/bookings - book a session (auth required)
router.post('/bookings', authenticate, async (req, res) => {
  try {
    const { mentorId, sessionType, scheduledAt, duration, notes } = req.body;
    if (!mentorId || !sessionType || !scheduledAt) {
      return res.status(400).json({ error: 'mentorId, sessionType, and scheduledAt are required' });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });

    const booking = await Booking.create({
      studentId: req.user._id,
      mentorId,
      sessionType,
      scheduledAt,
      duration: duration || 60,
      status: 'pending',
      notes,
      meetingLink: 'https://meet.example.com/demo-link' // placeholder
    });

    res.status(201).json({ booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/mentors/bookings/me - current user bookings
router.get('/bookings/me', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ studentId: req.user._id })
      .populate('mentorId')
      .sort({ scheduledAt: 1 });
    res.json({ bookings });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

