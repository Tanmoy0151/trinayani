import { NextRequest, NextResponse } from 'next/server';
import { getUserApplications } from '@/data/users';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

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