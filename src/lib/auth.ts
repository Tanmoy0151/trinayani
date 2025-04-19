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
export function hasRole(user: User | null, requiredRole: 'user' | 'admin'): boolean {
  if (!user) return false;
  
  if (requiredRole === 'admin') {
    return user.role === 'admin';
  }
  
  return true; // All authenticated users have 'user' role
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