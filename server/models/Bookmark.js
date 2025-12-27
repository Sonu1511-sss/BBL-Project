import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  lessonId: String,
  moduleId: String,
  type: {
    type: String,
    enum: ['course', 'lesson', 'problem', 'thread'],
    required: true
  },
  title: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

bookmarkSchema.index({ userId: 1, type: 1 });

export default mongoose.model('Bookmark', bookmarkSchema);

