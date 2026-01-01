import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminTabbedLayoutProps {
  children: ReactNode;
}

const adminTabs = [
  { id: 'courses', label: 'Courses', path: '/admin/courses', icon: '📚' },
  { id: 'dsa', label: 'DSA Patterns', path: '/admin/dsa-patterns', icon: '🧩' },
  { id: 'mentors', label: 'Mentors', path: '/admin/mentors', icon: '🧑‍🏫' },
  { id: 'interview', label: 'Interview Prep', path: '/admin/interview-prep', icon: '💼' },
  { id: 'users', label: 'Users', path: '/admin/users', icon: '👥' },
];

export default function AdminTabbedLayout({ children }: AdminTabbedLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const activeTab = adminTabs.find(tab => location.pathname.startsWith(tab.path))?.id || 'dashboard';

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Top Navbar */}
      <nav className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-gray-100 truncate">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {user && (
                <span className="text-xs sm:text-sm text-gray-400 hidden md:inline truncate max-w-[150px]">
                  {user.name || user.email}
                </span>
              )}
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-300 hover:text-gray-100 transition-colors whitespace-nowrap"
              >
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Home</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tabs Navigation */}
      <div className="bg-dark-900 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {adminTabs.map((tab) => {
              const isActive = location.pathname.startsWith(tab.path) || 
                              (tab.id === 'courses' && location.pathname.startsWith('/admin/courses'));
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={`
                    px-4 sm:px-6 py-3 font-medium text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap flex-shrink-0
                    ${isActive
                      ? 'border-[#4285F4] text-[#4285F4] bg-blue-500/10'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                    }
                  `}
                >
                  <span className="mr-1 sm:mr-2">{tab.icon}</span>
                  <span className="hidden xs:inline">{tab.label}</span>
                  <span className="xs:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-8rem)]">
        {children}
      </main>
    </div>
  );
}
