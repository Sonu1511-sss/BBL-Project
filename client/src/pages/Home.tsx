import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  thumbnail?: string;
  enrolledCount: number;
}

export default function Home() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data.courses?.slice(0, 8) || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section - Developer First Design */}
      <section className="relative bg-gradient-to-b from-dark-900 via-dark-950 to-dark-950 border-b border-dark-800">
        <div className="container-main section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-green-500/20 text-green-400 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-green-500/30">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></span>
              <span className="hidden sm:inline">100% Free • No Paywalls • Forever</span>
              <span className="sm:hidden">100% Free</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-gray-100 px-2">
              Babua Premier League
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Practical tech education for developers. <span className="font-semibold text-gray-100">DSA, System Design, LLD, OS, CN, DBMS, AI/ML</span> — all free, no strings attached.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              {user ? (
                <Link to="/dashboard" className="btn-primary text-base px-6 py-3">
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary text-base px-6 py-3">
                    Start Learning Free
                  </Link>
                  <Link to="/courses" className="btn-secondary text-base px-6 py-3">
                    Browse Courses
                  </Link>
                </>
              )}
            </div>
            <p className="mt-6 text-sm text-gray-400">
              Join <span className="font-semibold text-gray-200">10,000+</span> developers learning for free
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - Clean Grid */}
      <section className="section-padding bg-dark-900">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-3">
              Why Developers Choose Babua LMS
            </h2>
            <p className="text-gray-400 text-lg">Built by developers, for developers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🆓</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-100">100% Free</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                All videos, notes, problems, and quizzes are completely free. No paywalls, no hidden costs.
              </p>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-100">Complete Curriculum</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                DSA, System Design, LLD, OS, CN, DBMS, AI/ML — everything you need for tech interviews.
              </p>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🔥</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-100">Track Progress</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Streaks, progress tracking, and revision reminders to keep you consistent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Preview - Clean Grid */}
      <section className="section-padding bg-dark-950">
        <div className="container-main">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-3">
              Free Courses
            </h2>
            <p className="text-gray-400">All courses are 100% free. No credit card required.</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {courses.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="card-free group overflow-hidden"
                >
                  {course.thumbnail && (
                    <div className="relative h-40 bg-dark-800 overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
                      <div className="absolute top-3 right-3">
                        <span className="badge-free">FREE</span>
                      </div>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <span className="badge-category">{course.category}</span>
                      {!course.thumbnail && <span className="badge-free">FREE</span>}
                    </div>
                    <h3 className="text-base font-semibold text-gray-100 mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-dark-700">
                      <span className="text-xs text-gray-500">
                        {course.enrolledCount} students
                      </span>
                      <span className="text-sm text-primary-400 font-medium group-hover:underline">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/courses" className="btn-secondary">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Optional Paid Features - Clear Separation */}
      <section className="section-padding bg-dark-900 border-t border-dark-800">
        <div className="container-main">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium mb-4 border border-amber-500/30">
              <span>💡</span>
              <span>Optional Add-ons</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-3">
              Additional Support (Optional)
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              All learning content is <span className="font-semibold text-green-400">100% free</span>. These are optional paid services for extra support.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-paid p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">👨‍🏫</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-100">Mentor Sessions</h3>
                  <span className="badge-paid text-xs">Optional Paid</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                1:1 sessions with experienced mentors for personalized guidance and code reviews.
              </p>
              <Link to="/mentor" className="text-sm text-primary-400 font-medium hover:underline">
                Learn more →
              </Link>
            </div>
            <div className="card-paid p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">👥</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-100">Study Cohorts</h3>
                  <span className="badge-paid text-xs">Optional Paid</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Join structured cohorts with live sessions, group accountability, and peer learning.
              </p>
              <Link to="/mentor" className="text-sm text-primary-400 font-medium hover:underline">
                Learn more →
              </Link>
            </div>
            <div className="card-paid p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💼</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-100">Interview Prep</h3>
                  <span className="badge-paid text-xs">Optional Paid</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Resume reviews, mock interviews, and personalized career roadmaps.
              </p>
              <Link to="/mentor" className="text-sm text-primary-400 font-medium hover:underline">
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

