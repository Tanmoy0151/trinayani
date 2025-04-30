import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-db';

// This endpoint should be protected or disabled in production
export async function GET(request: NextRequest) {
  // Check for a secret key to prevent unauthorized seeding
  const { searchParams } = new URL(request.url);
  const secretKey = searchParams.get('key');

  // Use environment variable for the secret key
  const validKey = process.env.SEED_DB_SECRET || 'development_seed_key';

  if (secretKey !== validKey) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Run the database seeding function
    const result = await seedDatabase();

    if (result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'Database seeding failed', error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in seed API route:', error);
    return NextResponse.json(
      { message: 'Error seeding database', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 