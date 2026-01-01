# Babua Premier League (BPL) - Learning Management System

A comprehensive, free, and high-quality tech education platform designed to help students master computer science fundamentals, data structures, algorithms, system design, and more. Built with a student-first approach, offering 100% free core content with optional premium features.

## 🎯 Project Overview

Babua Premier League (BPL) is a full-stack Learning Management System (LMS) that provides free access to high-quality educational content covering essential computer science topics. The platform emphasizes accessibility, progress tracking, and community engagement while maintaining sustainable revenue through optional premium services.

## ✨ Core Principles

- ✅ **100% Free Core Content**: All videos, notes, problems, and quizzes are completely free
- ✅ **No Paywalls**: No locked content behind payments
- ✅ **Optional Revenue**: Revenue comes only from optional add-ons (mentor sessions, cohorts, interview prep)
- ✅ **Student-First Design**: Built with developers and students in mind

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - User notifications
- **Google OAuth** - Social authentication
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (JSON Web Tokens)** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📚 Features

### 🆓 Core Learning Features (100% Free)

#### 1. **User Authentication & Authorization**
   - Email/Password registration and login
   - Google OAuth integration
   - JWT-based session management
   - Role-based access control (Student, Mentor, Admin)
   - Secure password hashing

#### 2. **Course Management**
   - Multiple course categories:
     - **DSA (Data Structures & Algorithms)**
     - **System Design**
     - **LLD (Low-Level Design)**
     - **OS (Operating Systems)**
     - **CN (Computer Networks)**
     - **DBMS (Database Management Systems)**
     - **AI/ML (Artificial Intelligence & Machine Learning)**
   
   - Course structure:
     - **Modules** → Organized course sections
     - **Lessons** → Individual learning units (Video, Text, Quiz)
     - **Practice Problems** → Hands-on coding challenges
     - **Difficulty Levels** → Easy, Medium, Hard

#### 3. **DSA Patterns & Tracks**
   - Organized learning tracks:
     - DSA Patterns
     - System Design
     - DBMS
     - Computer Networks
     - Operating Systems
   
   - Features:
     - LeetCode problem integration
     - Video explanations
     - Company-specific questions
     - Topic categorization
     - Difficulty filtering

#### 4. **Progress Tracking**
   - Learning streaks (current and longest)
   - Course enrollment tracking
   - Lesson completion status
   - Problem-solving progress
   - Revision reminders
   - Last active date tracking

#### 5. **Practice & Assessment**
   - Coding problems with test cases
   - Quiz system for knowledge testing
   - Question status tracking (unsolved, solved, in-progress)
   - Solution explanations
   - Company-specific problem sets

#### 6. **Learning Tools**
   - **Bookmarks** - Save important lessons and problems
   - **Notes** - Personal notes on lessons
   - **Revision Mode** - Mark content for revision
   - **Search Functionality** - Find courses, lessons, and problems

#### 7. **Community Features**
   - Community discussions
   - Study cohorts
   - User profiles
   - Achievement system

#### 8. **Analytics Dashboard**
   - Learning progress visualization
   - Streak tracking
   - Course completion statistics
   - Performance metrics

### 💎 Optional Premium Features

#### 1. **Mentor Connect**
   - 1:1 mentoring sessions
   - Office hours booking
   - Mentor profiles and availability
   - Session scheduling system

#### 2. **Study Cohorts**
   - Intensive paid cohorts
   - Group learning programs
   - Structured curriculum
   - Community support

#### 3. **Interview Preparation**
   - Resume review services
   - Mock interview sessions
   - Career roadmaps
   - Behavioral interview prep
   - Coding interview resources
   - Resource library with tags and categories

## 🏗️ Project Structure

