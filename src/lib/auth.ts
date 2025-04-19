// This file will handle JWT authentication
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

// JWT secret should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-replace-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

// User interface (to be expanded)
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

// JWT payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token for authenticated user
 */
export function generateToken(user: User): string {
  // Explicitly cast the secret to avoid TypeScript errors
  const secret = JWT_SECRET as string;
  
  return jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      role: user.role
    },
    secret,
    { expiresIn: JWT_EXPIRY }
  );
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    // Explicitly cast the secret to avoid TypeScript errors
    const secret = JWT_SECRET as string;
    return jwt.verify(token, secret) as JWTPayload;
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
export function hasRole(user: User | null, requiredRole: 'user' | 'admin'): boolean {
  if (!user) return false;
  
  if (requiredRole === 'admin') {
    return user.role === 'admin';
  }
  
  return true; // All authenticated users have 'user' role
} 