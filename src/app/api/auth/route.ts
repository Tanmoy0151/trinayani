import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/data/users';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = findUserByEmail(email);

    // Check if user exists and password matches
    // In a real app, you would use bcrypt to compare hashed passwords
    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create a session object (in a real app, this would be a JWT token)
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: session
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 