import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Lesson {
  _id: string;
  title: string;
  type: string;
  content?: string;
  videoUrl?: string;
  duration: number;
  problems: any[];
}

export default function LessonView() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (courseId && lessonId) {
      fetchLesson();
    }
  }, [courseId, lessonId]);

  const fetchLesson = async () => {
    try {
      const [courseRes] = await Promise.all([
        axios.get(`${API_URL}/courses/${courseId}`)
      ]);

      const courseData = courseRes.data.course;
      setCourse(courseData);

      // Find lesson in course modules
      let foundLesson: Lesson | null = null;
      for (const module of courseData.modules) {
        foundLesson = module.lessons.find((l: any) => l._id.toString() === lessonId);
        if (foundLesson) break;
      }

      if (foundLesson) {
        setLesson(foundLesson);
        // Check if completed
        if (user) {
          try {
            const progressRes = await axios.get(`${API_URL}/progress/course/${courseId}`);
            const lessonProgress = progressRes.data.progress.find(
              (p: any) => p.lessonId === lessonId && p.completed
            );
            setCompleted(!!lessonProgress);
          } catch (error) {
            // Progress not found, lesson not completed
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch lesson:', error);
      toast.error('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async () => {
    if (!user) {
      toast.error('Please login to mark as complete');
      return;
    }

    try {
      await axios.post(`${API_URL}/progress/update`, {
        courseId,
        lessonId,
        completed: true,
        timeSpent: lesson?.duration || 0
      });
      setCompleted(true);
      toast.success('Lesson marked as complete! 🔥');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update progress');
    }
  };

  const addToRevision = async () => {
    if (!user) {
      toast.error('Please login to add to revision');
      return;
    }

    try {
      await axios.post(`${API_URL}/progress/add-to-revise`, {
        courseId,
        lessonId,
        priority: 'medium'
      });
      toast.success('Added to revision list!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add to revision');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-400">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <div className="mb-4">
        <Link
          to={`/courses/${courseId}`}
          className="text-sm text-primary-400 hover:text-primary-300 font-medium"
        >
          ← Back to Course
        </Link>
      </div>

      <div className="card">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-category capitalize">{lesson.type}</span>
                <span className="text-sm text-gray-500">{lesson.duration} min</span>
                {completed && <span className="badge-free">Completed</span>}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">{lesson.title}</h1>
            </div>
          </div>

          <div className="mb-6">
            {lesson.type === 'video' && lesson.videoUrl ? (
              <div className="bg-dark-800 aspect-video rounded-lg flex flex-col items-center justify-center mb-6 border border-dark-700">
                <p className="text-gray-200 text-sm mb-2">Video Player</p>
                <p className="text-gray-400 text-xs font-mono">{lesson.videoUrl}</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none mb-6">
                <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {lesson.content || 'Lesson content will be displayed here.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {lesson.problems && lesson.problems.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-100 mb-4">Practice Problems</h2>
              <div className="space-y-3">
                {lesson.problems.map((problem, index) => (
                  <div key={index} className="card p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-100">{problem.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        problem.difficulty === 'easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        problem.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{problem.description}</p>
                    {problem.testCases && problem.testCases.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-dark-700">
                        <p className="text-xs font-medium text-gray-300 mb-1">Test Cases:</p>
                        <div className="code-block text-xs">
                          <div>Input: {problem.testCases[0].input}</div>
                          <div>Output: {problem.testCases[0].output}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4 border-t border-dark-700">
            {!completed && (
              <button onClick={markComplete} className="btn-primary">
                Mark as Complete
              </button>
            )}
            <button onClick={addToRevision} className="btn-secondary">
              Add to Revision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

