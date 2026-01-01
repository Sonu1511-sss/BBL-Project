import mongoose from 'mongoose';

const userStatusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['unsolved', 'solved', 'in-progress'],
    default: 'unsolved',
  },
  solvedAt: Date,
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
  revision: {
    type: Boolean,
    default: false,
  },
  note: String,
}, { _id: false });

const questionSchema = new mongoose.Schema({
  track: {
    type: String,
    required: true,
    enum: ['DSA Patterns', 'System Design', 'DBMS', 'CN', 'OS'],
  },
  section: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['leetcode', 'theory'],
    required: true,
  },
  // DSA/LeetCode fields
  videoUrl: String,
  leetcodeUrl: String,
  solveLink: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
  },
  companies: [String],
  topics: [String],
  // Theory/System Design fields
  resourceUrl: String,
  note: String,
  revision: {
    type: Boolean,
    default: false,
  },
  // Voice/Audio fields (optional)
  voiceUrl: String,
  audioUrl: String,
  userStatus: [userStatusSchema],
}, {
  timestamps: true,
});

export default mongoose.model('Question', questionSchema);


