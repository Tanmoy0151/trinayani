import { NextRequest, NextResponse } from 'next/server';
import { users, findUserByEmail, User } from '@/data/users';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // In a real application, you would hash the password before storing
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (in a real app, this would be a database insert)
    const newUser = {
      id: parseInt(Date.now().toString()),
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      password, // In a real app, store hashedPassword instead
      role: 'user' as const, // Explicitly typed as 'user'
      createdAt: new Date().toISOString(),
      applications: [],
      isActive: true,
      isLoginRestricted: false
    };

    // Add to our users array
    users.push(newUser);

    // Return success without exposing the password
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json(
      { 
        message: 'Registration successful',
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 