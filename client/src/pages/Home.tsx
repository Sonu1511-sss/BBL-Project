import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();
  
  // 5 Dummy Courses - Same as Courses page
  const tracks = [
    { 
      id: 'dsa', 
      name: 'DSA Patterns', 
      description: 'Master Data Structures and Algorithms through curated patterns. Learn arrays, linked lists, trees, graphs, and dynamic programming.', 
      icon: '💻', 
      path: '/courses/dsa',
      students: 1250,
      lessons: 45
    },
    { 
      id: 'system-design', 
      name: 'System Design', 
      description: 'Learn scalable system design principles. Master load balancing, database sharding, caching strategies, and microservices architecture.', 
      icon: '🏗️', 
      path: '/courses/system-design',
      students: 980,
      lessons: 32
    },
    { 
      id: 'dbms', 
      name: 'DBMS', 
      description: 'Master database concepts and SQL. Learn normalization, indexing, transactions, ACID properties, and database optimization techniques.', 
      icon: '🗄️', 
      path: '/courses/dbms',
      students: 750,
      lessons: 28
    },
    { 
      id: 'cn', 
      name: 'Computer Networks', 
      description: 'Understand network protocols and architecture. Learn TCP/IP, HTTP, DNS, load balancing, and distributed systems fundamentals.', 
      icon: '🌐', 
      path: '/courses/cn',
      students: 620,
      lessons: 24
    },
    { 
      id: 'os', 
      name: 'Operating Systems', 
      description: 'Explore OS fundamentals. Master process management, memory management, file systems, concurrency, and synchronization concepts.', 
      icon: '⚙️', 
      path: '/courses/os',
      students: 540,
      lessons: 30
    },
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section - Developer First Design */}
      <section className="relative bg-gradient-to-b from-dark-900 via-dark-950 to-dark-950 border-b border-dark-800">
        <div className="container-main py-10 sm:py-14 md:py-18 lg:py-20 xl:py-24">
          <div className="text-center max-w-4xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500/20 text-green-400 rounded-full text-xs sm:text-sm font-medium mb-5 sm:mb-6 lg:mb-8 border border-green-500/30">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></span>
              <span className="hidden sm:inline">100% Free • No Paywalls • Forever</span>
              <span className="sm:hidden">100% Free</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 text-gray-100 leading-tight px-2">
              Babua Premier League
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 mb-6 sm:mb-8 lg:mb-10 leading-relaxed max-w-2xl mx-auto px-2">
              Practical tech education for developers. <span className="font-semibold text-gray-100">DSA, System Design, LLD, OS, CN, DBMS, AI/ML</span> — all free, no strings attached.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-2">
              {user ? (
                <Link to="/dashboard" className="btn-primary text-base px-8 py-3.5 font-semibold">
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary text-base px-8 py-3.5 font-semibold">
                    Start Learning Free
                  </Link>
                  <Link to="/courses" className="btn-secondary text-base px-8 py-3.5 font-semibold">
                    Browse Courses
                  </Link>
                </>
              )}
            </div>
            <p className="text-sm sm:text-base text-gray-400">
              Join <span className="font-semibold text-gray-200">10,000+</span> developers learning for free
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - Clean Grid */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20 bg-dark-900">
        <div className="container-main px-4 sm:px-5 md:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-3 sm:mb-4">
              Why Developers Choose Babua LMS
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl">Built by developers, for developers</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            <div className="card p-5 sm:p-6 md:p-7 lg:p-8 hover:border-primary-500/50 transition-colors">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl sm:text-2xl">🆓</span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-100">100% Free</h3>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">
                All videos, notes, problems, and quizzes are completely free. No paywalls, no hidden costs.
              </p>
            </div>
            <div className="card p-6 md:p-8 hover:border-primary-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-100">Complete Curriculum</h3>
              </div>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                DSA, System Design, LLD, OS, CN, DBMS, AI/ML — everything you need for tech interviews.
              </p>
            </div>
            <div className="card p-6 md:p-8 hover:border-primary-500/50 transition-colors sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-100">Track Progress</h3>
              </div>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Streaks, progress tracking, and revision reminders to keep you consistent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section - Only show when logged in */}
      {user && (
        <section className="py-10 sm:py-14 md:py-16 lg:py-20 bg-dark-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
            {/* Header - Same as Courses page */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-gray-400">Curated learning tracks</p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">All Free Courses</h2>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-right">
                  <p className="text-sm sm:text-base text-gray-400 font-semibold">{tracks.length} courses</p>
                  <p className="text-xs sm:text-sm text-gray-500">100% free, forever</p>
                </div>
                <div className="px-3 py-1.5 sm:py-2 bg-green-500/20 text-green-400 rounded-lg text-xs sm:text-sm font-medium border border-green-500/30">
                  FREE
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-gray-400 max-w-2xl">
                Comprehensive courses designed for developers. Learn at your own pace with hands-on practice and real-world examples.
              </p>
            </div>

            {/* Courses Grid - Same as Courses page */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {tracks.map((track) => (
                <Link
                  key={track.id}
                  to={track.path}
                  className="bg-dark-900 border border-dark-700 rounded-xl p-4 sm:p-5 lg:p-6 hover:border-[#4285F4] hover:shadow-lg hover:shadow-[#4285F4]/10 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="text-3xl sm:text-4xl lg:text-5xl group-hover:scale-110 transition-transform">
                      {track.icon}
                    </div>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium border border-green-500/30">
                      FREE
                    </span>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-100 mb-2 sm:mb-3 group-hover:text-[#4285F4] transition-colors">
                    {track.name}
                  </h3>
                  
                  <p className="text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed mb-4 sm:mb-5 line-clamp-3">
                    {track.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-dark-700">
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <span>👥</span>
                        <span>{track.students}+</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>📚</span>
                        <span>{track.lessons} lessons</span>
                      </span>
                    </div>
                    <span className="text-sm sm:text-base text-[#4285F4] font-medium group-hover:underline">
                      View →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Optional Paid Features - Clear Separation */}
      <section className="py-12 sm:py-16 md:py-20 bg-dark-900 border-t border-dark-800">
        <div className="container-main px-4">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-xs sm:text-sm font-medium mb-6 border border-amber-500/30">
              <span>💡</span>
              <span>Optional Add-ons</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-100 mb-4">
              Additional Support (Optional)
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              All learning content is <span className="font-semibold text-green-400">100% free</span>. These are optional paid services for extra support.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="card-paid p-6 md:p-8 hover:border-amber-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">👨‍🏫</span>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-100">Mentor Sessions</h3>
                  <span className="badge-paid text-xs">Optional Paid</span>
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-5">
                1:1 sessions with experienced mentors for personalized guidance and code reviews.
              </p>
              <Link to="/mentor" className="text-sm md:text-base text-primary-400 font-medium hover:underline inline-flex items-center gap-1">
                Learn more →
              </Link>
            </div>
            <div className="card-paid p-6 md:p-8 hover:border-amber-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-100">Study Cohorts</h3>
                  <span className="badge-paid text-xs">Optional Paid</span>
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-5">
                Join structured cohorts with live sessions, group accountability, and peer learning.
              </p>
              <Link to="/mentor" className="text-sm md:text-base text-primary-400 font-medium hover:underline inline-flex items-center gap-1">
                Learn more →
              </Link>
            </div>
            <div className="card-paid p-6 md:p-8 hover:border-amber-500/50 transition-colors sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">💼</span>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-100">Interview Prep</h3>
                  <span className="badge-paid text-xs">Optional Paid</span>
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-5">
                Resume reviews, mock interviews, and personalized career roadmaps.
              </p>
              <Link to="/mentor" className="text-sm md:text-base text-primary-400 font-medium hover:underline inline-flex items-center gap-1">
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

