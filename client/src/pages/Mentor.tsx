import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface Mentor {
  _id: string;
  name: string;
  email: string;
  profile?: {
    avatar?: string;
    bio?: string;
  };
}

interface Booking {
  _id: string;
  sessionType: string;
  scheduledAt: string;
  status: string;
  mentorId: Mentor;
}

export default function Mentor() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<string>('');
  const [bookingData, setBookingData] = useState({
    sessionType: 'office-hours',
    scheduledAt: '',
    duration: 30
  });

  useEffect(() => {
    fetchMentors();
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchMentors = async () => {
    try {
      const response = await axios.get(`${API_URL}/mentor/list`);
      setMentors(response.data.mentors);
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/mentor/my-bookings`);
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) {
      toast.error('Please select a mentor');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/mentor/book-session`, {
        mentorId: selectedMentor,
        ...bookingData
      });
      toast.success('Booking created successfully!');
      setShowBookingForm(false);
      fetchBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create booking');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 gradient-text">Mentor Sessions</h1>
        <p className="text-gray-400 text-xl max-w-3xl mx-auto">
          Book 1:1 sessions with experienced mentors. This is an <span className="font-bold text-primary-400">optional</span> feature.
          All core learning content remains <span className="font-bold text-green-400">100% free</span>.
        </p>
      </div>

      {!user && (
        <div className="card p-8 mb-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/30">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🔒</div>
            <div>
              <p className="text-yellow-300 font-semibold text-lg">
                Please login to book mentor sessions.
              </p>
              <p className="text-yellow-400 text-sm mt-1">
                All learning content is free, mentor sessions are optional.
              </p>
            </div>
          </div>
        </div>
      )}

      {user && (
        <>
          <div className="mb-8 text-center">
            <button
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="btn-primary px-8 py-4 text-lg"
            >
              {showBookingForm ? 'Cancel' : '+ Book a Session'}
            </button>
          </div>

          {showBookingForm && (
            <div className="card p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 gradient-text">Book Mentor Session</h2>
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Mentor
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    value={selectedMentor}
                    onChange={(e) => setSelectedMentor(e.target.value)}
                  >
                    <option value="">Choose a mentor...</option>
                    {mentors.map((mentor) => (
                      <option key={mentor._id} value={mentor._id}>
                        {mentor.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Session Type
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    value={bookingData.sessionType}
                    onChange={(e) => setBookingData({ ...bookingData, sessionType: e.target.value })}
                  >
                    <option value="office-hours">Office Hours</option>
                    <option value="mock-interview">Mock Interview</option>
                    <option value="resume-review">Resume Review</option>
                    <option value="general">General Discussion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    value={bookingData.scheduledAt}
                    onChange={(e) => setBookingData({ ...bookingData, scheduledAt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="120"
                    required
                    className="w-full px-4 py-2 bg-dark-800 border border-dark-700 text-gray-100 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    value={bookingData.duration}
                    onChange={(e) => setBookingData({ ...bookingData, duration: parseInt(e.target.value) })}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full py-3 text-lg"
                >
                  Book Session 🎯
                </button>
              </form>
            </div>
          )}

          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 gradient-text text-center">Available Mentors</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <div key={mentor._id} className="card p-6 hover:scale-105 transition-transform">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {mentor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-100">{mentor.name}</h3>
                      <span className="text-xs text-primary-400 font-semibold bg-primary-500/20 px-3 py-1 rounded-full border border-primary-500/30">Mentor</span>
                    </div>
                  </div>
                  {mentor.profile?.bio && (
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{mentor.profile.bio}</p>
                  )}
                  <span className="text-sm text-green-400 font-bold flex items-center gap-2">
                    <span>✓</span> Available for booking
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 gradient-text text-center">My Bookings</h2>
            {bookings.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-400 text-lg">No bookings yet.</p>
                <p className="text-gray-500 text-sm mt-2">Book your first session to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="card p-6 hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-400 rounded-full flex items-center justify-center text-white font-bold">
                          {booking.mentorId.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-100">{booking.mentorId.name}</h3>
                          <p className="text-gray-400 capitalize">{booking.sessionType.replace('-', ' ')}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <span>📅</span>
                            {new Date(booking.scheduledAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                        booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border-2 border-green-500/30' :
                        booking.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/30'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

