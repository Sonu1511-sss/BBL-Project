import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
  {
    day: { type: String, required: true }, // e.g., "Monday"
    slots: [{ type: String }], // e.g., "10:00-11:00"
  },
  { _id: false }
);

const mentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, default: 'DSA Mentor' },
    bio: { type: String, default: '' },
    expertise: [{ type: String, default: [] }],
    rating: { type: Number, default: 4.8 },
    pricePerHour: { type: Number, default: 299 },
    photoUrl: { type: String, default: '' },
    availability: [availabilitySchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Mentor', mentorSchema);




