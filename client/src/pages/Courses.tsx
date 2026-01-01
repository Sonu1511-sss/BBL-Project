import { Link } from 'react-router-dom';

export default function Courses() {
  // 5 Dummy Courses
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
    <div className="bg-dark-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="space-y-1 sm:space-y-2">
            <p className="text-xs sm:text-sm text-gray-400">Curated learning tracks</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">All Free Courses</h1>
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

        {/* Courses Grid */}
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
    </div>
  );
}
