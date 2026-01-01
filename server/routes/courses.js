import express from 'express';
import Course from '../models/Course.js';
import Track from '../models/Track.js';
import Question from '../models/Question.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Optional auth middleware
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore auth errors
  }
  next();
};

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .select('title slug description category thumbnail enrolledCount')
      .sort({ createdAt: -1 });
    
    res.json({ courses: courses || [] });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/courses/track/:track
// @desc    Get track with sections and questions (with user status if authenticated)
// @access  Public (with optional auth)
router.get('/track/:track', optionalAuth, async (req, res) => {
  try {
    // Map URL track names to database track names
    const trackMap = {
      'DSA Patterns': 'DSA Patterns',
      'System Design': 'System Design',
      'DBMS': 'DBMS',
      'CN': 'CN',
      'OS': 'OS',
    };
    
    const trackName = decodeURIComponent(req.params.track);
    const dbTrackName = trackMap[trackName] || trackName;
    let track = await Track.findOne({ track: dbTrackName });

    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    // Add user status to questions if authenticated
    if (req.user) {
      const trackObj = track.toObject();
      for (const section of trackObj.sections) {
        for (const question of section.questions) {
          const questionDoc = await Question.findOne({
            track: dbTrackName,
            section: section.name,
            id: question.id,
          });

          if (questionDoc && questionDoc.userStatus) {
            const userStatus = questionDoc.userStatus.find(
              us => us.userId.toString() === req.user._id.toString()
            );
            question.userStatus = userStatus || null;
          }
        }
      }
      res.json({ track: trackObj });
    } else {
      res.json({ track });
    }
  } catch (error) {
    console.error('Get track error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/courses/track/:track/sections/:sectionName
// @desc    Get questions for a specific section
// @access  Public (with optional auth)
router.get('/track/:track/sections/:sectionName', optionalAuth, async (req, res) => {
  try {
    const track = await Track.findOne({ track: req.params.track });
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    const section = track.sections.find(s => s.name === req.params.sectionName);
    
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    // Add user status if authenticated
    if (req.user) {
      const sectionObj = section.toObject();
      for (const question of sectionObj.questions) {
        const questionDoc = await Question.findOne({
          track: req.params.track,
          section: req.params.sectionName,
          id: question.id,
        });

        if (questionDoc && questionDoc.userStatus) {
          const userStatus = questionDoc.userStatus.find(
            us => us.userId.toString() === req.user._id.toString()
          );
          question.userStatus = userStatus || null;
        }
      }
      res.json({ section: sectionObj });
    } else {
      res.json({ section });
    }
  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

