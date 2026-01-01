import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface PrepItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  level: string;
  tags: string[];
  resources: { label: string; url: string }[];
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function InterviewPrep() {
  const [items, setItems] = useState<PrepItem[]>([]);

  useEffect(() => {
    axios.get(`${API_URL}/interview-prep`).then((res) => setItems(res.data.items || [])).catch(() => {});
  }, []);

  // Dummy Interview Prep Items
  const dummyItems: PrepItem[] = items.length > 0 ? items : [
    {
      _id: '1',
      title: 'Resume Review & Optimization',
      category: 'resume',
      description: 'Get your resume reviewed by industry experts. Optimize for ATS and make it stand out.',
      level: 'intermediate',
      tags: ['Resume', 'ATS', 'Optimization'],
      resources: [
        { label: 'Resume Template', url: '#' },
        { label: 'ATS Checklist', url: '#' }
      ]
    },
    {
      _id: '2',
      title: 'Mock Technical Interviews',
      category: 'mock',
      description: 'Practice technical interviews with real FAANG engineers. Get detailed feedback.',
      level: 'advanced',
      tags: ['Mock Interview', 'FAANG', 'Technical'],
      resources: [
        { label: 'Interview Prep Guide', url: '#' },
        { label: 'Common Questions', url: '#' }
      ]
    },
    {
      _id: '3',
      title: 'Behavioral Interview Prep',
      category: 'behavioral',
      description: 'Master STAR method and behavioral questions. Ace your interviews with confidence.',
      level: 'beginner',
      tags: ['Behavioral', 'STAR Method', 'Communication'],
      resources: [
        { label: 'STAR Method Guide', url: '#' },
        { label: 'Sample Answers', url: '#' }
      ]
    },
    {
      _id: '4',
      title: 'Coding Interview Bootcamp',
      category: 'coding',
      description: 'Intensive coding interview preparation with live sessions and practice problems.',
      level: 'advanced',
      tags: ['Coding', 'DSA', 'Practice'],
      resources: [
        { label: 'Problem Sets', url: '#' },
        { label: 'Video Solutions', url: '#' }
      ]
    },
    {
      _id: '5',
      title: 'Career Roadmap & Strategy',
      category: 'career',
      description: 'Personalized career roadmap based on your goals. Plan your path to success.',
      level: 'beginner',
      tags: ['Career', 'Planning', 'Strategy'],
      resources: [
        { label: 'Career Guide', url: '#' },
        { label: 'Skill Assessment', url: '#' }
      ]
    }
  ];

  const displayItems = items.length > 0 ? items : dummyItems;

  return (
    <div className="bg-dark-950 text-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Premium Banner */}
        <div className="mb-5 sm:mb-6 lg:mb-8">
          <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 border border-purple-500/30 rounded-xl p-4 sm:p-5 lg:p-6 shadow-lg shadow-purple-900/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 sm:px-3 py-1 bg-purple-500/30 text-purple-300 rounded-lg text-xs sm:text-sm font-semibold border border-purple-500/50">
                    PREMIUM FEATURE
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs sm:text-sm font-medium border border-green-500/30">
                    COMING SOON
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">Interview Preparation Hub</h1>
                <p className="text-sm sm:text-base text-gray-300">
                  Comprehensive interview prep resources. Resume reviews, mock interviews, and career guidance.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <span className="px-3 sm:px-4 py-2 rounded-lg border border-purple-400/40 bg-purple-500/10 text-purple-100 text-xs sm:text-sm">
                  {displayItems.length}+ resources
                </span>
                <span className="px-3 sm:px-4 py-2 rounded-lg border border-blue-400/30 bg-blue-500/10 text-[#8AB4F8] text-xs sm:text-sm">
                  Premium Access
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-5 sm:mb-6 lg:mb-8">
          <div className="bg-dark-900 border border-purple-500/30 rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-100">Premium Plans</h3>
                <p className="text-xs sm:text-sm text-gray-400">Choose your interview prep package</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <div className="px-3 sm:px-4 py-2 bg-dark-800 rounded-lg border border-dark-700">
                  <div className="text-xs text-gray-400">Basic Plan</div>
                  <div className="text-lg sm:text-xl font-bold text-purple-400">₹1,999</div>
                  <div className="text-xs text-gray-500">per month</div>
                </div>
                <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/50">
                  <div className="text-xs text-gray-300 font-semibold">Premium Plan</div>
                  <div className="text-lg sm:text-xl font-bold text-white">₹2,999</div>
                  <div className="text-xs text-green-400">Save 25%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mb-5 sm:mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 sm:p-5 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">🎯</span>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-1">Interview Prep Coming Soon!</h3>
              <p className="text-xs sm:text-sm text-gray-400">Premium interview preparation resources launching soon. Get early access.</p>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors whitespace-nowrap">
              Get Early Access
            </button>
          </div>
        </div>

        {/* Interview Prep Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {displayItems.map((item) => (
            <div key={item._id} className="bg-dark-900 border border-purple-500/30 rounded-xl p-4 sm:p-5 space-y-2 sm:space-y-3 shadow-lg shadow-black/15 relative group hover:border-purple-500/50 transition-all">
              {/* Premium Badge */}
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-semibold border border-purple-500/40">
                  PREMIUM
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-4 sm:pt-5">
                <div className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded bg-blue-500/10 text-[#8AB4F8] border border-blue-500/30 capitalize">
                  {item.category}
                </div>
                <div className="text-xs text-gray-400 capitalize">{item.level}</div>
              </div>
              
              <div className="text-base sm:text-lg lg:text-xl font-semibold text-gray-100 pr-16">{item.title}</div>
              
              <div className="text-xs sm:text-sm text-gray-300 line-clamp-2 sm:line-clamp-3">{item.description}</div>
              
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {item.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 sm:py-1 text-xs rounded bg-purple-500/10 text-purple-200 border border-purple-500/30">
                    {tag}
                  </span>
                ))}
                {item.tags && item.tags.length > 3 && (
                  <span className="px-2 py-0.5 sm:py-1 text-xs rounded bg-dark-800 text-gray-400 border border-dark-700">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>
              
              <div className="space-y-1 text-xs sm:text-sm pt-2 border-t border-dark-700">
                {item.resources?.slice(0, 2).map((r, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-purple-300">
                    <span>•</span>
                    <span className="truncate">{r.label}</span>
                  </div>
                ))}
                {item.resources && item.resources.length > 2 && (
                  <div className="text-xs text-gray-500">+{item.resources.length - 2} more resources</div>
                )}
              </div>
              
              <button
                onClick={() => toast.info('Interview prep features coming soon! Stay tuned.')}
                className="w-full py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                View Details (Coming Soon)
              </button>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: '📝', title: 'Resume Review', desc: 'Expert feedback' },
            { icon: '🎤', title: 'Mock Interviews', desc: 'Practice sessions' },
            { icon: '💼', title: 'Career Guidance', desc: 'Personalized plans' },
            { icon: '📚', title: 'Resources', desc: '50+ curated' }
          ].map((feature) => (
            <div key={feature.title} className="bg-dark-900 border border-dark-700 rounded-xl p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl mb-2">{feature.icon}</div>
              <div className="text-sm sm:text-base font-semibold text-gray-100 mb-1">{feature.title}</div>
              <div className="text-xs sm:text-sm text-gray-400">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

