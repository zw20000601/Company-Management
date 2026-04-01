'use client';

import { createContext, useContext, useCallback, ReactNode } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const defaultUser: User = {
  id: '1',
  name: 'Alex Chen',
  email: 'alex.chen@company.com',
  role: 'Product Manager',
  avatar: 'AC',
};

// Demo accounts for testing
const demoAccounts: { email: string; password: string; user: User }[] = [
  {
    email: 'admin@taskflow.com',
    password: 'admin123',
    user: { id: '1', name: 'Alex Chen', email: 'admin@taskflow.com', role: 'Admin', avatar: 'AC' },
  },
  {
    email: 'demo@taskflow.com',
    password: 'demo123',
    user: { id: '2', name: 'Demo User', email: 'demo@taskflow.com', role: 'Member', avatar: 'DU' },
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('taskflow_user', null);
  const [registeredUsers, setRegisteredUsers] = useLocalStorage<{ email: string; password: string; user: User }[]>(
    'taskflow_registered_users',
    demoAccounts
  );

  const login = useCallback(
    (email: string, password: string): boolean => {
      const account = registeredUsers.find(
        (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
      );
      if (account) {
        setUser(account.user);
        return true;
      }
      return false;
    },
    [registeredUsers, setUser]
  );

  const register = useCallback(
    (name: string, email: string, password: string): boolean => {
      const exists = registeredUsers.some((a) => a.email.toLowerCase() === email.toLowerCase());
      if (exists) return false;

      const newUser: User = {
        id: String(registeredUsers.length + 1),
        name,
        email,
        role: 'Member',
        avatar: name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      };
      setRegisteredUsers([...registeredUsers, { email, password, user: newUser }]);
      setUser(newUser);
      return true;
    },
    [registeredUsers, setRegisteredUsers, setUser]
  );

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
