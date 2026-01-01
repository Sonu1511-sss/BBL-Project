import express from 'express';
import Course from '../models/Course.js';
import Track from '../models/Track.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import Mentor from '../models/Mentor.js';
import InterviewPrep from '../models/InterviewPrep.js';
import { authenticate } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(adminOnly);

// @route   GET /api/admin/courses
// @desc    Get all courses (tracks excluding DSA Patterns)
// @access  Admin
router.get('/courses', async (req, res) => {
  try {
    // Get all tracks except DSA Patterns (theory tracks only)
    const courses = await Track.find({ 
      track: { $ne: 'DSA Patterns' } 
    }).sort({ order: 1, createdAt: -1 });
    res.json({ courses });
  } catch (error) {
    console.error('Get admin courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/courses
// @desc    Create a new course/track with sections and questions
// @access  Admin
router.post('/courses', async (req, res) => {
  try {
    const { track, title, description, thumbnail, sections } = req.body;

    if (!track) {
      return res.status(400).json({ error: 'Track is required' });
    }

    if (track === 'DSA Patterns') {
      return res.status(400).json({ error: 'DSA Patterns should be managed separately' });
    }

    // Check if track already exists
    const existingTrack = await Track.findOne({ track });
    if (existingTrack) {
      return res.status(400).json({ error: 'Course with this track already exists' });
    }

    // Create new track
    const trackDoc = new Track({
      track,
      title: title || track,
      description: description || '',
      thumbnail: thumbnail || '',
      sections: (sections || []).map((section, index) => ({
        name: section.name,
        order: section.order || index,
        questions: section.topics || section.questions || [],
      })),
    });

    await trackDoc.save();

    // Save individual questions to Question collection for user tracking
    if (sections && sections.length > 0) {
      for (const section of sections) {
        for (const question of section.topics || section.questions || []) {
          await Question.findOneAndUpdate(
            { track, section: section.name, id: question.id },
            {
              track,
              section: section.name,
              id: question.id,
              title: question.title,
              type: 'theory',
              resourceUrl: question.resourceUrl,
              note: question.note,
              revision: question.revision || false,
              voiceUrl: question.voiceUrl,
              audioUrl: question.audioUrl,
            },
            { upsert: true, new: true }
          );
        }
      }
    }

    res.status(201).json({ 
      message: 'Course created successfully',
      course: trackDoc 
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// @route   PUT /api/admin/courses/:track
// @desc    Update a course/track
// @access  Admin
router.put('/courses/:track', async (req, res) => {
  try {
    const trackName = decodeURIComponent(req.params.track);
    const { title, description, thumbnail, sections, enabled, order } = req.body;

    if (trackName === 'DSA Patterns') {
      return res.status(400).json({ error: 'DSA Patterns should be managed separately' });
    }

    const trackDoc = await Track.findOne({ track: trackName });
    if (!trackDoc) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Update fields
    if (title !== undefined) trackDoc.title = title;
    if (description !== undefined) trackDoc.description = description;
    if (thumbnail !== undefined) trackDoc.thumbnail = thumbnail;
    if (enabled !== undefined) trackDoc.enabled = enabled;
    if (order !== undefined) trackDoc.order = order;

    // Update sections if provided
    if (sections !== undefined) {
      trackDoc.sections = sections.map((section, index) => ({
        name: section.name,
        order: section.order || index,
        questions: section.topics || section.questions || [],
      }));

      // Update questions in Question collection
      for (const section of sections) {
        for (const question of section.topics || section.questions || []) {
          await Question.findOneAndUpdate(
            { track: trackName, section: section.name, id: question.id },
            {
              track: trackName,
              section: section.name,
              id: question.id,
              title: question.title,
              type: 'theory',
              resourceUrl: question.resourceUrl,
              note: question.note,
              revision: question.revision || false,
              voiceUrl: question.voiceUrl,
              audioUrl: question.audioUrl,
            },
            { upsert: true, new: true }
          );
        }
      }
    }

    await trackDoc.save();

    res.json({ 
      message: 'Course updated successfully',
      course: trackDoc 
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// @route   DELETE /api/admin/courses/:track
// @desc    Delete a course/track
// @access  Admin
router.delete('/courses/:track', async (req, res) => {
  try {
    const trackName = decodeURIComponent(req.params.track);

    if (trackName === 'DSA Patterns') {
      return res.status(400).json({ error: 'DSA Patterns cannot be deleted' });
    }

    const trackDoc = await Track.findOne({ track: trackName });
    if (!trackDoc) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Delete all questions associated with this track
    await Question.deleteMany({ track: trackName });

    // Delete the track
    await Track.deleteOne({ track: trackName });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// @route   GET /api/admin/tracks/:track
// @desc    Get track with sections and questions
// @access  Admin
router.get('/tracks/:track', async (req, res) => {
  try {
    const track = await Track.findOne({ track: req.params.track });
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json({ track });
  } catch (error) {
    console.error('Get track error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/tracks/:track/sections
// @desc    Add section to track
// @access  Admin
router.post('/tracks/:track/sections', async (req, res) => {
  try {
    const { name, order } = req.body;
    let track = await Track.findOne({ track: req.params.track });
    
    if (!track) {
      track = new Track({
        track: req.params.track,
        title: req.params.track,
        sections: [],
      });
    }

    track.sections.push({
      name,
      order: order || track.sections.length,
      questions: [],
    });

    await track.save();
    res.json({ track });
  } catch (error) {
    console.error('Add section error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/tracks/:track/sections/:sectionName/questions
// @desc    Add question to section
// @access  Admin
router.post('/tracks/:track/sections/:sectionName/questions', async (req, res) => {
  try {
    const questionData = req.body;
    const track = await Track.findOne({ track: req.params.track });
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    const section = track.sections.find(s => s.name === req.params.sectionName);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    // Generate ID if not provided
    if (!questionData.id) {
      const sectionPrefix = req.params.sectionName.substring(0, 2).toUpperCase();
      questionData.id = `${sectionPrefix}-${Date.now()}`;
    }

    section.questions.push(questionData);
    await track.save();

    // Also save to Question collection
    const questionType = req.params.track === 'DSA Patterns' ? 'leetcode' : 'theory';
    const savedQuestion = await Question.findOneAndUpdate(
      { track: req.params.track, section: req.params.sectionName, id: questionData.id },
      {
        ...questionData,
        track: req.params.track,
        section: req.params.sectionName,
        type: questionType,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ 
      success: true, 
      topicId: questionData.id,
      question: savedQuestion,
      track 
    });
  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// @route   POST /api/admin/courses/:track/sections/:sectionId/topics
// @desc    Add topic to section (alias for questions endpoint)
// @access  Admin
router.post('/courses/:track/sections/:sectionId/topics', async (req, res) => {
  try {
    const trackName = decodeURIComponent(req.params.track);
    const sectionName = decodeURIComponent(req.params.sectionId);
    const questionData = req.body;
    
    const track = await Track.findOne({ track: trackName });
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    const section = track.sections.find(s => s.name === sectionName);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    // Generate ID if not provided
    if (!questionData.id) {
      const sectionPrefix = sectionName.substring(0, 2).toUpperCase();
      questionData.id = `${sectionPrefix}-${Date.now()}`;
    }

    section.questions.push(questionData);
    await track.save();

    // Also save to Question collection
    const questionType = trackName === 'DSA Patterns' ? 'leetcode' : 'theory';
    const savedQuestion = await Question.findOneAndUpdate(
      { track: trackName, section: sectionName, id: questionData.id },
      {
        ...questionData,
        track: trackName,
        section: sectionName,
        type: questionType,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ 
      success: true, 
      topicId: questionData.id,
      question: savedQuestion,
      track 
    });
  } catch (error) {
    console.error('Add topic error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// @route   DELETE /api/admin/tracks/:track/sections/:sectionName/questions/:questionId
// @desc    Delete question from section
// @access  Admin
router.delete('/tracks/:track/sections/:sectionName/questions/:questionId', async (req, res) => {
  try {
    const track = await Track.findOne({ track: req.params.track });
    
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    const section = track.sections.find(s => s.name === req.params.sectionName);
    if (section) {
      section.questions = section.questions.filter(q => q.id !== req.params.questionId);
      await track.save();
    }

    // Also delete from Question collection
    await Question.deleteOne({
      track: req.params.track,
      section: req.params.sectionName,
      id: req.params.questionId,
    });

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/admin/questions
// @desc    Get all questions (admin)
// @access  Admin
router.get('/questions', async (req, res) => {
  try {
    res.json({ questions: [] });
  } catch (error) {
    console.error('Get admin questions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/admin/tracks
// @desc    Get all tracks (admin)
// @access  Admin
router.get('/tracks', async (req, res) => {
  try {
    const tracks = await Track.find().sort({ order: 1 });
    res.json({ tracks });
  } catch (error) {
    console.error('Get admin tracks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ----- Mentors CRUD -----
router.get('/mentors', async (_req, res) => {
  try {
    const mentors = await Mentor.find().sort({ createdAt: -1 });
    res.json({ mentors });
  } catch (error) {
    console.error('Get admin mentors error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/mentors', async (req, res) => {
  try {
    const mentor = await Mentor.create(req.body);
    res.status(201).json({ mentor });
  } catch (error) {
    console.error('Create mentor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/mentors/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
    res.json({ mentor });
  } catch (error) {
    console.error('Update mentor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/mentors/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndDelete(req.params.id);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
    res.json({ message: 'Mentor deleted' });
  } catch (error) {
    console.error('Delete mentor error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ----- Interview Prep CRUD -----
router.get('/interview-prep', async (_req, res) => {
  try {
    const items = await InterviewPrep.find().sort({ createdAt: -1 });
    res.json({ items });
  } catch (error) {
    console.error('Get interview prep error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/interview-prep', async (req, res) => {
  try {
    const item = await InterviewPrep.create(req.body);
    res.status(201).json({ item });
  } catch (error) {
    console.error('Create interview prep error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/interview-prep/:id', async (req, res) => {
  try {
    const item = await InterviewPrep.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ item });
  } catch (error) {
    console.error('Update interview prep error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/interview-prep/:id', async (req, res) => {
  try {
    const item = await InterviewPrep.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Delete interview prep error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

