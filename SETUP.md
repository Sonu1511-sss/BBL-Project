# Babua Premier League LMS - Setup Guide

## 🎯 Project Overview

This is a **100% free** Learning Management System where all core learning content (videos, notes, problems, quizzes) is completely free with no paywalls. Revenue comes only from optional add-ons like mentor sessions, cohorts, and interview prep services.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install root dependencies:**
```bash
npm install
```

2. **Install server dependencies:**
```bash
cd server
npm install
```

3. **Install client dependencies:**
```bash
cd ../client
npm install
```

4. **Set up environment variables:**

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/babua-lms
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
FRONTEND_URL=http://localhost:3000
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Seed sample courses:**
```bash
cd server
npm run seed
```

6. **Start development servers:**

From root directory:
```bash
npm run dev
```

Or separately:
- Server: `cd server && npm run dev`
- Client: `cd client && npm run dev`

## 📁 Project Structure

```
babua-lms/
├── server/                 # Backend (Node.js + Express)
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── scripts/           # Seed scripts
│   └── index.js          # Server entry point
├── client/                # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # React contexts (Auth)
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main app component
│   └── vite.config.ts    # Vite configuration
└── package.json          # Root package.json
```

## 🔑 Key Features

### Core Learning (100% Free)
- ✅ User authentication (Email/Password + Google OAuth ready)
- ✅ Courses: DSA, System Design, LLD, OS, CN, DBMS, AI/ML
- ✅ Course structure: Modules → Lessons → Problems
- ✅ Progress tracking with streaks
- ✅ Revision reminders
- ✅ Community discussions
- ✅ Study cohorts

### Optional Paid Features
- 💰 Mentor connect / 1:1 office hours booking
- 💰 Intensive paid cohorts
- 💰 Interview prep services (resume review, mock interviews)

## 🗄️ Database Models

- **User**: Authentication, profile, streaks, enrolled courses
- **Course**: Course structure with modules, lessons, problems
- **Progress**: Lesson completion, time spent, weak topics, revision list
- **Thread**: Community discussions
- **Cohort**: Study groups (free and paid)
- **Booking**: Mentor session bookings
- **Payment**: Payment records (Razorpay integration ready)

## 🔌 API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/google` - Google OAuth

### Courses
- `GET /api/courses` - Get all courses (public)
- `GET /api/courses/:id` - Get course details (public)
- `GET /api/courses/:id/modules` - Get modules (public)
- `POST /api/courses/:id/enroll` - Enroll in course (private)

### Progress
- `POST /api/progress/update` - Update lesson progress
- `GET /api/progress/course/:courseId` - Get course progress
- `POST /api/progress/add-to-revise` - Add to revision list
- `GET /api/progress/revision-list` - Get revision list

### Community
- `GET /api/community/threads` - Get discussion threads
- `POST /api/community/thread` - Create thread
- `GET /api/community/thread/:id` - Get thread details
- `POST /api/community/thread/:id/reply` - Reply to thread

### Mentor (Optional Paid)
- `GET /api/mentor/list` - Get available mentors
- `POST /api/mentor/book-session` - Book mentor session
- `GET /api/mentor/my-bookings` - Get user bookings

### Payments (Optional Paid)
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/my-payments` - Get payment history

## 🎨 Frontend Pages

- `/` - Home page
- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - User dashboard with progress
- `/courses` - Browse all courses
- `/courses/:id` - Course detail page
- `/courses/:courseId/lessons/:lessonId` - Lesson viewer
- `/community` - Community discussions
- `/mentor` - Mentor booking (optional paid)
- `/profile` - User profile

## 🔒 Important Notes

1. **All core content is FREE**: No paywalls on videos, notes, problems, or quizzes
2. **Revenue is optional**: Only mentor sessions, cohorts, and interview prep are paid
3. **Payment integration**: Razorpay integration is stubbed - implement in production
4. **Google OAuth**: Set up Google OAuth credentials for full functionality
5. **MongoDB**: Use MongoDB Atlas for production or local MongoDB for development

## 🚧 Next Steps

1. Set up MongoDB (local or Atlas)
2. Configure environment variables
3. Seed sample courses
4. Test authentication flow
5. Integrate Razorpay for payments (if using paid features)
6. Set up Google OAuth (optional)
7. Deploy to production

## 📝 License

MIT

