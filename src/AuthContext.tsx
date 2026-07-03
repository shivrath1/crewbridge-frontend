import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import api from './api';

type User = {
  id: number;
  email: string;
  role: 'WORKER' | 'EMPLOYER' | 'TRAINER' | 'ADMIN';
  first_name: string;
  last_name: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
};

type RegisterData = {
  email: string;
  password: string;
  role: string;
  first_name: string;
  last_name: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On app load, restore the session from localStorage if a token exists.
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    api.defaults.headers.common['Authorization'] = `Token ${savedToken}`;
    setToken(savedToken);
    api
      .get('/auth/me/')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function applySession(data: { token: string; user: User }) {
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Token ${data.token}`;
    setToken(data.token);
    setUser(data.user);
  }

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login/', { email, password });
    applySession(res.data);
  }

  async function register(data: RegisterData) {
    const res = await api.post('/auth/register/', data);
    applySession(res.data);
  }

  function logout() {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
