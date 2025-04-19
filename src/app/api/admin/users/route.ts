import { NextRequest, NextResponse } from 'next/server';
import { ExtendedUser, allUsers } from './mockData';

// Verify if the requesting user is a super admin
function isSuperAdmin(request: NextRequest): boolean {
  // In a real app, you would verify the JWT token and check the user's role
  // For this demo, we'll assume the authorization header contains the user ID
  const userId = request.headers.get('authorization');
  if (!userId) return false;
  
  const user = allUsers.find(u => u.id.toString() === userId && u.role === 'super_admin');
  return !!user;
}

export async function GET(request: NextRequest) {
  // Check if the user is a super admin
  if (!isSuperAdmin(request)) {
    return NextResponse.json(
      { message: 'Unauthorized. Super Admin access required.' },
      { status: 403 }
    );
  }
  
  // Optional filtering by role
  const { searchParams } = new URL(request.url);
  const roleFilter = searchParams.get('role');
  const userId = searchParams.get('id');
  
  // If a specific user ID is requested
  if (userId) {
    const user = allUsers.find(u => u.id.toString() === userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  }
  
  // Otherwise return filtered users
  let filteredUsers = [...allUsers];
  
  if (roleFilter) {
    filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
  }
  
  // Return users without passwords
  const sanitizedUsers = filteredUsers.map(({ password, ...user }) => user);
  
  return NextResponse.json({ users: sanitizedUsers }, { status: 200 });
}

export async function POST(request: NextRequest) {
  // Check if the user is a super admin
  if (!isSuperAdmin(request)) {
    return NextResponse.json(
      { message: 'Unauthorized. Super Admin access required.' },
      { status: 403 }
    );
  }
  
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, role, phone } = body;
    
    // Basic validation
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingUser = allUsers.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: 409 }
      );
    }
    
    // Create new user
    const newUser: ExtendedUser = {
      id: allUsers.length + 1,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      password, // In a real app, this would be hashed
      phone,
      role,
      createdAt: new Date().toISOString(),
      applications: [],
      isActive: true,
      isLoginRestricted: false
    };
    
    allUsers.push(newUser);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const { id, firstName, lastName, email, role, isActive } = body;
    
    // Find the user
    const userIndex = allUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update user
    if (firstName) allUsers[userIndex].firstName = firstName;
    if (lastName) allUsers[userIndex].lastName = lastName;
    if (firstName || lastName) allUsers[userIndex].name = `${allUsers[userIndex].firstName} ${allUsers[userIndex].lastName}`;
    if (email) allUsers[userIndex].email = email;
    if (role) allUsers[userIndex].role = role;
    if (isActive !== undefined) allUsers[userIndex].isActive = isActive;
    
    // Return updated user without password
    const { password: _, ...userWithoutPassword } = allUsers[userIndex];
    
    return NextResponse.json(
      { message: 'User updated successfully', user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Check if the user is a super admin
  if (!isSuperAdmin(request)) {
    return NextResponse.json(
      { message: 'Unauthorized. Super Admin access required.' },
      { status: 403 }
    );
  }
  
  // Get the user ID from the URL
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');
  
  if (!userId) {
    return NextResponse.json(
      { message: 'User ID is required' },
      { status: 400 }
    );
  }
  
  // Find the user
  const userIndex = allUsers.findIndex(u => u.id.toString() === userId);
  if (userIndex === -1) {
    return NextResponse.json(
      { message: 'User not found' },
      { status: 404 }
    );
  }
  
  // Prevent deleting the last super admin
  if (allUsers[userIndex].role === 'super_admin') {
    const superAdminCount = allUsers.filter(u => u.role === 'super_admin').length;
    if (superAdminCount <= 1) {
      return NextResponse.json(
        { message: 'Cannot delete the last super admin' },
        { status: 409 }
      );
    }
  }
  
  // In a real application, you would soft delete the user or add them to an archive
  // For this demo, we'll just set isActive to false
  allUsers[userIndex].isActive = false;
  
  return NextResponse.json(
    { message: 'User deactivated successfully' },
    { status: 200 }
  );
} 