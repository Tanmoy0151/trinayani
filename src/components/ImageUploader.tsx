'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { IMAGE_CATEGORIES } from '@/data/images';

interface ImageUploaderProps {
  onImageUpload?: (imageData: {
    file: File,
    category: string,
    caption?: string,
    alt?: string
  }) => void;
  allowedCategories?: Array<keyof typeof IMAGE_CATEGORIES>;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  className?: string;
}

export default function ImageUploader({
  onImageUpload,
  allowedCategories,
  maxFileSize = 5, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  className = '',
}: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [alt, setAlt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter categories if allowedCategories is provided
  const categories = allowedCategories 
    ? Object.entries(IMAGE_CATEGORIES)
        .filter(([key]) => allowedCategories.includes(key as keyof typeof IMAGE_CATEGORIES))
        .map(([key, value]) => ({ key, value }))
    : Object.entries(IMAGE_CATEGORIES).map(([key, value]) => ({ key, value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0] || null;
    
    if (!file) {
      return;
    }
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.map(t => t.replace('image/', '')).join(', ')}`);
      return;
    }
    
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxFileSize}MB`);
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Set alt text to file name by default
    const fileName = file.name.split('.')[0].replace(/-|_/g, ' ');
    setAlt(fileName);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Manually update the file input
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        
        // Trigger change event manually
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }
    
    if (!selectedCategory) {
      setError('Please select an image category');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the provided callback with image data
      if (onImageUpload) {
        onImageUpload({
          file: selectedFile,
          category: selectedCategory,
          caption: caption || undefined,
          alt: alt || undefined
        });
      }
      
      // Reset the form
      setSelectedFile(null);
      setPreviewUrl(null);
      setSelectedCategory(null);
      setCaption('');
      setAlt('');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setError('Failed to upload image. Please try again.');
      console.error('Image upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Drop Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${previewUrl ? 'border-primary-300 bg-primary-50' : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <div className="relative mx-auto w-full max-w-xs">
              <Image 
                src={previewUrl} 
                alt="Preview" 
                width={300} 
                height={300}
                className="mx-auto max-h-60 w-auto object-contain rounded-md"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">Drag and drop an image here, or click to browse</p>
              <p className="text-sm text-gray-500">Supports: JPG, PNG, GIF, WebP (max {maxFileSize}MB)</p>
            </div>
          )}
          <input 
            ref={fileInputRef}
            type="file" 
            accept={allowedTypes.join(',')}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        
        {/* Image Details Section */}
        {selectedFile && (
          <div className="space-y-4 bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-800">Image Details</h3>
            
            {/* Category Selection */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.key} value={cat.value}>
                    {cat.key.toLowerCase()
                      .split('_')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(' ')}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Alt Text */}
            <div>
              <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text <span className="text-red-500">*</span>
              </label>
              <input
                id="alt"
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Descriptive text for accessibility"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Describes the image for screen readers and SEO
              </p>
            </div>
            
            {/* Caption */}
            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
                Caption
              </label>
              <input
                id="caption"
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Optional caption to display with the image"
              />
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-100 rounded-md">
            {error}
          </div>
        )}
        
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={!selectedFile || !selectedCategory || isLoading}
            className={`w-full py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : selectedFile && selectedCategory ? 
                'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500' : 
                'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : 'Upload Image'}
          </button>
        </div>
      </form>
    </div>
  );
} 