```
BPL Project/
├── client/                          # Frontend React Application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── admin/               # Admin-specific components
│   │   │   ├── AdminRoute.tsx       # Admin route protection
│   │   │   ├── PrivateRoute.tsx     # Private route protection
│   │   │   ├── Navbar.tsx           # Navigation bar
│   │   │   ├── Footer.tsx           # Footer component
│   │   │   └── ...
│   │   ├── contexts/                # React contexts
│   │   │   └── AuthContext.tsx      # Authentication context
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── useCourseContent.ts  # Course content hook
│   │   ├── pages/                   # Page components
│   │   │   ├── admin/               # Admin pages
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── AdminCourses.tsx
│   │   │   │   ├── AdminCourseCreator.tsx
│   │   │   │   ├── AdminQuestions.tsx
│   │   │   │   ├── AdminUsers.tsx
│   │   │   │   ├── AdminMentors.tsx
│   │   │   │   ├── AdminInterviewPrep.tsx
│   │   │   │   └── AdminTheory.tsx
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── Login.tsx            # Login page
│   │   │   ├── Signup.tsx           # Registration page
│   │   │   ├── Dashboard.tsx        # User dashboard
│   │   │   ├── Courses.tsx          # Course listing
│   │   │   ├── CourseDetail.tsx     # Course details
│   │   │   ├── LessonView.tsx       # Lesson viewer
│   │   │   ├── DSAPatterns.tsx      # DSA patterns page
│   │   │   ├── SystemDesignTab.tsx  # System design page
│   │   │   ├── InterviewPrep.tsx     # Interview prep page
│   │   │   ├── Mentors.tsx          # Mentors page
│   │   │   ├── Community.tsx        # Community page
│   │   │   ├── Profile.tsx          # User profile
│   │   │   ├── Analytics.tsx        # Analytics dashboard
│   │   │   └── Settings.tsx         # User settings
│   │   ├── App.tsx                  # Main app component
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.ts               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS config
│   └── tsconfig.json                # TypeScript config
│
├── server/                          # Backend Node.js Application
│   ├── models/                      # MongoDB models
│   │   ├── User.js                  # User model
│   │   ├── Course.js                # Course model
│   │   ├── Track.js                 # Track model
│   │   ├── Question.js              # Question model
│   │   ├── Progress.js              # Progress tracking model
│   │   ├── Quiz.js                  # Quiz model
│   │   ├── QuizAttempt.js           # Quiz attempt model
│   │   ├── Bookmark.js              # Bookmark model
│   │   ├── Note.js                  # Note model
│   │   ├── Achievement.js           # Achievement model
│   │   ├── Notification.js          # Notification model
│   │   ├── Community.js             # Community model
│   │   ├── Cohort.js                # Cohort model
│   │   ├── Mentor.js                # Mentor model
│   │   ├── Booking.js               # Booking model
│   │   └── InterviewPrep.js         # Interview prep model
│   ├── routes/                      # API routes
│   │   ├── auth.js                  # Authentication routes
│   │   ├── courses.js               # Course routes
│   │   ├── questions.js             # Question routes
│   │   ├── progress.js              # Progress routes
│   │   ├── quizzes.js               # Quiz routes
│   │   ├── bookmarks.js             # Bookmark routes
│   │   ├── notes.js                 # Note routes
│   │   ├── analytics.js             # Analytics routes
│   │   ├── search.js                # Search routes
│   │   ├── settings.js              # Settings routes
│   │   ├── achievements.js          # Achievement routes
│   │   ├── cohorts.js               # Cohort routes
│   │   ├── community.js             # Community routes
│   │   ├── mentors.js               # Mentor routes
│   │   ├── interviewPrep.js         # Interview prep routes
│   │   └── admin.js                 # Admin routes
│   ├── middleware/                  # Express middleware
│   │   ├── auth.js                  # Authentication middleware
│   │   └── admin.js                 # Admin authorization middleware
│   ├── scripts/                     # Database seeding scripts
│   │   ├── seedAdminAndCourses.js   # Seed admin and courses
│   │   ├── seedCommunityAndMentors.js # Seed community data
│   │   └── seedCourses.js           # Seed course data
│   ├── index.js                     # Server entry point
│   └── package.json                 # Backend dependencies
│
└── README.md                        # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd "BPL Project"
```

#### 2. Install Dependencies

Install dependencies for both client and server:

```bash
# Install root dependencies (if any)
npm install

# Install client dependencies
cd "BPL Project/client"
npm install

# Install server dependencies
cd "../server"
npm install
```

Or use the convenience script (if available):
```bash
npm run install-all
```

#### 3. Environment Variables Setup

**Backend Environment Variables** (`server/.env`):

Create a `.env` file in the `server` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://Shubham1511:Sonu%404321@cluster0.gl1ltyr.mongodb.net/BPL-Project?retryWrites=true&w=majority
# Or use local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/babua-lms

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port (optional, defaults to 5000)
PORT=5000
```

**Frontend Environment Variables** (`client/.env`):

Create a `.env` file in the `client` directory:

```env
# API URL (defaults to /api if not set)
VITE_API_URL=http://localhost:5000/api

# Google OAuth Client ID (optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

#### 4. Database Setup

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or start MongoDB service (Windows)
net start MongoDB
```

#### 5. Seed Initial Data

Seed the database with admin user and sample courses:

```bash
cd server
npm run seed:admin
```

This creates:
- **Admin User**: 
  - Email: `adminbpl@gmail.com`
  - Password: `Bpl@4321`
- **7 Courses** with modules and lessons

Additional seeding options:
```bash
# Seed community and mentors
npm run seed:community

# Seed courses only
npm run seed:courses

# Seed everything
npm run seed:all
```

#### 6. Run the Application

**Development Mode:**

Start both client and server:

```bash
# From project root
npm run dev
```

Or run separately:

```bash
# Terminal 1 - Start backend server
cd server
npm run dev

# Terminal 2 - Start frontend client
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173 (or port shown in terminal)
- **Backend API**: http://localhost:5000

**Production Mode:**

