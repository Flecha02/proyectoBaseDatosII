'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  idUsuario?: number;
  nombreUsuario?: string;
  correoUsuario?: string;
  idRol?: number;
  nombreRol?: string;
  nombre?: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('app_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('app_user');
      }
    }
  }, []);

  const login = (userData: User) => {
    const normalizedUser: User = {
      ...userData,
      nombre: userData.nombre || userData.nombreUsuario || 'Usuario',
      email: userData.email || userData.correoUsuario || '',
      role: userData.role || userData.nombreRol || 'Usuario',
    };
    setUser(normalizedUser);
    localStorage.setItem('app_user', JSON.stringify(normalizedUser));
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('app_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};