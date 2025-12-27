# Babua Premier League - Learning Management System

A free, high-quality tech education platform with optional student-friendly revenue streams.

## Core Principles

✅ **100% Free Core Content**: All videos, notes, problems, and quizzes are completely free
✅ **No Paywalls**: No locked content behind payments
✅ **Optional Revenue**: Revenue comes only from optional add-ons (mentor sessions, cohorts, interview prep)

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Features

### Core Learning (100% Free)
- User authentication (Email/Password + Google OAuth)
- Courses: DSA, System Design, LLD, OS, CN, DBMS, AI/ML
- Course structure: Modules → Lessons → Practice Problems
- Progress tracking with streaks
- Revision reminders
- Community discussions
- Study cohorts

### Optional Paid Features
- Mentor connect / 1:1 office hours
- Intensive paid cohorts
- Interview prep services (resume review, mock interviews)

## Setup

1. Install dependencies:
```bash
npm run install-all
```

2. Set up environment variables:
- Create `server/.env` with MongoDB connection and JWT secret
- Create `client/.env` with API URL (optional)

3. Seed admin and courses:
```bash
cd server
npm run seed:admin
```

This creates:
- Admin user: `adminbpl@gmail.com` / `Bpl@4321`
- 7 courses with modules and lessons

4. Run development servers:
```bash
npm run dev
```

## Admin Dashboard

Login with admin credentials and access `/admin` to:
- View all courses, modules, and lessons
- Delete courses/modules/lessons (with cascade delete)
- Full CRUD operations via API

See `ADMIN_DASHBOARD_GUIDE.md` for details.

## Project Structure

```
babua-lms/
├── server/          # Backend (Node.js + Express)
├── client/          # Frontend (React + TypeScript)
└── package.json     # Root package.json
```

