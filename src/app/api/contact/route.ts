import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'message'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    await connectToDatabase();
    
    // Create new contact submission
    const contactSubmission = new Contact({
      name: body.name,
      email: body.email,
      phone: body.phone,
      subject: body.subject || 'Contact Form Submission',
      message: body.message,
      status: 'new'
    });
    
    // Save to database
    await contactSubmission.save();
    
    // In a real application, you would also:
    // 1. Send an email notification to admins
    // 2. Send a confirmation email to the user
    
    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { message: 'Error processing contact form' },
      { status: 500 }
    );
  }
}

// Get all contact submissions (admin only)
export async function GET(request: NextRequest) {
  try {
    // Authentication check would go here
    // For now, this is a simplified example
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;
    
    await connectToDatabase();
    
    // Build query based on filters
    const query: any = {};
    if (status) query.status = status;
    
    // Get total count for pagination
    const total = await Contact.countDocuments(query);
    
    // Get contact submissions with pagination
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      contacts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { message: 'Error fetching contact submissions' },
      { status: 500 }
    );
  }
}

// Update a contact submission status (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Authentication check would go here
    // For now, this is a simplified example
    
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { message: 'Contact submission ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find and update the contact submission
    const contact = await Contact.findByIdAndUpdate(
      body.id,
      { $set: { status: body.status } },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return NextResponse.json(
        { message: 'Contact submission not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Contact submission updated successfully',
      contact
    });
  } catch (error) {
    console.error('Error updating contact submission:', error);
    return NextResponse.json(
      { message: 'Error updating contact submission' },
      { status: 500 }
    );
  }
} 