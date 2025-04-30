import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-primary-600 mb-6">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link 
            href="/" 
            className="btn-primary inline-flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 