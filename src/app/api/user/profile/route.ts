import { NextRequest, NextResponse } from 'next/server';
import { users, updateUserProfile } from '@/data/users';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, firstName, lastName, email, phone } = body;

    // Basic validation
    if (!userId || !firstName || !lastName || !email) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = users.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Update user profile
    const updatedUser = updateUserProfile(userId, {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      phone,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Return success without exposing the password
    const { password, ...userWithoutPassword } = updatedUser;
    
    return NextResponse.json(
      { 
        message: 'Profile updated successfully',
        user: userWithoutPassword 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 