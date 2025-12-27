import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Progress from '../models/Progress.js';
import Course from '../models/Course.js';
import Achievement from '../models/Achievement.js';

const router = express.Router();

// @route   GET /api/analytics/stats
// @desc    Get user learning statistics
// @access  Private
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get progress stats
    const progressData = await Progress.find({ userId });
    
    const totalLessons = progressData.length;
    const completedLessons = progressData.filter(p => p.completed).length;
    const totalTimeSpent = progressData.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    
    // Get enrolled courses
    const enrolledCourses = await Course.find({
      _id: { $in: req.user.enrolledCourses?.map(ec => ec.courseId) || [] }
    });

    // Get achievements
    const achievements = await Achievement.find({ userId });

    // Calculate weekly stats
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyProgress = progressData.filter(
      p => p.completedAt && new Date(p.completedAt) >= oneWeekAgo
    );

    res.json({
      stats: {
        totalLessons,
        completedLessons,
        completionRate: totalLessons > 0 ? (completedLessons / totalLessons * 100).toFixed(1) : 0,
        totalTimeSpent, // in minutes
        enrolledCourses: enrolledCourses.length,
        achievements: achievements.length,
        weeklyCompleted: weeklyProgress.length,
        currentStreak: req.user.streak?.current || 0,
        longestStreak: req.user.streak?.longest || 0
      },
      enrolledCourses: enrolledCourses.map(c => ({
        id: c._id,
        title: c.title,
        category: c.category
      })),
      recentAchievements: achievements.slice(-5).reverse()
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/analytics/leaderboard
// @desc    Get leaderboard (top users by streaks, progress, etc.)
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'streak' } = req.query;

    // This is a simplified version - in production, you'd use aggregation
    const User = (await import('../models/User.js')).default;
    
    let leaderboard = [];
    
    if (type === 'streak') {
      const users = await User.find({ 'streak.current': { $gt: 0 } })
        .select('name profile.avatar streak')
        .sort({ 'streak.current': -1 })
        .limit(50);
      
      leaderboard = users.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        avatar: user.profile?.avatar,
        value: user.streak.current,
        label: 'day streak'
      }));
    } else if (type === 'progress') {
      // Get users with most completed lessons
      const progressData = await Progress.aggregate([
        { $match: { completed: true } },
        { $group: { _id: '$userId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 50 }
      ]);

      const userIds = progressData.map(p => p._id);
      const users = await User.find({ _id: { $in: userIds } })
        .select('name profile.avatar');

      leaderboard = progressData.map((p, index) => {
        const user = users.find(u => u._id.toString() === p._id.toString());
        return {
          rank: index + 1,
          name: user?.name || 'Anonymous',
          avatar: user?.profile?.avatar,
          value: p.count,
          label: 'lessons completed'
        };
      });
    }

    res.json({ leaderboard, type });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

