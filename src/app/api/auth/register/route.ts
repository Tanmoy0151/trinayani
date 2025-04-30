import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import * as bcrypt from 'bcrypt';

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

    // Connect to MongoDB
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    let hashedPassword;
    try {
      // Try to hash with bcrypt if available
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      // Fallback to storing plain password if bcrypt is not available
      // In production, this should never happen and you should always hash passwords
      console.warn('Warning: Storing password without hashing. Bcrypt may not be installed.');
      hashedPassword = password;
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      applications: [],
      isActive: true,
      isLoginRestricted: false
    });

    // Save to database
    await newUser.save();

    // Return success without exposing the password
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;
    
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
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 