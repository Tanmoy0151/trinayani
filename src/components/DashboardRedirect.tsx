'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import logger from '@/utils/logger';
import { navigateByRole } from '@/utils/navigateToRole';

export default function DashboardRedirect() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      logger.warn('DashboardRedirect', 'No user data found in localStorage. Redirecting to login page.');
      router.push('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      const role = user.role || 'user';
      
      logger.info('DashboardRedirect', 'User data retrieved', { 
        id: String(user.id),
        name: user.name,
        role: role
      });
      
      // Use the centralized navigation utility
      navigateByRole(router, role, '/dashboard');
    } catch (error) {
      logger.error('DashboardRedirect', 'Error parsing user data', error);
      // Check if the error is related to JSON parsing
      if (error instanceof SyntaxError) {
        logger.error('DashboardRedirect', 'Invalid JSON in localStorage. User data may be corrupted.');
        localStorage.removeItem('user'); // Clean up invalid data
      }
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-500">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
} 