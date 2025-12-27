import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  lessons: any[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
  modules: Module[];
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchCourse();
      if (user) {
        fetchProgress();
      }
    }
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/${id}`);
      setCourse(response.data.course);
    } catch (error) {
      console.error('Failed to fetch course:', error);
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`${API_URL}/progress/course/${id}`);
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll');
      return;
    }
    try {
      await axios.post(`${API_URL}/courses/${id}/enroll`);
      toast.success('Enrolled successfully!');
      fetchCourse();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to enroll');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-400">Course not found</p>
      </div>
    );
  }

  const sortedModules = [...course.modules].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card mb-8 overflow-hidden">
        {course.thumbnail && (
          <div className="relative h-64 sm:h-80 bg-dark-800 overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent"></div>
            <div className="absolute top-4 right-4">
              <span className="badge-free">100% FREE</span>
            </div>
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge-category">{course.category}</span>
            {!course.thumbnail && <span className="badge-free">100% FREE</span>}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-3">{course.title}</h1>
          <p className="text-gray-400 mb-6 leading-relaxed">{course.description}</p>
        
          {progress && (
            <div className="mb-6 p-4 bg-dark-800 rounded-lg border border-dark-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Your Progress</span>
                <span className="text-sm font-semibold text-gray-100">{progress.stats.progressPercentage}%</span>
              </div>
              <div className="progress-bar mb-2">
                <div
                  className="progress-fill"
                  style={{ width: `${progress.stats.progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400">
                {progress.stats.completedLessons} of {progress.stats.totalLessons} lessons completed
              </p>
            </div>
          )}

          <button onClick={handleEnroll} className="btn-primary">
            {user ? 'Enroll Now (Free)' : 'Login to Enroll'}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-100 mb-2">Course Content</h2>
        <p className="text-sm text-gray-400">
          All content is <span className="font-semibold text-green-400">100% free</span>. No paywalls, no restrictions.
        </p>
      </div>

      <div className="space-y-4">
        {sortedModules.map((module, moduleIndex) => {
          const sortedLessons = [...module.lessons].sort((a, b) => a.order - b.order);
          return (
            <div key={module._id} className="card">
              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary-500/20 text-primary-400 rounded-md flex items-center justify-center text-sm font-bold flex-shrink-0 border border-primary-500/30">
                    {moduleIndex + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-100 mb-1">{module.title}</h3>
                    <p className="text-sm text-gray-400">{module.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {sortedLessons.map((lesson, lessonIndex) => {
                    const isCompleted = progress?.progress?.some(
                      (p: any) => p.lessonId === lesson._id.toString() && p.completed
                    );
                    return (
                      <Link
                        key={lesson._id}
                        to={`/courses/${course._id}/lessons/${lesson._id}`}
                        className={`flex items-center justify-between p-3 rounded-md border transition-colors ${
                          isCompleted
                            ? 'border-green-500/30 bg-green-500/10 hover:border-green-500/50'
                            : 'border-dark-700 hover:border-primary-500/50 hover:bg-dark-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {isCompleted ? (
                            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-dark-700 rounded flex items-center justify-center flex-shrink-0 border border-dark-600">
                              <span className="text-gray-400 text-xs font-medium">{lessonIndex + 1}</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-100 truncate">{lesson.title}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1.5">
                              <span className="capitalize">{lesson.type}</span>
                              <span>•</span>
                              <span>{lesson.duration} min</span>
                            </p>
                          </div>
                        </div>
                        <span className="text-primary-400 ml-2">→</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

