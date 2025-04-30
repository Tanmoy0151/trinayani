import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Check if user is an admin
const isAdmin = (role: string) => {
  return role === 'admin' || role === 'super_admin' || role === 'backoffice_admin';
};

// Get all blog posts (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    await connectToDatabase();
    
    // Build query based on filters
    const query: any = { status: 'published' };
    if (category) query.category = category;
    if (tag) query.tags = tag;
    
    // Get total count for pagination
    const total = await BlogPost.countDocuments(query);
    
    // Get posts with pagination
    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title slug excerpt featuredImage author category tags publishedAt');
    
    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { message: 'Error fetching blog posts' },
      { status: 500 }
    );
  }
}

// Create a new blog post (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication and authorization
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!isAdmin(session.user.role as string)) {
      return NextResponse.json(
        { message: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'excerpt', 'content', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Create slug from title
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
    
    // Add author info from session
    body.author = session.user.name;
    body.authorId = session.user.id;
    
    // Set status and publish date if published
    if (body.status === 'published' && !body.publishedAt) {
      body.publishedAt = new Date();
    }
    
    await connectToDatabase();
    
    // Check if slug is unique
    const existingSlug = await BlogPost.findOne({ slug: body.slug });
    if (existingSlug) {
      return NextResponse.json(
        { message: 'A post with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Create the blog post
    const newPost = new BlogPost(body);
    await newPost.save();
    
    return NextResponse.json(
      { message: 'Blog post created successfully', post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { message: 'Error creating blog post' },
      { status: 500 }
    );
  }
}

// Update a blog post (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication and authorization
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!isAdmin(session.user.role as string)) {
      return NextResponse.json(
        { message: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { message: 'Blog post ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find the blog post
    const post = await BlogPost.findById(body.id);
    
    if (!post) {
      return NextResponse.json(
        { message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Update slug if title changed and slug not explicitly provided
    if (body.title && body.title !== post.title && !body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
    
    // If status is changing to published, set publish date
    if (body.status === 'published' && post.status !== 'published') {
      body.publishedAt = new Date();
    }
    
    // Update the blog post
    const updatedPost = await BlogPost.findByIdAndUpdate(
      body.id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(
      { message: 'Blog post updated successfully', post: updatedPost }
    );
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { message: 'Error updating blog post' },
      { status: 500 }
    );
  }
}

// Delete a blog post (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication and authorization
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!isAdmin(session.user.role as string)) {
      return NextResponse.json(
        { message: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { message: 'Blog post ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find and delete the blog post
    const post = await BlogPost.findByIdAndDelete(id);
    
    if (!post) {
      return NextResponse.json(
        { message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Blog post deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { message: 'Error deleting blog post' },
      { status: 500 }
    );
  }
} 