import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const interviewPrepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['resume', 'mock', 'career', 'coding', 'behavioral'],
      default: 'coding',
    },
    description: { type: String, default: '' },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    tags: [{ type: String, default: [] }],
    resources: [resourceSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('InterviewPrep', interviewPrepSchema);



