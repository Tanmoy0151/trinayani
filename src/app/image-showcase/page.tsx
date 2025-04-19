'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import ImageGallery from '@/components/ImageGallery';
import { IMAGE_CATEGORIES } from '@/data/images';

export default function ImageShowcasePage() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof IMAGE_CATEGORIES>('PRODUCTS');
  
  const categoryButtons: Array<{
    id: keyof typeof IMAGE_CATEGORIES;
    label: string;
    description: string;
  }> = [
    { id: 'PRODUCTS', label: 'Products', description: 'Our product lineup' },
    { id: 'TEAM', label: 'Our Team', description: 'Meet the people behind Trinayani' },
    { id: 'SERVICES', label: 'Services', description: 'Solutions we provide' },
    { id: 'CAREERS', label: 'Careers', description: 'Join our growing team' },
    { id: 'PARTNERS', label: 'Partners', description: 'Our trusted partners' },
    { id: 'PROJECTS', label: 'Projects', description: 'Our successful implementations' },
  ];

  const getCategoryDescription = (category: keyof typeof IMAGE_CATEGORIES) => {
    switch(category) {
      case 'PRODUCTS':
        return "Browse our extensive range of products designed to meet your needs. Click on any image to view it in full size.";
      case 'TEAM':
        return "Meet the dedicated professionals who make Trinayani a leader in the industry. Our team combines expertise with passion.";
      case 'SERVICES':
        return "Discover our comprehensive service offerings tailored to solve your challenges and drive your success.";
      case 'CAREERS':
        return "Explore career opportunities at Trinayani and join a team committed to innovation and excellence.";
      case 'PARTNERS':
        return "We collaborate with industry-leading partners to deliver the best solutions to our clients.";
      case 'PROJECTS':
        return "View our successfully completed projects that demonstrate our capability and commitment to quality.";
      default:
        return "";
    }
  };
  
  // Determine gallery display options based on category
  const getGalleryProps = (category: keyof typeof IMAGE_CATEGORIES) => {
    switch(category) {
      case 'TEAM':
        return {
          columns: 3 as const,
          rounded: 'full' as const,
          aspectRatio: 'square' as const,
        };
      case 'PRODUCTS':
        return {
          columns: 3 as const, 
          rounded: 'md' as const,
          aspectRatio: 'video' as const,
        };
      case 'SERVICES':
        return {
          columns: 3 as const,
          rounded: 'lg' as const,
          aspectRatio: 'auto' as const,
        };
      case 'PARTNERS':
        return {
          columns: 4 as const,
          rounded: 'sm' as const,
          aspectRatio: 'auto' as const,
          shadow: false,
        };
      case 'PROJECTS':
        return {
          columns: 2 as const,
          rounded: 'lg' as const,
          aspectRatio: 'video' as const,
        };
      default:
        return {
          columns: 3 as const,
          rounded: 'md' as const,
        };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Image Gallery" 
        description="Explore our visual catalog showcasing products, team members, services, and more."
      />
      
      <div className="my-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {categoryButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => setActiveCategory(button.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === button.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
          <h2 className="text-2xl font-bold mb-2">{categoryButtons.find(b => b.id === activeCategory)?.label}</h2>
          <p className="text-gray-600 mb-6">{getCategoryDescription(activeCategory)}</p>
          
          <ImageGallery 
            category={activeCategory} 
            {...getGalleryProps(activeCategory)}
          />
        </div>
      </div>
      
      {/* Featured Images Section */}
      <section className="my-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Featured Images</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">Our Team</h3>
            <ImageGallery 
              category="TEAM" 
              columns={2} 
              rounded="lg"
              limit={2}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">Recent Projects</h3>
            <ImageGallery 
              category="PROJECTS"
              columns={1}
              aspectRatio="video"
              limit={1}
            />
          </div>
        </div>
      </section>
      
      {/* Logo Showcase */}
      <section className="my-16 bg-gray-50 py-10 px-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Partners</h2>
        <p className="text-center text-gray-600 mb-8">We collaborate with industry leaders to deliver exceptional results</p>
        
        <ImageGallery 
          category="PARTNERS"
          columns={4}
          shadow={false}
          showCaption={false}
        />
      </section>
    </div>
  );
} 