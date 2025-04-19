'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/data/blog-posts';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
  className?: string;
}

export default function BlogCard({ post, variant = 'default', className = '' }: BlogCardProps) {
  // Format the date manually instead of using date-fns
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);
    
    if (diffInYears > 0) {
      return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
    } else if (diffInMonths > 0) {
      return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
    } else if (diffInDays > 0) {
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    } else if (diffInHours > 0) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else if (diffInMinutes > 0) {
      return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
    } else {
      return 'just now';
    }
  };

  const formattedDate = formatRelativeTime(post.publishedAt);

  // Different layouts based on variant
  switch (variant) {
    case 'featured':
      return (
        <div className={`group relative overflow-hidden rounded-xl shadow-md ${className}`}>
          <div className="aspect-[16/9] w-full overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={675}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="mb-3 flex items-center space-x-2">
              <span className="rounded-full bg-primary-600 px-3 py-1 text-xs font-medium">{post.category}</span>
              <span className="text-xs opacity-80">{formattedDate}</span>
            </div>
            <h3 className="mb-2 text-xl font-bold leading-tight">
              <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 hover:text-gray-100">
                {post.title}
              </Link>
            </h3>
            <p className="line-clamp-2 text-sm opacity-90">{post.excerpt}</p>
            
            <div className="mt-4 flex items-center">
              <Image 
                src={post.author.avatar} 
                alt={post.author.name} 
                width={40} 
                height={40} 
                className="mr-3 rounded-full border-2 border-white"
              />
              <div>
                <p className="text-sm font-medium">{post.author.name}</p>
                <p className="text-xs opacity-80">{post.author.role}</p>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'compact':
      return (
        <div className={`group overflow-hidden rounded-lg shadow-sm ${className}`}>
          <div className="aspect-[16/10] overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={400}
              height={250}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">{post.category}</span>
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
            <h3 className="mb-1 line-clamp-2 text-base font-bold leading-tight">
              <Link href={`/blog/${post.slug}`} className="hover:text-primary-600">
                {post.title}
              </Link>
            </h3>
            <p className="line-clamp-2 text-xs text-gray-600">{post.excerpt}</p>
          </div>
        </div>
      );
      
    case 'horizontal':
      return (
        <div className={`group flex flex-col md:flex-row overflow-hidden rounded-lg shadow-sm ${className}`}>
          <div className="md:w-1/3 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={400}
              height={300}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex-1 p-5">
            <div className="mb-2 flex items-center space-x-3">
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">{post.category}</span>
              <span className="text-xs text-gray-500">{formattedDate}</span>
              <span className="text-xs text-gray-500">{post.readTime} min read</span>
            </div>
            <h3 className="mb-2 text-lg font-bold leading-tight">
              <Link href={`/blog/${post.slug}`} className="hover:text-primary-600">
                {post.title}
              </Link>
            </h3>
            <p className="mb-3 line-clamp-2 text-sm text-gray-600">{post.excerpt}</p>
            
            <div className="mt-auto flex items-center space-x-3">
              <Image 
                src={post.author.avatar} 
                alt={post.author.name} 
                width={32} 
                height={32} 
                className="rounded-full"
              />
              <span className="text-sm font-medium">{post.author.name}</span>
              {post.tags.length > 0 && (
                <div className="flex space-x-1">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs text-primary-600">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
      
    default: // default card
      return (
        <div className={`group overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md ${className}`}>
          <div className="aspect-[16/9] overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={800}
              height={450}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">{post.category}</span>
              <div className="flex items-center text-xs text-gray-500">
                <span className="mr-2">{formattedDate}</span>
                <span>•</span>
                <span className="ml-2">{post.readTime} min read</span>
              </div>
            </div>
            <h3 className="mb-2 text-xl font-bold leading-tight">
              <Link href={`/blog/${post.slug}`} className="hover:text-primary-600">
                {post.title}
              </Link>
            </h3>
            <p className="mb-3 line-clamp-3 text-sm text-gray-600">{post.excerpt}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Image 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  width={32} 
                  height={32} 
                  className="mr-2 rounded-full"
                />
                <span className="text-sm font-medium">{post.author.name}</span>
              </div>
              <div className="flex space-x-1">
                {post.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs text-gray-500">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
  }
} 