"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../api/client';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'client' | 'technician' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTechnician: boolean;
  isClient: boolean;
  getDashboardRoute: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Tentative de connexion avec:', credentials.email);
      const response = await apiClient.login(credentials);
      console.log('Réponse de connexion:', response);
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        // Synchroniser avec le Header
        localStorage.setItem('isUserConnected', 'true');
        
        // Gestion spéciale pour les comptes professionnels
        if (response.user.role === 'admin' || response.user.role === 'technician') {
          localStorage.setItem('isProConnected', 'true');
          console.log('Compte professionnel détecté:', response.user.role);
        }
        
        console.log('Connexion réussie, utilisateur:', response.user);
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.register(userData);
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        localStorage.setItem('isUserConnected', 'true');
        
        // Gestion spéciale pour les comptes professionnels
        if (response.user.role === 'admin' || response.user.role === 'technician') {
          localStorage.setItem('isProConnected', 'true');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur d\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isUserConnected');
    localStorage.removeItem('isProConnected');
    setUser(null);
    setError(null);
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        console.log('Vérification de l\'authentification avec le token');
        const profile = await apiClient.getProfile();
        console.log('Profil récupéré:', profile);
        setUser(profile);
        localStorage.setItem('isUserConnected', 'true');
        
        // Gestion spéciale pour les comptes professionnels
        if (profile.role === 'admin' || profile.role === 'technician') {
          localStorage.setItem('isProConnected', 'true');
          console.log('Compte professionnel détecté lors de la vérification:', profile.role);
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'authentification:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('isUserConnected');
        localStorage.removeItem('isProConnected');
        setUser(null);
      }
    } else {
      localStorage.removeItem('isUserConnected');
      localStorage.removeItem('isProConnected');
    }
    setLoading(false);
  };

  // Fonction pour déterminer la route du dashboard selon le rôle
  const getDashboardRoute = (): string => {
    if (!user) return '/login';
    
    console.log('Détermination de la route pour l\'utilisateur:', user.role);
    
    switch (user.role) {
      case 'admin':
      case 'technician':
        console.log('Redirection vers /pro pour le rôle:', user.role);
        return '/pro';
      case 'client':
      default:
        console.log('Redirection vers /dashboard pour le rôle:', user.role);
        return '/dashboard';
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTechnician: user?.role === 'technician',
    isClient: user?.role === 'client',
    getDashboardRoute,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 