```bash
# Build frontend
cd client
npm run build

# Start backend
cd server
npm start
```

## 👨‍💼 Admin Dashboard

### Access Admin Panel

1. Navigate to `/admin` in your browser
2. Login with admin credentials:
   - Email: `adminbpl@gmail.com`
   - Password: `Bpl@4321`

### Admin Features

The admin dashboard provides comprehensive management capabilities:

#### **Course Management**
- View all courses, modules, and lessons
- Create new courses with modules and lessons
- Edit existing courses
- Delete courses/modules/lessons (with cascade delete)
- Manage course categories and metadata

#### **Question Management**
- Add/edit/delete questions
- Organize questions by tracks and sections
- Set difficulty levels and tags
- Link LeetCode problems and resources

#### **User Management**
- View all registered users
- Manage user roles (Student, Mentor, Admin)
- View user progress and statistics

#### **Mentor Management**
- Add/edit/remove mentors
- Manage mentor profiles and availability
- Set mentor specializations

#### **Interview Prep Management**
- Create interview preparation resources
- Categorize resources (Resume, Mock Interview, Career Roadmap, Coding, Behavioral)
- Set difficulty levels and tags
- Manage resource links and descriptions

#### **Analytics & Reports**
- View platform statistics
- Track user engagement
- Monitor course completion rates

## 🔐 Authentication & Authorization

### User Roles

1. **Student** (Default)
   - Access to all free content
   - Progress tracking
   - Community features
   - Can enroll in courses

2. **Mentor**
   - All student features
   - Can create mentor profiles
   - Manage booking availability

3. **Admin**
   - Full system access
   - Content management
   - User management
   - Analytics dashboard

### Authentication Methods

- **Email/Password**: Traditional registration and login
- **Google OAuth**: One-click social login (requires Google Client ID)

## 📊 Database Models

### Core Models

- **User**: User accounts, profiles, streaks, enrolled courses
- **Course**: Course structure with modules, lessons, and problems
- **Track**: Learning tracks (DSA Patterns, System Design, etc.)
- **Question**: Individual questions/problems with metadata
- **Progress**: User progress tracking per course/lesson
- **Quiz**: Quiz definitions and questions
- **QuizAttempt**: User quiz attempts and scores
- **Bookmark**: User bookmarked content
- **Note**: User notes on lessons
- **Achievement**: User achievements and badges
- **Notification**: User notifications
- **Community**: Community posts and discussions
- **Cohort**: Study cohorts and groups
- **Mentor**: Mentor profiles and information
- **Booking**: Mentor session bookings
- **InterviewPrep**: Interview preparation resources

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course

### Questions & Tracks
- `GET /api/questions` - Get questions
- `GET /api/questions/:id` - Get question details
- `POST /api/questions/:id/status` - Update question status

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Update progress
- `GET /api/progress/streak` - Get streak information

### Admin
- `GET /api/admin/*` - Admin-only endpoints
- Full CRUD operations for courses, questions, users, mentors

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark UI optimized for developers
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Enhanced user experience
- **Toast Notifications**: User feedback for actions
- **Loading States**: Clear loading indicators
- **Error Handling**: User-friendly error messages

## 🧪 Development

### Code Structure

- **Frontend**: Component-based architecture with TypeScript
- **Backend**: RESTful API with Express.js
- **Database**: MongoDB with Mongoose ODM
- **State Management**: React Context API
- **Routing**: React Router for frontend, Express routes for backend

### Best Practices

- TypeScript for type safety
- Component reusability
- RESTful API design
- Error handling and validation
- Security best practices (JWT, password hashing)
- Code organization and modularity

## 📝 Scripts

### Client Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Server Scripts
```bash
npm start        # Start production server
npm run dev      # Start development server with watch mode
npm run seed:admin        # Seed admin and courses
npm run seed:community   # Seed community data
npm run seed:courses      # Seed courses only
npm run seed:all         # Seed all data
```

## 🤝 Contributing

This project is developed and maintained by:
- **Shubham Uprade**
- **Chandrabhan Gadeshwer**

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env` file
   - Verify network connectivity

2. **Port Already in Use**
   - Change `PORT` in server `.env`
   - Or kill the process using the port

3. **CORS Errors**
   - Verify `VITE_API_URL` in client `.env`
   - Check server CORS configuration

4. **Authentication Issues**
   - Clear browser cookies/localStorage
   - Verify JWT_SECRET is set correctly
   - Check token expiration

## 📞 Support

For issues, questions, or contributions, please contact the development team.

## 🎓 Learning Resources

This platform covers:
- Data Structures & Algorithms
- System Design & Architecture
- Low-Level Design
- Operating Systems
- Computer Networks
- Database Management Systems
- Artificial Intelligence & Machine Learning

---

**Developed with ❤️ by Shubham Uprade and Chandrabhan Gadeshwer**

*Building the future of free tech education, one lesson at a time.*
