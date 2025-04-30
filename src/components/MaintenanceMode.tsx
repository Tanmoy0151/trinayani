'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface MaintenanceModeProps {
  plannedEndTime?: string; // ISO string for when maintenance is planned to end
  message?: string; // Custom message to display
}

const MaintenanceMode: React.FC<MaintenanceModeProps> = ({ 
  plannedEndTime, 
  message = "Our system is currently undergoing scheduled maintenance." 
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [dots, setDots] = useState('.');

  // Calculate time remaining until maintenance ends
  useEffect(() => {
    if (!plannedEndTime) return;
    
    const calculateTimeRemaining = () => {
      const endTime = new Date(plannedEndTime).getTime();
      const now = new Date().getTime();
      const distance = endTime - now;
      
      if (distance < 0) {
        setTimeRemaining("Maintenance should be complete soon");
        return;
      }
      
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };
    
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [plannedEndTime]);

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-600 mb-4">Maintenance in Progress</h1>
            
            {/* Animated tools */}
            <div className="flex justify-center items-center space-x-4 my-6">
              <div className="animate-bounce delay-100">
                <svg className="h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="animate-spin">
                <svg className="h-10 w-10 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
            </div>
            
            <p className="text-lg text-gray-600 mb-4">{message}</p>
            
            <div className="flex items-center justify-center mb-4">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-primary-600 font-medium">Working on it{dots}</span>
            </div>
            
            {timeRemaining && (
              <div className="mb-6 p-3 bg-primary-50 text-primary-800 rounded-lg border border-primary-200">
                <span className="font-semibold">Estimated time remaining:</span> {timeRemaining}
              </div>
            )}
            
            <div className="mt-8 space-y-4">
              <button 
                onClick={() => window.location.reload()} 
                className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors font-medium"
              >
                Refresh Page
              </button>
              <Link href="https://status.trinayanimedical.com" className="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors font-medium text-center">
                Check System Status
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            If you need immediate assistance, please contact us at{' '}
            <a href="mailto:support@trinayanimedical.com" className="text-primary-600 font-medium">
              support@trinayanimedical.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode; 