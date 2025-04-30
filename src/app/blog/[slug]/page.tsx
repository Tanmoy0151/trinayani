import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlogCard from '@/components/BlogCard';
import blogPosts, { BLOG_CATEGORIES, BlogPost } from '@/data/blog-posts';
import NewsletterSignup from '@/components/NewsletterSignup';

// Add generateMetadata function for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const post = blogPosts.find(post => post.slug === params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags
    }
  };
}

// Convert to server component and use async/await pattern
export default async function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // Find the post from our data
  const post = blogPosts.find(post => post.slug === params.slug);
  
  // If post doesn't exist, show 404
  if (!post) {
    notFound();
  }
  
  // Get related posts
  const relatedPosts = blogPosts
    .filter(p => 
      p.id !== post.id && (
        p.category === post.category ||
        p.tags.some(tag => post.tags.includes(tag))
      )
    )
    .sort(() => 0.5 - Math.random()) // Shuffle
    .slice(0, 3); // Get 3 random related posts
  
  // Format date for display (manual implementation)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };
  
  const formattedDate = formatDate(post.publishedAt);
  
  // Simple function to convert markdown-like content to HTML paragraphs and headers
  const renderContent = (content: string) => {
    // Split content by line breaks
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    return lines.map((line, index) => {
      // Handle headers (# Header)
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold my-6">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold my-5">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold my-4">{line.substring(4)}</h3>;
      }
      
      // Handle bullet points (- item)
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-5 mb-2">{line.substring(2)}</li>;
      }
      
      // Default to paragraph
      return <p key={index} className="my-4 text-gray-700 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-sm text-gray-500">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-gray-700">Home</Link>
          </li>
          <li className="flex items-center space-x-2">
            <span>/</span>
            <Link href="/blog" className="hover:text-gray-700">Blog</Link>
          </li>
          <li className="flex items-center space-x-2">
            <span>/</span>
            <Link 
              href={`/blog?category=${post.category}`} 
              className="hover:text-gray-700"
            >
              {Object.entries(BLOG_CATEGORIES).find(([_, value]) => value === post.category)?.[0] || post.category}
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <span>/</span>
            <span className="truncate max-w-[200px]">{post.title}</span>
          </li>
        </ol>
      </nav>
      
      {/* Article Header */}
      <header className="mb-8 text-center">
        <div className="mb-3 flex items-center justify-center space-x-2">
          <Link 
            href={`/blog?category=${post.category}`}
            className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 hover:bg-primary-200"
          >
            {post.category}
          </Link>
          <span className="text-sm text-gray-500">{formattedDate}</span>
          <span className="text-sm text-gray-500">{post.readTime} min read</span>
        </div>
        
        <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {post.title}
        </h1>
        
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-center">
          <Image 
            src={post.author.avatar} 
            alt={post.author.name} 
            width={48} 
            height={48} 
            className="mr-4 rounded-full"
          />
          <div className="text-left">
            <p className="font-medium">{post.author.name}</p>
            <p className="text-sm text-gray-500">{post.author.role}</p>
          </div>
        </div>
      </header>
      
      {/* Featured Image */}
      <div className="mb-10 overflow-hidden rounded-xl">
        <Image
          src={post.coverImage}
          alt={post.title}
          width={1200}
          height={675}
          className="w-full object-cover"
          priority
        />
      </div>
      
      {/* Article Content */}
      <div className="mx-auto max-w-3xl">
        <article className="prose prose-lg prose-gray mx-auto">
          <div className="mt-8">
            {renderContent(post.content)}
          </div>
        </article>
        
        {/* Tags */}
        <div className="my-10 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50"
            >
              #{tag}
            </Link>
          ))}
        </div>
        
        {/* Author Bio */}
        <div className="my-12 rounded-xl bg-gray-50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Image 
              src={post.author.avatar} 
              alt={post.author.name} 
              width={80} 
              height={80} 
              className="rounded-full"
            />
            <div>
              <h3 className="mb-1 text-lg font-bold">About {post.author.name}</h3>
              <p className="mb-3 text-sm text-gray-500">{post.author.role}</p>
              <p className="text-gray-700">{post.author.bio}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="my-16 border-t border-gray-200 pt-12">
          <h2 className="mb-8 text-center text-2xl font-bold">Related Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map(relatedPost => (
              <BlogCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </div>
      )}
      
      {/* Newsletter Signup */}
      <div className="my-16">
        <NewsletterSignup 
          title="Want more articles like this?" 
          description="Sign up for our newsletter and get our best content delivered to your inbox."
          bgColor="primary-50"
          layout="horizontal"
          variant="default"
        />
      </div>
    </div>
  );
} 