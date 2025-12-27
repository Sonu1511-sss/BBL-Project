import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  streak?: {
    current: number;
    longest: number;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (googleData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || '/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      toast.success('Logged in successfully!');
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data?.error || 'Login failed');
      } else if (error.request) {
        toast.error('Cannot connect to server. Please check if backend is running.');
      } else {
        toast.error('Login failed. Please try again.');
      }
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      toast.success('Account created successfully!');
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data?.error || 'Signup failed');
      } else if (error.request) {
        toast.error('Cannot connect to server. Please check if backend is running.');
      } else {
        toast.error('Signup failed. Please try again.');
      }
      throw error;
    }
  };

  const loginWithGoogle = async (googleData: any) => {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, {
        googleId: googleData.sub || googleData.id,
        email: googleData.email,
        name: googleData.name,
        avatar: googleData.picture
      });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      toast.success('Logged in with Google!');
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data?.error || 'Google login failed');
      } else if (error.request) {
        toast.error('Cannot connect to server. Please check if backend is running.');
      } else {
        toast.error('Google login failed. Please try again.');
      }
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

