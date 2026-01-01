import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminTabbedLayout from '../../components/admin/AdminTabbedLayout';

interface PrepItem {
  _id?: string;
  title: string;
  category: 'resume' | 'mock' | 'career' | 'coding' | 'behavioral';
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  resources: { label: string; url: string }[];
  isActive: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

const emptyItem: PrepItem = {
  title: '',
  category: 'coding',
  description: '',
  level: 'beginner',
  tags: [],
  resources: [],
  isActive: true,
};

export default function AdminInterviewPrep() {
  const [items, setItems] = useState<PrepItem[]>([]);
  const [form, setForm] = useState<PrepItem>(emptyItem);
  const [resourceLabel, setResourceLabel] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    active: 0,
    inactive: 0,
    totalResources: 0,
    totalTags: 0,
  });

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/interview-prep`);
      const list = res.data.items || [];
      setItems(list);
      const active = list.filter((i: PrepItem) => i.isActive).length;
      const tags = new Set<string>();
      list.forEach((i: PrepItem) => (i.tags || []).forEach((t) => tags.add(t)));
      setStats({
        active,
        inactive: list.length - active,
        totalResources: list.length,
        totalTags: tags.size,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load items');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.filter(Boolean),
        resources: form.resources.filter((r) => r.label && r.url),
      };
      if (editingId) {
        await axios.put(`${API_URL}/admin/interview-prep/${editingId}`, payload);
        toast.success('Updated');
      } else {
        await axios.post(`${API_URL}/admin/interview-prep`, payload);
        toast.success('Created');
      }
      setForm(emptyItem);
      setEditingId(null);
      fetchItems();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: PrepItem) => {
    setForm({
      ...item,
      tags: item.tags || [],
      resources: item.resources || [],
    });
    setEditingId(item._id || null);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Delete this item?')) return;
    try {
      await axios.delete(`${API_URL}/admin/interview-prep/${id}`);
      toast.success('Deleted');
      fetchItems();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Delete failed');
    }
  };

  const addResource = () => {
    if (!resourceLabel || !resourceUrl) return;
    setForm({
      ...form,
      resources: [...form.resources, { label: resourceLabel, url: resourceUrl }],
    });
    setResourceLabel('');
    setResourceUrl('');
  };

  return (
    <AdminTabbedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="space-y-1 sm:space-y-2">
            <p className="text-xs sm:text-sm text-gray-400">Admin / Interview Prep</p>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100">Interview Preparation</h1>
            <p className="text-xs sm:text-sm text-gray-500">Manage resume, mock, coding, behavioral resources</p>
          </div>
          <span className="text-xs px-3 py-1.5 sm:py-2 rounded-lg bg-blue-500/10 text-[#8AB4F8] border border-blue-500/30 self-start sm:self-auto">
            Live data
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {[
            { label: 'Total Resources', value: stats.totalResources },
            { label: 'Active', value: stats.active },
            { label: 'Inactive', value: stats.inactive },
            { label: 'Unique Tags', value: stats.totalTags },
          ].map((card) => (
            <div key={card.label} className="bg-dark-900 border border-dark-700 rounded-xl p-3 sm:p-4 lg:p-5">
              <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">{card.label}</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-start">
          <form
            onSubmit={handleSubmit}
            className="bg-dark-900 border border-dark-700 rounded-xl p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4 lg:col-span-1 shadow-lg shadow-black/20"
          >
            <h2 className="text-lg font-semibold text-gray-100">
              {editingId ? 'Edit Resource' : 'Add Resource'}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <label className="text-xs sm:text-sm text-gray-300 space-y-1.5 sm:space-y-2">
                Title
                <input
                  className="w-full px-3 py-2 sm:py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-gray-100 text-sm sm:text-base"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm text-gray-300 space-y-2">
                Category
                <select
                  className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-100"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as PrepItem['category'] })}
                >
                  <option value="resume">Resume</option>
                  <option value="mock">Mock Interview</option>
                  <option value="career">Career Roadmap</option>
                  <option value="coding">Coding Practice</option>
                  <option value="behavioral">Behavioral</option>
                </select>
              </label>
              <label className="text-sm text-gray-300 space-y-2">
                Level
                <select
                  className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-100"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value as PrepItem['level'] })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </label>
              <label className="text-sm text-gray-300 space-y-2">
                Description
                <textarea
                  className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-100"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>
              <label className="text-sm text-gray-300 space-y-2">
                Tags (comma separated)
                <input
                  className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-100"
                  value={form.tags.join(', ')}
                  onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((s) => s.trim()) })}
                />
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Resources</span>
                  <span className="text-xs text-gray-500">Label + URL</span>
                </div>
                <div className="flex flex-col gap-2">
  <input
    className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-100"
    placeholder="e.g., System Design PDF"
    value={resourceLabel}
    onChange={(e) => setResourceLabel(e.target.value)}
  />

  <input
    className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-100"
    placeholder="https://..."
    value={resourceUrl}
    onChange={(e) => setResourceUrl(e.target.value)}
  />

  <button
    type="button"
    onClick={addResource}
    className="w-full px-3 py-2 rounded-lg bg-[#4285F4] text-white font-semibold hover:bg-[#3367D6] transition-colors"
  >
    Add
  </button>
</div>

                <div className="flex flex-wrap gap-2">
                  {form.resources.map((r, idx) => (
                    <span key={idx} className="px-2 py-1 rounded bg-blue-500/10 text-[#8AB4F8] border border-blue-500/30 text-xs flex items-center gap-2">
                      {r.label}
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            resources: form.resources.filter((_, i) => i !== idx),
                          })
                        }
                        className="text-gray-400 hover:text-gray-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                Active
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 sm:py-2.5 rounded-lg bg-[#4285F4] text-white text-sm sm:text-base font-semibold hover:bg-[#3367D6] disabled:opacity-50 transition-colors"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyItem);
                  }}
                  className="px-4 py-2 sm:py-2.5 rounded-lg border border-dark-700 text-gray-300 text-sm sm:text-base hover:bg-dark-800 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="lg:col-span-2">
            <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden shadow-lg shadow-black/20">
              <div className="px-4 sm:px-5 lg:px-6 py-3 sm:py-4 border-b border-dark-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base lg:text-lg text-gray-100 font-semibold">Resources</h3>
                  <p className="text-xs text-gray-500">Live from API</p>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">{items.length} items</span>
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-dark-700">
                  <thead className="bg-dark-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Level</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Tags</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-800">
                    {items.map((item) => (
                      <tr key={item._id} className="hover:bg-dark-800/60">
                        <td className="px-4 py-3 text-sm text-gray-100">
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-xs text-gray-400 line-clamp-1">{item.description}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-200 capitalize">{item.category}</td>
                        <td className="px-4 py-3 text-sm text-gray-200 capitalize">{item.level}</td>
                        <td className="px-4 py-3 text-sm text-gray-200">
                          <div className="flex flex-wrap gap-1">
                            {(item.tags || []).map((tag) => (
                              <span key={tag} className="px-2 py-1 text-xs rounded bg-purple-500/10 text-purple-200 border border-purple-500/30">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {item.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-3 py-1 rounded-lg bg-dark-800 text-gray-200 border border-dark-700 hover:border-[#4285F4] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="px-3 py-1 rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td className="px-4 py-6 text-center text-gray-400 text-sm" colSpan={6}>
                          No resources found. Add your first item.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-dark-700">
                {items.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-400 text-sm">
                    No resources found. Add your first item.
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item._id} className="p-4 sm:p-5 hover:bg-dark-800/60 transition-colors">
                      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                          <h4 className="text-sm sm:text-base font-semibold text-gray-100 break-words">{item.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">{item.description}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 capitalize">
                              {item.category}
                            </span>
                            <span className="px-2 py-1 text-xs rounded bg-gray-500/10 text-gray-300 border border-gray-500/30 capitalize">
                              {item.level}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${item.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          {(item.tags || []).length > 0 && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {(item.tags || []).map((tag) => (
                                <span key={tag} className="px-2 py-0.5 sm:py-1 text-xs rounded bg-purple-500/10 text-purple-200 border border-purple-500/30">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 sm:gap-3 pt-2 border-t border-dark-700">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex-1 px-3 py-2 rounded-lg bg-dark-800 text-gray-200 border border-dark-700 hover:border-[#4285F4] transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex-1 px-3 py-2 rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminTabbedLayout>
  );
}

