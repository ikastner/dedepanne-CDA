"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading, isAdmin, isTechnician, isClient } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (allowedRoles.length > 0 && user) {
        const userRole = user.role;
        const hasAllowedRole = allowedRoles.includes(userRole);
        
        if (!hasAllowedRole) {
          if (isAdmin || isTechnician) {
            router.push('/pro');
          } else if (isClient) {
            router.push('/dashboard');
          } else {
            router.push(redirectTo);
          }
          return;
        }
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, redirectTo, router, isAdmin, isTechnician, isClient]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles.length > 0 && user) {
    const userRole = user.role;
    const hasAllowedRole = allowedRoles.includes(userRole);
    
    if (!hasAllowedRole) {
      return null;
    }
  }

  return <>{children}</>;
} 