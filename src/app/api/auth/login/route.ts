import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/data/users';
import { generateToken } from '@/lib/auth';

// Since the users array isn't exported from register route, we'll define it here
// In a real application, this would be a database connection
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
}

const mockUsers: User[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    //const user = mockUsers.find((u: User) => u.email === email);
    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // In a real app, you would compare hashed passwords
    // const passwordMatch = await bcrypt.compare(password, user.password);
    const passwordMatch = password === user.password;

    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Don't return the password
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT token
    const authToken = await generateToken({
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Store user in localStorage via response cookie or client-side handling
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
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 