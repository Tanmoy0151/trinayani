'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [dots, setDots] = useState('.');
  const [showContact, setShowContact] = useState(false);

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Show contact info after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContact(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-4 text-red-500 animate-pulse">Server Down</h1>
          <div className="relative w-full h-16 mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xl font-semibold ml-2">Attempting to reconnect{dots}</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
            <p className="text-lg mb-4">
              We're experiencing technical difficulties right now. Our server appears to be offline.
            </p>
            <p className="mb-4 text-yellow-400">
              Our development team has been notified and is working on resolving this issue as quickly as possible.
            </p>
            
            <div className={`transition-all duration-500 ease-in-out ${showContact ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
              <div className="my-6 py-4 border-t border-b border-gray-700">
                <h2 className="text-xl font-bold mb-3 text-primary-600">Need immediate assistance?</h2>
                <p className="mb-2">
                  Please contact our development team:
                </p>
                <div className="bg-gray-900 p-3 rounded-md flex items-center mb-4 animate-bounce">
                  <svg className="h-6 w-6 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>developer@trinayanimedical.com</span>
                </div>
                <div className="bg-gray-900 p-3 rounded-md flex items-center animate-bounce">
                  <svg className="h-6 w-6 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+91 9876543210</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <button
                onClick={() => reset()}
                className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 rounded-md transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Try Again
              </button>
              <Link href="/" className="block w-full text-center py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
        
        {/* Animated server icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-40 bg-gray-700 rounded-md border-2 border-gray-600 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></div>
              
              <div className="w-16 h-2 bg-gray-500 mb-2 animate-pulse"></div>
              <div className="w-16 h-2 bg-gray-500 mb-2 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-16 h-2 bg-gray-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-800 flex items-center justify-center">
                <div className="relative w-full">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="w-4 h-4 bg-red-500 rounded-full absolute -left-4 animate-[server-error_3s_ease-in-out_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-40 h-6 bg-gray-600 mx-auto -mt-1 rounded-b-md flex items-center justify-center">
              <span className="text-xs text-gray-300">SYSTEM ERROR</span>
            </div>
            
            {/* Smoke effect */}
            <div className="absolute -top-8 left-12 opacity-0 animate-[smoke_3s_ease-out_infinite]">
              <div className="w-8 h-8 bg-gray-500 rounded-full opacity-20"></div>
            </div>
            <div className="absolute -top-8 left-16 opacity-0 animate-[smoke_3s_ease-out_0.5s_infinite]">
              <div className="w-6 h-6 bg-gray-500 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 