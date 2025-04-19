import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/admin',
];

// Define admin-only routes
const adminRoutes = [
  '/admin',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the requested path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if the requested path is an admin route
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isProtectedRoute) {
    try {
      // Get the auth token from cookies
      const authToken = request.cookies.get('auth-token')?.value;
      
      // If no token exists, redirect to login
      if (!authToken) {
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
      }
      
      // Verify the token
      const payload = await verifyToken(authToken);
      
      // If token is invalid, redirect to login
      if (!payload) {
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
      }
      
      // For admin routes, check if user has admin role
      if (isAdminRoute && payload.role !== 'admin') {
        // Redirect non-admin users to unauthorized page
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      console.error("Middleware error:", error);
      // On error, redirect to login
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all protected and admin routes
    ...protectedRoutes.map(route => `${route}/:path*`),
    // Add other routes that need middleware here
    '/api/:path*',
  ],
}; 