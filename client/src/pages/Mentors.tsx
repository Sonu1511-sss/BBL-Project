import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Availability {
  day: string;
  slots: string[];
}

interface Mentor {
  _id: string;
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  rating: number;
  pricePerHour: number;
  photoUrl: string;
  availability?: Availability[];
}

interface Booking {
  _id: string;
  mentorId: Mentor;
  sessionType: string;
  scheduledAt: string;
  duration: number;
  status: string;
  meetingLink?: string;
  notes?: string;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';
const sessionTypes = [
  { value: 'mock-interview', label: 'Mock Interview' },
  { value: 'resume-review', label: 'Resume Review' },
  { value: 'office-hours', label: 'Office Hours' },
  { value: 'general', label: 'General Guidance' },
];

export default function Mentors() {
  const { user, token } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedMentorId, setSelectedMentorId] = useState<string>('');
  const [sessionType, setSessionType] = useState<string>('mock-interview');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [duration, setDuration] = useState<number>(60);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/mentors`).then((res) => setMentors(res.data.mentors || []));
  }, []);

  useEffect(() => {
    if (token) {
      axios
        .get(`${API_URL}/mentors/bookings/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setBookings(res.data.bookings || []))
        .catch(() => {});
    }
  }, [token]);

  // Dummy mentors data for display
  const dummyMentors: Mentor[] = [
    {
      _id: '1',
      name: 'Rajesh Kumar',
      title: 'Senior Software Engineer at Google',
      bio: '10+ years experience in DSA and System Design. Helped 500+ students crack FAANG interviews.',
      expertise: ['DSA', 'System Design', 'Algorithms'],
      rating: 4.9,
      pricePerHour: 999,
      photoUrl: '',
      availability: [
        { day: 'Monday', slots: ['10:00-11:00', '14:00-15:00', '18:00-19:00'] },
        { day: 'Wednesday', slots: ['10:00-11:00', '16:00-17:00'] }
      ]
    },
    {
      _id: '2',
      name: 'Priya Sharma',
      title: 'Ex-Amazon | System Design Expert',
      bio: 'Specialized in scalable system architecture. Expert in microservices, distributed systems, and cloud infrastructure.',
      expertise: ['System Design', 'Cloud Architecture', 'Microservices'],
      rating: 4.8,
      pricePerHour: 899,
      photoUrl: '',
      availability: [
        { day: 'Tuesday', slots: ['11:00-12:00', '15:00-16:00'] },
        { day: 'Thursday', slots: ['10:00-11:00', '14:00-15:00'] }
      ]
    },
    {
      _id: '3',
      name: 'Amit Patel',
      title: 'DSA Mentor | LeetCode Expert',
      bio: 'Solved 2000+ LeetCode problems. Specialized in Dynamic Programming and Graph Algorithms.',
      expertise: ['DSA', 'Dynamic Programming', 'Graph Algorithms'],
      rating: 4.7,
      pricePerHour: 799,
      photoUrl: '',
      availability: [
        { day: 'Friday', slots: ['10:00-11:00', '13:00-14:00', '17:00-18:00'] },
        { day: 'Saturday', slots: ['10:00-11:00', '14:00-15:00'] }
      ]
    }
  ];

  const displayMentors = mentors.length > 0 ? mentors : dummyMentors;

  const selectedMentor = useMemo(
    () => displayMentors.find((m) => m._id === selectedMentorId) || displayMentors[0],
    [displayMentors, selectedMentorId]
  );

  useEffect(() => {
    if (!selectedMentorId && displayMentors.length) {
      setSelectedMentorId(displayMentors[0]._id);
    }
  }, [displayMentors, selectedMentorId]);

  const handleBook = async () => {
    if (!user || !token) {
      toast.error('Please log in to book a session.');
      return;
    }
    if (!selectedMentor?._id || !selectedSlot) {
      toast.error('Choose a mentor and a slot.');
      return;
    }
    try {
      setLoading(true);
      const scheduledAt = new Date(selectedSlot).toISOString();
      const res = await axios.post(
        `${API_URL}/mentors/bookings`,
        {
          mentorId: selectedMentor._id,
          sessionType,
          scheduledAt,
          duration,
          notes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Session booked! Pending confirmation.');
      setBookings((prev) => [...prev, res.data.booking]);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const renderSlots = () => {
    const availability = selectedMentor?.availability || [];
    if (!availability.length) {
      return <p className="text-gray-400 text-sm">No slots listed. Please contact mentor.</p>;
    }
    return availability.map((day) => (
      <div key={day.day} className="space-y-2">
        <div className="text-xs text-gray-400 uppercase">{day.day}</div>
        <div className="flex flex-wrap gap-2">
          {day.slots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                selectedSlot === slot
                  ? 'border-[#4285F4] bg-[#4285F4]/10 text-[#8AB4F8]'
                  : 'border-dark-700 text-gray-300 hover:border-gray-500'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-dark-950 text-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Premium Banner */}
        <div className="mb-5 sm:mb-6 lg:mb-8">
          <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/30 rounded-xl p-4 sm:p-5 lg:p-6 shadow-lg shadow-amber-900/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 sm:px-3 py-1 bg-amber-500/30 text-amber-300 rounded-lg text-xs sm:text-sm font-semibold border border-amber-500/50">
                    PREMIUM FEATURE
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs sm:text-sm font-medium border border-green-500/30">
                    COMING SOON
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">1:1 Mentor Sessions</h1>
                <p className="text-sm sm:text-base text-gray-300">
                  Book personalized sessions with industry experts. Premium service for focused learning.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <div className="px-3 sm:px-4 py-2 rounded-lg border border-blue-500/40 bg-blue-500/10 text-[#8AB4F8] text-xs sm:text-sm">
                  4.8★ avg rating
                </div>
                <div className="px-3 sm:px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 text-xs sm:text-sm">
                  100+ sessions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="mb-5 sm:mb-6 lg:mb-8">
          <div className="bg-dark-900 border border-amber-500/30 rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-100">Pricing Plans</h3>
                <p className="text-xs sm:text-sm text-gray-400">Choose the plan that fits your learning goals</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <div className="px-3 sm:px-4 py-2 bg-dark-800 rounded-lg border border-dark-700">
                  <div className="text-xs text-gray-400">Starting from</div>
                  <div className="text-lg sm:text-xl font-bold text-amber-400">₹799/hr</div>
                </div>
                <div className="px-3 sm:px-4 py-2 bg-dark-800 rounded-lg border border-dark-700">
                  <div className="text-xs text-gray-400">Package deals</div>
                  <div className="text-lg sm:text-xl font-bold text-green-400">Save 20%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6 lg:mb-8">
          {[
            { title: 'Choose Mentor', desc: 'Pick a DSA/System Design expert', icon: '🧑‍🏫' },
            { title: 'Select Slot', desc: 'Live weekly availability', icon: '🗓️' },
            { title: 'Book & Join', desc: 'Instant meeting link after confirm', icon: '✅' },
          ].map((item) => (
            <div key={item.title} className="bg-dark-900 border border-dark-700 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3 shadow-lg shadow-black/10">
              <div className="text-xl sm:text-2xl flex-shrink-0">{item.icon}</div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-semibold text-gray-100">{item.title}</div>
                <div className="text-xs sm:text-sm text-gray-400">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="mb-5 sm:mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 sm:p-5 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">🚀</span>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-1">Mentor Sessions Coming Soon!</h3>
              <p className="text-xs sm:text-sm text-gray-400">We're launching premium 1:1 mentor sessions. Get notified when available.</p>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors whitespace-nowrap">
              Notify Me
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {/* Mentor cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {displayMentors.map((m) => (
              <div
                key={m._id}
                className={`bg-dark-900 border rounded-xl p-4 sm:p-5 space-y-2 sm:space-y-3 hover:border-[#4285F4]/50 transition-colors relative overflow-hidden shadow-lg shadow-black/20 ${
                  selectedMentorId === m._id ? 'border-[#4285F4]' : 'border-dark-700'
                }`}
              >
                <div className="absolute top-0 right-0 px-2 sm:px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-bl-xl border-l border-b border-amber-500/40">
                  ₹{m.pricePerHour}/hr
                </div>
                <div className="absolute top-0 left-0 px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-br-xl border-r border-b border-purple-500/40">
                  Premium
                </div>
                <div className="flex items-center gap-2 sm:gap-3 pt-4 sm:pt-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-dark-800 flex items-center justify-center text-base sm:text-lg font-semibold flex-shrink-0">
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base lg:text-lg font-semibold flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="truncate">{m.name}</span>
                      <span className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-green-500/10 text-green-300 border border-green-500/30 flex-shrink-0">
                        Expert
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 truncate">{m.title}</div>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-gray-300 line-clamp-2 sm:line-clamp-3">{m.bio}</div>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {m.expertise?.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded bg-blue-500/10 text-[#8AB4F8] border border-blue-500/30">
                      {tag}
                    </span>
                  ))}
                  {m.expertise && m.expertise.length > 3 && (
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded bg-dark-800 text-gray-400 border border-dark-700">
                      +{m.expertise.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm pt-1 border-t border-dark-700">
                  <span className="flex items-center gap-1">
                    ⭐ {m.rating?.toFixed(1)}
                    <span className="hidden sm:inline text-xs text-gray-500">(100+ sessions)</span>
                  </span>
                  <span className="font-semibold text-amber-400">₹{m.pricePerHour}/hr</span>
                </div>
                {/* Quick availability preview */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {(m.availability?.slice(0, 2) || []).map((day) => (
                    <div key={day.day} className="px-2 py-1 rounded-lg border border-dark-700 text-xs text-gray-300">
                      {day.day}: {day.slots.slice(0, 1).join(', ')}{day.slots.length > 1 ? '…' : ''}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    toast.info('Mentor sessions coming soon! Stay tuned.');
                    setSelectedMentorId(m._id);
                  }}
                  className="w-full py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm sm:text-base font-semibold hover:from-amber-700 hover:to-orange-700 transition-all relative overflow-hidden group"
                >
                  <span className="relative z-10">Book Now (Coming Soon)</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </button>
              </div>
            ))}
          </div>

          {/* Booking panel */}
          <div className="bg-dark-900 border border-amber-500/30 rounded-xl p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4 shadow-lg shadow-black/20 relative">
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-semibold border border-purple-500/40">
                COMING SOON
              </span>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-100">Book a Session</h2>
              <p className="text-xs sm:text-sm text-gray-400">Premium 1:1 mentoring sessions</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Mentor</label>
                <select
                  className="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-3 py-2 text-sm"
                  value={selectedMentor?._id || ''}
                  onChange={(e) => setSelectedMentorId(e.target.value)}
                >
                  {displayMentors.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} — ₹{m.pricePerHour}/hr
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Session Type</label>
                <select
                  className="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-3 py-2"
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                >
                  {sessionTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">Pick a slot</label>
                  <span className="text-xs text-gray-500">Live availability</span>
                </div>
                <div className="space-y-3">{renderSlots()}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Duration (mins)</label>
                <input
                  type="number"
                  min={15}
                  max={120}
                  step={15}
                  className="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-3 py-2"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Notes</label>
                <textarea
                  className="w-full bg-dark-800 border border-dark-700 text-gray-100 rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Topics to discuss, expectations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3 sm:p-4 text-center">
                <p className="text-xs sm:text-sm text-gray-300 mb-2">🚀 Launching Soon!</p>
                <p className="text-xs text-gray-400 mb-3">Get notified when mentor sessions go live</p>
                <button
                  onClick={() => toast.success('You will be notified when mentor sessions launch!')}
                  className="w-full py-2 sm:py-2.5 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors"
                >
                  Notify Me
                </button>
              </div>
              <button
                disabled={true}
                className="w-full py-3 rounded-lg bg-gray-600 text-gray-400 font-semibold cursor-not-allowed opacity-50"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming sessions */}
        {bookings.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-3">Your Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map((b) => (
                <div key={b._id} className="bg-dark-900 border border-dark-700 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-100">{b.mentorId?.name}</span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-[#8AB4F8] border border-blue-500/30">
                      {b.sessionType}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {new Date(b.scheduledAt).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Duration: {b.duration} mins</div>
                  <div className="text-xs text-gray-400">Status: {b.status}</div>
                  {b.meetingLink && (
                    <a
                      href={b.meetingLink}
                      className="text-[#8AB4F8] text-xs hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Join link
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

