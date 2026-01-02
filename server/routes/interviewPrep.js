import express from 'express';
import InterviewPrep from '../models/InterviewPrep.js';

const router = express.Router();

// GET /api/interview-prep - public list
router.get('/', async (_req, res) => {
  try {
    const items = await InterviewPrep.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (error) {
    console.error('Get interview prep error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;




