import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import * as bcrypt from 'bcrypt';

// Since the users array isn't exported from register route, we'll define it here
// In a real application, this would be a database connection
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  isLoginRestricted: boolean;
}

const mockUsers: User[] = [];

export async function POST(request: NextRequest) {
  console.log('API: Login request received');
  try {
    const body = await request.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      console.warn('API: Login attempt with missing email or password');
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log(`API: Attempting to find user with email: ${email}`);
    
    // Connect to MongoDB and find user
    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.warn(`API: Login failed - user not found with email: ${email}`);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user's login is restricted
    if (user.isLoginRestricted) {
      console.warn(`API: Login rejected - restricted account for user: ${user.id}`);
      return NextResponse.json(
        { message: 'Your account has been restricted. Please contact an administrator.' },
        { status: 403 }
      );
    }

    // Compare password
    // In a real app with proper setup, passwords would be hashed
    // For now, comparing directly as our schema doesn't have hashed passwords yet
    let passwordMatch;
    try {
      // First try with bcrypt if it's available
      passwordMatch = await bcrypt.compare(password, user.password);
    } catch (error) {
      // Fallback to direct comparison if bcrypt fails (e.g., not installed or password not hashed)
      passwordMatch = password === user.password;
    }

    if (!passwordMatch) {
      console.warn(`API: Login failed - invalid password for user: ${user.id}`);
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Don't return the password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    console.log(`API: Login successful for user: ${user.id}, role: ${user.role}`);
    
    try {
      // Generate JWT token with correct role mapping
      const authToken = await generateToken({
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      });

      // Return the response with user data and token
      const response = NextResponse.json(
        {
          message: 'Login successful',
          user: userWithoutPassword
        },
        { status: 200 }
      );

      // Set cookie with JWT token
      response.cookies.set('auth-token', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return response;
    } catch (tokenError) {
      console.error('API: Error generating auth token:', tokenError);
      return NextResponse.json(
        { message: 'Authentication failed. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API: Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 