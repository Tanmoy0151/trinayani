import connectToDatabase from './mongodb';
import mongoose from 'mongoose';

/**
 * Seeds the database with initial data
 * This function can be called from a script or API route
 */
export async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log('Connected to MongoDB');
    
    // Check if User model is available
    if (!mongoose.models.User) {
      // Dynamically import User model to avoid circular dependencies
      await import('@/models/User');
    }
    
    // Check if we already have users
    const User = mongoose.models.User;
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`Database already has ${userCount} users. Skipping user seeding.`);
    } else {
      await seedUsers();
    }
    
    // Check if BlogPost model is available
    if (!mongoose.models.BlogPost) {
      // Dynamically import BlogPost model to avoid circular dependencies
      await import('@/models/BlogPost');
    }
    
    // Check if we already have blog posts
    const BlogPost = mongoose.models.BlogPost;
    const postCount = await BlogPost.countDocuments();
    if (postCount > 0) {
      console.log(`Database already has ${postCount} blog posts. Skipping blog seeding.`);
    } else {
      await seedBlogPosts();
    }
    
    console.log('Database seeding completed successfully!');
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Seeds the users collection with initial data
 */
async function seedUsers() {
  console.log('Seeding users collection...');
  
  try {
    // Dynamically import User model to avoid circular dependencies
    const User = mongoose.models.User;
    
    // Create admin users with plain text passwords for development
    const superAdmin = new User({
      firstName: 'Super',
      lastName: 'Admin',
      name: 'Super Admin',
      email: 'superadmin@trinayanimedical.com',
      password: 'super123',
      role: 'super_admin',
      isActive: true,
      isLoginRestricted: false,
      applications: []
    });
    
    const backofficeAdmin = new User({
      firstName: 'Backoffice',
      lastName: 'Admin',
      name: 'Backoffice Admin',
      email: 'admin@trinayanimedical.com',
      password: 'admin123',
      role: 'backoffice_admin',
      isActive: true,
      isLoginRestricted: false,
      applications: []
    });
    
    // Create field employee
    const fieldEmployee = new User({
      firstName: 'Field',
      lastName: 'Employee',
      name: 'Field Employee',
      email: 'fieldemployee@example.com',
      password: 'password456',
      role: 'field_employee',
      isActive: true,
      isLoginRestricted: false,
      applications: []
    });
    
    // Create applicant
    const applicant = new User({
      firstName: 'Test',
      lastName: 'Applicant',
      name: 'Test Applicant',
      email: 'applicant@example.com',
      password: 'password123',
      role: 'applicant',
      isActive: true,
      isLoginRestricted: false,
      applications: []
    });
    
    // Create regular user
    const regularUser = new User({
      firstName: 'Regular',
      lastName: 'User',
      name: 'Regular User',
      email: 'user@example.com',
      password: 'userpass123',
      role: 'user',
      isActive: true,
      isLoginRestricted: false,
      applications: []
    });
    
    // Save all users
    await Promise.all([
      superAdmin.save(),
      backofficeAdmin.save(),
      fieldEmployee.save(),
      applicant.save(),
      regularUser.save()
    ]);
    
    console.log('Successfully seeded 5 users');
    return true;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

/**
 * Seeds the blog posts collection with initial data
 */
async function seedBlogPosts() {
  console.log('Seeding blog posts collection...');
  
  try {
    // Dynamically import BlogPost model to avoid circular dependencies
    const BlogPost = mongoose.models.BlogPost;
    const User = mongoose.models.User;
    
    // Get super admin user for author reference
    const superAdmin = await User.findOne({ email: 'superadmin@trinayanimedical.com' });
    
    if (!superAdmin) {
      throw new Error('Super Admin user not found. Please seed users first.');
    }
    
    // Create sample blog posts
    const blogPosts = [
      {
        title: 'Welcome to Trinayani Enterprises',
        slug: 'welcome-to-trinayani-enterprises',
        excerpt: 'Learn about our mission and services in the medical equipment industry.',
        content: `
# Welcome to Trinayani Enterprises

We are excited to welcome you to our new website and blog. Trinayani Enterprises is dedicated to providing top-quality medical equipment sales and services to healthcare facilities across the region.

## Our Mission

Our mission is to support healthcare providers with reliable equipment, prompt service, and expert technical support. We understand that medical equipment is critical to patient care, and we are committed to ensuring that your equipment works flawlessly when you need it.

## What We Offer

- Sales of cutting-edge medical equipment
- Maintenance and repair services
- Technical consultations
- Equipment training for healthcare staff

Stay tuned for more blog posts about our services, new products, and industry insights.
        `,
        featuredImage: '/images/blog/welcome.jpg',
        author: superAdmin.name,
        authorId: superAdmin._id,
        category: 'Company News',
        tags: ['Welcome', 'Healthcare', 'Medical Equipment'],
        status: 'published',
        publishedAt: new Date(),
        viewCount: 0
      },
      {
        title: 'Understanding Medical Equipment Maintenance',
        slug: 'understanding-medical-equipment-maintenance',
        excerpt: 'A comprehensive guide to maintaining your medical equipment for optimal performance and longevity.',
        content: `
# Understanding Medical Equipment Maintenance

Regular maintenance of medical equipment is crucial for ensuring patient safety, equipment longevity, and optimal performance. In this guide, we'll discuss best practices for maintaining various types of medical equipment.

## Why Maintenance Matters

1. **Patient Safety**: Properly maintained equipment reduces the risk of malfunctions during critical procedures.
2. **Compliance**: Regular maintenance helps meet regulatory requirements.
3. **Cost Efficiency**: Preventative maintenance is less expensive than emergency repairs.
4. **Equipment Lifespan**: Regular care extends the useful life of expensive medical equipment.

## Maintenance Best Practices

- Follow manufacturer guidelines for maintenance schedules
- Keep detailed maintenance logs
- Train staff on proper equipment usage
- Schedule regular professional inspections

Contact our service team to develop a customized maintenance plan for your facility.
        `,
        featuredImage: '/images/blog/maintenance.jpg',
        author: superAdmin.name,
        authorId: superAdmin._id,
        category: 'Equipment Care',
        tags: ['Maintenance', 'Equipment Care', 'Best Practices'],
        status: 'published',
        publishedAt: new Date(Date.now() - 86400000), // 1 day ago
        viewCount: 0
      },
      {
        title: 'Upcoming Medical Equipment Innovations',
        slug: 'upcoming-medical-equipment-innovations',
        excerpt: 'Explore the latest innovations in medical equipment technology that will shape the future of healthcare.',
        content: `
# Upcoming Medical Equipment Innovations

The medical equipment industry is constantly evolving with new technologies and innovations. Here's a look at some exciting developments on the horizon.

## AI-Powered Diagnostics

Artificial intelligence is revolutionizing diagnostic equipment, enabling faster and more accurate readings of everything from X-rays to blood tests.

## Portable Advanced Imaging

Miniaturization of advanced imaging technologies is making it possible to bring MRI and CT capabilities to remote locations and emergency situations.

## Remote Monitoring Solutions

The latest monitoring equipment allows healthcare providers to track patient vitals remotely, improving care for chronic conditions and reducing hospital readmissions.

## Robotic Surgical Assistants

Advancements in robotics are creating more precise surgical tools that can assist surgeons in complex procedures.

Stay tuned for more updates on these exciting technologies as they become available.
        `,
        featuredImage: '/images/blog/innovation.jpg',
        author: superAdmin.name,
        authorId: superAdmin._id,
        category: 'Technology',
        tags: ['Innovation', 'Future Tech', 'Healthcare Technology'],
        status: 'published',
        publishedAt: new Date(Date.now() - 172800000), // 2 days ago
        viewCount: 0
      }
    ];
    
    // Save all blog posts
    await BlogPost.insertMany(blogPosts);
    
    console.log(`Successfully seeded ${blogPosts.length} blog posts`);
    return true;
  } catch (error) {
    console.error('Error seeding blog posts:', error);
    throw error;
  }
} 