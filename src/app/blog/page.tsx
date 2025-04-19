'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import BlogCard from '@/components/BlogCard';
import blogPosts, { BLOG_CATEGORIES } from '@/data/blog-posts';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function BlogPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const tagParam = searchParams.get('tag');
  
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);

  // Get all unique tags from blog posts
  const allTags = Array.from(
    new Set(blogPosts.flatMap(post => post.tags))
  ).sort();

  // Filter posts based on active category and tag filter
  const filteredPosts = blogPosts.filter(post => {
    // If no category is selected, or if the post matches the selected category
    const categoryMatch = !activeCategory || post.category === activeCategory;
    
    // If no tag is selected, or if the post has the selected tag
    const tagMatch = !tagParam || post.tags.includes(tagParam);
    
    return categoryMatch && tagMatch;
  });
  
  // Find featured posts (either featured flag or most recent)
  const featuredPosts = blogPosts
    .filter(post => post.featured)
    .slice(0, 1);
  
  // Get the most recent post if no featured posts
  const mainFeaturedPost = featuredPosts.length > 0 
    ? featuredPosts[0] 
    : blogPosts.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Our Blog" 
        description="Stay updated with the latest industry insights, tutorials, and company news."
      />
      
      {/* Featured Post Section */}
      <section className="mb-12">
        <BlogCard post={mainFeaturedPost} variant="featured" />
      </section>
      
      {/* Category Filter */}
      <section className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !activeCategory 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveCategory(null)}
          >
            All Posts
          </button>
          
          {Object.entries(BLOG_CATEGORIES).map(([key, value]) => (
            <button
              key={key}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === value 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(value)}
            >
              {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
            </button>
          ))}
        </div>
        
        {/* Tag filters (horizontal scrollable on mobile) */}
        {allTags.length > 0 && (
          <div className="mt-4 flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {allTags.map(tag => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}${activeCategory ? `&category=${activeCategory}` : ''}`}
                className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors ${
                  tagParam === tag 
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </section>
      
      {/* Main Blog Posts Grid */}
      <section className="mb-16">
        {filteredPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="mb-4 h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" 
              />
            </svg>
            <h3 className="mb-2 text-lg font-medium text-gray-900">No posts found</h3>
            <p className="text-sm text-gray-500">Try changing your filter criteria or check back later for new content.</p>
            <button 
              onClick={() => {
                setActiveCategory(null);
                // Reset URL to remove tag param
                window.history.pushState({}, '', '/blog');
              }}
              className="mt-4 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              View All Posts
            </button>
          </div>
        )}
      </section>
      
      {/* Popular Topics Section */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">Popular Topics</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {Object.entries(BLOG_CATEGORIES).slice(0, 4).map(([key, value]) => {
            const postsInCategory = blogPosts.filter(post => post.category === value).length;
            return (
              <div 
                key={key} 
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
                <div className="relative p-6 flex flex-col h-40 justify-end text-white">
                  <h3 className="text-lg font-bold mb-1">
                    {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                  </h3>
                  <p className="text-sm opacity-90">{postsInCategory} articles</p>
                  <Link 
                    href={`/blog?category=${value}`}
                    className="mt-2 text-xs font-medium uppercase tracking-wider opacity-90 hover:opacity-100"
                  >
                    View Articles →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      
      {/* Recent Articles Section */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Articles</h2>
          <Link 
            href="/blog"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All →
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {blogPosts
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
            .slice(0, 6)
            .map((post, index) => (
              <BlogCard 
                key={post.id} 
                post={post} 
                variant={index === 0 ? 'horizontal' : 'compact'}
              />
            ))}
        </div>
      </section>
      
      {/* Newsletter Signup */}
      <div className="my-10">
        <NewsletterSignup 
          title="Subscribe to our newsletter" 
          description="Get the latest articles, industry insights and company updates delivered to your inbox."
          bgColor="gray"
          layout="horizontal"
          variant="default"
        />
      </div>
    </div>
  );
} 