import { NextRequest, NextResponse } from 'next/server';

export type SubscriberData = {
  email: string;
  createdAt: string;
  status: 'active' | 'unsubscribed';
  source?: string;
};

// Mock database for subscribers
export let subscribers: SubscriberData[] = [];

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, source } = body;

    // Basic validation
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format with a more comprehensive regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = subscribers.find(
      (subscriber) => subscriber.email.toLowerCase() === email.toLowerCase()
    );

    if (existingSubscriber) {
      // If already subscribed but unsubscribed, reactivate
      if (existingSubscriber.status === 'unsubscribed') {
        existingSubscriber.status = 'active';
        return NextResponse.json(
          { 
            success: true, 
            message: 'Your subscription has been reactivated. You will now receive our latest updates!' 
          },
          { status: 200 }
        );
      }
      
      // Already subscribed and active
      return NextResponse.json(
        { 
          success: true, 
          message: 'You are already subscribed to our newsletter. Thank you for your continued support!' 
        },
        { status: 200 }
      );
    }

    // Add new subscriber
    const newSubscriber: SubscriberData = {
      email: email.toLowerCase().trim(),
      createdAt: new Date().toISOString(),
      status: 'active',
      source: source || 'website',
    };

    subscribers.push(newSubscriber);
    
    // In a real application, this would save to a database
    // and potentially send a welcome email
    console.log(`New subscriber added: ${email} from source: ${source || 'website'}`);

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for subscribing to our newsletter! You will receive our latest updates directly to your inbox.' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'We encountered an issue processing your subscription. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // This would typically require admin authentication
  const authHeader = request.headers.get('authorization');
  
  // Simple auth check for demo purposes
  // In a real app, use a proper authentication system
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized access' },
      { status: 401 }
    );
  }
  
  // For demonstration purposes, we're returning subscriber count and status
  return NextResponse.json({ 
    success: true, 
    subscriberCount: subscribers.length,
    activeCount: subscribers.filter(sub => sub.status === 'active').length,
    unsubscribedCount: subscribers.filter(sub => sub.status === 'unsubscribed').length
  });
} 