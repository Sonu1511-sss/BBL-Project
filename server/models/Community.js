import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  moduleId: String,
  lessonId: String,
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  upvotes: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  replies: [{
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    upvotes: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }]
  }],
  isResolved: {
    type: Boolean,
    default: false
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Thread', threadSchema);

