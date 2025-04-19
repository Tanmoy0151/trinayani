import { useState } from 'react';

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  bgColor?: 'white' | 'gray' | 'transparent' | 'primary-50';
  layout?: 'horizontal' | 'vertical';
  variant?: 'default' | 'compact';
}

const NewsletterSignup = ({
  title = 'Subscribe to our newsletter',
  description = 'Get the latest articles, industry insights and company updates delivered to your inbox.',
  bgColor = 'gray',
  layout = 'vertical',
  variant = 'default',
}: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    try {
      setStatus('loading');
      
      // Connect to our API endpoint
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }
      
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to subscribe. Please try again later.');
      console.error('Newsletter subscription error:', error);
    }
  };

  const bgColors = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    transparent: 'bg-transparent',
    'primary-50': 'bg-primary-50',
  };

  return (
    <div className={`rounded-xl ${bgColors[bgColor]} p-6 sm:p-8`}>
      <div className="mx-auto max-w-2xl text-center">
        {variant === 'default' && (
          <>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {title}
            </h2>
            <p className="mt-2 text-gray-600">
              {description}
            </p>
          </>
        )}
        
        {variant === 'compact' && (
          <h3 className="text-lg font-medium text-gray-900">
            {title}
          </h3>
        )}
        
        <form 
          onSubmit={handleSubmit}
          className={`mt-4 ${layout === 'horizontal' ? 'flex flex-col sm:flex-row' : 'flex flex-col'} gap-2`}
        >
          <div className={layout === 'horizontal' ? 'flex-1' : 'w-full'}>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              className="w-full rounded-md border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:ring-primary-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
            />
          </div>
          
          <button
            type="submit"
            className={`${layout === 'horizontal' ? 'flex-none' : 'w-full mt-2'} rounded-md bg-primary-600 px-6 py-2.5 font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200`}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        
        {status === 'success' && (
          <p className="mt-3 text-sm text-green-600">
            Thanks for subscribing! You'll hear from us soon.
          </p>
        )}
        
        {status === 'error' && (
          <p className="mt-3 text-sm text-red-600">
            {errorMessage}
          </p>
        )}
        
        <p className="mt-3 text-xs text-gray-500">
          By subscribing, you agree to our Privacy Policy and consent to receive updates.
        </p>
      </div>
    </div>
  );
};

export default NewsletterSignup; 