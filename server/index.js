import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://bbl-project.vercel.app';
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from './routes/auth.js';
import communityRoutes from './routes/community.js';
import coursesRoutes from './routes/courses.js';
import progressRoutes from './routes/progress.js';
import analyticsRoutes from './routes/analytics.js';
import bookmarksRoutes from './routes/bookmarks.js';
import notesRoutes from './routes/notes.js';
import quizzesRoutes from './routes/quizzes.js';
import searchRoutes from './routes/search.js';
import settingsRoutes from './routes/settings.js';
import achievementsRoutes from './routes/achievements.js';
import cohortsRoutes from './routes/cohorts.js';
import adminRoutes from './routes/admin.js';
import questionsRoutes from './routes/questions.js';
import mentorsRoutes from './routes/mentors.js';
import interviewPrepRoutes from './routes/interviewPrep.js';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/cohorts', cohortsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mentors', mentorsRoutes);
app.use('/api/interview-prep', interviewPrepRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Shubham1511:Sonu%404321@cluster0.gl1ltyr.mongodb.net/BPL-Project?retryWrites=true&w=majority';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

