import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  // DSA fields
  videoUrl: String,
  leetcodeUrl: String,
  solveLink: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
  },
  companies: [String],
  topics: [String],
  // System Design/Theory fields
  resourceUrl: String,
  note: String,
  revision: {
    type: Boolean,
    default: false,
  },
  // Voice/Audio fields (optional)
  voiceUrl: String,
  audioUrl: String,
  type: {
    type: String,
    enum: ['leetcode', 'theory'],
    required: true,
  },
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  questions: [questionSchema],
}, { _id: true });

const trackSchema = new mongoose.Schema({
  track: {
    type: String,
    required: true,
    unique: true,
    enum: ['DSA Patterns', 'System Design', 'DBMS', 'CN', 'OS'],
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  thumbnail: String, // Course thumbnail image URL
  sections: [sectionSchema],
  enabled: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Track', trackSchema);


