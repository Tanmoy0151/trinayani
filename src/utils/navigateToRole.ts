import { getDashboardByRole } from '@/lib/auth';
import logger from './logger';

// Use a more generic type to avoid import issues
type RouterType = {
  push: (path: string) => void;
  back: () => void;
};

/**
 * Navigate user to the appropriate page based on role
 * This centralizes role-based navigation logic
 */
export function navigateByRole(
  router: RouterType, 
  role: string, 
  fromPath: string = '',
  fallbackPath: string = '/login'
): void {
  if (!role) {
    logger.warn('Navigation', 'No role provided, navigating to fallback path', { fallbackPath });
    router.push(fallbackPath);
    return;
  }

  // Get the appropriate dashboard path based on role
  const targetPath = getDashboardByRole(role);
  
  logger.navigation('Navigation', fromPath, targetPath);
  logger.info('Navigation', `Redirecting user with role "${role}" to ${targetPath}`);
  
  // Redirect to the appropriate dashboard
  router.push(targetPath);
}

/**
 * Check if a role is allowed to access admin pages
 */
export function isAdminRole(role: string): boolean {
  return ['super_admin', 'backoffice_admin', 'admin'].includes(role);
}

export default {
  navigateByRole,
  isAdminRole
}; 