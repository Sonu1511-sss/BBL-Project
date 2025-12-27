import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import ConfirmDialog from '../components/ConfirmDialog';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
  type: string;
  content?: string;
  videoUrl?: string;
  duration: number;
  order: number;
  problems: any[];
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  thumbnail?: string;
  modules: Module[];
  enrolledCount: number;
}

interface Thread {
  _id: string;
  title: string;
  content: string;
  author: { name: string; email: string };
  courseId?: { title: string; category: string };
  upvotes: any[];
  replies: any[];
  isResolved: boolean;
  tags: string[];
  createdAt: string;
}

interface Mentor {
  _id: string;
  name: string;
  email: string;
  profile?: {
    bio?: string;
    avatar?: string;
  };
  createdAt: string;
}

interface Booking {
  _id: string;
  studentId: { name: string; email: string };
  mentorId: { name: string; email: string };
  sessionType: string;
  scheduledAt: string;
  duration: number;
  status: string;
  meetingLink?: string;
}

type TabType = 'overview' | 'courses' | 'users' | 'community' | 'mentors';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Courses state
  const [courses, setCourses] = useState<Course[]>([]);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  
  // Community state
  const [threads, setThreads] = useState<Thread[]>([]);
  
  // Mentors state
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteType, setDeleteType] = useState<'course' | 'module' | 'lesson' | 'thread' | 'mentor' | 'booking' | 'user'>('course');
  const [deleteId, setDeleteId] = useState<string>('');

  useEffect(() => {
    // AdminRoute already handles authentication, so we can directly fetch data
    // Wait for user to be loaded before fetching
    const userRole = (user as any)?.role || user?.role;
    if (user && userRole === 'admin') {
      fetchData();
    } else if (user && userRole !== 'admin') {
      // If user is loaded but not admin, AdminRoute will handle redirect
      setLoading(false);
    } else {
      // User not loaded yet
      setLoading(false);
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        await Promise.all([fetchStats(), fetchCourses()]);
      } else if (activeTab === 'courses') {
        await fetchCourses();
      } else if (activeTab === 'users') {
        await fetchUsers();
      } else if (activeTab === 'community') {
        await fetchThreads();
      } else if (activeTab === 'mentors') {
        await Promise.all([fetchMentors(), fetchBookings()]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/courses`);
      setCourses(response.data.courses);
    } catch (error: any) {
      console.error('Failed to fetch courses:', error);
      toast.error(error.response?.data?.error || 'Failed to load courses');
    }
  };

  const fetchThreads = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/community/threads`);
      setThreads(response.data.threads);
    } catch (error: any) {
      console.error('Failed to fetch threads:', error);
      toast.error(error.response?.data?.error || 'Failed to load threads');
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/mentors`);
      setMentors(response.data.mentors);
    } catch (error: any) {
      console.error('Failed to fetch mentors:', error);
      toast.error(error.response?.data?.error || 'Failed to load mentors');
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/bookings`);
      setBookings(response.data.bookings);
    } catch (error: any) {
      console.error('Failed to fetch bookings:', error);
      toast.error(error.response?.data?.error || 'Failed to load bookings');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/users`);
      setUsers(response.data.users);
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      toast.error(error.response?.data?.error || 'Failed to load users');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`);
      setStats(response.data.stats);
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
      toast.error(error.response?.data?.error || 'Failed to load statistics');
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteType === 'course') {
        await axios.delete(`${API_URL}/admin/courses/${deleteId}`);
        toast.success('Course deleted successfully');
        fetchCourses();
      } else if (deleteType === 'module') {
        const [courseId, moduleId] = deleteId.split('|');
        await axios.delete(`${API_URL}/admin/courses/${courseId}/modules/${moduleId}`);
        toast.success('Module deleted successfully');
        fetchCourses();
      } else if (deleteType === 'lesson') {
        const [courseId, moduleId, lessonId] = deleteId.split('|');
        await axios.delete(`${API_URL}/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
        toast.success('Lesson deleted successfully');
        fetchCourses();
      } else if (deleteType === 'thread') {
        await axios.delete(`${API_URL}/admin/community/threads/${deleteId}`);
        toast.success('Thread deleted successfully');
        fetchThreads();
      } else if (deleteType === 'mentor') {
        await axios.delete(`${API_URL}/admin/mentors/${deleteId}`);
        toast.success('Mentor deleted successfully');
        fetchMentors();
      } else if (deleteType === 'booking') {
        await axios.delete(`${API_URL}/admin/bookings/${deleteId}`);
        toast.success('Booking deleted successfully');
        fetchBookings();
      } else if (deleteType === 'user') {
        await axios.delete(`${API_URL}/admin/users/${deleteId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      }
      setShowDeleteDialog(false);
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.error || 'Failed to delete');
    }
  };

  const handleToggleResolve = async (threadId: string) => {
    try {
      await axios.put(`${API_URL}/admin/community/threads/${threadId}/resolve`);
      toast.success('Thread status updated');
      fetchThreads();
    } catch (error: any) {
      console.error('Toggle resolve error:', error);
      toast.error(error.response?.data?.error || 'Failed to update');
    }
  };

  const confirmDelete = (type: typeof deleteType, id: string) => {
    setDeleteType(type);
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const toggleCourse = (courseId: string) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  // Show loading spinner only on initial load when user is not yet loaded
  // AdminRoute handles the redirect, so if we're here, user should be admin
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Double check role (shouldn't reach here if not admin due to AdminRoute)
  const userRole = (user as any)?.role || user?.role;
  if (userRole !== 'admin') {
    return null; // AdminRoute will handle redirect
  }

  const getDeleteMessage = () => {
    if (deleteType === 'course') {
      const course = courses.find(c => c._id === deleteId);
      return `Are you sure you want to delete the course "${course?.title}"? This will also delete all modules, lessons, and progress data.`;
    } else if (deleteType === 'module') {
      return 'Are you sure you want to delete this module? This will also delete all lessons in this module.';
    } else if (deleteType === 'lesson') {
      return 'Are you sure you want to delete this lesson? This will also delete all related progress data.';
    } else if (deleteType === 'thread') {
      return 'Are you sure you want to delete this community thread? This action cannot be undone.';
    } else if (deleteType === 'mentor') {
      return 'Are you sure you want to delete this mentor? This will also delete all their bookings.';
    } else if (deleteType === 'booking') {
      return 'Are you sure you want to delete this booking?';
    }
    return 'Are you sure you want to delete this item?';
  };

  return (
    <div className="container-main py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-2">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-400">Manage courses, community, and mentors</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-dark-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'courses'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Courses
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'users'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'community'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Community
        </button>
        <button
          onClick={() => setActiveTab('mentors')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'mentors'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Mentors
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : stats ? (
            <>
              {/* Statistics Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
                    <span className="text-2xl">👥</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-100">{stats.totalUsers}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalStudents} students • {stats.totalMentors} mentors
                  </p>
                </div>
                <div className="card p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-400">Total Courses</h3>
                    <span className="text-2xl">📚</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-100">{stats.totalCourses}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.totalEnrollments} total enrollments
                  </p>
                </div>
                <div className="card p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-400">Community Threads</h3>
                    <span className="text-2xl">💬</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-100">{stats.totalThreads}</p>
                  <p className="text-xs text-gray-500 mt-1">Discussion threads</p>
                </div>
                <div className="card p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-400">Mentor Bookings</h3>
                    <span className="text-2xl">📅</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-100">{stats.totalBookings}</p>
                  <p className="text-xs text-gray-500 mt-1">Scheduled sessions</p>
                </div>
              </div>

              {/* Recent Courses */}
              <div>
                <h2 className="text-xl font-semibold text-gray-100 mb-4">Recent Courses</h2>
                {courses.length === 0 ? (
                  <div className="card p-8 text-center">
                    <p className="text-gray-400">No courses found.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.slice(0, 6).map((course) => (
                      <div key={course._id} className="card overflow-hidden">
                        {course.thumbnail && (
                          <div className="relative h-32 bg-dark-800 overflow-hidden">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="badge-category text-xs">{course.category}</span>
                            <span className="badge-free text-xs">FREE</span>
                          </div>
                          <h3 className="text-sm font-semibold text-gray-100 mb-1 line-clamp-1">{course.title}</h3>
                          <p className="text-xs text-gray-500">
                            {course.modules.length} modules • {course.enrolledCount} enrolled
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-gray-400">Failed to load statistics.</p>
            </div>
          )}
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          {courses.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-400 mb-4">No courses found. Create your first course!</p>
              <button onClick={() => navigate('/admin/courses/new')} className="btn-primary">
                Create Course
              </button>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="card overflow-hidden">
                {course.thumbnail && (
                  <div className="relative h-48 bg-dark-800 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      <span className="badge-free">FREE</span>
                    </div>
                  </div>
                )}
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-100">{course.title}</h2>
                        <span className="badge-category">{course.category}</span>
                        {!course.thumbnail && <span className="badge-free">FREE</span>}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{course.description}</p>
                      <p className="text-xs text-gray-500">
                        {course.modules.length} modules • {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons • {course.enrolledCount} enrolled
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/courses/${course._id}/edit`)}
                        className="btn-secondary text-sm px-3 py-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete('course', course._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-md font-medium transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => toggleCourse(course._id)}
                        className="btn-ghost text-sm px-3 py-2"
                      >
                        {expandedCourses.has(course._id) ? '▼' : '▶'}
                      </button>
                    </div>
                  </div>

                  {expandedCourses.has(course._id) && (
                    <div className="mt-4 space-y-3 border-t border-dark-700 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-semibold text-gray-200">Modules</h3>
                        <button
                          onClick={() => navigate(`/admin/courses/${course._id}/modules/new`)}
                          className="btn-secondary text-xs px-2 py-1"
                        >
                          + Add Module
                        </button>
                      </div>
                      {course.modules.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">No modules yet.</p>
                      ) : (
                        course.modules
                          .sort((a, b) => a.order - b.order)
                          .map((module) => (
                            <div key={module._id} className="bg-dark-800 rounded-lg p-3 sm:p-4 border border-dark-700">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                                <div className="flex-1">
                                  <h4 className="text-sm sm:text-base font-semibold text-gray-100 mb-1">
                                    {module.order}. {module.title}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-gray-400 mb-1">{module.description}</p>
                                  <p className="text-xs text-gray-500">{module.lessons.length} lessons</p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => navigate(`/admin/courses/${course._id}/modules/${module._id}/edit`)}
                                    className="btn-secondary text-xs px-2 py-1"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => confirmDelete('module', `${course._id}|${module._id}`)}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-md font-medium transition-colors"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => toggleModule(module._id)}
                                    className="btn-ghost text-xs px-2 py-1"
                                  >
                                    {expandedModules.has(module._id) ? '▼' : '▶'}
                                  </button>
                                </div>
                              </div>

                              {expandedModules.has(module._id) && (
                                <div className="mt-3 space-y-2 border-t border-dark-700 pt-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-xs font-semibold text-gray-300">Lessons</h5>
                                    <button
                                      onClick={() => navigate(`/admin/courses/${course._id}/modules/${module._id}/lessons/new`)}
                                      className="btn-secondary text-xs px-2 py-1"
                                    >
                                      + Add Lesson
                                    </button>
                                  </div>
                                  {module.lessons.length === 0 ? (
                                    <p className="text-xs text-gray-500 text-center py-2">No lessons yet.</p>
                                  ) : (
                                    module.lessons
                                      .sort((a, b) => a.order - b.order)
                                      .map((lesson) => (
                                        <div key={lesson._id} className="bg-dark-900 rounded p-2 sm:p-3 border border-dark-700">
                                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                            <div className="flex-1">
                                              <p className="text-xs sm:text-sm font-medium text-gray-200">
                                                {lesson.order}. {lesson.title}
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                {lesson.type} • {lesson.duration} min • {lesson.problems.length} problems
                                              </p>
                                            </div>
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() => navigate(`/admin/courses/${course._id}/modules/${module._id}/lessons/${lesson._id}/edit`)}
                                                className="btn-secondary text-xs px-2 py-1"
                                              >
                                                Edit
                                              </button>
                                              <button
                                                onClick={() => confirmDelete('lesson', `${course._id}|${module._id}|${lesson._id}`)}
                                                className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-md font-medium transition-colors"
                                              >
                                                Delete
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                  )}
                                </div>
                              )}
                            </div>
                          ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Community Tab */}
      {activeTab === 'community' && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : threads.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-400">No community threads found.</p>
            </div>
          ) : (
            threads.map((thread) => (
              <div key={thread._id} className="card">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-100">{thread.title}</h3>
                        {thread.isResolved && (
                          <span className="badge-free text-xs">Resolved</span>
                        )}
                        {thread.courseId && (
                          <span className="badge-category text-xs">{thread.courseId.category}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">{thread.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>By: {thread.author.name}</span>
                        <span>•</span>
                        <span>{thread.upvotes.length} upvotes</span>
                        <span>•</span>
                        <span>{thread.replies.length} replies</span>
                        {thread.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex gap-1 flex-wrap">
                              {thread.tags.map((tag, i) => (
                                <span key={i} className="text-primary-400">#{tag}</span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleResolve(thread._id)}
                        className={`btn-secondary text-xs px-3 py-2 ${thread.isResolved ? 'bg-green-600/20 border-green-500/30' : ''}`}
                      >
                        {thread.isResolved ? 'Mark Unresolved' : 'Mark Resolved'}
                      </button>
                      <button
                        onClick={() => confirmDelete('thread', thread._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded-md font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-400">No users found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user._id} className="card">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {user.profile?.avatar && (
                          <img
                            src={user.profile.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-lg font-semibold text-gray-100">{user.name}</h3>
                            <span className={`badge-category text-xs ${
                              user.role === 'admin' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                              user.role === 'mentor' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              'bg-green-500/20 text-green-400 border-green-500/30'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{user.email}</p>
                          {user.profile?.bio && (
                            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{user.profile.bio}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                            {user.streak && (
                              <>
                                <span>🔥 Streak: {user.streak.current} days</span>
                                <span>•</span>
                              </>
                            )}
                            <span>📚 Enrolled: {user.enrolledCourses?.length || 0} courses</span>
                            <span>•</span>
                            <span>📅 Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                          {user.enrolledCourses && user.enrolledCourses.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-dark-700">
                              <p className="text-xs font-medium text-gray-400 mb-2">Enrolled Courses:</p>
                              <div className="flex flex-wrap gap-1">
                                {user.enrolledCourses.map((enrollment: any) => (
                                  enrollment.courseId && (
                                    <span key={enrollment.courseId._id} className="badge-category text-xs">
                                      {enrollment.courseId.title}
                                    </span>
                                  )
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => confirmDelete('user', user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded-md font-medium transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mentors Tab */}
      {activeTab === 'mentors' && (
        <div className="space-y-6">
          {/* Mentors List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-100">Mentors</h2>
              <button
                onClick={() => navigate('/admin/mentors/new')}
                className="btn-primary text-sm"
              >
                + Add Mentor
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : mentors.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-gray-400 mb-4">No mentors found.</p>
                <button onClick={() => navigate('/admin/mentors/new')} className="btn-primary">
                  Add First Mentor
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mentors.map((mentor) => (
                  <div key={mentor._id} className="card">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 mb-3">
                        {mentor.profile?.avatar && (
                          <img
                            src={mentor.profile.avatar}
                            alt={mentor.name}
                            className="w-12 h-12 rounded-full"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-100 mb-1">{mentor.name}</h3>
                          <p className="text-sm text-gray-400 mb-2">{mentor.email}</p>
                          {mentor.profile?.bio && (
                            <p className="text-xs text-gray-500 line-clamp-2">{mentor.profile.bio}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-dark-700">
                        <button
                          onClick={() => navigate(`/admin/mentors/${mentor._id}/edit`)}
                          className="btn-secondary text-xs px-3 py-2 flex-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete('mentor', mentor._id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded-md font-medium transition-colors flex-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bookings List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Mentor Bookings</h2>
            {bookings.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-gray-400">No bookings found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking._id} className="card">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-base font-semibold text-gray-100">{booking.sessionType}</h3>
                            <span className={`badge-category text-xs ${
                              booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              booking.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                              booking.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">
                            <span className="font-medium">Student:</span> {booking.studentId.name} ({booking.studentId.email})
                          </p>
                          <p className="text-sm text-gray-400 mb-2">
                            <span className="font-medium">Mentor:</span> {booking.mentorId.name} ({booking.mentorId.email})
                          </p>
                          <p className="text-xs text-gray-500">
                            Scheduled: {new Date(booking.scheduledAt).toLocaleString()} • Duration: {booking.duration} min
                          </p>
                          {booking.meetingLink && (
                            <a
                              href={booking.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary-400 hover:underline mt-2 inline-block"
                            >
                              Meeting Link →
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => confirmDelete('booking', booking._id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded-md font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Confirm Delete"
        message={getDeleteMessage()}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
