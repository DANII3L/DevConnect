import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import ApiService from '../services/apiService';
import { User, Session } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, full_name?: string, username?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      ApiService.getCurrentUser(token)
        .then((response) => {
          if (response.success && response.user) {
            setUser(response.user);
            setSession({
              access_token: token,
              user: response.user,
            });
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string, full_name?: string, username?: string) => {
    const response = await ApiService.register({
      email,
      password,
      full_name,
      username,
    });

    if (response.success) {
      await signIn(email, password);
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await ApiService.login({ email, password });

    if (response.success && response.data) {
      const { user, session } = response.data;
      
      localStorage.setItem('access_token', session.access_token);
      if (session.refresh_token) {
        localStorage.setItem('refresh_token', session.refresh_token);
      }

      setUser(user);
      setSession({
        ...session,
        user: user
      });
    }
  };

  const signOut = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        await ApiService.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
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