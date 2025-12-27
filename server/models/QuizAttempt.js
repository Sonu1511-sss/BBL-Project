import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [{
    questionId: String,
    answer: String,
    isCorrect: Boolean,
    points: Number
  }],
  score: Number,
  totalPoints: Number,
  percentage: Number,
  passed: Boolean,
  timeSpent: Number, // in minutes
  startedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

quizAttemptSchema.index({ userId: 1, quizId: 1 });

export default mongoose.model('QuizAttempt', quizAttemptSchema);

