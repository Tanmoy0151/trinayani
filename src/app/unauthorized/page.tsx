'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import logger from '@/utils/logger';
import { isAdminRole } from '@/utils/navigateToRole';
import { logout } from '@/utils/auth';

export default function UnauthorizedPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        logger.info('UnauthorizedPage', 'User data retrieved', { 
          id: String(parsedUser.id), 
          role: parsedUser.role 
        });
      } catch (error) {
        logger.error('UnauthorizedPage', 'Error parsing user data', error);
      }
    } else {
      logger.warn('UnauthorizedPage', 'No user data found in localStorage');
    }
  }, []);
  
  const handleBack = () => {
    logger.navigation('UnauthorizedPage', pathname || '', 'previous page');
    console.log('UnauthorizedPage: Navigating back to previous page.');
    router.back();
  };
  
  const handleLogout = () => {
    console.log('UnauthorizedPage: Processing logout request.');
    
    // Use the central logout utility for consistent behavior
    if (user) {
      logout(String(user.id), user.role, 'UnauthorizedPage');
    } else {
      logout('', '', 'UnauthorizedPage');
    }
    
    // Note: The logout utility handles everything including redirection
    // so we don't need additional code here
  };
  
  const getDashboardLink = () => {
    if (!user) {
      logger.info('UnauthorizedPage', 'No user data, returning login path');
      return '/login';
    }
    
    let dashboardPath = '/';
    
    if (isAdminRole(user.role)) {
      dashboardPath = '/admin/dashboard';
    } else if (user.role === 'field_employee') {
      dashboardPath = '/employee/dashboard';
    } else if (user.role === 'applicant') {
      dashboardPath = '/applicant/dashboard';
    } else {
      logger.warn('UnauthorizedPage', `Unknown role "${user.role}", defaulting to homepage`);
    }
    
    logger.info('UnauthorizedPage', `Determined dashboard path for user`, {
      role: user.role,
      path: dashboardPath
    });
    
    return dashboardPath;
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <ShieldAlert className="h-16 w-16 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>
        
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. 
          {user && (
            <span> Your current role ({user.role.replace('_', ' ')}) doesn't have the required permissions.</span>
          )}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>
          
          <Link href={getDashboardLink()}>
            <Button className="w-full sm:w-auto">
              Go to Dashboard
            </Button>
          </Link>
          
          <Button variant="secondary" onClick={handleLogout} className="w-full sm:w-auto text-red-600 hover:text-red-700">
            <LogOut size={16} className="mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
} 