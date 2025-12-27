import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import progressRoutes from './routes/progress.js';
import communityRoutes from './routes/community.js';
import mentorRoutes from './routes/mentor.js';
import analyticsRoutes from './routes/analytics.js';
import notificationsRoutes from './routes/notifications.js';
import achievementsRoutes from './routes/achievements.js';
import notesRoutes from './routes/notes.js';
import bookmarksRoutes from './routes/bookmarks.js';
import quizzesRoutes from './routes/quizzes.js';
import cohortsRoutes from './routes/cohorts.js';
import searchRoutes from './routes/search.js';
import settingsRoutes from './routes/settings.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/babua-lms', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected:', conn.connection.host);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('💡 Make sure MongoDB is running or check your connection string');
    // Don't exit - let the server start but API will return errors
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/cohorts', cohortsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Babua LMS API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Babua LMS Backend API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      courses: '/api/courses',
      progress: '/api/progress',
      community: '/api/community',
      mentor: '/api/mentor',
      analytics: '/api/analytics',
      notifications: '/api/notifications',
      achievements: '/api/achievements',
      notes: '/api/notes',
      bookmarks: '/api/bookmarks',
      quizzes: '/api/quizzes',
      cohorts: '/api/cohorts',
      search: '/api/search',
      settings: '/api/settings',
      admin: '/api/admin'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

