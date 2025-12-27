import mongoose from 'mongoose';

const cohortSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0
  },
  maxMembers: {
    type: Number,
    default: 50
  },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now }
  }],
  liveSessions: [{
    title: String,
    scheduledAt: Date,
    duration: Number,
    meetingLink: String,
    recordingUrl: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Cohort', cohortSchema);

