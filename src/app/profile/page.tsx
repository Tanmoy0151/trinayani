'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, Building } from 'lucide-react';
import logger from '@/utils/logger';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      logger.warn('ProfilePage', 'No user data found, redirecting to login');
      router.push('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      logger.info('ProfilePage', 'User data loaded', { id: String(parsedUser.id), role: parsedUser.role });
    } catch (error) {
      logger.error('ProfilePage', 'Error parsing user data', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatJoinDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-primary-600 px-6 py-10 text-center">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-primary-600 text-2xl font-bold border-4 border-white shadow-md">
                {user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : <User size={40} />}
              </div>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-primary-100">{user.role?.replace('_', ' ')}</p>
          </div>
          
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Full Name</p>
                  <p className="text-sm text-gray-600">{user.name || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Email Address</p>
                  <p className="text-sm text-gray-600">{user.email || 'Not provided'}</p>
                </div>
              </div>
              
              {user.department && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Department</p>
                    <p className="text-sm text-gray-600">{user.department}</p>
                  </div>
                </div>
              )}
              
              {user.joinDate && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Joined</p>
                    <p className="text-sm text-gray-600">{formatJoinDate(user.joinDate)}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-800">
                  This is a basic profile page. Profile editing will be implemented in a future update.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 