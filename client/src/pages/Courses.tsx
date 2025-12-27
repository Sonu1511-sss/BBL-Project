import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  thumbnail?: string;
  enrolledCount: number;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data.courses || []);
    } catch (error: any) {
      console.error('Failed to fetch courses:', error);
      if (error.response) {
        // Server responded with error
        toast.error(error.response.data?.error || 'Failed to load courses');
      } else if (error.request) {
        // Request made but no response
        toast.error('Cannot connect to server. Please make sure backend is running.');
      } else {
        // Something else happened
        toast.error('Failed to load courses');
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'DSA', 'System Design', 'LLD', 'OS', 'CN', 'DBMS', 'AI/ML'];
  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter(course => course.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container-main py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="badge-free">All Free</span>
          <span className="text-xs sm:text-sm text-gray-400">{courses.length} courses</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-2">All Courses</h1>
        <p className="text-sm sm:text-base text-gray-400">
          Complete curriculum for tech interviews. <span className="font-semibold text-green-400">100% free</span>, forever.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6 sm:mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-gray-300 border border-dark-700 hover:bg-dark-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Courses Grid - Clean Design */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <Link
            key={course._id}
            to={`/courses/${course._id}`}
            className="card-free group"
          >
            {course.thumbnail && (
              <div className="relative h-40 bg-dark-800 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
                <div className="absolute top-3 right-3">
                  <span className="badge-free">FREE</span>
                </div>
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="badge-category">{course.category}</span>
                {!course.thumbnail && <span className="badge-free">FREE</span>}
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                {course.description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-dark-700">
                <span className="text-xs text-gray-500">
                  {course.enrolledCount} students
                </span>
                <span className="text-sm text-primary-400 font-medium group-hover:underline">
                  View →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No courses found in this category.</p>
        </div>
      )}
    </div>
  );
}

