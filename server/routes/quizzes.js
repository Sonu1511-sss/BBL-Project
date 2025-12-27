import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';

const router = express.Router();

// @route   GET /api/quizzes
// @desc    Get quizzes (optionally filtered by course)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { courseId, lessonId } = req.query;
    
    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (lessonId) filter.lessonId = lessonId;

    const quizzes = await Quiz.find(filter)
      .populate('courseId', 'title slug')
      .sort({ createdAt: -1 });

    res.json({ quizzes });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/quizzes/:id
// @desc    Get quiz details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('courseId', 'title slug');

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Don't send correct answers if not authenticated or not completed
    const quizData = quiz.toObject();
    if (!req.user) {
      quizData.questions = quizData.questions.map(q => ({
        ...q,
        correctAnswer: undefined
      }));
    }

    res.json({ quiz: quizData });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/quizzes/:id/attempt
// @desc    Submit quiz attempt
// @access  Private
router.post('/:id/attempt', authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const { answers, timeSpent } = req.body;
    const startedAt = req.body.startedAt ? new Date(req.body.startedAt) : new Date();

    // Calculate score
    let score = 0;
    let totalPoints = 0;
    const detailedAnswers = quiz.questions.map((question, index) => {
      totalPoints += question.points || 1;
      const userAnswer = answers[index]?.answer || '';
      const isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      if (isCorrect) {
        score += question.points || 1;
      }
      return {
        questionId: question._id.toString(),
        answer: userAnswer,
        isCorrect,
        points: isCorrect ? (question.points || 1) : 0
      };
    });

    const percentage = (score / totalPoints) * 100;
    const passed = percentage >= (quiz.passingScore || 60);

    const attempt = new QuizAttempt({
      userId: req.user._id,
      quizId: quiz._id,
      answers: detailedAnswers,
      score,
      totalPoints,
      percentage: percentage.toFixed(2),
      passed,
      timeSpent: timeSpent || 0,
      startedAt,
      completedAt: new Date()
    });

    await attempt.save();

    // Update progress if passed
    if (passed && quiz.courseId && quiz.lessonId) {
      const Progress = (await import('../models/Progress.js')).default;
      await Progress.findOneAndUpdate(
        {
          userId: req.user._id,
          courseId: quiz.courseId,
          lessonId: quiz.lessonId
        },
        {
          userId: req.user._id,
          courseId: quiz.courseId,
          lessonId: quiz.lessonId,
          completed: true,
          completedAt: new Date(),
          score: percentage
        },
        { upsert: true, new: true }
      );
    }

    res.json({ attempt });
  } catch (error) {
    console.error('Submit quiz attempt error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/quizzes/:id/attempts
// @desc    Get user's quiz attempts
// @access  Private
router.get('/:id/attempts', authenticate, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      userId: req.user._id,
      quizId: req.params.id
    }).sort({ completedAt: -1 });

    res.json({ attempts });
  } catch (error) {
    console.error('Get quiz attempts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

