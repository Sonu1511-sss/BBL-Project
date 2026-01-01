import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCourseContent } from '../hooks/useCourseContent';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Question {
  id: string;
  title: string;
  videoUrl?: string;
  leetcodeUrl?: string;
  solveLink?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  companies?: string[];
  topics?: string[];
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

export default function DSAPatterns() {
  const { user } = useAuth();
  const { data: trackData, loading, refresh, lastUpdated } = useCourseContent('DSA Patterns', 5000);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
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
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update status');
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
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update revision status');
    }
  };

  // Dummy DSA Patterns Data (5 sections with questions)
  const dummySections = [
    {
      _id: 'arrays',
      name: 'Arrays & Two Pointers',
      order: 1,
      questions: [
        {
          id: 'two-sum',
          title: 'Two Sum',
          difficulty: 'Easy',
          leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
          videoUrl: 'https://youtube.com/watch?v=example1',
          topics: ['Array', 'Hash Table'],
          companies: ['Google', 'Amazon', 'Microsoft']
        },
        {
          id: 'best-time-stock',
          title: 'Best Time to Buy and Sell Stock',
          difficulty: 'Easy',
          leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
          videoUrl: 'https://youtube.com/watch?v=example2',
          topics: ['Array', 'Dynamic Programming'],
          companies: ['Amazon', 'Facebook']
        },
        {
          id: 'container-water',
          title: 'Container With Most Water',
          difficulty: 'Medium',
          leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
          videoUrl: 'https://youtube.com/watch?v=example3',
          topics: ['Array', 'Two Pointers'],
          companies: ['Google', 'Amazon']
        }
      ]
    },
    {
      _id: 'sliding-window',
      name: 'Sliding Window',
      order: 2,
      questions: [
        {
          id: 'longest-substring',
          title: 'Longest Substring Without Repeating Characters',
          difficulty: 'Medium',
          leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
          videoUrl: 'https://youtube.com/watch?v=example4',
          topics: ['String', 'Sliding Window'],
          companies: ['Amazon', 'Microsoft', 'Facebook']
        },
        {
          id: 'min-window',
          title: 'Minimum Window Substring',
          difficulty: 'Hard',
          leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/',
          videoUrl: 'https://youtube.com/watch?v=example5',
          topics: ['String', 'Sliding Window', 'Hash Table'],
          companies: ['Google', 'Amazon']
        }
      ]
    },
    {
      _id: 'binary-search',
      name: 'Binary Search',
      order: 3,
      questions: [
        {
          id: 'search-rotated',
          title: 'Search in Rotated Sorted Array',
          difficulty: 'Medium',
          leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
          videoUrl: 'https://youtube.com/watch?v=example6',
          topics: ['Array', 'Binary Search'],
          companies: ['Facebook', 'Microsoft']
        },
        {
          id: 'find-min-rotated',
          title: 'Find Minimum in Rotated Sorted Array',
          difficulty: 'Medium',
          leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
          videoUrl: 'https://youtube.com/watch?v=example7',
          topics: ['Array', 'Binary Search'],
          companies: ['Amazon', 'Google']
        }
      ]
    },
    {
      _id: 'linked-list',
      name: 'Linked Lists',
      order: 4,
      questions: [
        {
          id: 'reverse-list',
          title: 'Reverse Linked List',
          difficulty: 'Easy',
          leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
          videoUrl: 'https://youtube.com/watch?v=example8',
          topics: ['Linked List'],
          companies: ['Amazon', 'Microsoft', 'Facebook']
        },
        {
          id: 'merge-lists',
          title: 'Merge Two Sorted Lists',
          difficulty: 'Easy',
          leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/',
          videoUrl: 'https://youtube.com/watch?v=example9',
          topics: ['Linked List'],
          companies: ['Amazon', 'Microsoft']
        },
        {
          id: 'detect-cycle',
          title: 'Linked List Cycle',
          difficulty: 'Easy',
          leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
          videoUrl: 'https://youtube.com/watch?v=example10',
          topics: ['Linked List', 'Two Pointers'],
          companies: ['Amazon', 'Google']
        }
      ]
    },
    {
      _id: 'dynamic-programming',
      name: 'Dynamic Programming',
      order: 5,
      questions: [
        {
          id: 'climbing-stairs',
          title: 'Climbing Stairs',
          difficulty: 'Easy',
          leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
          videoUrl: 'https://youtube.com/watch?v=example11',
          topics: ['Dynamic Programming'],
          companies: ['Amazon', 'Google']
        },
        {
          id: 'coin-change',
          title: 'Coin Change',
          difficulty: 'Medium',
          leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
          videoUrl: 'https://youtube.com/watch?v=example12',
          topics: ['Dynamic Programming'],
          companies: ['Google', 'Amazon', 'Microsoft']
        },
        {
          id: 'longest-common-subsequence',
          title: 'Longest Common Subsequence',
          difficulty: 'Medium',
          leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/',
          videoUrl: 'https://youtube.com/watch?v=example13',
          topics: ['Dynamic Programming', 'String'],
          companies: ['Google', 'Facebook']
        }
      ]
    }
  ];

  const sectionsSorted = trackData?.sections
    ? [...trackData.sections].sort((a, b) => a.order - b.order)
    : dummySections;

  if (loading && !trackData && dummySections.length === 0) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4285F4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 py-6 sm:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">DSA Patterns</h1>
              <p className="text-sm sm:text-base text-gray-400">
                Master Data Structures and Algorithms through curated patterns
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 sm:gap-4">
              {lastUpdated && (
                <span className="text-xs sm:text-sm text-gray-500">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-3 sm:px-4 py-2 bg-dark-800 text-gray-300 rounded-lg hover:bg-dark-700 disabled:opacity-50 flex items-center gap-2 text-xs sm:text-sm transition-colors w-full sm:w-auto justify-center"
              >
                <svg
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sections */}
        {sectionsSorted.length === 0 ? (
          <div className="bg-dark-900 border border-dark-700 rounded-lg p-8 sm:p-12 text-center">
            <p className="text-sm sm:text-base text-gray-400">No sections available yet.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 lg:space-y-5">
            {sectionsSorted.map((section) => (
              <div
                key={section._id}
                className="bg-dark-900 border border-dark-700 rounded-lg overflow-hidden"
              >
                <div
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 cursor-pointer hover:bg-dark-800 transition-colors gap-2 sm:gap-3"
                  onClick={() => toggleSection(section._id)}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className="text-gray-400 text-sm sm:text-base flex-shrink-0">
                      {expandedSections.has(section._id) ? '▼' : '▶️'}
                    </span>
                    <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-100 truncate">{section.name}</h2>
                    <span className="px-2 py-1 bg-dark-800 text-gray-400 text-xs sm:text-sm rounded flex-shrink-0">
                      {section.questions?.length || 0} questions
                    </span>
                  </div>
                </div>

                {expandedSections.has(section._id) && (
                  <div className="border-t border-dark-700 p-3 sm:p-4 lg:p-5">
                    {section.questions && section.questions.length > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                        {section.questions.map((question, idx) => {
                          const userStatus = question.userStatus;
                          const status = userStatus?.status || 'unsolved';
                          const revision = userStatus?.revision || false;

                          return (
                            <div
                              key={question.id || idx}
                              className="bg-dark-800 rounded-lg p-3 sm:p-4 hover:bg-dark-700 transition-colors"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                                <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <span className="text-gray-500 text-xs sm:text-sm flex-shrink-0">{idx + 1}.</span>
                                    <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-100 break-words">
                                      {question.title}
                                    </h3>
                                    {question.difficulty && (
                                      <span
                                        className={`px-2 py-0.5 sm:py-1 text-xs rounded flex-shrink-0 ${
                                          question.difficulty === 'Easy'
                                            ? 'bg-green-500/20 text-green-400'
                                            : question.difficulty === 'Medium'
                                            ? 'bg-yellow-500/20 text-yellow-400'
                                            : 'bg-red-500/20 text-red-400'
                                        }`}
                                      >
                                        {question.difficulty}
                                      </span>
                                    )}
                                  </div>

                                  {/* Links */}
                                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:gap-4">
                                    {question.videoUrl && (
                                      <a
                                        href={question.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-red-400 hover:text-red-300 flex items-center gap-1 text-xs sm:text-sm transition-colors"
                                      >
                                        <svg
                                          className="w-3 h-3 sm:w-4 sm:h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                        <span className="hidden sm:inline">Video</span>
                                        <span className="sm:hidden">▶</span>
                                      </a>
                                    )}
                                    {question.leetcodeUrl && (
                                      <a
                                        href={question.leetcodeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs sm:text-sm transition-colors"
                                      >
                                        <svg
                                          className="w-3 h-3 sm:w-4 sm:h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                          />
                                        </svg>
                                        <span className="hidden sm:inline">LeetCode</span>
                                        <span className="sm:hidden">LC</span>
                                      </a>
                                    )}
                                    {question.solveLink && (
                                      <a
                                        href={question.solveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-400 hover:text-green-300 flex items-center gap-1 text-xs sm:text-sm transition-colors"
                                      >
                                        <svg
                                          className="w-3 h-3 sm:w-4 sm:h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                        <span className="hidden sm:inline">Solve</span>
                                        <span className="sm:hidden">✓</span>
                                      </a>
                                    )}
                                  </div>

                                  {/* Tags */}
                                  {(question.companies?.length > 0 || question.topics?.length > 0) && (
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                      {question.topics?.map((topic, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-0.5 sm:py-1 bg-blue-500/20 text-blue-400 text-xs rounded"
                                        >
                                          {topic}
                                        </span>
                                      ))}
                                      {question.companies?.map((company, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-0.5 sm:py-1 bg-purple-500/20 text-purple-400 text-xs rounded"
                                        >
                                          {company}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Status Controls */}
                                {user && (
                                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-dark-700 sm:border-0">
                                    <button
                                      onClick={() => handleStatusToggle(question.id, status)}
                                      className={`px-2 sm:px-3 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                                        status === 'solved'
                                          ? 'bg-green-600 text-white'
                                          : status === 'in-progress'
                                          ? 'bg-yellow-600 text-white'
                                          : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                                      }`}
                                    >
                                      <span className="hidden sm:inline">
                                        {status === 'solved'
                                          ? '✓ Solved'
                                          : status === 'in-progress'
                                          ? '⏳ In Progress'
                                          : '○ Unsolved'}
                                      </span>
                                      <span className="sm:hidden">
                                        {status === 'solved' ? '✓' : status === 'in-progress' ? '⏳' : '○'}
                                      </span>
                                    </button>
                                    <button
                                      onClick={() => handleRevisionToggle(question.id, revision)}
                                      className={`px-2 sm:px-3 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                                        revision
                                          ? 'bg-orange-600 text-white'
                                          : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                                      }`}
                                    >
                                      <span className="hidden sm:inline">
                                        {revision ? '📌 Revision' : 'Mark Revision'}
                                      </span>
                                      <span className="sm:hidden">
                                        {revision ? '📌' : 'Rev'}
                                      </span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base text-gray-400 text-center py-4">No questions in this section</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



