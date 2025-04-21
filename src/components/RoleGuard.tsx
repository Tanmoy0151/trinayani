'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserRole, Permission, hasPermission } from '@/types/user';
import logger from '@/utils/logger';

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
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      logger.warn('RoleGuard', 'No user data found in localStorage', { pathname });
      router.push('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      
      let authorized = true;
      let failReason = '';
      
      // Check role if allowedRoles is specified
      if (allowedRoles && allowedRoles.length > 0) {
        authorized = allowedRoles.includes(user.role);
        if (!authorized) {
          failReason = `User role (${user.role}) not in allowed roles [${allowedRoles.join(', ')}]`;
        }
      }
      
      // Check permissions if requiredPermissions is specified
      if (authorized && requiredPermissions && requiredPermissions.length > 0) {
        const missingPermissions: Permission[] = [];
        
        for (const permission of requiredPermissions) {
          if (!hasPermission(user, permission)) {
            missingPermissions.push(permission);
          }
        }
        
        authorized = missingPermissions.length === 0;
        
        if (!authorized) {
          failReason = `User missing required permissions: [${missingPermissions.join(', ')}]`;
        }
      }
      
      if (!authorized) {
        logger.warn('RoleGuard', `Access denied to ${pathname}`, { 
          userId: String(user.id),
          role: user.role,
          path: pathname,
          reason: failReason
        });
        router.push('/unauthorized');
        setIsAuthorized(false);
        return;
      }
      
      logger.info('RoleGuard', `Access granted to ${pathname}`, { 
        userId: String(user.id),
        role: user.role
      });
      setIsAuthorized(true);
    } catch (error) {
      logger.error('RoleGuard', 'Error parsing user data', error);
      router.push('/login');
    }
  }, [router, allowedRoles, requiredPermissions, pathname]);
  
  // Show nothing while checking authorization
  if (isAuthorized === null) {
    return null;
  }
  
  // If authorized, render children, otherwise render fallback
  return isAuthorized ? <>{children}</> : <>{fallback}</>;
} 