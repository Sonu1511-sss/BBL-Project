import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Course {
  _id: string;
  title: string;
  slug: string;
  category: string;
  enrolledCourses?: any;
}

interface ProgressStats {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [revisionList, setRevisionList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, revisionRes] = await Promise.all([
        axios.get(`${API_URL}/courses`),
        axios.get(`${API_URL}/progress/revision-list`)
      ]);

      // Get enrolled courses from user data
      if (user && coursesRes.data.courses) {
        const enrolled = coursesRes.data.courses.filter((course: Course) =>
          user.enrolledCourses?.some((ec: any) => ec.courseId === course._id)
        );
        setEnrolledCourses(enrolled);
      }

      setRevisionList(revisionRes.data.revisionList || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container-main py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">Welcome back, {user?.name}</h1>
        <p className="text-sm sm:text-base text-gray-400">Continue your learning journey</p>
      </div>

      {/* Streak Card - Developer Style */}
      {user?.streak && (
        <div className="card p-4 sm:p-6 mb-6 sm:mb-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-300 mb-1">Current Streak</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl sm:text-4xl font-bold text-gray-100">{user.streak.current}</p>
                <span className="text-xl sm:text-2xl">🔥</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mt-2">
                Longest: <span className="font-semibold text-gray-100">{user.streak.longest} days</span>
              </p>
            </div>
            <div className="text-3xl sm:text-5xl hidden sm:block">🔥</div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Enrolled Courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">My Courses</h2>
            <span className="badge-category">{enrolledCourses.length} enrolled</span>
          </div>
          {enrolledCourses.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-gray-400 mb-4 text-sm">You haven't enrolled in any courses yet.</p>
              <Link to="/courses" className="btn-primary text-sm">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrolledCourses.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="card p-4 block hover:border-primary-500"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-100 mb-1">{course.title}</h3>
                      <span className="badge-category text-xs">{course.category}</span>
                    </div>
                    <span className="text-primary-400">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Revision List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">To Revise</h2>
            {revisionList.length > 0 && (
              <span className="badge-category">{revisionList.length} items</span>
            )}
          </div>
          {revisionList.length === 0 ? (
            <div className="card p-6">
              <p className="text-gray-400 text-sm">No topics marked for revision yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {revisionList.slice(0, 5).map((item, index) => (
                <div key={index} className="card p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-100 mb-1">{item.courseTitle}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        item.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-dark-800 text-gray-300 border border-dark-700'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {revisionList.length > 5 && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  +{revisionList.length - 5} more items
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link to="/courses" className="card p-4 text-center hover:border-primary-500">
            <div className="text-2xl mb-2">📚</div>
            <p className="text-sm font-medium text-gray-100">Browse Courses</p>
          </Link>
          <Link to="/community" className="card p-4 text-center hover:border-primary-500">
            <div className="text-2xl mb-2">💬</div>
            <p className="text-sm font-medium text-gray-100">Community</p>
          </Link>
          <Link to="/mentor" className="card-paid p-4 text-center hover:border-amber-500">
            <div className="text-2xl mb-2">👨‍🏫</div>
            <p className="text-sm font-medium text-gray-100">Mentor</p>
            <span className="badge-paid text-xs mt-1">Optional</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

