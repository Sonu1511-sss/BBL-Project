import express from 'express';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/progress/update
// @desc    Update lesson progress
// @access  Private
router.post('/update', authenticate, async (req, res) => {
  try {
    const { courseId, moduleId, lessonId, completed, timeSpent, score } = req.body;

    if (!courseId || !lessonId) {
      return res.status(400).json({ error: 'Course ID and Lesson ID are required' });
    }

    let progress = await Progress.findOne({
      userId: req.user._id,
      courseId,
      lessonId
    });

    if (progress) {
      progress.completed = completed !== undefined ? completed : progress.completed;
      progress.timeSpent = (progress.timeSpent || 0) + (timeSpent || 0);
      if (score !== undefined) progress.score = score;
      if (completed) progress.completedAt = new Date();
    } else {
      progress = new Progress({
        userId: req.user._id,
        courseId,
        moduleId,
        lessonId,
        completed: completed || false,
        timeSpent: timeSpent || 0,
        score
      });
      if (completed) progress.completedAt = new Date();
    }

    await progress.save();

    // Update user streak if lesson completed
    if (completed) {
      const user = await User.findById(req.user._id);
      const today = new Date().toDateString();
      const lastActive = user.streak.lastActiveDate?.toDateString();
      
      if (lastActive !== today) {
        if (lastActive && new Date(user.streak.lastActiveDate).getTime() === new Date(today).getTime() - 86400000) {
          user.streak.current += 1;
        } else {
          user.streak.current = 1;
        }
        user.streak.lastActiveDate = new Date();
        if (user.streak.current > user.streak.longest) {
          user.streak.longest = user.streak.current;
        }
        await user.save();
      }
    }

    res.json({ progress });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/progress/course/:courseId
// @desc    Get progress for a course
// @access  Private
router.get('/course/:courseId', authenticate, async (req, res) => {
  try {
    const progress = await Progress.find({
      userId: req.user._id,
      courseId: req.params.courseId
    });

    const Course = (await import('../models/Course.js')).default;
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Calculate overall progress
    let totalLessons = 0;
    let completedLessons = 0;

    course.modules.forEach(module => {
      totalLessons += module.lessons.length;
      module.lessons.forEach(lesson => {
        const lessonProgress = progress.find(
          p => p.lessonId === lesson._id.toString()
        );
        if (lessonProgress?.completed) completedLessons++;
      });
    });

    const progressPercentage = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100) 
      : 0;

    res.json({
      progress,
      stats: {
        totalLessons,
        completedLessons,
        progressPercentage
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/progress/add-to-revise
// @desc    Add lesson to revision list
// @access  Private
router.post('/add-to-revise', authenticate, async (req, res) => {
  try {
    const { courseId, moduleId, lessonId, priority = 'medium' } = req.body;

    let progress = await Progress.findOne({
      userId: req.user._id,
      courseId,
      lessonId
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        courseId,
        moduleId,
        lessonId
      });
    }

    // Check if already in revision list
    const alreadyAdded = progress.toRevise.some(
      r => r.lessonId === lessonId
    );

    if (!alreadyAdded) {
      progress.toRevise.push({
        lessonId,
        moduleId,
        priority,
        addedAt: new Date()
      });
      await progress.save();
    }

    res.json({ progress });
  } catch (error) {
    console.error('Add to revise error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/progress/revision-list
// @desc    Get revision list for user
// @access  Private
router.get('/revision-list', authenticate, async (req, res) => {
  try {
    const progress = await Progress.find({
      userId: req.user._id,
      'toRevise.0': { $exists: true }
    }).populate('courseId', 'title slug');

    const revisionList = [];
    progress.forEach(p => {
      p.toRevise.forEach(item => {
        revisionList.push({
          courseId: p.courseId,
          courseTitle: p.courseId.title,
          moduleId: item.moduleId,
          lessonId: item.lessonId,
          priority: item.priority,
          addedAt: item.addedAt
        });
      });
    });

    res.json({ revisionList });
  } catch (error) {
    console.error('Get revision list error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/progress/mark-weak-topic
// @desc    Mark a topic as weak
// @access  Private
router.post('/mark-weak-topic', authenticate, async (req, res) => {
  try {
    const { courseId, topic } = req.body;

    let progress = await Progress.findOne({
      userId: req.user._id,
      courseId
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        courseId
      });
    }

    const existingTopic = progress.weakTopics.find(
      wt => wt.topic === topic
    );

    if (existingTopic) {
      existingTopic.reviewCount += 1;
      existingTopic.lastReviewed = new Date();
    } else {
      progress.weakTopics.push({
        topic,
        lastReviewed: new Date(),
        reviewCount: 1
      });
    }

    await progress.save();
    res.json({ progress });
  } catch (error) {
    console.error('Mark weak topic error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

