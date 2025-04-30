// This file will handle JWT authentication
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

// JWT secret should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-replace-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

// User interface (to be expanded)
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'field_employee' | 'super_admin' | 'backoffice_admin' | 'applicant';
}

// JWT payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Define user permissions by role
export const ROLE_PERMISSIONS = {
  super_admin: [
    'dashboard.admin.view',
    'users.manage',
    'jobs.manage',
    'blog.manage',
    'applications.manage',
    'expenses.manage',
    'settings.manage',
    'reports.view',
    'client.manage'
  ],
  backoffice_admin: [
    'dashboard.admin.view',
    'jobs.manage',
    'blog.manage',
    'applications.manage',
    'expenses.manage',
    'settings.view',
    'reports.view'
  ],
  field_employee: [
    'dashboard.employee.view',
    'tasks.view',
    'tasks.update',
    'expenses.create',
    'expenses.view_own',
    'client.view'
  ],
  applicant: [
    'dashboard.applicant.view',
    'applications.view_own',
    'applications.create',
    'profile.manage'
  ],
  user: [
    'dashboard.basic.view',
    'profile.manage'
  ],
  admin: [
    'dashboard.admin.view',
    'jobs.manage',
    'blog.manage',
    'applications.manage',
    'settings.view'
  ]
};

// Function to get dashboard route by role
export function getDashboardByRole(role: string): string {
  switch (role) {
    case 'super_admin':
    case 'backoffice_admin':
    case 'admin':
      return '/admin/dashboard';
    case 'field_employee':
      return '/employee/dashboard';
    case 'applicant':
      return '/applicant/dashboard';
    default:
      console.warn(`getDashboardByRole: Unknown role "${role}", defaulting to homepage`);
      return '/';
  }
}

/**
 * Generate a JWT token for authenticated user
 */
export async function generateToken(user: User): Promise<string> {
  // Convert secret to Uint8Array for jose
  const secretKey = new TextEncoder().encode(JWT_SECRET);
  
  // Calculate expiry in seconds
  const expiryInSeconds = getExpiryTime(JWT_EXPIRY);
  
  // Sign with jose
  const token = await new SignJWT({ 
    userId: user.id,
    email: user.email,
    role: user.role
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiryInSeconds)
    .sign(secretKey);
  
  return token;
}

/**
 * Verify a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    // Convert secret to Uint8Array for jose
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    
    // Verify with jose
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Auth middleware function
 */
export function authMiddleware(req: NextRequest) {
  // Extract token from cookies or Authorization header
  const token = req.cookies.get('auth-token')?.value || 
                req.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return null;
}

/**
 * Check if user has required role
 */
export function hasRole(user: User | null, requiredRole: 'user' | 'admin' | 'field_employee' | 'super_admin' | 'backoffice_admin' | 'applicant'): boolean {
  if (!user) return false;
  
  if (requiredRole === 'super_admin') {
    return user.role === 'super_admin';
  }
  
  if (requiredRole === 'backoffice_admin') {
    return user.role === 'super_admin' || user.role === 'backoffice_admin';
  }
  
  if (requiredRole === 'admin') {
    return user.role === 'super_admin' || user.role === 'backoffice_admin' || user.role === 'admin';
  }
  
  if (requiredRole === 'field_employee') {
    return user.role === 'super_admin' || user.role === 'backoffice_admin' || user.role === 'field_employee';
  }
  
  return true; // All authenticated users have access to user/applicant level
}

/**
 * Check if user has specific permission
 */
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  
  // Super admin has all permissions
  if (user.role === 'super_admin') return true;
  
  // Get permissions for the user's role
  const rolePermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];
  
  // Check if the user's role includes the required permission
  return rolePermissions.includes(permission);
}

/**
 * Helper function to convert duration string to seconds from now
 */
function getExpiryTime(duration: string): number {
  const now = Math.floor(Date.now() / 1000);
  
  // Parse the duration string (e.g., '7d', '24h', '30m')
  const unit = duration.slice(-1);
  const value = parseInt(duration.slice(0, -1), 10);
  
  switch (unit) {
    case 'd': // days
      return now + (value * 24 * 60 * 60);
    case 'h': // hours
      return now + (value * 60 * 60);
    case 'm': // minutes
      return now + (value * 60);
    case 's': // seconds
      return now + value;
    default:
      return now + (7 * 24 * 60 * 60); // default 7 days
  }
} 