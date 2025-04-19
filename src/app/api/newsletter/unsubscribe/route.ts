import { NextRequest, NextResponse } from 'next/server';
import { subscribers, SubscriberData } from '../subscribe/route';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, reason } = body;

    // Basic validation
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find the subscriber
    const subscriberIndex = subscribers.findIndex(
      (subscriber: SubscriberData) => subscriber.email.toLowerCase() === email.toLowerCase()
    );

    if (subscriberIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email not found in our subscription list'
        },
        { status: 404 }
      );
    }

    // Update subscriber status to unsubscribed
    subscribers[subscriberIndex].status = 'unsubscribed';
    
    // If a reason was provided, we could store this for analytics
    if (reason) {
      console.log(`Unsubscribe reason for ${email}: ${reason}`);
    }

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'You have been successfully unsubscribed from our newsletter.'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'We encountered an issue processing your unsubscribe request. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// GET handler for unsubscribe page verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  // In a real app, you would verify the token matches what was sent to the user
  // This is just a simple demo that checks if email exists
  
  if (!email) {
    return NextResponse.json(
      { success: false, message: 'Email parameter is required' },
      { status: 400 }
    );
  }
  
  const subscriber = subscribers.find(
    (sub: SubscriberData) => sub.email.toLowerCase() === email.toLowerCase()
  );
  
  if (!subscriber) {
    return NextResponse.json(
      { success: false, message: 'Email not found' },
      { status: 404 }
    );
  }
  
  // Check if already unsubscribed
  if (subscriber.status === 'unsubscribed') {
    return NextResponse.json(
      { success: true, message: 'You are already unsubscribed' },
      { status: 200 }
    );
  }
  
  return NextResponse.json(
    { success: true, email },
    { status: 200 }
  );
} 