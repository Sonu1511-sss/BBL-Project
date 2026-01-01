import express from 'express';
import Question from '../models/Question.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Optional auth middleware
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore auth errors
  }
  next();
};

// @route   POST /api/questions/:id/status
// @desc    Update question status
// @access  Private
router.post('/:id/status', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}, async (req, res) => {
  try {
    const { status } = req.body;
    const question = await Question.findOne({ id: req.params.id });
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    if (!['unsolved', 'solved', 'in-progress'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const userStatusIndex = question.userStatus.findIndex(
      us => us.userId.toString() === req.user._id.toString()
    );

    if (userStatusIndex >= 0) {
      question.userStatus[userStatusIndex].status = status;
      if (status === 'solved') {
        question.userStatus[userStatusIndex].solvedAt = new Date();
      }
    } else {
      question.userStatus.push({
        userId: req.user._id,
        status,
        solvedAt: status === 'solved' ? new Date() : undefined,
      });
    }

    await question.save();
    res.json({ message: 'Status updated', status });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/questions/:id/revision
// @desc    Update question revision status
// @access  Private
router.post('/:id/revision', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}, async (req, res) => {
  try {
    const { revision } = req.body;
    const question = await Question.findOne({ id: req.params.id });
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const userStatusIndex = question.userStatus.findIndex(
      us => us.userId.toString() === req.user._id.toString()
    );

    if (userStatusIndex >= 0) {
      question.userStatus[userStatusIndex].revision = revision !== undefined ? revision : false;
    } else {
      question.userStatus.push({
        userId: req.user._id,
        status: 'unsolved',
        revision: revision !== undefined ? revision : false,
      });
    }

    await question.save();
    res.json({ message: 'Revision status updated', revision });
  } catch (error) {
    console.error('Update revision error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/questions/:id
// @desc    Update question (revision, note)
// @access  Private
router.put('/:id', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}, async (req, res) => {
  try {
    const { revision, note } = req.body;
    const question = await Question.findOne({ id: req.params.id });
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const userStatusIndex = question.userStatus.findIndex(
      us => us.userId.toString() === req.user._id.toString()
    );

    if (userStatusIndex >= 0) {
      if (revision !== undefined) {
        question.userStatus[userStatusIndex].revision = revision;
      }
      if (note !== undefined) {
        question.userStatus[userStatusIndex].note = note;
      }
    } else {
      question.userStatus.push({
        userId: req.user._id,
        status: 'unsolved',
        revision: revision !== undefined ? revision : false,
        note: note !== undefined ? note : '',
      });
    }

    await question.save();
    res.json({ question });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

