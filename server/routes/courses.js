import express from 'express';
import Course from '../models/Course.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses (all are free)
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoose = (await import('mongoose')).default;
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Database not connected',
        message: 'Please check MongoDB connection'
      });
    }

    const courses = await Course.find()
      .select('title slug description category thumbnail enrolledCount')
      .sort({ createdAt: -1 });
    
    res.json({ courses: courses || [] });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: error.message || 'Failed to fetch courses',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course with all modules and lessons
// @access  Public (all content is free)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/courses/:id/modules
// @desc    Get modules for a course
// @access  Public
router.get('/:id/modules', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .select('modules title');
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ 
      courseTitle: course.title,
      modules: course.modules.sort((a, b) => a.order - b.order)
    });
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/courses/:id/modules/:moduleId/lessons
// @desc    Get lessons for a module
// @access  Public
router.get('/:id/modules/:moduleId/lessons', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const module = course.modules.id(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    res.json({ 
      moduleTitle: module.title,
      lessons: module.lessons.sort((a, b) => a.order - b.order)
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course (free enrollment)
// @access  Private
router.post('/:id/enroll', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.user._id);

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      ec => ec.courseId.toString() === req.params.id
    );

    if (!alreadyEnrolled) {
      user.enrolledCourses.push({ courseId: req.params.id });
      await user.save();
      
      course.enrolledCount += 1;
      await course.save();
    }

    res.json({ message: 'Enrolled successfully', course });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

