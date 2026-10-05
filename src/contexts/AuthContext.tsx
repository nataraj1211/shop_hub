import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types/product';
import { toast } from '@/components/ui/sonner';

interface StoredUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAdmin: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'shophub_users';

// Seed demo users
const defaultUsers: StoredUser[] = [
  { id: '1', email: 'admin@shophub.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { id: '2', email: 'customer@example.com', password: 'customer123', name: 'John Customer', role: 'customer' },
];

const loadUsers = (): StoredUser[] => {
  const saved = localStorage.getItem(USERS_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch { /* ignore */ }
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<StoredUser[]>(() => loadUsers());
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('shophub_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  const login = (email: string, password: string, role: UserRole): boolean => {
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role
    );

    if (foundUser) {
      const loggedInUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      };
      setUser(loggedInUser);
      localStorage.setItem('shophub_user', JSON.stringify(loggedInUser));
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      return true;
    }

    toast.error('Invalid email or password');
    return false;
  };

  const signup = (name: string, email: string, password: string, role: UserRole): boolean => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      toast.error('An account with this email already exists');
      return false;
    }

    const newUser: StoredUser = {
      id: `${Date.now()}`,
      email: email.trim(),
      password,
      name: name.trim(),
      role,
    };
    const updated = [...users, newUser];
    setUsers(updated);

    const loggedInUser: User = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role };
    setUser(loggedInUser);
    localStorage.setItem('shophub_user', JSON.stringify(loggedInUser));
    toast.success(`Account created! Welcome, ${newUser.name}!`);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shophub_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, isAdmin, isCustomer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
