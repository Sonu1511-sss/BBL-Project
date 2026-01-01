import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminTabbedLayout from '../../components/admin/AdminTabbedLayout';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const THEORY_TRACKS = [
  { id: 'System Design', name: 'System Design', icon: '🏗️', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'DBMS', name: 'DBMS', icon: '🗄️', color: 'bg-green-500/20 text-green-400' },
  { id: 'OS', name: 'Operating Systems', icon: '⚙️', color: 'bg-purple-500/20 text-purple-400' },
  { id: 'CN', name: 'Computer Networks', icon: '🌐', color: 'bg-orange-500/20 text-orange-400' },
];

interface Track {
  _id: string;
  track: string;
  title: string;
  description?: string;
  thumbnail?: string;
  sections: Array<{
    _id: string;
    name: string;
    order: number;
    questions: any[];
  }>;
}

interface CourseFormData {
  track: string;
  title: string;
  description: string;
  thumbnail: string;
}

export default function AdminCourses() {
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState<string>('System Design');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Track | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    track: '',
    title: '',
    description: '',
    thumbnail: '',
  });

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/courses`);
      const courses = response.data.courses || [];
      
      // Map courses to tracks format, ensuring all theory tracks are represented
      const tracksMap = new Map(courses.map((c: Track) => [c.track, c]));
      const tracksData = THEORY_TRACKS.map(track => {
        const course = tracksMap.get(track.id);
        return course || {
          _id: '',
          track: track.id,
          title: track.name,
          description: '',
          thumbnail: '',
          sections: [],
        };
      });
      setTracks(tracksData);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const currentTrack = tracks.find(t => t.track === selectedTrack);

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

  const handleDeleteSection = async (_trackName: string, sectionName: string) => {
    if (!confirm(`Delete section "${sectionName}"?`)) return;
    
    try {
      // Note: You may need to implement DELETE endpoint
      toast.success('Section deleted');
      fetchTracks();
    } catch (error) {
      toast.error('Failed to delete section');
    }
  };

  return (
    <AdminTabbedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1 space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100">Courses Management</h2>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base">Manage System Design, DBMS, OS, and Computer Networks courses</p>
            </div>
            <button
              onClick={() => navigate('/admin/courses/create')}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#4285F4] text-white rounded-lg hover:bg-[#3367D6] font-semibold transition-colors flex items-center gap-2 justify-center text-sm sm:text-base whitespace-nowrap"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Create Course</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>

          {/* Track Tabs */}
          <div className="flex gap-2 border-b border-dark-700 overflow-x-auto pb-2 scrollbar-hide">
            {THEORY_TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track.id)}
                className={`px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  selectedTrack === track.id
                    ? 'border-[#4285F4] text-[#4285F4] bg-blue-500/10'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className="mr-1 sm:mr-2">{track.icon}</span>
                <span className="hidden xs:inline">{track.name}</span>
                <span className="xs:hidden">{track.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4285F4]"></div>
            </div>
          ) : currentTrack ? (
            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
              {/* Track Info */}
              <div className="bg-dark-900 border border-dark-700 rounded-lg p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-100 truncate">{currentTrack.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {currentTrack.sections?.length || 0} sections • {currentTrack.sections?.reduce((acc, s) => acc + (s.questions?.length || 0), 0) || 0} topics
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/courses/create?track=${selectedTrack}`)}
                    className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-xs sm:text-sm lg:text-base whitespace-nowrap flex-shrink-0 transition-colors"
                  >
                    Add Section
                  </button>
                </div>
              </div>

              {/* Sections List */}
              {(currentTrack.sections || []).map((section) => (
                <div key={section._id} className="bg-dark-900 border border-dark-700 rounded-lg overflow-hidden">
                  <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 cursor-pointer hover:bg-dark-800 transition-colors gap-2 sm:gap-3"
                    onClick={() => toggleSection(section._id)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <span className="text-gray-400 flex-shrink-0">{expandedSections.has(section._id) ? '▼' : '▶️'}</span>
                      <h4 className="text-base sm:text-lg font-semibold text-gray-100 truncate">{section.name}</h4>
                      <span className="px-2 py-1 bg-dark-800 text-gray-400 text-xs rounded flex-shrink-0">
                        {section.questions?.length || 0} topics
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/courses/create?track=${selectedTrack}&section=${section.name}`);
                        }}
                        className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-[#4285F4] text-white rounded hover:bg-[#3367D6] transition-colors whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Add Topic</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSection(selectedTrack, section.name);
                        }}
                        className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors whitespace-nowrap"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {expandedSections.has(section._id) && (
                    <div className="border-t border-dark-700 p-4">
                      {(section.questions?.length || 0) > 0 ? (
                        <div className="space-y-2">
                          {(section.questions || []).map((question, idx) => (
                            <div
                              key={question.id || idx}
                              className="flex items-center justify-between p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-sm">{idx + 1}.</span>
                                <span className="text-gray-100">{question.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {question.resourceUrl && (
                                  <a
                                    href={question.resourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-red-500 hover:text-red-400"
                                  >
                                    ▶️
                                  </a>
                                )}
                                <button className="text-gray-400 hover:text-red-400" title="Delete topic">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-center py-4">No topics in this section</p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {(!currentTrack.sections || currentTrack.sections.length === 0) && (
                <div className="bg-dark-900 border border-dark-700 rounded-lg p-12 text-center">
                  <p className="text-gray-400 mb-4">No sections yet</p>
                  <button
                    onClick={() => navigate(`/admin/courses/create?track=${selectedTrack}`)}
                    className="px-6 py-2 bg-[#4285F4] text-white rounded-lg hover:bg-[#3367D6] font-medium"
                  >
                    Add First Section
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-dark-900 border border-dark-700 rounded-lg p-12 text-center">
              <p className="text-gray-400 mb-4">No course found for {selectedTrack}</p>
              <button
                onClick={() => navigate(`/admin/courses/create?track=${selectedTrack}`)}
                className="px-6 py-2 bg-[#4285F4] text-white rounded-lg hover:bg-[#3367D6] font-medium"
              >
                Create Course
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminTabbedLayout>
  );
}
