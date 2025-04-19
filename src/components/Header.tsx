'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
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

    // Add scroll event listener to detect when page is scrolled
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('scroll', handleScroll);
    
    // Call handleScroll once to set initial state
    handleScroll();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/75 backdrop-blur-md shadow-sm border-b border-gray-200/30' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary-600 transition-colors duration-300">Trinayani Medical</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="font-medium text-gray-800 hover:text-primary-600 transition-colors duration-300">
              Home
            </Link>
            <Link href="/about" className="font-medium text-gray-800 hover:text-primary-600 transition-colors duration-300">
              About
            </Link>
            <Link href="/products" className="font-medium text-gray-800 hover:text-primary-600 transition-colors duration-300">
              Products
            </Link>
            <Link href="/services" className="font-medium text-gray-800 hover:text-primary-600 transition-colors duration-300">
              Services
            </Link>
            <Link href="/careers" className="font-medium text-gray-800 hover:text-primary-600 transition-colors duration-300">
              Careers
            </Link>
            <Link href="/contact" className="font-medium text-gray-800 hover:text-primary-600 transition-colors duration-300">
              Contact
            </Link>
            {isLoggedIn ? (
              <Link href="/dashboard" className="font-medium text-primary-600 hover:text-primary-800 transition-colors duration-300">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-800 transition-colors duration-300">
                Login
              </Link>
            )}
          </nav>

          <div className="md:hidden flex items-center">
            {/* Login/Dashboard Button for Mobile */}
            {isLoggedIn ? (
              <Link 
                href="/dashboard" 
                className="mr-4 font-medium text-primary-600 hover:text-primary-800 transition-colors duration-300"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="mr-4 font-medium text-primary-600 hover:text-primary-800 transition-colors duration-300"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              type="button" 
              className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-300" 
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
          <div className="md:hidden mt-4 space-y-2 pb-3 bg-white/95 backdrop-blur-sm rounded-b-lg shadow-lg">
            <Link href="/" className="block font-medium text-gray-800 hover:text-primary-600 transition-colors duration-300 py-2 px-4">
              Home
            </Link>
            <Link href="/about" className="block font-medium text-gray-800 hover:text-primary-600 transition-colors duration-300 py-2 px-4">
              About
            </Link>
            <Link href="/products" className="block font-medium text-gray-800 hover:text-primary-600 transition-colors duration-300 py-2 px-4">
              Products
            </Link>
            <Link href="/services" className="block font-medium text-gray-800 hover:text-primary-600 transition-colors duration-300 py-2 px-4">
              Services
            </Link>
            <Link href="/careers" className="block font-medium text-gray-800 hover:text-primary-600 transition-colors duration-300 py-2 px-4">
              Careers
            </Link>
            <Link href="/contact" className="block font-medium text-gray-800 hover:text-primary-600 transition-colors duration-300 py-2 px-4">
              Contact
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 