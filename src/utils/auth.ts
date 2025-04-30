import logger from './logger';

// Safe localStorage helper for SSR compatibility
const safeLocalStorage = {
  clear: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
};

/**
 * Central logout utility to ensure consistent logout behavior across the application
 * @param userId - The ID of the user logging out
 * @param userRole - The role of the user logging out
 * @param component - The component initiating the logout
 */
export function logout(userId: string = '', userRole: string = '', component: string = 'Unknown') {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      logger.warn(component, 'Logout called in server context');
      return false;
    }
    
    // Log the logout action
    logger.auth(component, 'logout', userId, userRole);
    
    // Clear all local storage data safely
    safeLocalStorage.clear();
    
    // Clear auth cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
    
    // Force page reload to clear any cached state and navigate to login page
    window.location.href = '/login';
    
    return true;
  } catch (error) {
    // Log error but still try to redirect
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during logout';
    logger.error(component, 'Error during logout', error);
    
    // Still try to redirect to login page after a delay if we're in a browser
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }
    
    return false;
  }
}

export default {
  logout
}; 