import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Bookmark from '../models/Bookmark.js';
import Course from '../models/Course.js';

const router = express.Router();

// @route   GET /api/bookmarks
// @desc    Get user bookmarks
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { type } = req.query;
    
    const filter = { userId: req.user._id };
    if (type) filter.type = type;

    const bookmarks = await Bookmark.find(filter)
      .populate('courseId', 'title slug category')
      .sort({ createdAt: -1 });

    res.json({ bookmarks });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/bookmarks
// @desc    Create a bookmark
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { courseId, lessonId, moduleId, type, title, notes } = req.body;

    if (!type) {
      return res.status(400).json({ error: 'Type is required' });
    }

    // Check if bookmark already exists
    const existing = await Bookmark.findOne({
      userId: req.user._id,
      courseId,
      lessonId,
      type
    });

    if (existing) {
      return res.status(400).json({ error: 'Bookmark already exists' });
    }

    const bookmark = new Bookmark({
      userId: req.user._id,
      courseId,
      lessonId,
      moduleId,
      type,
      title: title || 'Bookmark',
      notes: notes || ''
    });

    await bookmark.save();
    await bookmark.populate('courseId', 'title slug category');

    res.status(201).json({ bookmark });
  } catch (error) {
    console.error('Create bookmark error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/bookmarks/:id
// @desc    Delete a bookmark
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Delete bookmark error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

