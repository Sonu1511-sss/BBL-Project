import express from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get user settings
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('name email profile role');

    res.json({
      settings: {
        profile: {
          name: user.name,
          email: user.email,
          bio: user.profile?.bio || '',
          avatar: user.profile?.avatar || '',
          currentGoal: user.profile?.currentGoal || ''
        },
        notifications: {
          email: true, // Default
          push: true,
          streak: true,
          achievements: true,
          community: true
        },
        preferences: {
          theme: 'dark', // Default dark theme
          language: 'en'
        }
      }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/settings/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, bio, currentGoal, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) {
      if (!user.profile) user.profile = {};
      user.profile.bio = bio;
    }
    if (currentGoal !== undefined) {
      if (!user.profile) user.profile = {};
      user.profile.currentGoal = currentGoal;
    }
    if (avatar) {
      if (!user.profile) user.profile = {};
      user.profile.avatar = avatar;
    }

    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/settings/password
// @desc    Update user password
// @access  Private
router.put('/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Password change not available for Google accounts' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

