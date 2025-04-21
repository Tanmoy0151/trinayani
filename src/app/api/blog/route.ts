import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// In a real application, this would connect to a database
// For this demo, we'll store blog posts in memory
let blogPosts: any[] = [];

// Helper function to check if the user is an admin
async function isAdmin(request: Request) {
  const authToken = request.headers.get('Authorization')?.split('Bearer ')[1];
  
  if (!authToken) {
    return false;
  }
  
  try {
    const payload = await verifyToken(authToken);
    // Check for all admin roles, not just 'admin'
    return payload?.role === 'admin' || payload?.role === 'super_admin' || payload?.role === 'backoffice_admin';
  } catch (error) {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    // Get the blog posts (in a real app, these would come from a database)
    const { default: posts } = await import('@/data/blog-posts');
    
    // Parse URL to get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured');
    
    let filteredPosts = [...posts];
    
    // Filter by ID if provided
    if (id) {
      filteredPosts = filteredPosts.filter(post => post.id.toString() === id);
    }
    
    // Filter by slug if provided
    if (slug) {
      filteredPosts = filteredPosts.filter(post => post.slug === slug);
    }
    
    // Filter by category if provided
    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }
    
    // Filter by tag if provided
    if (tag) {
      filteredPosts = filteredPosts.filter(post => post.tags.includes(tag));
    }
    
    // Filter featured posts if requested
    if (featured === 'true') {
      filteredPosts = filteredPosts.filter(post => post.featured);
    }
    
    return NextResponse.json({ success: true, posts: filteredPosts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check if user is admin
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'slug', 'excerpt', 'content', 'category', 'authorId'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Check if slug is unique
    const { default: posts } = await import('@/data/blog-posts');
    const slugExists = posts.some((post: any) => post.slug === data.slug);
    
    if (slugExists) {
      return NextResponse.json(
        { success: false, error: 'Blog post with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Create new blog post (in a real app, you would save to database)
    const newPost = {
      id: Date.now(),
      ...data,
      publishedAt: new Date().toISOString(),
      readTime: Math.ceil(data.content.length / 1000), // Estimate based on content length
    };
    
    // In a real app, you would add to database
    blogPosts.push(newPost);
    
    return NextResponse.json(
      { success: true, post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Check if user is admin
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Validate required field
    if (!data.id) {
      return NextResponse.json(
        { success: false, error: 'Missing post ID' },
        { status: 400 }
      );
    }
    
    // In a real app, you would update in database
    // Here we're just updating our local array for demo purposes
    const postIndex = blogPosts.findIndex(post => post.id === parseInt(data.id));
    
    if (postIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Update the post
    blogPosts[postIndex] = {
      ...blogPosts[postIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(
      { success: true, post: blogPosts[postIndex] }
    );
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Check if user is admin
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the post ID from URL params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing post ID' },
        { status: 400 }
      );
    }
    
    // In a real app, you would delete from database
    // Here we're just updating our local array for demo purposes
    const initialLength = blogPosts.length;
    blogPosts = blogPosts.filter(post => post.id !== parseInt(id));
    
    if (blogPosts.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Blog post deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
} 