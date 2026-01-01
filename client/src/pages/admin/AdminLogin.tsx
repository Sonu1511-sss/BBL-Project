import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ADMIN_EMAIL = 'adminbpl@gmail.com';
const ADMIN_PASSWORD = 'Bpl@4321';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      
      // Check if user is admin
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role !== 'admin') {
        toast.error('Access denied. Admin credentials required.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
      }

      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 py-8 sm:py-12 px-3 sm:px-4 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-dark-900 border border-dark-700 rounded-xl p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4285F4]/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-[#4285F4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 mb-2">
              Admin Login
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Sign in to access the admin dashboard
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-[#4285F4] transition-all placeholder-gray-500"
                placeholder="adminbpl@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-[#4285F4] transition-all placeholder-gray-500"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-dark-800/50 border border-dark-700 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              <span className="font-semibold text-gray-300">Default Credentials:</span>
              <br />
              Email: <span className="text-[#4285F4]">{ADMIN_EMAIL}</span>
              <br />
              Password: <span className="text-[#4285F4]">{ADMIN_PASSWORD}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
