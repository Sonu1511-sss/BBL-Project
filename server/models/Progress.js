import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  moduleId: String, // Reference to module within course
  lessonId: String, // Reference to lesson within module
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  timeSpent: {
    type: Number,
    default: 0 // in minutes
  },
  score: Number, // For quizzes/problems
  weakTopics: [{
    topic: String,
    lastReviewed: Date,
    reviewCount: Number
  }],
  toRevise: [{
    lessonId: String,
    moduleId: String,
    addedAt: Date,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
progressSchema.index({ userId: 1, courseId: 1 });
progressSchema.index({ userId: 1, lessonId: 1 });

export default mongoose.model('Progress', progressSchema);

