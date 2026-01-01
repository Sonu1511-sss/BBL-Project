import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCourseContent } from '../hooks/useCourseContent';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Question {
  id: string;
  title: string;
  resourceUrl?: string;
  note?: string;
  revision?: boolean;
  userStatus?: {
    status: 'unsolved' | 'solved' | 'in-progress';
    revision: boolean;
    note: string;
  };
}

interface Section {
  _id: string;
  name: string;
  order: number;
  questions: Question[];
}

interface TrackData {
  _id: string;
  track: string;
  title: string;
  sections: Section[];
}

// Map routes to track names
const getTrackFromPath = (pathname: string): string => {
  if (pathname.includes('system-design')) return 'System Design';
  if (pathname.includes('dbms')) return 'DBMS';
  if (pathname.includes('cn')) return 'CN';
  if (pathname.includes('os')) return 'OS';
  return 'System Design'; // default
};

export default function SystemDesignTab() {
  const { user } = useAuth();
  const location = useLocation();
  const trackName = getTrackFromPath(location.pathname);
  
  const { data: trackData, loading, refresh, lastUpdated } = useCourseContent(trackName, 5000);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refresh();
      toast.success('Content refreshed!');
    } catch (error) {
      toast.error('Failed to refresh content');
    } finally {
      setIsRefreshing(false);
    }
  }, [refresh]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleStatusToggle = async (questionId: string, currentStatus: 'unsolved' | 'solved' | 'in-progress') => {
    if (!user) {
      toast.error('Please log in to update status.');
      return;
    }
    const newStatus =
      currentStatus === 'unsolved'
        ? 'in-progress'
        : currentStatus === 'in-progress'
        ? 'solved'
        : 'unsolved';

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/questions/${questionId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status updated to ${newStatus}!`);
      refresh();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status.');
    }
  };

  const handleRevisionToggle = async (questionId: string, currentRevision: boolean) => {
    if (!user) {
      toast.error('Please log in to update revision status.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/questions/${questionId}/revision`,
        { revision: !currentRevision },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Revision ${!currentRevision ? 'marked' : 'unmarked'}!`);
      refresh();
    } catch (error) {
      console.error('Failed to update revision:', error);
      toast.error('Failed to update revision status.');
    }
  };

  const getStatusIcon = (status?: 'unsolved' | 'solved' | 'in-progress') => {
    switch (status) {
      case 'solved':
        return <span className="text-green-500">✅</span>;
      case 'in-progress':
        return <span className="text-yellow-500">🔄</span>;
      case 'unsolved':
      default:
        return <span className="text-gray-500">⭕</span>;
    }
  };

  // Calculate overall progress
  const allQuestions = trackData?.sections.flatMap((s) => s.questions || []) || [];
  const solvedCount = allQuestions.filter((q) => q.userStatus?.status === 'solved').length;
  const totalCount = allQuestions.length;
  const overallProgress = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-dark-950 text-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4285F4]"></div>
      </div>
    );
  }

  return (
    <div className="bg-dark-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Courses</p>
            <h1 className="text-3xl font-bold">{trackName}</h1>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-xs text-gray-500 hidden sm:block">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh content"
            >
              <svg 
                className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-dark-900 border border-dark-700 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-100">Overall Progress</h2>
          <span className="text-lg font-bold text-gray-300">
            {solvedCount}/{totalCount}
          </span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-3">
          <div
            className="bg-[#4285F4] h-3 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-2">{overallProgress}% Complete</p>
      </div>

        {/* Section Dropdown Filter */}
        {trackData && trackData.sections.length > 0 && (
          <div className="mb-6">
            <label htmlFor="section-filter" className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Section
            </label>
            <select
              id="section-filter"
              className="form-select bg-dark-800 border border-dark-700 text-gray-100 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">All Sections</option>
              {trackData.sections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sections */}
        {trackData?.sections.map((section) => {
        const sectionQuestions = section.questions || [];
        const sectionSolvedCount = sectionQuestions.filter((q) => q.userStatus?.status === 'solved').length;
        const sectionTotalCount = sectionQuestions.length;
        const sectionProgress = sectionTotalCount > 0 ? Math.round((sectionSolvedCount / sectionTotalCount) * 100) : 0;

        // Filter by selected section
        if (selectedSection && section._id !== selectedSection) {
          return null;
        }

        return (
          <div key={section._id} className="mb-8 bg-dark-900 rounded-lg border border-dark-700">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-dark-800 transition-colors"
              onClick={() => toggleSection(section._id)}
            >
              <div className="flex items-center gap-4 flex-1">
                <h3 className="text-xl font-semibold text-gray-100 flex items-center">
                  {expandedSections.has(section._id) ? '▼' : '▶️'} {section.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <span>{sectionSolvedCount}/{sectionTotalCount}</span>
                  <div className="w-24 bg-dark-700 rounded-full h-2">
                    <div
                      className="bg-[#4285F4] h-2 rounded-full"
                      style={{ width: `${sectionProgress}%` }}
                    ></div>
                  </div>
                  <span>{sectionProgress}%</span>
                </div>
              </div>
            </div>

            {expandedSections.has(section._id) && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-dark-700">
                  <thead className="bg-dark-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Problem</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Resource</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Note</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Revision</th>
                    </tr>
                  </thead>
                  <tbody className="bg-dark-900 divide-y divide-dark-700">
                    {sectionQuestions.map((question, idx) => (
                      <tr key={question.id || idx} className="hover:bg-dark-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => handleStatusToggle(question.id, question.userStatus?.status || 'unsolved')}
                            className="hover:scale-110 transition-transform"
                          >
                            {getStatusIcon(question.userStatus?.status)}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{question.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {question.resourceUrl && (
                            <a 
                              href={question.resourceUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-red-500 hover:text-red-400 flex items-center gap-1"
                            >
                              <span>▶️</span>
                              <span className="hidden sm:inline">Resource</span>
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {question.note || question.userStatus?.note || '---'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleRevisionToggle(question.id, question.revision || question.userStatus?.revision || false)}
                            className={`px-2 py-1 rounded ${
                              question.revision || question.userStatus?.revision
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-gray-500/20 text-gray-400'
                            } hover:opacity-80 transition-opacity`}
                          >
                            {question.revision || question.userStatus?.revision ? '⭐' : '☆'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

        {!trackData && (
          <div className="bg-dark-900 rounded-lg border border-dark-700 p-8 text-center">
            <p className="text-gray-400">No {trackName} content found. Admin can add content from the admin dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}
