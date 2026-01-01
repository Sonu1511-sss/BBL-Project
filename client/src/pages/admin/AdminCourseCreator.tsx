

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminTabbedLayout from '../../components/admin/AdminTabbedLayout';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Topic {
  _id?: string;
  id: string;
  title: string;
  // DSA fields
  videoUrl?: string;
  leetcodeUrl?: string;
  solveLink?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  companies?: string[];
  topics?: string[];
  // System Design/Theory fields
  resourceUrl?: string;
  note?: string;
  revision?: boolean;
}

interface Section {
  _id?: string;
  name: string;
  order: number;
  topics: Topic[];
}

const TRACKS = ['System Design', 'DBMS', 'CN', 'OS']; // Only theory tracks for Courses tab

export default function AdminCourseCreator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trackParam = searchParams.get('track') || 'System Design';
  const sectionParam = searchParams.get('section');
  const [selectedTrack, setSelectedTrack] = useState(trackParam);
  const [sections, setSections] = useState<Section[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [showAddTopic, setShowAddTopic] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState<Partial<Topic>>({
    id: '',
    title: '',
    videoUrl: '',
    leetcodeUrl: '',
    solveLink: '',
    difficulty: 'Easy',
    companies: [],
    topics: [],
    resourceUrl: '',
    note: '',
    revision: false,
  });
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  useEffect(() => {
    if (sectionParam) {
      // Auto-open add topic modal for the specified section
      const sectionIndex = sections.findIndex(s => s.name === sectionParam);
      if (sectionIndex >= 0) {
        setShowAddTopic(`${sectionIndex}`);
      }
    }
  }, [sectionParam]);

  const handleAddSection = () => {
    if (!newSectionName.trim()) {
      toast.error('Section name is required');
      return;
    }
    const newSection: Section = {
      name: newSectionName,
      order: sections.length + 1,
      topics: [],
    };
    setSections([...sections, newSection]);
    setNewSectionName('');
    setShowAddSection(false);
    toast.success('Section added');
  };

  const handleAddTopic = (sectionIndex: number) => {
    if (!newTopic.id || !newTopic.title) {
      toast.error('ID and Title are required');
      return;
    }
    const isDSA = selectedTrack === 'DSA Patterns';
    const updatedSections = [...sections];
    
    const topicData: Topic = {
      id: newTopic.id!,
      title: newTopic.title!,
    };

    if (isDSA) {
      topicData.videoUrl = newTopic.videoUrl || '';
      topicData.leetcodeUrl = newTopic.leetcodeUrl || '';
      topicData.solveLink = newTopic.solveLink || '';
      topicData.difficulty = newTopic.difficulty || 'Easy';
      topicData.companies = newTopic.companies || [];
      topicData.topics = newTopic.topics || [];
    } else {
      topicData.resourceUrl = newTopic.resourceUrl || '';
      topicData.note = newTopic.note || '';
      topicData.revision = newTopic.revision || false;
    }

    updatedSections[sectionIndex].topics.push(topicData);
    setSections(updatedSections);
    setNewTopic({ 
      id: '', 
      title: '', 
      videoUrl: '', 
      leetcodeUrl: '', 
      solveLink: '', 
      difficulty: 'Easy',
      companies: [],
      topics: [],
      resourceUrl: '', 
      note: '', 
      revision: false 
    });
    setShowAddTopic(null);
    toast.success('Topic added');
  };

  const handleEditTopic = (sectionIndex: number, topicIndex: number) => {
    const topic = sections[sectionIndex].topics[topicIndex];
    setEditingTopic({ ...topic });
    setShowAddTopic(`${sectionIndex}-${topicIndex}`);
  };

  const handleUpdateTopic = (sectionIndex: number, topicIndex: number) => {
    if (!editingTopic?.id || !editingTopic?.title) {
      toast.error('ID and Title are required');
      return;
    }
    const isDSA = selectedTrack === 'DSA Patterns';
    const updatedSections = [...sections];
    
    const topicData: Topic = {
      id: editingTopic.id,
      title: editingTopic.title,
    };

    if (isDSA) {
      topicData.videoUrl = editingTopic.videoUrl || '';
      topicData.leetcodeUrl = editingTopic.leetcodeUrl || '';
      topicData.solveLink = editingTopic.solveLink || '';
      topicData.difficulty = editingTopic.difficulty || 'Easy';
      topicData.companies = editingTopic.companies || [];
      topicData.topics = editingTopic.topics || [];
    } else {
      topicData.resourceUrl = editingTopic.resourceUrl || '';
      topicData.note = editingTopic.note || '';
      topicData.revision = editingTopic.revision || false;
    }

    updatedSections[sectionIndex].topics[topicIndex] = topicData;
    setSections(updatedSections);
    setEditingTopic(null);
    setShowAddTopic(null);
    toast.success('Topic updated');
  };

  const handleDeleteTopic = (sectionIndex: number, topicIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].topics.splice(topicIndex, 1);
    setSections(updatedSections);
    toast.success('Topic deleted');
  };

  const handleSaveCourse = async () => {
    if (sections.length === 0) {
      toast.error('Please add at least one section');
      return;
    }
    try {
      // Save course with sections and topics
      await axios.post(`${API_URL}/admin/courses`, {
        track: selectedTrack,
        sections: sections,
      });
      toast.success('Course saved successfully!');
      navigate('/admin/courses');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.error || 'Failed to save course');
    }
  };

  const renderAddTopicModal = () => {
    if (!showAddTopic) return null;
    
    const isDSA = selectedTrack === 'DSA Patterns';
    const currentTopic = editingTopic || newTopic;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
        <div className="bg-dark-900 border border-dark-700 rounded-lg p-6 w-full max-w-2xl my-8">
          <h3 className="text-xl font-semibold text-gray-100 mb-4">
            {editingTopic ? 'Edit Topic' : `Add New ${isDSA ? 'DSA Question' : 'Topic'}`}
          </h3>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm text-gray-400 mb-1">ID *</label>
              <input
                type="text"
                placeholder={isDSA ? "e.g., AR-01" : "e.g., LB-01"}
                value={currentTopic.id || ''}
                onChange={(e) =>
                  editingTopic
                    ? setEditingTopic({ ...editingTopic, id: e.target.value })
                    : setNewTopic({ ...newTopic, id: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title *</label>
              <input
                type="text"
                placeholder={isDSA ? "e.g., Two Sum" : "e.g., Introduction to L4 vs L7"}
                value={currentTopic.title || ''}
                onChange={(e) =>
                  editingTopic
                    ? setEditingTopic({ ...editingTopic, title: e.target.value })
                    : setNewTopic({ ...newTopic, title: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg"
              />
            </div>
            
            {isDSA ? (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Video URL</label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/..."
                    value={currentTopic.videoUrl || ''}
                    onChange={(e) =>
                      editingTopic
                        ? setEditingTopic({ ...editingTopic, videoUrl: e.target.value })
                        : setNewTopic({ ...newTopic, videoUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">LeetCode URL</label>
                  <input
                    type="url"
                    placeholder="https://leetcode.com/problems/two-sum/"
                    value={currentTopic.leetcodeUrl || ''}
                    onChange={(e) =>
                      editingTopic
                        ? setEditingTopic({ ...editingTopic, leetcodeUrl: e.target.value })
                        : setNewTopic({ ...newTopic, leetcodeUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Solve Link</label>
                  <input
                    type="url"
                    placeholder="https://leetcode.com/problems/two-sum/"
                    value={currentTopic.solveLink || ''}
                    onChange={(e) =>
                      editingTopic
                        ? setEditingTopic({ ...editingTopic, solveLink: e.target.value })
                        : setNewTopic({ ...newTopic, solveLink: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
                  <select
                    value={currentTopic.difficulty || 'Easy'}
                    onChange={(e) =>
                      editingTopic
                        ? setEditingTopic({ ...editingTopic, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })
                        : setNewTopic({ ...newTopic, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })
                    }
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Companies (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g., Accenture+29, Google+15, Amazon+12"
                    value={Array.isArray(currentTopic.companies) ? currentTopic.companies.join(', ') : currentTopic.companies || ''}
                    onChange={(e) => {
                      const companies = e.target.value.split(',').map(c => c.trim()).filter(Boolean);
                      editingTopic
                        ? setEditingTopic({ ...editingTopic, companies })
                        : setNewTopic({ ...newTopic, companies });
                    }}
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Topics (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g., Array, HashTable, Two Pointers"
                    value={Array.isArray(currentTopic.topics) ? currentTopic.topics.join(', ') : currentTopic.topics || ''}
                    onChange={(e) => {
                      const topics = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                      editingTopic
                        ? setEditingTopic({ ...editingTopic, topics })
                        : setNewTopic({ ...newTopic, topics });
                    }}
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Resource URL</label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/..."
                    value={currentTopic.resourceUrl || ''}
                    onChange={(e) =>
                      editingTopic
                        ? setEditingTopic({ ...editingTopic, resourceUrl: e.target.value })
                        : setNewTopic({ ...newTopic, resourceUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Note</label>
                  <textarea
                    placeholder="Add notes..."
                    value={currentTopic.note || ''}
                    onChange={(e) =>
                      editingTopic
                        ? setEditingTopic({ ...editingTopic, note: e.target.value })
                        : setNewTopic({ ...newTopic, note: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg"
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="revision"
                    checked={currentTopic.revision || false}
                    onChange={(e) =>
                      editingTopic
                        ? setEditingTopic({ ...editingTopic, revision: e.target.checked })
                        : setNewTopic({ ...newTopic, revision: e.target.checked })
                    }
                    className="w-4 h-4 text-green-600 bg-dark-800 border-dark-700 rounded"
                  />
                  <label htmlFor="revision" className="text-sm text-gray-400">
                    Mark for revision
                  </label>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                if (editingTopic && showAddTopic.includes('-')) {
                  const [sectionIdx, topicIdx] = showAddTopic.split('-').map(Number);
                  handleUpdateTopic(sectionIdx, topicIdx);
                } else if (showAddTopic === 'new') {
                  toast.error('Please select a section first');
                } else {
                  handleAddTopic(parseInt(showAddTopic));
                }
              }}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {editingTopic ? 'Update' : 'Add'}
            </button>
            <button
              onClick={() => {
                setShowAddTopic(null);
                setEditingTopic(null);
                setNewTopic({ 
                  id: '', 
                  title: '', 
                  videoUrl: '', 
                  leetcodeUrl: '', 
                  solveLink: '', 
                  difficulty: 'Easy',
                  companies: [],
                  topics: [],
                  resourceUrl: '', 
                  note: '', 
                  revision: false 
                });
              }}
              className="flex-1 px-4 py-2 bg-dark-800 text-gray-300 rounded-lg hover:bg-dark-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.topics.some((topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <AdminTabbedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-400 mb-4">
          Admin / Questions / {selectedTrack}
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              {selectedTrack} Curriculum
            </h1>
            <p className="text-gray-400">
              Manage topics, resources, and revision status for {selectedTrack}. Structure your curriculum by sections.
            </p>
          </div>
          <button className="px-4 py-2 bg-dark-800 text-gray-300 rounded-lg hover:bg-dark-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Bulk Import JSON
          </button>
        </div>

        {/* Track Tabs */}
        <div className="flex gap-2 mb-6 border-b border-dark-700 overflow-x-auto">
          {TRACKS.map((track) => (
            <button
              key={track}
              onClick={() => {
                setSelectedTrack(track);
                setSections([]); // Clear sections when switching tracks
              }}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                selectedTrack === track
                  ? 'border-green-500 text-green-500'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {track}
            </button>
          ))}
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search topics or sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={() => setShowAddSection(true)}
            className="px-4 py-2 bg-dark-800 text-gray-300 rounded-lg hover:bg-dark-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Add Section
          </button>
          <button
            onClick={() => {
              if (sections.length === 0) {
                toast.error('Please add a section first');
                return;
              }
              setShowAddTopic('new');
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Topic
          </button>
        </div>

        {/* Add Section Modal */}
        {showAddSection && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-dark-900 border border-dark-700 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-100 mb-4">Add New Section</h3>
              <input
                type="text"
                placeholder="Section name (e.g., Load Balancing)"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSection()}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAddSection}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddSection(false);
                    setNewSectionName('');
                  }}
                  className="flex-1 px-4 py-2 bg-dark-800 text-gray-300 rounded-lg hover:bg-dark-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sections */}
        {filteredSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-dark-900 border border-dark-700 rounded-lg mb-6">
            {/* Section Header */}
            <div className="p-4 border-b border-dark-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-400">
                    {String(sectionIndex + 1).padStart(2, '0')}.
                  </span>
                  <h3 className="text-lg font-semibold text-gray-100">{section.name}</h3>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                    {section.topics.length} Topics
                  </span>
                </div>
              </div>
            </div>

            {/* Topics Table */}
            {section.topics.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">TITLE</th>
                      {selectedTrack === 'DSA Patterns' ? (
                        <>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">VIDEO</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">LEETCODE</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">DIFFICULTY</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">COMPANIES</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">TOPICS</th>
                        </>
                      ) : (
                        <>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">RESOURCE</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">NOTE</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">REVISION</th>
                        </>
                      )}
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {section.topics.map((topic, topicIndex) => {
                      const isDSA = selectedTrack === 'DSA Patterns';
                      return (
                        <tr key={topicIndex} className="hover:bg-dark-800">
                          <td className="px-4 py-3 text-sm text-gray-300">{topic.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-100">{topic.title}</td>
                          {isDSA ? (
                            <>
                              <td className="px-4 py-3 text-sm">
                                {topic.videoUrl ? (
                                  <a href={topic.videoUrl} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">
                                    ▶️
                                  </a>
                                ) : (
                                  <span className="text-gray-500">---</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {topic.leetcodeUrl ? (
                                  <a href={topic.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                    LC
                                  </a>
                                ) : (
                                  <span className="text-gray-500">---</span>
                                )}
                              </td>
                              <td className={`px-4 py-3 text-sm ${
                                topic.difficulty === 'Easy' ? 'text-green-400' :
                                topic.difficulty === 'Medium' ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>
                                {topic.difficulty || '---'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-300">
                                {topic.companies?.join(', ') || '---'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-300">
                                {topic.topics?.join(', ') || '---'}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-3 text-sm">
                                {topic.resourceUrl ? (
                                  <a
                                    href={topic.resourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-400 hover:text-green-300 flex items-center gap-1"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    Link
                                  </a>
                                ) : (
                                  <span className="text-gray-500">---</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-400">
                                {topic.note || (
                                  <span className="text-gray-500 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    No notes added
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => {
                                    const updatedSections = [...sections];
                                    updatedSections[sectionIndex].topics[topicIndex].revision =
                                      !updatedSections[sectionIndex].topics[topicIndex].revision;
                                    setSections(updatedSections);
                                  }}
                                  className={`w-12 h-6 rounded-full transition-colors ${
                                    topic.revision ? 'bg-green-500' : 'bg-dark-700'
                                  }`}
                                >
                                  <span
                                    className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                                      topic.revision ? 'translate-x-6' : 'translate-x-0.5'
                                    }`}
                                  />
                                </button>
                              </td>
                            </>
                          )}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditTopic(sectionIndex, topicIndex)}
                              className="text-gray-400 hover:text-blue-400"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteTopic(sectionIndex, topicIndex)}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add Topic Button */}
            <div className="p-4 border-t border-dark-700">
              <button
                onClick={() => setShowAddTopic(`${sectionIndex}`)}
                className="text-green-400 hover:text-green-300 font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                + ADD TOPIC TO {section.name.toUpperCase()}
              </button>
            </div>
          </div>
        ))}

        {/* Add Topic Modal */}
        {renderAddTopicModal()}

        {/* Add New Section Area */}
        <div
          onClick={() => setShowAddSection(true)}
          className="border-2 border-dashed border-dark-700 rounded-lg p-12 text-center cursor-pointer hover:border-green-500 transition-colors"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-1">Add New Section</h3>
              <p className="text-sm text-gray-400">
                Create a new container for topics like "Caching" or "CAP Theorem"
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {sections.length > 0 && (
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => navigate('/admin/courses')}
              className="px-6 py-2 bg-dark-800 text-gray-300 rounded-lg hover:bg-dark-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCourse}
              className="px-6 py-2 bg-[#4285F4] text-white rounded-lg hover:bg-[#3367D6] font-semibold"
            >
              Save Course
            </button>
          </div>
        )}
      </div>
    </AdminTabbedLayout>
  );
}
