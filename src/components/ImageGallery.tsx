'use client';

import { useState } from 'react';
import Image from 'next/image';
import images, { IMAGE_CATEGORIES, ImageData } from '@/data/images';

interface ImageGalleryProps {
  category: keyof typeof IMAGE_CATEGORIES;
  title?: string;
  subtitle?: string;
  showCaption?: boolean;
  columns?: 1 | 2 | 3 | 4;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow?: boolean;
  aspectRatio?: 'auto' | 'square' | 'video' | 'portrait';
  className?: string;
  imageClassName?: string;
  limit?: number;
}

export default function ImageGallery({
  category,
  title,
  subtitle,
  showCaption = true,
  columns = 3,
  rounded = 'md',
  shadow = true,
  aspectRatio = 'auto',
  className = '',
  imageClassName = '',
  limit
}: ImageGalleryProps) {
  const [activeImage, setActiveImage] = useState<ImageData | null>(null);

  // Helper to get the correct images array based on category
  const getImagesArray = () => {
    const categoryImages = images[IMAGE_CATEGORIES[category]];
    
    // If it's an array, use it directly
    if (Array.isArray(categoryImages)) {
      return limit ? categoryImages.slice(0, limit) : categoryImages;
    }
    
    // If it's an object with nested arrays, flatten all arrays inside
    if (categoryImages && typeof categoryImages === 'object') {
      const allImages: ImageData[] = [];
      Object.values(categoryImages).forEach(value => {
        if (Array.isArray(value)) {
          allImages.push(...value);
        } else if (value && typeof value === 'object' && 'src' in value) {
          allImages.push(value as ImageData);
        }
      });
      return limit ? allImages.slice(0, limit) : allImages;
    }
    
    // Default empty array if nothing matches
    return [];
  };

  const galleryImages = getImagesArray();

  // Helper for grid columns
  const getGridColumns = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    }
  };

  // Helper for aspect ratio
  const getAspectRatio = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'video': return 'aspect-video';
      case 'portrait': return 'aspect-[3/4]';
      default: return '';
    }
  };

  // Helper for border radius
  const getRoundedClass = () => {
    switch (rounded) {
      case 'none': return '';
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-md';
      case 'lg': return 'rounded-lg';
      case 'full': return 'rounded-full';
      default: return 'rounded-md';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {title && <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>}
      {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}
      
      <div className={`grid ${getGridColumns()} gap-6`}>
        {galleryImages.map((img, index) => (
          <div 
            key={index} 
            className="relative group overflow-hidden"
            onClick={() => setActiveImage(img)}
          >
            <div className={`${getAspectRatio()} overflow-hidden ${getRoundedClass()} ${shadow ? 'shadow-md' : ''} ${imageClassName}`}>
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width || 800}
                height={img.height || 600}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${getRoundedClass()}`}
              />
            </div>
            
            {showCaption && 'caption' in img && img.caption && (
              <div className="mt-2">
                <p className="text-sm text-gray-700 font-medium">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for enlarged image */}
      {activeImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white rounded-full p-2"
              onClick={() => setActiveImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              width={activeImage.width || 1200}
              height={activeImage.height || 800}
              className="max-h-[85vh] w-auto mx-auto"
            />
            
            {'caption' in activeImage && activeImage.caption && (
              <div className="bg-black bg-opacity-70 text-white p-4 absolute bottom-0 left-0 right-0">
                <p>{activeImage.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 