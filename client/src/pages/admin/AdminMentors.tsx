import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminTabbedLayout from '../../components/admin/AdminTabbedLayout';

interface Mentor {
  _id?: string;
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  rating: number;
  pricePerHour: number;
  photoUrl: string;
  isActive: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

const emptyMentor: Mentor = {
  name: '',
  title: 'DSA Mentor',
  bio: '',
  expertise: [],
  rating: 4.8,
  pricePerHour: 299,
  photoUrl: '',
  isActive: true,
};

export default function AdminMentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [form, setForm] = useState<Mentor>(emptyMentor);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMentors = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/mentors`);
      setMentors(res.data.mentors || []);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load mentors');
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        expertise: form.expertise.filter(Boolean),
      };
      if (editingId) {
        await axios.put(`${API_URL}/admin/mentors/${editingId}`, payload);
        toast.success('Mentor updated');
      } else {
        await axios.post(`${API_URL}/admin/mentors`, payload);
        toast.success('Mentor created');
      }
      setForm(emptyMentor);
      setEditingId(null);
      fetchMentors();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (mentor: Mentor) => {
    setForm({
      ...mentor,
      expertise: mentor.expertise || [],
    });
    setEditingId(mentor._id || null);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Delete this mentor?')) return;
    try {
      await axios.delete(`${API_URL}/admin/mentors/${id}`);
      toast.success('Deleted');
      fetchMentors();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <AdminTabbedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-100">Mentors</h1>
            <span className="text-xs sm:text-sm text-gray-400">Manage mentor profiles & pricing</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleSubmit}
            className="bg-dark-900 border border-dark-700 rounded-xl p-6 space-y-4 lg:col-span-1"
          >
            <h2 className="text-lg font-semibold text-gray-100">
              {editingId ? 'Edit Mentor' : 'Add Mentor'}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <label className="text-sm text-gray-300 space-y-2">
                Name
                <input
                  className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-100"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>
              <label className="text-sm text-gray-300 space-y-2">
                Title
                <input
                  className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-100"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </label>
              <label className="text-sm text-gray-300 space-y-2">
                Bio
                <textarea
                  className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-100"
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </label>
              <label className="text-sm text-gray-300 space-y-2">
                Expertise (comma separated)
                <input
                  className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-100"
                  value={form.expertise.join(', ')}
                  onChange={(e) =>
                    setForm({ ...form, expertise: e.target.value.split(',').map((s) => s.trim()) })
                  }
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm text-gray-300 space-y-2">
                  Rating
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-100"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  />
                </label>
                <label className="text-sm text-gray-300 space-y-2">
                  Price/hr (₹)
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-100"
                    value={form.pricePerHour}
                    onChange={(e) => setForm({ ...form, pricePerHour: Number(e.target.value) })}
                  />
                </label>
              </div>
              <label className="text-sm text-gray-300 space-y-2">
                Photo URL
                <input
                  className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-100"
                  value={form.photoUrl}
                  onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                />
              </label>
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
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#4285F4] text-white font-semibold hover:bg-[#3367D6] disabled:opacity-50"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyMentor);
                  }}
                  className="px-4 py-2 rounded-lg border border-dark-700 text-gray-300 hover:bg-dark-800"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="lg:col-span-2">
            <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-dark-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h3 className="text-gray-100 font-semibold">Mentor List</h3>
                <span className="text-xs text-gray-500">{mentors.length} mentors</span>
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-dark-700">
                  <thead className="bg-dark-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Expertise</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Rating</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Price/hr</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-800">
                    {mentors.map((m) => (
                      <tr key={m._id} className="hover:bg-dark-800/60">
                        <td className="px-4 py-3 text-sm text-gray-100">
                          <div className="font-semibold">{m.name}</div>
                          <div className="text-xs text-gray-400">{m.title}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-200">
                          <div className="flex flex-wrap gap-1">
                            {(m.expertise || []).map((tag) => (
                              <span key={tag} className="px-2 py-1 text-xs rounded bg-blue-500/10 text-[#8AB4F8] border border-blue-500/30">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-100">{m.rating?.toFixed(1)}</td>
                        <td className="px-4 py-3 text-sm text-gray-100">₹{m.pricePerHour}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${m.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {m.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right space-x-2">
                          <button
                            onClick={() => handleEdit(m)}
                            className="px-3 py-1 rounded-lg bg-dark-800 text-gray-200 border border-dark-700 hover:border-[#4285F4] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(m._id)}
                            className="px-3 py-1 rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {mentors.length === 0 && (
                      <tr>
                        <td className="px-4 py-6 text-center text-gray-400 text-sm" colSpan={6}>
                          No mentors found. Add your first mentor.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-dark-700">
                {mentors.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-400 text-sm">
                    No mentors found. Add your first mentor.
                  </div>
                ) : (
                  mentors.map((m) => (
                    <div key={m._id} className="p-4 hover:bg-dark-800/60 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-100 mb-1 break-words">{m.name}</h4>
                          <p className="text-xs text-gray-400 mb-2">{m.title}</p>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-sm text-gray-100">{m.rating?.toFixed(1)} ⭐</span>
                            <span className="text-sm text-gray-100">₹{m.pricePerHour}/hr</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${m.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                              {m.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          {(m.expertise || []).length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {(m.expertise || []).map((tag) => (
                                <span key={tag} className="px-2 py-1 text-xs rounded bg-blue-500/10 text-[#8AB4F8] border border-blue-500/30">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(m)}
                          className="flex-1 px-3 py-2 rounded-lg bg-dark-800 text-gray-200 border border-dark-700 hover:border-[#4285F4] transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(m._id)}
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



