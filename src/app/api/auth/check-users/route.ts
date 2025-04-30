import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

/**
 * This API route checks for required test users during application startup
 * It will automatically add any missing test users listed in the README
 */
export async function GET(request: NextRequest) {
  // This API would typically be called only on application startup
  // or for testing purposes, but we'll add basic security
  const { searchParams } = new URL(request.url);
  const secretKey = searchParams.get('key');
  
  // Use environment variable for the secret key or fallback to a default for development
  const validKey = process.env.SEED_DB_SECRET || 'development_seed_key';
  
  if (secretKey !== validKey) {
    console.warn('Unauthorized attempt to access check-users API');
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  console.log('Starting check for required test users...');
  
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Test user accounts from README
    const testUsers = [
      {
        email: 'superadmin@trinayanimedical.com',
        password: 'super123',
        firstName: 'Super',
        lastName: 'Admin',
        name: 'Super Admin',
        role: 'super_admin'
      },
      {
        email: 'admin@trinayanimedical.com',
        password: 'admin123',
        firstName: 'Backoffice',
        lastName: 'Admin',
        name: 'Backoffice Admin',
        role: 'backoffice_admin'
      },
      {
        email: 'fieldemployee@example.com',
        password: 'password456',
        firstName: 'Field',
        lastName: 'Employee',
        name: 'Field Employee',
        role: 'field_employee'
      },
      {
        email: 'applicant@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'Applicant',
        name: 'Test Applicant',
        role: 'applicant'
      }
    ];
    
    const results = {
      existing: 0,
      added: 0,
      errors: 0,
      details: [] as string[]
    };
    
    // Check each test user and add if not present
    for (const testUser of testUsers) {
      try {
        // Check if user exists
        const existingUser = await User.findOne({ email: testUser.email.toLowerCase() });
        
        if (existingUser) {
          console.log(`Test user ${testUser.email} already exists, skipping`);
          results.existing++;
          results.details.push(`User ${testUser.email} already exists`);
        } else {
          // Create the user
          const newUser = new User({
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            name: testUser.name,
            email: testUser.email.toLowerCase(),
            password: testUser.password, // In production, would hash this
            role: testUser.role,
            isActive: true,
            isLoginRestricted: false,
            applications: []
          });
          
          await newUser.save();
          console.log(`Added test user: ${testUser.email} with role ${testUser.role}`);
          results.added++;
          results.details.push(`Added user ${testUser.email} with role ${testUser.role}`);
        }
      } catch (userError) {
        console.error(`Error processing test user ${testUser.email}:`, userError);
        results.errors++;
        results.details.push(`Error with user ${testUser.email}: ${userError instanceof Error ? userError.message : 'Unknown error'}`);
      }
    }
    
    // Return summary of operation
    return NextResponse.json({
      message: 'Test user check completed',
      summary: `Found ${results.existing} existing users, added ${results.added} new users, encountered ${results.errors} errors`,
      details: results.details
    });
    
  } catch (error) {
    console.error('Error checking test users:', error);
    return NextResponse.json(
      { message: 'Error checking test users', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 