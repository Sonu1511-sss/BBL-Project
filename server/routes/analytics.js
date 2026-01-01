import express from 'express';

const router = express.Router();

// @route   GET /api/analytics/stats
// @desc    Get analytics stats
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    res.json({
      totalCourses: 0,
      totalQuestions: 0,
      activeTracks: 0,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
