import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Achievement from '../models/Achievement.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/achievements
// @desc    Get user achievements
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.user._id })
      .sort({ unlockedAt: -1 });

    const totalPoints = achievements.reduce((sum, a) => sum + (a.points || 0), 0);

    res.json({
      achievements,
      totalPoints,
      count: achievements.length
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/achievements/available
// @desc    Get all available achievements (for display)
// @access  Public
router.get('/available', async (req, res) => {
  try {
    // Define available achievements
    const availableAchievements = [
      {
        type: 'streak',
        title: 'First Streak',
        description: 'Complete 1 day streak',
        icon: '🔥',
        points: 10,
        requirement: 1
      },
      {
        type: 'streak',
        title: 'Week Warrior',
        description: 'Complete 7 day streak',
        icon: '🔥',
        points: 50,
        requirement: 7
      },
      {
        type: 'streak',
        title: 'Month Master',
        description: 'Complete 30 day streak',
        icon: '🔥',
        points: 200,
        requirement: 30
      },
      {
        type: 'course',
        title: 'First Course',
        description: 'Complete your first course',
        icon: '📚',
        points: 25,
        requirement: 1
      },
      {
        type: 'lesson',
        title: 'Quick Learner',
        description: 'Complete 10 lessons',
        icon: '⚡',
        points: 30,
        requirement: 10
      },
      {
        type: 'community',
        title: 'Helper',
        description: 'Get 10 upvotes on your posts',
        icon: '💬',
        points: 40,
        requirement: 10
      }
    ];

    res.json({ achievements: availableAchievements });
  } catch (error) {
    console.error('Get available achievements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/achievements/check
// @desc    Check and unlock achievements (called after actions)
// @access  Private
router.post('/check', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const newlyUnlocked = [];

    // Check streak achievements
    const user = await User.findById(userId);
    if (user?.streak) {
      const streakAchievements = [
        { requirement: 1, title: 'First Streak', points: 10 },
        { requirement: 7, title: 'Week Warrior', points: 50 },
        { requirement: 30, title: 'Month Master', points: 200 }
      ];

      for (const ach of streakAchievements) {
        if (user.streak.current >= ach.requirement) {
          const exists = await Achievement.findOne({
            userId,
            type: 'streak',
            title: ach.title
          });

          if (!exists) {
            const achievement = new Achievement({
              userId,
              type: 'streak',
              title: ach.title,
              description: `Complete ${ach.requirement} day streak`,
              icon: '🔥',
              points: ach.points
            });
            await achievement.save();
            newlyUnlocked.push(achievement);
          }
        }
      }
    }

    // Check lesson completion achievements
    const completedLessons = await Progress.countDocuments({
      userId,
      completed: true
    });

    if (completedLessons >= 10) {
      const exists = await Achievement.findOne({
        userId,
        type: 'lesson',
        title: 'Quick Learner'
      });

      if (!exists) {
        const achievement = new Achievement({
          userId,
          type: 'lesson',
          title: 'Quick Learner',
          description: 'Complete 10 lessons',
          icon: '⚡',
          points: 30
        });
        await achievement.save();
        newlyUnlocked.push(achievement);
      }
    }

    res.json({ newlyUnlocked });
  } catch (error) {
    console.error('Check achievements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

