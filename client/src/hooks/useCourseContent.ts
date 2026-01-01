import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

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

interface UseCourseContentReturn {
  data: TrackData | null;
  loading: boolean;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

export const useCourseContent = (
  trackName: string,
  refreshInterval: number = 5000
): UseCourseContentReturn => {
  const [data, setData] = useState<TrackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.get(`${API_URL}/courses/track/${encodeURIComponent(trackName)}`, {
        headers,
      });

      if (response.data && (response.data.track || response.data.course)) {
        // API returns { track } for /courses/track/:track, fallback to course
        setData(response.data.track || response.data.course);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error(`Failed to fetch course content for ${trackName}:`, error);
      // Don't set error state, just log it
    } finally {
      setLoading(false);
    }
  }, [trackName]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up auto-refresh interval
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, refreshInterval);
    }

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading,
    refresh,
    lastUpdated,
  };
};
