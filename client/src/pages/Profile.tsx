import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function Profile() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-100">Profile</h1>

      <div className="card p-8 mb-8">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center text-4xl font-bold text-primary-400">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-100">{user?.name}</h2>
            <p className="text-gray-400">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-lg text-sm font-semibold border border-primary-500/30">
              {user?.role}
            </span>
          </div>
        </div>

        {user?.streak && (
          <div className="bg-gradient-to-r from-orange-500/30 to-pink-500/30 text-white p-6 rounded-lg border border-orange-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 text-gray-300">Current Streak</p>
                <p className="text-4xl font-bold text-gray-100">{user.streak.current} 🔥</p>
                <p className="text-sm mt-2 text-gray-300">Longest streak: {user.streak.longest} days</p>
              </div>
              <div className="text-6xl">🔥</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Learning Stats</h2>
          <div className="card p-6">
            <p className="text-gray-400">Your learning statistics will appear here.</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Account Settings</h2>
          <div className="card p-6">
            <p className="text-gray-400">Account settings coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

