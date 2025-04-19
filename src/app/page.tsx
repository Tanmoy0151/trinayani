import Image from 'next/image';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import blogPosts from '@/data/blog-posts';

export default function Home() {
  // Get featured or recent blog posts
  const featuredPosts = blogPosts
    .filter(post => post.featured)
    .slice(0, 3);
  
  // If we don't have enough featured posts, add the most recent ones
  const recentPosts = blogPosts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .filter(post => !featuredPosts.some(fp => fp.id === post.id))
    .slice(0, 3 - featuredPosts.length);
    
  const displayPosts = [...featuredPosts, ...recentPosts].slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-700 to-secondary-700 text-white">
        <div className="container-custom py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Advanced Medical Equipment Solutions
              </h1>
              <p className="text-lg md:text-xl text-gray-100">
                Official business partner of GE Healthcare and Carl Zeiss Medical, providing sales and service for cutting-edge medical equipment.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="btn-primary">
                  Explore Products
                </Link>
                <Link href="/contact" className="bg-white text-primary-700 hover:bg-gray-100 font-medium py-2 px-4 rounded-md transition duration-300">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-96">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
                  <p className="text-gray-800 font-semibold mb-2">Representing Top Medical Brands</p>
                  <div className="flex justify-center space-x-6">
                    <span className="text-lg font-bold text-primary-600">GE Healthcare</span>
                    <span className="text-lg font-bold text-secondary-600">Carl Zeiss</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Featured Blog Posts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Latest Insights</h2>
            <Link 
              href="/blog" 
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              View All
            </Link>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayPosts.map((post, index) => (
              <BlogCard 
                key={post.id} 
                post={post} 
                variant={index === 0 ? 'featured' : 'default'}
                className={index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Medical Equipment Solutions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide sales and service for a wide range of advanced medical equipment from GE Healthcare and Carl Zeiss Medical.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-primary-100 flex items-center justify-center">
                <div className="text-primary-600 text-6xl font-bold">CT</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">CT Scanners</h3>
                <p className="text-gray-600 mb-4">
                  Advanced GE Healthcare CT scanners for precise diagnostic imaging with exceptional detail.
                </p>
                <Link href="/products#ct" className="text-primary-600 font-medium hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-primary-100 flex items-center justify-center">
                <div className="text-primary-600 text-6xl font-bold">MRI</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">MRI Systems</h3>
                <p className="text-gray-600 mb-4">
                  GE Healthcare MRI systems delivering exceptional image quality for confident diagnoses.
                </p>
                <Link href="/products#mri" className="text-primary-600 font-medium hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-secondary-100 flex items-center justify-center">
                <div className="text-secondary-600 text-6xl font-bold">Eye</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Eye Examination Equipment</h3>
                <p className="text-gray-600 mb-4">
                  Carl Zeiss biometry, perimetry, and surgical microscopes for comprehensive eye care.
                </p>
                <Link href="/products#eye" className="text-secondary-600 font-medium hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Trinayani Medical</h2>
              <p className="text-gray-600 mb-6">
                As an official business partner of GE Healthcare and Carl Zeiss Medical, we provide advanced medical equipment solutions to hospitals, clinics, and healthcare providers.
              </p>
              <p className="text-gray-600 mb-6">
                Our expertise spans diagnostic imaging, surgical equipment, and eye examination technologies, backed by exceptional service and support.
              </p>
              <Link href="/about" className="btn-primary">
                Learn More About Us
              </Link>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-gray-700">Authorized partner of GE Healthcare and Carl Zeiss</p>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-gray-700">Expert technical service and maintenance</p>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-gray-700">Comprehensive training and support</p>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-gray-700">Nationwide equipment installation</p>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-gray-700">24/7 customer support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary-700 to-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Elevate Your Healthcare Facility?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Contact us today to learn more about our medical equipment solutions and how we can support your healthcare facility.
          </p>
          <Link href="/contact" className="inline-block bg-white text-primary-700 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition duration-300 text-lg">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
} 