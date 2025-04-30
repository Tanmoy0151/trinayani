import { NextResponse } from 'next/server';
import { users, findUserByEmail } from '@/data/users';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if password is strong enough (in a real app, enforce stronger rules)
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create new user (in a real app, password would be hashed)
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password, // In a real app, this would be hashed with bcrypt
      role: 'user', // Default role for new users
      createdAt: new Date().toISOString(),
      applications: []
    };

    // Add user to our "database"
    users.push(newUser);

    // Return success without password
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 