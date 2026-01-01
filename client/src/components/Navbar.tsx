import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo />
            <span className="text-base sm:text-lg md:text-xl font-bold text-gray-100">Babua LMS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {user ? (
              <>
                <Link to="/courses" className="text-sm lg:text-base text-gray-300 hover:text-gray-100 transition-colors px-2 py-1 rounded-md hover:bg-dark-800">
                  Courses
                </Link>
                <Link to="/community" className="text-sm lg:text-base text-gray-300 hover:text-gray-100 transition-colors px-2 py-1 rounded-md hover:bg-dark-800">
                  Community
                </Link>
                <Link to="/mentors" className="text-sm lg:text-base text-gray-300 hover:text-gray-100 transition-colors px-2 py-1 rounded-md hover:bg-dark-800">
                  Mentors
                </Link>
                <Link to="/interview-prep" className="text-sm lg:text-base text-gray-300 hover:text-gray-100 transition-colors px-2 py-1 rounded-md hover:bg-dark-800">
                  Interview Prep
                </Link>
                <Link to="/dashboard" className="text-sm lg:text-base text-gray-300 hover:text-gray-100 transition-colors px-2 py-1 rounded-md hover:bg-dark-800">
                  Dashboard
                </Link>
                <Link to="/analytics" className="text-sm lg:text-base text-gray-300 hover:text-gray-100 transition-colors px-2 py-1 rounded-md hover:bg-dark-800">
                  Analytics
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="text-sm lg:text-base text-green-400 hover:text-green-300 transition-colors px-2 py-1 rounded-md hover:bg-dark-800">
                    Admin
                  </Link>
                )}
                <Link to="/settings" className="text-sm lg:text-base text-gray-300 hover:text-gray-100 transition-colors px-2 py-1 rounded-md hover:bg-dark-800">
                  Settings
                </Link>
                <Link to="/profile" className="text-sm lg:text-base text-gray-300 hover:text-gray-100 transition-colors px-2 py-1 rounded-md hover:bg-dark-800">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm lg:text-base font-medium ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm lg:text-base text-gray-300 hover:text-gray-100 transition-colors px-2 py-1 rounded-md hover:bg-dark-800">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-[#4285F4] text-white rounded-lg hover:bg-[#3367D6] transition-colors text-sm lg:text-base font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-gray-100 hover:bg-dark-800 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-dark-700 py-4">
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  <Link 
                    to="/courses" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-300 hover:text-gray-100 transition-colors px-3 py-2 rounded-md hover:bg-dark-800"
                  >
                    Courses
                  </Link>
                  <Link 
                    to="/community" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-300 hover:text-gray-100 transition-colors px-3 py-2 rounded-md hover:bg-dark-800"
                  >
                    Community
                  </Link>
                  <Link 
                    to="/mentors" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-300 hover:text-gray-100 transition-colors px-3 py-2 rounded-md hover:bg-dark-800"
                  >
                    Mentors
                  </Link>
                  <Link 
                    to="/interview-prep" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-300 hover:text-gray-100 transition-colors px-3 py-2 rounded-md hover:bg-dark-800"
                  >
                    Interview Prep
                  </Link>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-300 hover:text-gray-100 transition-colors px-3 py-2 rounded-md hover:bg-dark-800"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/analytics" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-300 hover:text-gray-100 transition-colors px-3 py-2 rounded-md hover:bg-dark-800"
                  >
                    Analytics
                  </Link>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm text-green-400 hover:text-green-300 transition-colors px-3 py-2 rounded-md hover:bg-dark-800"
                    >
                      Admin
                    </Link>
                  )}
                  <Link 
                    to="/settings" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-300 hover:text-gray-100 transition-colors px-3 py-2 rounded-md hover:bg-dark-800"
                  >
                    Settings
                  </Link>
                  <Link 
                    to="/profile" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-300 hover:text-gray-100 transition-colors px-3 py-2 rounded-md hover:bg-dark-800"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-300 hover:text-gray-100 transition-colors px-3 py-2 rounded-md hover:bg-dark-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 bg-[#4285F4] text-white rounded-lg hover:bg-[#3367D6] transition-colors text-sm font-medium text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

