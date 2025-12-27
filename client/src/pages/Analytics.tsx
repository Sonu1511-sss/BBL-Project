import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface AnalyticsStats {
  totalLessons: number;
  completedLessons: number;
  completionRate: string;
  totalTimeSpent: number;
  enrolledCourses: number;
  achievements: number;
  weeklyCompleted: number;
  currentStreak: number;
  longestStreak: number;
}

export default function Analytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics/stats`);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics');
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

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="container-main py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-2">Learning Analytics</h1>
        <p className="text-sm sm:text-base text-gray-400">Track your progress and performance</p>
      </div>

      {stats && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-400">Completion Rate</span>
                <span className="text-xl sm:text-2xl">📊</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-100">{stats.completionRate}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.completedLessons} of {stats.totalLessons} lessons
              </p>
            </div>

            <div className="card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-400">Time Spent</span>
                <span className="text-xl sm:text-2xl">⏱️</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-100">{formatTime(stats.totalTimeSpent)}</p>
              <p className="text-xs text-gray-500 mt-1">Total learning time</p>
            </div>

            <div className="card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-400">Current Streak</span>
                <span className="text-xl sm:text-2xl">🔥</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-100">{stats.currentStreak}</p>
              <p className="text-xs text-gray-500 mt-1">Longest: {stats.longestStreak} days</p>
            </div>

            <div className="card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-400">Achievements</span>
                <span className="text-xl sm:text-2xl">🏆</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-100">{stats.achievements}</p>
              <p className="text-xs text-gray-500 mt-1">Unlocked badges</p>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="card p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4">This Week</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Lessons Completed</span>
                  <span className="text-lg font-bold text-gray-100">{stats.weeklyCompleted}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min((stats.weeklyCompleted / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link to="/leaderboard" className="card p-4 sm:p-6 hover:border-primary-500 transition-colors">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🏅</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-2">Leaderboard</h3>
              <p className="text-xs sm:text-sm text-gray-400">See where you rank</p>
            </Link>

            <Link to="/achievements" className="card p-4 sm:p-6 hover:border-primary-500 transition-colors">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🎖️</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-2">Achievements</h3>
              <p className="text-xs sm:text-sm text-gray-400">View all badges</p>
            </Link>

            <Link to="/courses" className="card p-4 sm:p-6 hover:border-primary-500 transition-colors sm:col-span-2 lg:col-span-1">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📚</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-2">Continue Learning</h3>
              <p className="text-xs sm:text-sm text-gray-400">Browse courses</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

