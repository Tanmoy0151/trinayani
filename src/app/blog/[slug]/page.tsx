'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import BlogCard from '@/components/BlogCard';
import blogPosts, { BLOG_CATEGORIES } from '@/data/blog-posts';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<typeof blogPosts[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<typeof blogPosts>([]);
  const router = useRouter();
  
  // Fetch post data with async/await
  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        // Simulate an async operation
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const foundPost = blogPosts.find(post => post.slug === params.slug);
        
        if (!foundPost) {
          notFound();
          return;
        }
        
        setPost(foundPost);
        
        // Get related posts
        const related = blogPosts
          .filter(p => 
            p.id !== foundPost.id && (
              p.category === foundPost.category ||
              p.tags.some(tag => foundPost.tags.includes(tag))
            )
          )
          .sort(() => 0.5 - Math.random()) // Shuffle
          .slice(0, 3); // Get 3 random related posts
          
        setRelatedPosts(related);
      } catch (error) {
        console.error("Error fetching post:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }
    
    fetchPost();
  }, [params.slug]);
  
  // Show loading state while fetching post
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/2 mx-auto bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  // If post isn't loaded and we're not loading, show 404
  if (!post) {
    return notFound();
  }
  
  // Format date for display (manual implementation since we can't use date-fns)
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
      <div className="my-16 rounded-xl bg-primary-50 p-8 sm:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Want more articles like this?
          </h2>
          <p className="mt-2 text-gray-600">
            Sign up for our newsletter and get our best content delivered to your inbox.
          </p>
          <form className="mt-6 flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                className="w-full rounded-md border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              className="flex-none rounded-md bg-primary-600 px-6 py-2.5 font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      {/* Back to Blog Link */}
      <div className="mt-10 text-center">
        <Link 
          href="/blog" 
          className="inline-flex items-center font-medium text-primary-600 hover:text-primary-700"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="mr-2 h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back to Blog
        </Link>
      </div>
    </div>
  );
} 