import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Cohort from '../models/Cohort.js';
import Course from '../models/Course.js';

const router = express.Router();

// @route   GET /api/cohorts
// @desc    Get all cohorts (public and user's cohorts)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { courseId, isPaid } = req.query;
    
    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (isPaid !== undefined) filter.isPaid = isPaid === 'true';

    const cohorts = await Cohort.find(filter)
      .populate('courseId', 'title slug category')
      .populate('createdBy', 'name profile.avatar')
      .populate('members.userId', 'name profile.avatar')
      .sort({ startDate: -1 });

    res.json({ cohorts });
  } catch (error) {
    console.error('Get cohorts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/cohorts/my-cohorts
// @desc    Get user's enrolled cohorts
// @access  Private
router.get('/my-cohorts', authenticate, async (req, res) => {
  try {
    const cohorts = await Cohort.find({
      'members.userId': req.user._id
    })
      .populate('courseId', 'title slug category')
      .populate('createdBy', 'name profile.avatar')
      .populate('members.userId', 'name profile.avatar')
      .sort({ startDate: -1 });

    res.json({ cohorts });
  } catch (error) {
    console.error('Get my cohorts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/cohorts
// @desc    Create a new cohort
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, courseId, startDate, endDate, isPaid, price, maxMembers, liveSessions } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ error: 'Name, start date, and end date are required' });
    }

    const cohort = new Cohort({
      name,
      description,
      courseId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isPaid: isPaid || false,
      price: price || 0,
      maxMembers: maxMembers || 50,
      liveSessions: liveSessions || [],
      createdBy: req.user._id,
      members: [{
        userId: req.user._id,
        joinedAt: new Date()
      }]
    });

    await cohort.save();
    await cohort.populate('courseId', 'title slug category');
    await cohort.populate('createdBy', 'name profile.avatar');

    res.status(201).json({ cohort });
  } catch (error) {
    console.error('Create cohort error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/cohorts/:id/join
// @desc    Join a cohort
// @access  Private
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.id);

    if (!cohort) {
      return res.status(404).json({ error: 'Cohort not found' });
    }

    // Check if already a member
    const isMember = cohort.members.some(
      m => m.userId.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({ error: 'Already a member of this cohort' });
    }

    // Check if full
    if (cohort.members.length >= cohort.maxMembers) {
      return res.status(400).json({ error: 'Cohort is full' });
    }

    cohort.members.push({
      userId: req.user._id,
      joinedAt: new Date()
    });

    await cohort.save();
    await cohort.populate('members.userId', 'name profile.avatar');

    res.json({ cohort });
  } catch (error) {
    console.error('Join cohort error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/cohorts/:id
// @desc    Get cohort details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.id)
      .populate('courseId', 'title slug category')
      .populate('createdBy', 'name profile.avatar')
      .populate('members.userId', 'name profile.avatar');

    if (!cohort) {
      return res.status(404).json({ error: 'Cohort not found' });
    }

    res.json({ cohort });
  } catch (error) {
    console.error('Get cohort error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

