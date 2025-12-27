import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update streak
    const today = new Date().toDateString();
    const lastActive = user.streak.lastActiveDate?.toDateString();
    
    if (lastActive !== today) {
      if (lastActive && new Date(user.streak.lastActiveDate).getTime() === new Date(today).getTime() - 86400000) {
        // Consecutive day
        user.streak.current += 1;
      } else {
        // Reset streak
        user.streak.current = 1;
      }
      user.streak.lastActiveDate = new Date();
      if (user.streak.current > user.streak.longest) {
        user.streak.longest = user.streak.current;
      }
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        streak: user.streak
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('enrolledCourses.courseId', 'title slug category');
    
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/google
// @desc    Google OAuth login/signup
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, name, avatar } = req.body;

    if (!googleId || !email || !name) {
      return res.status(400).json({ error: 'Missing required fields: googleId, email, and name are required' });
    }

    // Check if user exists by email or googleId
    let user = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { googleId }
      ]
    });

    if (user) {
      // Existing user - update Google ID and avatar if not set
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (avatar && (!user.profile || !user.profile.avatar)) {
        if (!user.profile) user.profile = {};
        user.profile.avatar = avatar;
      }
      // Update name if changed
      if (name && name !== user.name) {
        user.name = name;
      }
      await user.save();
    } else {
      // New user - create account
      user = new User({
        name,
        email: email.toLowerCase(),
        googleId,
        profile: { 
          avatar: avatar || undefined
        }
      });
      await user.save();
    }

    // Update streak
    const today = new Date();
    const todayStr = today.toDateString();
    const lastActive = user.streak.lastActiveDate ? new Date(user.streak.lastActiveDate).toDateString() : null;
    
    if (lastActive !== todayStr) {
      if (lastActive) {
        const lastActiveTime = new Date(user.streak.lastActiveDate).getTime();
        const todayTime = today.getTime();
        const diffDays = Math.floor((todayTime - lastActiveTime) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day
          user.streak.current += 1;
        } else {
          // Streak broken
          user.streak.current = 1;
        }
      } else {
        // First time
        user.streak.current = 1;
      }
      
      user.streak.lastActiveDate = today;
      if (user.streak.current > user.streak.longest) {
        user.streak.longest = user.streak.current;
      }
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        streak: user.streak,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Server error during Google authentication' });
  }
});

export default router;

