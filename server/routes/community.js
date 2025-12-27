import express from 'express';
import Thread from '../models/Community.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/community/threads
// @desc    Get discussion threads (optionally filtered by course)
// @access  Public
router.get('/threads', async (req, res) => {
  try {
    const { courseId, moduleId, lessonId } = req.query;
    
    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (moduleId) filter.moduleId = moduleId;
    if (lessonId) filter.lessonId = lessonId;

    const threads = await Thread.find(filter)
      .populate('author', 'name profile.avatar')
      .populate('courseId', 'title slug')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ threads });
  } catch (error) {
    console.error('Get threads error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/community/thread
// @desc    Create a new discussion thread
// @access  Private
router.post('/thread', authenticate, async (req, res) => {
  try {
    const { courseId, moduleId, lessonId, title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const thread = new Thread({
      courseId,
      moduleId,
      lessonId,
      title,
      content,
      author: req.user._id,
      tags: tags || []
    });

    await thread.save();
    await thread.populate('author', 'name profile.avatar');
    await thread.populate('courseId', 'title slug');

    res.status(201).json({ thread });
  } catch (error) {
    console.error('Create thread error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/community/thread/:id
// @desc    Get single thread with replies
// @access  Public
router.get('/thread/:id', async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id)
      .populate('author', 'name profile.avatar')
      .populate('replies.author', 'name profile.avatar')
      .populate('courseId', 'title slug');

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    res.json({ thread });
  } catch (error) {
    console.error('Get thread error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/community/thread/:id/reply
// @desc    Reply to a thread
// @access  Private
router.post('/thread/:id/reply', authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Reply content is required' });
    }

    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    thread.replies.push({
      content,
      author: req.user._id
    });

    await thread.save();
    await thread.populate('replies.author', 'name profile.avatar');

    res.json({ thread });
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/community/thread/:id/upvote
// @desc    Upvote a thread
// @access  Private
router.post('/thread/:id/upvote', authenticate, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const existingUpvote = thread.upvotes.find(
      u => u.userId.toString() === req.user._id.toString()
    );

    if (existingUpvote) {
      thread.upvotes = thread.upvotes.filter(
        u => u.userId.toString() !== req.user._id.toString()
      );
    } else {
      thread.upvotes.push({ userId: req.user._id });
    }

    await thread.save();
    res.json({ thread });
  } catch (error) {
    console.error('Upvote error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

