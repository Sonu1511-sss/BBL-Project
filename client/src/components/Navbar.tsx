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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container-main">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-lg sm:text-xl font-bold text-gray-100 flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Logo className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="hidden sm:inline">Babua Premier League</span>
              <span className="sm:hidden">BPL</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 md:gap-2">
            <Link to="/courses" className="btn-ghost text-sm">
              Courses
            </Link>
            <Link to="/community" className="btn-ghost text-sm">
              Community
            </Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn-ghost text-sm">
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" className="btn-ghost text-sm">
                  Dashboard
                </Link>
                <Link to="/analytics" className="btn-ghost text-sm">
                  Analytics
                </Link>
                <Link to="/mentor" className="btn-ghost text-sm">
                  Mentor
                </Link>
                <div className="divider border-l border-dark-700 h-6 mx-2"></div>
                <Link to="/settings" className="btn-ghost text-sm">
                  Settings
                </Link>
                <Link to="/profile" className="btn-ghost text-sm font-medium">
                  {user.name.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm ml-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-gray-100 hover:bg-dark-800 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-dark-700 py-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/courses"
                onClick={closeMobileMenu}
                className="btn-ghost text-sm text-left px-4 py-2"
              >
                Courses
              </Link>
              <Link
                to="/community"
                onClick={closeMobileMenu}
                className="btn-ghost text-sm text-left px-4 py-2"
              >
                Community
              </Link>
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className="btn-ghost text-sm text-left px-4 py-2"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="btn-ghost text-sm text-left px-4 py-2"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/analytics"
                    onClick={closeMobileMenu}
                    className="btn-ghost text-sm text-left px-4 py-2"
                  >
                    Analytics
                  </Link>
                  <Link
                    to="/mentor"
                    onClick={closeMobileMenu}
                    className="btn-ghost text-sm text-left px-4 py-2"
                  >
                    Mentor
                  </Link>
                  <div className="divider border-t border-dark-700 my-2"></div>
                  <Link
                    to="/settings"
                    onClick={closeMobileMenu}
                    className="btn-ghost text-sm text-left px-4 py-2"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="btn-ghost text-sm text-left px-4 py-2 font-medium"
                  >
                    Profile: {user.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary text-sm text-left px-4 py-2 mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="btn-ghost text-sm text-left px-4 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMobileMenu}
                    className="btn-primary text-sm text-left px-4 py-2"
                  >
                    Sign Up
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

