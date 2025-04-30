import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/data/users';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, currentPassword, newPassword } = body;

    // Basic validation
    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Find the user
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password (in a real app, you would use bcrypt.compare)
    if (users[userIndex].password !== currentPassword) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Update password (in a real app, you would hash the new password)
    users[userIndex].password = newPassword;

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}