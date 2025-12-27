import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['DSA', 'System Design', 'LLD', 'OS', 'CN', 'DBMS', 'AI/ML'],
    required: true
  },
  thumbnail: String,
  isFree: {
    type: Boolean,
    default: true // All courses are free
  },
  modules: [{
    title: String,
    description: String,
    order: Number,
    lessons: [{
      title: String,
      type: {
        type: String,
        enum: ['video', 'text', 'quiz'],
        default: 'text'
      },
      content: String, // For text lessons
      videoUrl: String, // For video lessons
      duration: Number, // in minutes
      order: Number,
      problems: [{
        title: String,
        description: String,
        difficulty: {
          type: String,
          enum: ['easy', 'medium', 'hard']
        },
        testCases: [{
          input: String,
          output: String
        }],
        solution: String
      }]
    }]
  }],
  enrolledCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Course', courseSchema);

