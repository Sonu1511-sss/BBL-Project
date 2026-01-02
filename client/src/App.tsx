import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LessonView from './pages/LessonView';
import Community from './pages/Community';
import DSAPatterns from './pages/DSAPatterns';
import SystemDesignTab from './pages/SystemDesignTab';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourseCreator from './pages/admin/AdminCourseCreator';
import AdminMentors from './pages/admin/AdminMentors';
import AdminInterviewPrep from './pages/admin/AdminInterviewPrep';
import Mentors from './pages/Mentors';
import InterviewPrep from './pages/InterviewPrep';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Component to conditionally render Navbar and Footer
function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

// Wrapper component to conditionally use GoogleOAuthProvider
function AppContent() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ConditionalLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/dsa" element={<DSAPatterns />} />
            <Route path="/courses/system-design" element={<SystemDesignTab />} />
            <Route path="/courses/dbms" element={<SystemDesignTab />} />
            <Route path="/courses/cn" element={<SystemDesignTab />} />
            <Route path="/courses/os" element={<SystemDesignTab />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/community" element={<Community />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/interview-prep" element={<InterviewPrep />} />

            {/* Private Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/courses/:courseId/lessons/:lessonId"
              element={
                <PrivateRoute>
                  <LessonView />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <PrivateRoute>
                  <Analytics />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <AdminRoute>
                  <AdminCourses />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/courses/create"
              element={
                <AdminRoute>
                  <AdminCourseCreator />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/questions"
              element={
                <AdminRoute>
                  <AdminQuestions />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/mentors"
              element={
                <AdminRoute>
                  <AdminMentors />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/interview-prep"
              element={
                <AdminRoute>
                  <AdminInterviewPrep />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/questions/create"
              element={
                <AdminRoute>
                  <AdminCourseCreator />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ConditionalLayout>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

function App() {
  // Only wrap with GoogleOAuthProvider if clientId is provided
  // This prevents the "Missing required parameter client_id" error
  const appContent = GOOGLE_CLIENT_ID ? (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppContent />
    </GoogleOAuthProvider>
  ) : (
    <AppContent />
  );
  
  return (
    <ErrorBoundary>
      {appContent}
    </ErrorBoundary>
  );
}

export default App;
