import { NextRequest, NextResponse } from 'next/server';
import { getUserApplications, users, additionalApplications, updateApplicationStatus } from '@/data/users';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const role = url.searchParams.get('role') || '';
    const isAdmin = ['super_admin', 'backoffice_admin', 'admin'].includes(role);

    // Special case for admin - return all applications
    if (isAdmin) {
      // Gather all applications from users
      const allUserApplications = users.flatMap(user => 
        user.applications.map(app => ({
          ...app,
          userName: user.name
        }))
      );
      
      // Combine with additional applications
      const allApplications = [
        ...allUserApplications,
        ...additionalApplications.map(app => {
          // Find user name for additional applications if possible
          const user = users.find(u => u.id === app.userId);
          return {
            ...app,
            userName: user ? user.name : 'Unknown User'
          };
        })
      ];
      
      return NextResponse.json(
        { 
          success: true,
          applications: allApplications 
        },
        { status: 200 }
      );
    }

    // Regular user case - validate userId
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    const applications = getUserApplications(parseInt(userId, 10));

    return NextResponse.json(
      { 
        success: true,
        applications 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch applications'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { message: 'Application ID and status are required' },
        { status: 400 }
      );
    }

    const updatedApplication = updateApplicationStatus(id, status, notes);

    if (!updatedApplication) {
      return NextResponse.json(
        { message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        application: updatedApplication 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update application'
      },
      { status: 500 }
    );
  }
}