import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminTabbedLayout from '../../components/admin/AdminTabbedLayout';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Stats {
  totalCourses: number;
  totalQuestions: number;
  activeTracks: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    totalQuestions: 0,
    activeTracks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch stats from multiple endpoints
      const [coursesRes, questionsRes, tracksRes] = await Promise.all([
        axios.get(`${API_URL}/courses`).catch(() => ({ data: { courses: [] } })),
        axios.get(`${API_URL}/admin/questions`).catch(() => ({ data: { questions: [] } })),
        axios.get(`${API_URL}/admin/tracks`).catch(() => ({ data: { tracks: [] } })),
      ]);

      const courses = coursesRes.data.courses || [];
      const questions = questionsRes.data.questions || [];
      const tracks = tracksRes.data.tracks || [];

      setStats({
        totalCourses: courses.length,
        totalQuestions: questions.length,
        activeTracks: tracks.filter((t: any) => t.enabled !== false).length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminTabbedLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4285F4]"></div>
        </div>
      </AdminTabbedLayout>
    );
  }

  return (
    <AdminTabbedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Header */}
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100">Admin Dashboard</h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-400">Overview of your LMS platform</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {/* Total Courses Card */}
            <div className="bg-dark-900 border border-dark-700 rounded-lg p-4 sm:p-5 lg:p-6 hover:border-[#4285F4] transition-colors cursor-pointer" onClick={() => navigate('/admin/courses')}>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs sm:text-sm font-medium">Total Courses</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">{stats.totalCourses}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl sm:text-2xl">📚</span>
                </div>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-400 gap-1.5">
                <span>View all courses</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Total Questions Card */}
            <div className="bg-dark-900 border border-dark-700 rounded-lg p-4 sm:p-5 lg:p-6 hover:border-[#4285F4] transition-colors cursor-pointer" onClick={() => navigate('/admin/questions')}>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs sm:text-sm font-medium">Total Questions</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">{stats.totalQuestions}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl sm:text-2xl">❓</span>
                </div>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-400 gap-1.5">
                <span>Manage questions</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Active Tracks Card */}
            <div className="bg-dark-900 border border-dark-700 rounded-lg p-4 sm:p-5 lg:p-6 hover:border-[#4285F4] transition-colors cursor-pointer" onClick={() => navigate('/admin/courses')}>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs sm:text-sm font-medium">Active Tracks</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">{stats.activeTracks}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl sm:text-2xl">🎯</span>
                </div>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-400 gap-1.5">
                <span>View tracks</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-dark-900 border border-dark-700 rounded-lg p-4 sm:p-5 lg:p-6">
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-100 mb-3 sm:mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/admin/courses/create')}
                className="flex items-center gap-3 p-3 sm:p-4 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-left"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl">➕</span>
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-sm sm:text-base text-gray-100 font-medium">Add Course Section</p>
                  <p className="text-xs sm:text-sm text-gray-400">Create a new section for System Design, DBMS, OS, or CN</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/questions/create')}
                className="flex items-center gap-3 p-3 sm:p-4 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-left"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl">❓</span>
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-sm sm:text-base text-gray-100 font-medium">Add DSA Question</p>
                  <p className="text-xs sm:text-sm text-gray-400">Add a new question to DSA Patterns track</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center gap-3 p-3 sm:p-4 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-left"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl">👥</span>
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-sm sm:text-base text-gray-100 font-medium">Manage Users</p>
                  <p className="text-xs sm:text-sm text-gray-400">View and manage user accounts</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/courses')}
                className="flex items-center gap-3 p-3 sm:p-4 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-left"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl">📚</span>
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-sm sm:text-base text-gray-100 font-medium">Manage Courses</p>
                  <p className="text-xs sm:text-sm text-gray-400">Edit and organize course content</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminTabbedLayout>
  );
}
