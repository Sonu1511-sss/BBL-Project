import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Thread {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
    profile?: { avatar?: string };
  };
  courseId?: {
    title: string;
    slug: string;
  };
  upvotes: any[];
  replies: any[];
  createdAt: string;
}

export default function Community() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    courseId: ''
  });

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const response = await axios.get(`${API_URL}/community/threads`);
      setThreads(response.data.threads);
    } catch (error) {
      console.error('Failed to fetch threads:', error);
      toast.error('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to create a thread');
      return;
    }

    try {
      await axios.post(`${API_URL}/community/thread`, formData);
      toast.success('Thread created!');
      setShowForm(false);
      setFormData({ title: '', content: '', courseId: '' });
      fetchThreads();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create thread');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Community Q&A</h1>
          <p className="text-sm text-gray-400">Ask questions, share solutions, learn together</p>
        </div>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary text-sm"
          >
            {showForm ? 'Cancel' : '+ New Thread'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Create New Thread</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-500"
                placeholder="What's your question?"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-500"
                placeholder="Describe your question or share your solution..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary text-sm">
              Post Thread
            </button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {threads.map((thread) => (
          <div key={thread._id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-100 mb-2">{thread.title}</h3>
                {thread.courseId && (
                  <Link
                    to={`/courses/${thread.courseId.slug}`}
                    className="text-xs text-primary-400 hover:text-primary-300 font-medium"
                  >
                    {thread.courseId.title}
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>▲</span>
                <span>{thread.upvotes.length}</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{thread.content}</p>
            <div className="flex items-center justify-between pt-3 border-t border-dark-700">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{thread.author.name}</span>
                <span>•</span>
                <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-xs text-gray-500">
                {thread.replies.length} {thread.replies.length === 1 ? 'reply' : 'replies'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {threads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No discussions yet. Be the first to start one!</p>
        </div>
      )}
    </div>
  );
}

