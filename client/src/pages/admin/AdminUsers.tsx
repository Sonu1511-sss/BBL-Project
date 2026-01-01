import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminTabbedLayout from '../../components/admin/AdminTabbedLayout';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  streak?: number;
  enrolledCourses?: any[];
  createdAt?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Try to fetch users from admin endpoint, fallback to auth endpoint
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const response = await axios.get(`${API_URL}/admin/users`, { headers });
        setUsers(response.data.users || []);
      } catch (error) {
        // If admin endpoint doesn't exist, try to get from User model directly
        // For now, we'll show a message that the endpoint needs to be implemented
        console.error('Failed to fetch users:', error);
        toast.error('Users endpoint not implemented yet');
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.role === 'admin').length;
  const regularUsers = users.filter((u) => u.role !== 'admin').length;

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">User Management</h2>
              <p className="text-gray-400 text-sm md:text-base">View and manage all platform users</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-900 border border-dark-700 rounded-lg p-6">
              <p className="text-gray-400 text-sm font-medium mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-100">{totalUsers}</p>
            </div>
            <div className="bg-dark-900 border border-dark-700 rounded-lg p-6">
              <p className="text-gray-400 text-sm font-medium mb-1">Admin Users</p>
              <p className="text-3xl font-bold text-gray-100">{adminUsers}</p>
            </div>
            <div className="bg-dark-900 border border-dark-700 rounded-lg p-6">
              <p className="text-gray-400 text-sm font-medium mb-1">Regular Users</p>
              <p className="text-3xl font-bold text-gray-100">{regularUsers}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-[#4285F4]"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-[#4285F4]"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          {filteredUsers.length > 0 ? (
            <div className="bg-dark-900 border border-dark-700 rounded-lg overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-dark-700">
                  <thead className="bg-dark-800">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Streak
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Enrolled Courses
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-dark-900 divide-y divide-dark-700">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-dark-800 transition-colors">
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-100">{user.name || 'N/A'}</div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300 truncate max-w-[200px]">{user.email}</div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.streak || 0} 🔥
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.enrolledCourses?.length || 0}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-dark-700">
                {filteredUsers.map((user) => (
                  <div key={user._id} className="p-4 hover:bg-dark-800/60 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-100 mb-1 break-words">{user.name || 'N/A'}</h4>
                        <p className="text-xs text-gray-400 break-all mb-2">{user.email}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {user.role || 'user'}
                          </span>
                          <span className="text-xs text-gray-300">
                            {user.streak || 0} 🔥
                          </span>
                          <span className="text-xs text-gray-300">
                            {user.enrolledCourses?.length || 0} courses
                          </span>
                        </div>
                        {user.createdAt && (
                          <p className="text-xs text-gray-400 mt-2">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-dark-900 border border-dark-700 rounded-lg p-12 text-center">
              <p className="text-gray-400 mb-4">
                {searchQuery || filterRole !== 'all'
                  ? 'No users found matching your filters'
                  : 'No users found. Users endpoint may need to be implemented.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterRole('all');
                  }}
                  className="px-4 py-2 bg-[#4285F4] text-white rounded-lg hover:bg-[#3367D6] font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminTabbedLayout>
  );
}
