import { NextRequest, NextResponse } from 'next/server';
import jobOpenings, { addJobPosting, updateJobPosting, getJobById } from '@/data/job-openings';

// GET - Retrieve all job postings or a specific job by ID
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const jobId = url.searchParams.get('id');
    
    // If an ID is provided, return that specific job
    if (jobId) {
      const id = parseInt(jobId, 10);
      const job = getJobById(id);
      
      if (!job) {
        return NextResponse.json(
          { message: 'Job not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, job });
    }
    
    // Otherwise return all jobs
    return NextResponse.json({ 
      success: true, 
      jobs: jobOpenings 
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST - Create a new job posting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'department', 'location', 'type', 'experience', 'description'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Ensure requirements and responsibilities are arrays
    if (!Array.isArray(body.requirements) || !Array.isArray(body.responsibilities)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Requirements and responsibilities must be arrays' 
        },
        { status: 400 }
      );
    }
    
    // Add isActive field if not provided
    const jobData = {
      ...body,
      isActive: body.isActive !== undefined ? body.isActive : true
    };
    
    // Add the job
    const newJob = addJobPosting(jobData);
    
    return NextResponse.json(
      { success: true, job: newJob },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create job' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing job posting
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Job ID is required
    if (!body.id) {
      return NextResponse.json(
        { success: false, message: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    // Update the job
    const updatedJob = updateJobPosting(body.id, body);
    
    if (!updatedJob) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update job' },
      { status: 500 }
    );
  }
} 