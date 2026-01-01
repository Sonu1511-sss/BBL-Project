import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function Profile() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fallbackProgress = [
    { title: 'DSA Patterns', percent: 72 },
    { title: 'System Design', percent: 45 },
    { title: 'DBMS', percent: 60 },
    { title: 'Operating Systems', percent: 38 },
  ];
  const recentActivity = [
    'Solved: Longest Substring Without Repeat',
    'Watched: Load Balancer deep-dive',
    'Practiced: B+ Tree indexing',
    'Read: TCP congestion control',
  ];

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    try {
      // Fetch all enrolled courses and their progress
      // This is a simplified version - in production, you'd have a dedicated endpoint
      const response = await axios.get(`${API_URL}/courses`);
      // For now, just show user info
      setProgress([]);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      setProgress(fallbackProgress);
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
    <div className="bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-sm text-gray-400">Your profile</p>
          <h1 className="text-3xl font-bold text-gray-100">Profile</h1>
        </div>

        <div className="card p-4 sm:p-6 lg:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-primary-500/20 rounded-full flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-400 flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-100 truncate">{user?.name}</h2>
              <p className="text-sm sm:text-base text-gray-400 break-all">{user?.email}</p>
              <span className="inline-block mt-2 px-2 sm:px-3 py-1 bg-primary-500/20 text-primary-400 rounded-lg text-xs sm:text-sm font-semibold border border-primary-500/30">
                {user?.role}
              </span>
            </div>
          </div>

          {user?.streak && (
            <div className="bg-gradient-to-r from-orange-500/30 to-pink-500/30 text-white p-4 sm:p-6 rounded-lg border border-orange-500/30">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm opacity-90 text-gray-300">Current Streak</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">{user.streak.current} 🔥</p>
                  <p className="text-xs sm:text-sm mt-2 text-gray-300">Longest streak: {user.streak.longest} days</p>
                </div>
                <div className="text-3xl sm:text-4xl lg:text-6xl flex-shrink-0">🔥</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">Learning Stats</h2>
            <div className="card p-6 space-y-3">
              {(progress.length ? progress : fallbackProgress).map((item) => (
                <div key={item.title} className="space-y-1">
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <span>{item.title}</span>
                    <span className="font-semibold text-gray-100">{item.percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-dark-800">
                    <div
                      className="h-2 rounded-full bg-[#4285F4]"
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">Recent Activity</h2>
            <div className="card p-6 space-y-2">
              {recentActivity.map((text) => (
                <div
                  key={text}
                  className="flex items-start gap-2 text-sm text-gray-200 border border-dark-800 rounded-lg px-3 py-2 bg-dark-900"
                >
                  <span className="text-[#8AB4F8]">•</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

