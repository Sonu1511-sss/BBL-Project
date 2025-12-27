import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['streak', 'course', 'lesson', 'community', 'mentor'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  icon: String, // Emoji or icon identifier
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  points: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

achievementSchema.index({ userId: 1, type: 1 });

export default mongoose.model('Achievement', achievementSchema);

