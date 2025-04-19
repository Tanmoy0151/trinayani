'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole, Permission, hasPermission } from '@/types/user';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: Permission[];
  fallback?: ReactNode;
}

export default function RoleGuard({
  children,
  allowedRoles,
  requiredPermissions,
  fallback = null
}: RoleGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      router.push('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      
      let authorized = true;
      
      // Check role if allowedRoles is specified
      if (allowedRoles && allowedRoles.length > 0) {
        authorized = allowedRoles.includes(user.role);
      }
      
      // Check permissions if requiredPermissions is specified
      if (authorized && requiredPermissions && requiredPermissions.length > 0) {
        authorized = requiredPermissions.every(permission => 
          hasPermission(user, permission)
        );
      }
      
      if (!authorized) {
        router.push('/unauthorized');
        setIsAuthorized(false);
        return;
      }
      
      setIsAuthorized(true);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router, allowedRoles, requiredPermissions]);
  
  // Show nothing while checking authorization
  if (isAuthorized === null) {
    return null;
  }
  
  // If authorized, render children, otherwise render fallback
  return isAuthorized ? <>{children}</> : <>{fallback}</>;
} 