import express from 'express';
import Course from '../models/Course.js';
import Progress from '../models/Progress.js';
import Thread from '../models/Community.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import { isAdmin } from '../middleware/admin.js';
import mongoose from 'mongoose';

const router = express.Router();

// All admin routes require admin authentication
router.use(isAdmin[0], isAdmin[1]);

// @route   GET /api/admin/courses
// @desc    Get all courses (admin view)
// @access  Admin
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/admin/courses/:id
// @desc    Get single course (admin view)
// @access  Admin
router.get('/courses/:id', async (req, res) => {
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

// @route   POST /api/admin/courses
// @desc    Create a new course
// @access  Admin
router.post('/courses', async (req, res) => {
  try {
    const { title, slug, description, category, thumbnail, modules } = req.body;

    if (!title || !slug || !description || !category) {
      return res.status(400).json({ error: 'Title, slug, description, and category are required' });
    }

    // Check if slug already exists
    const existingCourse = await Course.findOne({ slug });
    if (existingCourse) {
      return res.status(400).json({ error: 'Course with this slug already exists' });
    }

    const course = new Course({
      title,
      slug,
      description,
      category,
      thumbnail: thumbnail || '',
      isFree: true, // All courses are free
      modules: modules || []
    });

    await course.save();
    res.status(201).json({ course });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/courses/:id
// @desc    Update a course
// @access  Admin
router.put('/courses/:id', async (req, res) => {
  try {
    const { title, slug, description, category, thumbnail, modules } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== course.slug) {
      const existingCourse = await Course.findOne({ slug });
      if (existingCourse) {
        return res.status(400).json({ error: 'Course with this slug already exists' });
      }
      course.slug = slug;
    }

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (thumbnail !== undefined) course.thumbnail = thumbnail;
    if (modules) course.modules = modules;

    await course.save();
    res.json({ course });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/admin/courses/:id
// @desc    Delete a course (with cascade delete)
// @access  Admin
router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Cascade delete: Remove all progress records for this course
    await Progress.deleteMany({ courseId: course._id });

    // Delete the course
    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course deleted successfully', deletedCourse: course });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/courses/:courseId/modules
// @desc    Add a module to a course
// @access  Admin
router.post('/courses/:courseId/modules', async (req, res) => {
  try {
    const { title, description, order } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Module title is required' });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const newModule = {
      title,
      description: description || '',
      order: order || (course.modules.length + 1),
      lessons: []
    };

    course.modules.push(newModule);
    await course.save();

    res.status(201).json({ module: course.modules[course.modules.length - 1], course });
  } catch (error) {
    console.error('Add module error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/courses/:courseId/modules/:moduleId
// @desc    Update a module
// @access  Admin
router.put('/courses/:courseId/modules/:moduleId', async (req, res) => {
  try {
    const { title, description, order } = req.body;

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const module = course.modules.id(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    if (title) module.title = title;
    if (description !== undefined) module.description = description;
    if (order !== undefined) module.order = order;

    await course.save();
    res.json({ module, course });
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/admin/courses/:courseId/modules/:moduleId
// @desc    Delete a module (with cascade delete of lessons)
// @access  Admin
router.delete('/courses/:courseId/modules/:moduleId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const module = course.modules.id(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    // Cascade delete: Remove progress for all lessons in this module
    const lessonIds = module.lessons.map(lesson => lesson._id.toString());
    await Progress.deleteMany({
      courseId: course._id,
      lessonId: { $in: lessonIds }
    });

    // Remove the module (this also removes all lessons in it)
    module.remove();
    await course.save();

    res.json({ message: 'Module deleted successfully', course });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/courses/:courseId/modules/:moduleId/lessons
// @desc    Add a lesson to a module
// @access  Admin
router.post('/courses/:courseId/modules/:moduleId/lessons', async (req, res) => {
  try {
    const { title, type, content, videoUrl, duration, order, problems } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Lesson title is required' });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const module = course.modules.id(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const newLesson = {
      title,
      type: type || 'text',
      content: content || '',
      videoUrl: videoUrl || '',
      duration: duration || 0,
      order: order || (module.lessons.length + 1),
      problems: problems || []
    };

    module.lessons.push(newLesson);
    await course.save();

    res.status(201).json({
      lesson: module.lessons[module.lessons.length - 1],
      module,
      course
    });
  } catch (error) {
    console.error('Add lesson error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/courses/:courseId/modules/:moduleId/lessons/:lessonId
// @desc    Update a lesson
// @access  Admin
router.put('/courses/:courseId/modules/:moduleId/lessons/:lessonId', async (req, res) => {
  try {
    const { title, type, content, videoUrl, duration, order, problems } = req.body;

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const module = course.modules.id(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const lesson = module.lessons.id(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    if (title) lesson.title = title;
    if (type) lesson.type = type;
    if (content !== undefined) lesson.content = content;
    if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
    if (duration !== undefined) lesson.duration = duration;
    if (order !== undefined) lesson.order = order;
    if (problems) lesson.problems = problems;

    await course.save();
    res.json({ lesson, module, course });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/admin/courses/:courseId/modules/:moduleId/lessons/:lessonId
// @desc    Delete a lesson (with cascade delete of progress)
// @access  Admin
router.delete('/courses/:courseId/modules/:moduleId/lessons/:lessonId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const module = course.modules.id(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const lesson = module.lessons.id(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Cascade delete: Remove progress for this lesson
    await Progress.deleteMany({
      courseId: course._id,
      lessonId: lesson._id.toString()
    });

    // Remove the lesson
    lesson.remove();
    await course.save();

    res.json({ message: 'Lesson deleted successfully', module, course });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== COMMUNITY MANAGEMENT ====================

// @route   GET /api/admin/community/threads
// @desc    Get all community threads
// @access  Admin
router.get('/community/threads', async (req, res) => {
  try {
    const threads = await Thread.find()
      .populate('author', 'name email')
      .populate('courseId', 'title category')
      .sort({ createdAt: -1 });
    res.json({ threads });
  } catch (error) {
    console.error('Get threads error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/admin/community/threads/:id
// @desc    Delete a community thread
// @access  Admin
router.delete('/community/threads/:id', async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    await Thread.findByIdAndDelete(req.params.id);
    res.json({ message: 'Thread deleted successfully' });
  } catch (error) {
    console.error('Delete thread error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/community/threads/:id/resolve
// @desc    Mark thread as resolved/unresolved
// @access  Admin
router.put('/community/threads/:id/resolve', async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    thread.isResolved = !thread.isResolved;
    await thread.save();
    res.json({ thread });
  } catch (error) {
    console.error('Toggle resolve error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== MENTORS MANAGEMENT ====================

// @route   GET /api/admin/mentors
// @desc    Get all mentors
// @access  Admin
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' })
      .select('name email profile role createdAt')
      .sort({ createdAt: -1 });
    res.json({ mentors });
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/mentors
// @desc    Create a new mentor
// @access  Admin
router.post('/mentors', async (req, res) => {
  try {
    const { name, email, password, bio, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const mentor = new User({
      name,
      email,
      password,
      role: 'mentor',
      profile: {
        bio: bio || '',
        avatar: avatar || ''
      }
    });

    await mentor.save();
    res.status(201).json({ mentor });
  } catch (error) {
    console.error('Create mentor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/mentors/:id
// @desc    Update a mentor
// @access  Admin
router.put('/mentors/:id', async (req, res) => {
  try {
    const { name, email, bio, avatar } = req.body;

    const mentor = await User.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    if (mentor.role !== 'mentor') {
      return res.status(400).json({ error: 'User is not a mentor' });
    }

    if (name) mentor.name = name;
    if (email) mentor.email = email;
    if (bio !== undefined) {
      if (!mentor.profile) mentor.profile = {};
      mentor.profile.bio = bio;
    }
    if (avatar !== undefined) {
      if (!mentor.profile) mentor.profile = {};
      mentor.profile.avatar = avatar;
    }

    await mentor.save();
    res.json({ mentor });
  } catch (error) {
    console.error('Update mentor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/admin/mentors/:id
// @desc    Delete a mentor (cascade delete bookings)
// @access  Admin
router.delete('/mentors/:id', async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    // Cascade delete: Remove all bookings for this mentor
    await Booking.deleteMany({ mentorId: mentor._id });

    // Delete the mentor
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Mentor deleted successfully' });
  } catch (error) {
    console.error('Delete mentor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/admin/bookings
// @desc    Get all bookings
// @access  Admin
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('studentId', 'name email')
      .populate('mentorId', 'name email')
      .sort({ scheduledAt: -1 });
    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/admin/bookings/:id
// @desc    Delete a booking
// @access  Admin
router.delete('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== USERS MANAGEMENT ====================

// @route   GET /api/admin/users
// @desc    Get all users with statistics
// @access  Admin
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('name email role profile streak enrolledCourses createdAt')
      .populate('enrolledCourses.courseId', 'title category')
      .sort({ createdAt: -1 });
    
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get platform statistics
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalMentors,
      totalCourses,
      totalThreads,
      totalBookings,
      coursesWithEnrollments
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'mentor' }),
      Course.countDocuments(),
      Thread.countDocuments(),
      Booking.countDocuments(),
      Course.aggregate([
        {
          $group: {
            _id: null,
            totalEnrollments: { $sum: '$enrolledCount' }
          }
        }
      ])
    ]);

    const totalEnrollments = coursesWithEnrollments[0]?.totalEnrollments || 0;

    res.json({
      stats: {
        totalUsers,
        totalStudents,
        totalMentors,
        totalCourses,
        totalThreads,
        totalBookings,
        totalEnrollments
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user (cascade delete)
// @access  Admin
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin users' });
    }

    // Cascade delete: Remove all related data
    await Promise.all([
      Progress.deleteMany({ userId: user._id }),
      Thread.deleteMany({ author: user._id }),
      Booking.deleteMany({
        $or: [
          { studentId: user._id },
          { mentorId: user._id }
        ]
      })
    ]);

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

