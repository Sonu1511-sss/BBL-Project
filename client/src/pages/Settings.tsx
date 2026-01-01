import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: '',
    currentGoal: '',
    avatar: ''
  });

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`);
      const settings = response.data.settings;
      setProfileData({
        name: settings.profile.name,
        bio: settings.profile.bio || '',
        currentGoal: settings.profile.currentGoal || '',
        avatar: settings.profile.avatar || ''
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_URL}/settings/profile`, profileData);
      toast.success('Profile updated successfully!');
      window.location.reload(); // Refresh to update user context
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${API_URL}/settings/password`, {
        currentPassword,
        newPassword
      });
      toast.success('Password updated successfully!');
      form.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">Settings</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Profile Settings */}
          <div className="card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4">Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Goal
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  value={profileData.currentGoal}
                  onChange={(e) => setProfileData({ ...profileData, currentGoal: e.target.value })}
                  placeholder="e.g., Master DSA in 3 months"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Password Settings */}
          {user && !user.email?.includes('@google') && (
            <div className="card p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4">Change Password</h2>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    required
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    required
                    minLength={6}
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    minLength={6}
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

