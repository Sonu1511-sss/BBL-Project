import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminTabbedLayout from '../../components/admin/AdminTabbedLayout';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Question {
  id: string;
  title: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  videoUrl?: string;
  leetcodeUrl?: string;
  companies?: string[];
  topics?: string[];
}

interface Section {
  _id: string;
  name: string;
  questions: Question[];
}

interface TrackData {
  _id: string;
  track: string;
  title: string;
  sections: Section[];
}

export default function AdminQuestions() {
  const navigate = useNavigate();
  const [trackData, setTrackData] = useState<TrackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const selectedTrack = 'DSA Patterns';

  useEffect(() => {
    fetchTrackData();
  }, []);

  const fetchTrackData = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/${encodeURIComponent(selectedTrack)}`);
      if (response.data && response.data.course) {
        setTrackData(response.data.course);
      }
    } catch (error) {
      console.error('Failed to fetch DSA questions:', error);
      toast.error('Failed to load DSA questions');
    } finally {
      setLoading(false);
    }
  };

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

  const totalQuestions = trackData?.sections.reduce((acc, section) => acc + (section.questions?.length || 0), 0) || 0;
  const totalSections = trackData?.sections.length || 0;

  if (loading) {
    return (
      <AdminTabbedLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="animate-spin rounded-full h-10 w-12 border-b-2 border-[#4285F4]"></div>
        </div>
      </AdminTabbedLayout>
    );
  }

  return (
    <AdminTabbedLayout>
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100 mb-2">DSA & Question Hub</h2>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base">Manage DSA Patterns questions and LeetCode problems</p>
            </div>
            <button
              onClick={() => navigate('/admin/questions/create?track=DSA Patterns')}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#4285F4] text-white rounded-lg hover:bg-[#3367D6] font-semibold transition-colors flex items-center gap-2 justify-center text-sm sm:text-base whitespace-nowrap"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add DSA Question</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          {/* Stats Card */}
          <div className="bg-dark-900 border border-dark-700 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Total Questions</p>
                <p className="text-3xl font-bold text-gray-100">{totalQuestions}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Total Sections</p>
                <p className="text-3xl font-bold text-gray-100">{totalSections}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Track</p>
                <p className="text-3xl font-bold text-gray-100">DSA Patterns</p>
              </div>
            </div>
          </div>

          {/* Sections List */}
          {trackData && trackData.sections.length > 0 ? (
            <div className="space-y-4">
              {trackData.sections.map((section) => (
                <div key={section._id} className="bg-dark-900 border border-dark-700 rounded-lg overflow-hidden">
                  <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 cursor-pointer hover:bg-dark-800 transition-colors gap-3"
                    onClick={() => toggleSection(section._id)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <span className="text-gray-400 flex-shrink-0">{expandedSections.has(section._id) ? '▼' : '▶️'}</span>
                      <h4 className="text-base sm:text-lg font-semibold text-gray-100 truncate">{section.name}</h4>
                      <span className="px-2 py-1 bg-dark-800 text-gray-400 text-xs rounded flex-shrink-0">
                        {section.questions?.length || 0} questions
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/questions/create?track=DSA Patterns&section=${section.name}`);
                      }}
                      className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-[#4285F4] text-white rounded hover:bg-[#3367D6] transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      <span className="hidden sm:inline">Add Question</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                  </div>

                  {expandedSections.has(section._id) && (
                    <div className="border-t border-dark-700 p-4">
                      {(section.questions?.length || 0) > 0 ? (
                        <>
                          {/* Desktop Table View */}
                          <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-dark-700">
                              <thead className="bg-dark-800">
                                <tr>
                                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Title</th>
                                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Difficulty</th>
                                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Companies</th>
                                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Topics</th>
                                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="bg-dark-900 divide-y divide-dark-700">
                                {(section.questions || []).map((question, idx) => (
                                  <tr key={question.id || idx} className="hover:bg-dark-800">
                                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-100">{question.title}</td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                                      <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                          question.difficulty === 'Easy'
                                            ? 'bg-green-500/20 text-green-400'
                                            : question.difficulty === 'Medium'
                                            ? 'bg-yellow-500/20 text-yellow-400'
                                            : question.difficulty === 'Hard'
                                            ? 'bg-red-500/20 text-red-400'
                                            : 'bg-gray-500/20 text-gray-400'
                                        }`}
                                      >
                                        {question.difficulty || '---'}
                                      </span>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-100 max-w-[150px] truncate">
                                      {question.companies?.join(', ') || '---'}
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-100 max-w-[150px] truncate">
                                      {question.topics?.join(', ') || '---'}
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                                      <div className="flex items-center gap-2">
                                        {question.videoUrl && (
                                          <a
                                            href={question.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-red-500 hover:text-red-400"
                                            title="Video"
                                          >
                                            ▶️
                                          </a>
                                        )}
                                        {question.leetcodeUrl && (
                                          <a
                                            href={question.leetcodeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-400"
                                            title="LeetCode"
                                          >
                                            LC
                                          </a>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile Card View */}
                          <div className="md:hidden space-y-3">
                            {(section.questions || []).map((question, idx) => (
                              <div key={question.id || idx} className="bg-dark-800 rounded-lg p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h5 className="text-sm font-medium text-gray-100 flex-1">{question.title}</h5>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {question.videoUrl && (
                                      <a
                                        href={question.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-red-500 hover:text-red-400"
                                        title="Video"
                                      >
                                        ▶️
                                      </a>
                                    )}
                                    {question.leetcodeUrl && (
                                      <a
                                        href={question.leetcodeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-400"
                                        title="LeetCode"
                                      >
                                        LC
                                      </a>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                      question.difficulty === 'Easy'
                                        ? 'bg-green-500/20 text-green-400'
                                        : question.difficulty === 'Medium'
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : question.difficulty === 'Hard'
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-gray-500/20 text-gray-400'
                                    }`}
                                  >
                                    {question.difficulty || '---'}
                                  </span>
                                  {question.companies && question.companies.length > 0 && (
                                    <span className="text-xs text-gray-400">
                                      {question.companies.join(', ')}
                                    </span>
                                  )}
                                </div>
                                {question.topics && question.topics.length > 0 && (
                                  <p className="text-xs text-gray-400 mt-2">
                                    Topics: {question.topics.join(', ')}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-400 text-center py-4">No questions in this section</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-dark-900 border border-dark-700 rounded-lg p-12 text-center">
              <p className="text-gray-400 mb-4">No DSA questions found</p>
              <button
                onClick={() => navigate('/admin/questions/create?track=DSA Patterns')}
                className="px-6 py-2 bg-[#4285F4] text-white rounded-lg hover:bg-[#3367D6] font-medium"
              >
                Add First Question
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminTabbedLayout>
  );
}
