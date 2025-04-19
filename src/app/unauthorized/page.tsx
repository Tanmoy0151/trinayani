'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  
  const handleBack = () => {
    router.back();
  };
  
  const getDashboardLink = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'applicant':
        return '/applicant/dashboard';
      case 'field_employee':
        return '/employee/dashboard';
      case 'backoffice_admin':
        return '/admin/dashboard';
      case 'super_admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
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
        </div>
      </div>
    </div>
  );
} 