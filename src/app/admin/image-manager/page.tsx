'use client';

import { useState } from 'react';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import ImageUploader from '@/components/ImageUploader';
import ImageGallery from '@/components/ImageGallery';
import { IMAGE_CATEGORIES, ImageData } from '@/data/images';

// Mock function to simulate image upload to a server
const simulateImageUpload = async (imageData: {
  file: File;
  category: string;
  caption?: string;
  alt?: string;
}) => {
  // In a real app, you would upload to your server or cloud storage
  console.log('Uploading image:', imageData);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return success response (in a real app, this would come from your server)
  return {
    success: true,
    url: URL.createObjectURL(imageData.file),
    data: {
      src: URL.createObjectURL(imageData.file),
      alt: imageData.alt || 'Uploaded image',
      caption: imageData.caption,
      category: imageData.category,
    }
  };
};

export default function ImageManager() {
  const [uploadedImages, setUploadedImages] = useState<ImageData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof IMAGE_CATEGORIES>('PRODUCTS');

  const handleImageUpload = async (imageData: {
    file: File;
    category: string;
    caption?: string;
    alt?: string;
  }) => {
    setIsUploading(true);
    setUploadResult(null);
    
    try {
      const result = await simulateImageUpload(imageData);
      
      if (result.success) {
        // Add the new image to our local state
        setUploadedImages(prev => [
          ...prev,
          {
            src: result.url,
            alt: imageData.alt || 'Uploaded image',
            caption: imageData.caption,
            category: imageData.category,
            width: 800,
            height: 600,
          }
        ]);
        
        setUploadResult({
          success: true,
          message: 'Image uploaded successfully!'
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadResult({
        success: false,
        message: 'Failed to upload image. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Helper function to filter uploaded images by category
  const getUploadedImagesByCategory = (category: string) => {
    return uploadedImages.filter(img => 
      img.category === IMAGE_CATEGORIES[category as keyof typeof IMAGE_CATEGORIES]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Image Manager" 
        description="Upload, organize, and manage images for your website content."
      />
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upload'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upload Images
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manage'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Images
          </button>
        </nav>
      </div>
      
      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Upload New Image</h2>
              <ImageUploader 
                onImageUpload={handleImageUpload}
                maxFileSize={10}
              />
              
              {uploadResult && (
                <div className={`mt-4 p-4 rounded-md ${
                  uploadResult.success 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {uploadResult.message}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Recently Uploaded</h2>
              {uploadedImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {uploadedImages.slice(-6).reverse().map((img, index) => (
                    <div key={index} className="border rounded-md p-2 relative group">
                      <div className="aspect-video overflow-hidden rounded-md">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {img.caption && (
                        <p className="text-sm text-gray-600 mt-1 truncate">{img.caption}</p>
                      )}
                      <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs py-1 px-2 rounded">
                        {Object.entries(IMAGE_CATEGORIES).find(([_, value]) => value === img.category)?.[0] || 'Other'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2">No images uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Manage Tab */}
      {activeTab === 'manage' && (
        <div>
          <div className="mb-6">
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category:
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(IMAGE_CATEGORIES).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category as keyof typeof IMAGE_CATEGORIES)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">
              {selectedCategory.charAt(0) + selectedCategory.slice(1).toLowerCase().replace('_', ' ')} Images
            </h2>
            
            {/* Show uploaded images for the selected category */}
            {getUploadedImagesByCategory(selectedCategory).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {getUploadedImagesByCategory(selectedCategory).map((img, index) => (
                  <div key={index} className="border rounded-md p-2 group relative">
                    <div className="aspect-square overflow-hidden rounded-md">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    {'caption' in img && img.caption && (
                      <p className="text-sm text-gray-700 mt-2 truncate">{img.caption}</p>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                      <button className="bg-white text-gray-800 py-1 px-3 rounded-md text-sm font-medium hover:bg-gray-100">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 border border-dashed rounded-lg">
                <p>No images in this category yet. Upload some images first!</p>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className="mt-4 py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Go to Upload
                </button>
              </div>
            )}
            
            {/* Standard Gallery View */}
            {uploadedImages.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-medium mb-4">All Uploaded Images</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="border rounded-md p-2">
                      <div className="aspect-video overflow-hidden rounded-md">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {'caption' in img && img.caption && (
                        <p className="text-sm text-gray-600 mt-1 truncate">{img.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 