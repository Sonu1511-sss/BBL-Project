import express from 'express';

const router = express.Router();

// @route   GET /api/progress/revision-list
// @desc    Get revision list
// @access  Private
router.get('/revision-list', async (req, res) => {
  try {
    res.json({ revisionList: [] });
  } catch (error) {
    console.error('Get revision list error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
