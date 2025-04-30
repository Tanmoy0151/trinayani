import { NextRequest, NextResponse } from 'next/server';
import { ExtendedUser, allUsers } from '../mockData';

// Verify if the requesting user is a super admin
function isSuperAdmin(request: NextRequest): boolean {
  // In a real app, you would verify the JWT token and check the user's role
  // For this demo, we'll assume the authorization header contains the user ID
  const userId = request.headers.get('authorization');
  if (!userId) return false;
  
  const user = allUsers.find(u => u.id.toString() === userId && u.role === 'super_admin');
  return !!user;
}

// Handle toggling a user's login restriction
export async function PUT(request: NextRequest) {
  // Check if the user is a super admin
  if (!isSuperAdmin(request)) {
    return NextResponse.json(
      { message: 'Unauthorized. Super Admin access required.' },
      { status: 403 }
    );
  }
  
  try {
    const body = await request.json();
    const { userId, isRestricted } = body;
    
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Find the user
    const userIndex = allUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Prevent restricting the last super admin
    if (allUsers[userIndex].role === 'super_admin') {
      const superAdminCount = allUsers.filter(u => u.role === 'super_admin' && u.isActive).length;
      if (superAdminCount <= 1 && isRestricted) {
        return NextResponse.json(
          { message: "Cannot restrict the last super admin's login" },
          { status: 409 }
        );
      }
    }
    
    // Update the user's restriction status
    allUsers[userIndex].isLoginRestricted = isRestricted;
    
    // Return the updated user without password
    const { password: _, ...userWithoutPassword } = allUsers[userIndex];
    
    return NextResponse.json(
      { 
        message: `User login ${isRestricted ? 'restricted' : 'allowed'} successfully`,
        user: userWithoutPassword 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user login restriction:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 