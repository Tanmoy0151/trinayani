'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Settings, User, LayoutDashboard, AlertTriangle } from 'lucide-react';
import logger from '@/utils/logger';
import { navigateByRole } from '@/utils/navigateToRole';
import { logout } from '@/utils/auth';

// Add a safe localStorage helper for SSR compatibility
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
  clear: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
};

// Update the login check function to use our safe helper
const checkIfUserLoggedIn = (): boolean => {
  const userData = safeLocalStorage.getItem('user');
  return !!userData;
};

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Initialize to false for both server and client - will be updated in useEffect
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileProfileMenuRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const mobileAvatarButtonRef = useRef<HTMLButtonElement>(null);
  // Add a flag to track if component is mounted
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted state to true
    setIsMounted(true);
    
    // Immediately check login status on mount and pathname changes
    const checkAuth = () => {
      const userData = safeLocalStorage.getItem('user');
      
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (!isLoggedIn) {
            console.log('Header: Setting user as logged in', { 
              name: parsedUser.name || 'Unknown',
              role: parsedUser.role || 'Unknown'
            });
          }
          
          setIsLoggedIn(true);
          setUserName(parsedUser.name || '');
          setUserRole(parsedUser.role || '');
          setUserId(parsedUser.id ? String(parsedUser.id) : '');
          setLogoutError(null);
          
        } catch (error) {
          console.error('Header: Error parsing user data:', error);
          setIsLoggedIn(false);
        }
      } else {
        if (isLoggedIn) {
          console.log('Header: User is not logged in, updating state');
        }
        setIsLoggedIn(false);
        setUserName('');
        setUserRole('');
        setUserId('');
      }
    };

    // Run on mount and when pathname changes
    checkAuth();
    
    // Add event listener for storage changes to handle login/logout in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        console.log('Header: Local storage changed for user data, updating state');
        checkAuth();
      }
    };

    // Add scroll event listener to detect when page is scrolled
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Improved click outside handler to handle both desktop and mobile menus
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both desktop and mobile profile menus
      const isOutsideDesktopMenu = profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node);
      const isOutsideMobileMenu = mobileProfileMenuRef.current && !mobileProfileMenuRef.current.contains(event.target as Node);
      
      // Only close if clicking outside of both menus
      if ((isOutsideDesktopMenu || !profileMenuRef.current) && 
          (isOutsideMobileMenu || !mobileProfileMenuRef.current)) {
        setIsProfileMenuOpen(false);
      }
    };

    // Only add browser event listeners if in browser environment
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('scroll', handleScroll);
      document.addEventListener('mousedown', handleClickOutside);
      
      // Call handleScroll once to set initial state
      handleScroll();
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    
    return undefined;
  }, [pathname, isLoggedIn]);

  // Add a stop propagation to prevent menu closing immediately
  const toggleProfileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Update the handleLogout function to stop propagation and handle SSR
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Verify we're in a browser environment
    if (typeof window === 'undefined') {
      console.warn('Header: Logout attempted in server environment');
      return;
    }
    
    try {
      // Use the central logout utility
      const success = logout(userId, userRole, 'Header');
      
      // Update local state if needed, but window.location redirect in the utility
      // will reload the page, so these state updates won't be visible
      if (success) {
        setIsLoggedIn(false);
        setUserName('');
        setUserRole('');
        setUserId('');
        setIsProfileMenuOpen(false);
      }
    } catch (error) {
      // This shouldn't happen since the utility handles errors, but just in case
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during logout';
      logger.error('Header', 'Error during logout', error);
      setLogoutError(errorMessage);
    }
  };

  // Update handleNavigateToDashboard to stop propagation
  const handleNavigateToDashboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close menu before navigation
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    
    // Navigate to the appropriate dashboard based on user role
    navigateByRole(router, userRole, pathname || '');
  };

  // Add a profile link click handler to prevent default and stop propagation
  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    router.push('/profile');
  };

  // Add a settings link click handler to prevent default and stop propagation
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
    router.push('/settings');
  };

  // Add debugging function to check header state
  const debugHeaderState = () => {
    console.log('Header state:', {
      isLoggedIn,
      userName,
      userRole,
      userId,
      isProfileMenuOpen
    });
  };

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
          <nav className="hidden md:flex space-x-8 items-center">
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
            {/* Only show auth-related UI after component is mounted to avoid hydration mismatch */}
            {isMounted && (
              <>
                {isLoggedIn ? (
                  <div className="relative z-50" ref={profileMenuRef}>
                    <button
                      ref={avatarButtonRef}
                      onClick={(e) => {
                        toggleProfileMenu(e);
                        debugHeaderState();
                      }}
                      className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors duration-300 focus:outline-none"
                      title={userName || 'User Profile'}
                      aria-expanded={isProfileMenuOpen}
                      aria-haspopup="true"
                    >
                      {userName ? (
                        <span className="text-primary-700 font-medium">
                          {userName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </span>
                      ) : (
                        <User size={20} />
                      )}
                    </button>
                    
                    {isProfileMenuOpen && (
                      <div 
                        className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu"
                        onClick={(e) => e.stopPropagation()} // Stop propagation on menu to prevent closing
                      >
                        <div className="py-2 px-4 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{userName}</p>
                          <p className="text-xs text-gray-500">{userRole?.replace('_', ' ')}</p>
                        </div>
                        
                        {logoutError && (
                          <div className="px-4 py-2 bg-red-50 text-xs text-red-600 flex items-center">
                            <AlertTriangle size={12} className="mr-1" />
                            <span>{logoutError}</span>
                          </div>
                        )}
                        
                        <div className="py-1">
                          <button
                            onClick={handleNavigateToDashboard}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </button>
                          <button
                            onClick={handleProfileClick}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </button>
                          <button
                            onClick={handleSettingsClick}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </button>
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="font-medium text-primary-600 hover:text-primary-800 transition-colors duration-300">
                    Login
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="md:hidden flex items-center">
            {/* Login/Dashboard Button for Mobile */}
            {isMounted && (
              <>
                {isLoggedIn ? (
                  <div className="relative z-50 mr-4" ref={mobileProfileMenuRef}>
                    <button
                      ref={mobileAvatarButtonRef}
                      onClick={(e) => {
                        toggleProfileMenu(e);
                        debugHeaderState();
                      }}
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors duration-300"
                      title={userName || 'User Profile'}
                      aria-expanded={isProfileMenuOpen}
                      aria-haspopup="true"
                    >
                      {userName ? (
                        <span className="text-primary-700 font-medium text-xs">
                          {userName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </span>
                      ) : (
                        <User size={16} />
                      )}
                    </button>
                    
                    {isProfileMenuOpen && (
                      <div 
                        className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-mobile"
                        onClick={(e) => e.stopPropagation()} // Stop propagation on menu container
                      >
                        <div className="py-2 px-4 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{userName}</p>
                          <p className="text-xs text-gray-500">{userRole?.replace('_', ' ')}</p>
                        </div>
                        
                        {logoutError && (
                          <div className="px-4 py-2 bg-red-50 text-xs text-red-600 flex items-center">
                            <AlertTriangle size={12} className="mr-1" />
                            <span>{logoutError}</span>
                          </div>
                        )}
                        
                        <div className="py-1">
                          <button
                            onClick={handleNavigateToDashboard}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </button>
                          <button
                            onClick={handleProfileClick}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </button>
                          <button
                            onClick={handleSettingsClick}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </button>
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            role="menuitem"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    className="mr-4 font-medium text-primary-600 hover:text-primary-800 transition-colors duration-300"
                  >
                    Login
                  </Link>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button 
              type="button" 
              className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-300" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
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
          <div 
            className="md:hidden mt-4 space-y-2 pb-3 bg-white/95 backdrop-blur-sm rounded-b-lg shadow-lg"
            id="mobile-menu"
          >
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