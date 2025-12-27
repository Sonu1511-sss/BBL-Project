import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lessonId: String,
  title: {
    type: String,
    required: true
  },
  description: String,
  questions: [{
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'short-answer'],
      default: 'multiple-choice'
    },
    options: [String], // For multiple choice
    correctAnswer: {
      type: String,
      required: true
    },
    explanation: String,
    points: {
      type: Number,
      default: 1
    }
  }],
  totalPoints: Number,
  timeLimit: Number, // in minutes
  passingScore: Number, // percentage
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Quiz', quizSchema);

