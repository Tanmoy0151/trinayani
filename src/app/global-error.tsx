'use client';

import { useEffect, useState } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [dots, setDots] = useState('.');

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <html>
      <body>
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
                  Our server is currently unavailable. We're experiencing technical difficulties.
                </p>
                <p className="mb-4 text-yellow-400">
                  Please contact our development team at developer@trinayanimedical.com
                </p>
                
                <div className="mt-6">
                  <button
                    onClick={() => reset()}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 rounded-md transition-colors font-semibold focus:outline-none"
                  >
                    Try Again
                  </button>
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
                  <div className="w-16 h-2 bg-gray-500 mb-2 animate-pulse"></div>
                  <div className="w-16 h-2 bg-gray-500 animate-pulse"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-800 flex items-center justify-center">
                    <div className="relative w-full">
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="w-4 h-4 bg-red-500 rounded-full absolute -left-4 animate-server-error"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-40 h-6 bg-gray-600 mx-auto -mt-1 rounded-b-md flex items-center justify-center">
                  <span className="text-xs text-gray-300">SYSTEM ERROR</span>
                </div>
                
                {/* Smoke effect */}
                <div className="absolute -top-8 left-12 opacity-0 animate-smoke">
                  <div className="w-8 h-8 bg-gray-500 rounded-full opacity-20"></div>
                </div>
                <div className="absolute -top-8 left-16 opacity-0 animate-smoke" style={{ animationDelay: '0.5s' }}>
                  <div className="w-6 h-6 bg-gray-500 rounded-full opacity-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 