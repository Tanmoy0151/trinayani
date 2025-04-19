import { NextResponse } from 'next/server';

// In a real application, this would connect to a database
const subscribers: { email: string; timestamp: string }[] = [];

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Basic validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const isExisting = subscribers.some(
      (subscriber) => subscriber.email.toLowerCase() === email.toLowerCase()
    );

    if (isExisting) {
      return NextResponse.json(
        { message: 'You are already subscribed to our newsletter' },
        { status: 200 }
      );
    }

    // Store new subscriber (in a real app, this would be a database operation)
    subscribers.push({
      email,
      timestamp: new Date().toISOString(),
    });

    // For debugging purposes - view all subscribers in the console
    console.log('Current subscribers:', subscribers);

    return NextResponse.json(
      { message: 'Successfully subscribed to the newsletter' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription request' },
      { status: 500 }
    );
  }
}

// For development/testing - allow retrieving the number of subscribers
export async function GET() {
  return NextResponse.json(
    { subscriberCount: subscribers.length },
    { status: 200 }
  );
} 