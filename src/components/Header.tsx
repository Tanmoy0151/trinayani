'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsLoggedIn(true);
          setUserName(parsedUser.name || '');
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth();

    // Add event listener for storage changes to handle login/logout in other tabs
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary-600">Trinayani Medical</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="font-medium text-gray-800 hover:text-primary-600 transition">
              Home
            </Link>
            <Link href="/about" className="font-medium text-gray-800 hover:text-primary-600 transition">
              About
            </Link>
            <Link href="/products" className="font-medium text-gray-800 hover:text-primary-600 transition">
              Products
            </Link>
            <Link href="/services" className="font-medium text-gray-800 hover:text-primary-600 transition">
              Services
            </Link>
            <Link href="/careers" className="font-medium text-gray-800 hover:text-primary-600 transition">
              Careers
            </Link>
            <Link href="/contact" className="font-medium text-gray-800 hover:text-primary-600 transition">
              Contact
            </Link>
            {isLoggedIn ? (
              <Link href="/dashboard" className="font-medium text-primary-600 hover:text-primary-800 transition">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-800 transition">
                Login
              </Link>
            )}
          </nav>

          <div className="md:hidden flex items-center">
            {/* Login/Dashboard Button for Mobile */}
            {isLoggedIn ? (
              <Link 
                href="/dashboard" 
                className="mr-4 font-medium text-primary-600 hover:text-primary-800 transition"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="mr-4 font-medium text-primary-600 hover:text-primary-800 transition"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              type="button" 
              className="text-gray-500 hover:text-gray-700 focus:outline-none" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-3">
            <Link href="/" className="block font-medium text-gray-800 hover:text-primary-600 transition py-2">
              Home
            </Link>
            <Link href="/about" className="block font-medium text-gray-800 hover:text-primary-600 transition py-2">
              About
            </Link>
            <Link href="/products" className="block font-medium text-gray-800 hover:text-primary-600 transition py-2">
              Products
            </Link>
            <Link href="/services" className="block font-medium text-gray-800 hover:text-primary-600 transition py-2">
              Services
            </Link>
            <Link href="/careers" className="block font-medium text-gray-800 hover:text-primary-600 transition py-2">
              Careers
            </Link>
            <Link href="/contact" className="block font-medium text-gray-800 hover:text-primary-600 transition py-2">
              Contact
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 