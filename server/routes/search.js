import express from 'express';
import Course from '../models/Course.js';
import Thread from '../models/Community.js';

const router = express.Router();

// @route   GET /api/search
// @desc    Search courses, lessons, and community threads
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json({
        courses: [],
        threads: [],
        lessons: []
      });
    }

    const searchRegex = new RegExp(q, 'i');
    const results = {
      courses: [],
      threads: [],
      lessons: []
    };

    if (type === 'all' || type === 'courses') {
      const courses = await Course.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { category: searchRegex }
        ]
      })
        .select('title slug description category thumbnail enrolledCount')
        .limit(10);

      results.courses = courses;
    }

    if (type === 'all' || type === 'community') {
      const threads = await Thread.find({
        $or: [
          { title: searchRegex },
          { content: searchRegex }
        ]
      })
        .populate('author', 'name profile.avatar')
        .populate('courseId', 'title slug')
        .sort({ createdAt: -1 })
        .limit(10);

      results.threads = threads;
    }

    if (type === 'all' || type === 'lessons') {
      // Search lessons within courses
      const courses = await Course.find({
        'modules.lessons.title': searchRegex
      })
        .select('title slug modules')
        .limit(5);

      const lessons = [];
      courses.forEach(course => {
        course.modules.forEach(module => {
          module.lessons.forEach(lesson => {
            if (lesson.title.match(searchRegex)) {
              lessons.push({
                courseId: course._id,
                courseTitle: course.title,
                courseSlug: course.slug,
                moduleId: module._id,
                moduleTitle: module.title,
                lessonId: lesson._id,
                lessonTitle: lesson.title,
                lessonType: lesson.type
              });
            }
          });
        });
      });

      results.lessons = lessons.slice(0, 10);
    }

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

