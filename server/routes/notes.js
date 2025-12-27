import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Note from '../models/Note.js';

const router = express.Router();

// @route   GET /api/notes
// @desc    Get user notes
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { courseId, lessonId, tag } = req.query;
    
    const filter = { userId: req.user._id };
    if (courseId) filter.courseId = courseId;
    if (lessonId) filter.lessonId = lessonId;
    if (tag) filter.tags = tag;

    const notes = await Note.find(filter)
      .populate('courseId', 'title slug')
      .sort({ createdAt: -1 });

    res.json({ notes });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { courseId, lessonId, title, content, tags, isPublic } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const note = new Note({
      userId: req.user._id,
      courseId,
      lessonId,
      title,
      content,
      tags: tags || [],
      isPublic: isPublic || false
    });

    await note.save();
    await note.populate('courseId', 'title slug');

    res.status(201).json({ note });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const { title, content, tags, isPublic } = req.body;
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPublic !== undefined) note.isPublic = isPublic;

    await note.save();
    await note.populate('courseId', 'title slug');

    res.json({ note });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

