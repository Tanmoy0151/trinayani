/**
 * Logger utility for consistent logging across the application
 * This helps with debugging and tracking down issues
 */

// Environment configuration
const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Formatted console log with component name prefixed
 */
export function logInfo(component: string, message: string, data?: any) {
  if (isDevelopment) {
    if (data) {
      console.log(`[${component}] ${message}`, data);
    } else {
      console.log(`[${component}] ${message}`);
    }
  }
}

/**
 * Formatted console warning with component name prefixed
 */
export function logWarning(component: string, message: string, data?: any) {
  if (data) {
    console.warn(`[${component}] ⚠️ ${message}`, data);
  } else {
    console.warn(`[${component}] ⚠️ ${message}`);
  }
}

/**
 * Formatted console error with component name prefixed
 */
export function logError(component: string, message: string, error?: any) {
  console.error(`[${component}] ❌ ${message}`);
  if (error) {
    if (error instanceof Error) {
      console.error(`[${component}] Error details:`, {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } else {
      console.error(`[${component}] Error details:`, error);
    }
  }
}

/**
 * Log navigation/routing events
 */
export function logNavigation(component: string, fromPath: string, toPath: string) {
  if (isDevelopment) {
    console.log(`[${component}] Navigation: ${fromPath} → ${toPath}`);
  }
}

/**
 * Log authentication events
 */
export function logAuth(component: string, action: 'login' | 'logout' | 'check' | 'failed', userId?: string, role?: string) {
  const actionMap = {
    login: '🔑 User logged in',
    logout: '🚪 User logged out',
    check: '🔍 Auth check',
    failed: '❌ Auth failed'
  };
  
  const message = actionMap[action];
  const data = { userId, role };
  
  if (action === 'failed') {
    console.warn(`[${component}] ${message}`, data);
  } else if (isDevelopment) {
    console.log(`[${component}] ${message}`, data);
  }
}

/**
 * Log API request events
 */
export function logApiRequest(endpoint: string, method: string, status?: number, error?: any) {
  const statusEmoji = status 
    ? (status >= 200 && status < 300 ? '✅' : '❌') 
    : '🔄';
  
  const message = `${statusEmoji} ${method} ${endpoint}${status ? ` - Status: ${status}` : ''}`;
  
  if (status && (status < 200 || status >= 300)) {
    console.warn(`[API] ${message}`);
    if (error) {
      console.error(`[API] Error details:`, error);
    }
  } else if (isDevelopment) {
    console.log(`[API] ${message}`);
  }
}

export default {
  info: logInfo,
  warn: logWarning,
  error: logError,
  navigation: logNavigation,
  auth: logAuth,
  api: logApiRequest
}; 