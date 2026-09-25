import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api } from '../api';
import { clearAuth, getStoredAuth, saveAuth } from '../storage';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStoredAuth()
      .then(async ({ token: storedToken, user: storedUser }) => {
        if (!storedToken) return;

        setToken(storedToken);
        setUser(storedUser);

        try {
          const freshUser = await api.me(storedToken);
          setUser(freshUser);
          await saveAuth(storedToken, freshUser);
        } catch {
          await clearAuth();
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const persistAuth = useCallback(async (nextToken: string, nextUser: User) => {
    await saveAuth(nextToken, nextUser);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { user: nextUser, token: nextToken } = await api.login(
        email,
        password,
      );
      await persistAuth(nextToken, nextUser);
    },
    [persistAuth],
  );

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const { user: nextUser, token: nextToken } = await api.register(
        email,
        password,
        name,
      );
      await persistAuth(nextToken, nextUser);
    },
    [persistAuth],
  );

  const logout = useCallback(async () => {
    await clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const setUserAndPersist = useCallback(
    async (nextUser: User) => {
      if (token) {
        await saveAuth(token, nextUser);
      }
      setUser(nextUser);
    },
    [token],
  );

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      setUser: setUserAndPersist,
    }),
    [user, token, loading, login, register, logout, setUserAndPersist],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
