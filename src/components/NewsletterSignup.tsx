'use client';
import React, { useState } from 'react';

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'inverted';
  source?: string;
}

export default function NewsletterSignup({ 
  variant = 'default',
  source = 'website'
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset message
    setMessage(null);
    
    // Basic validation
    if (!email.trim()) {
      setMessage({ text: 'Please enter your email address', type: 'error' });
      return;
    }
    
    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setMessage({ text: 'Please enter a valid email address', type: 'error' });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        setEmail(''); // Clear input on success
      } else {
        setMessage({ text: data.message || 'Failed to subscribe. Please try again.', type: 'error' });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage({ 
        text: 'An error occurred while subscribing. Please try again later.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Variant-specific styles
  const containerClass = {
    default: 'bg-white p-8 rounded-lg shadow-md',
    compact: 'bg-white p-4 rounded-lg',
    inverted: 'bg-primary-800 text-white p-8 rounded-lg shadow-md'
  }[variant];
  
  const inputClass = {
    default: 'w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    compact: 'w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    inverted: 'w-full p-3 bg-primary-700 border border-primary-600 text-white rounded-md focus:ring-2 focus:ring-white'
  }[variant];
  
  const buttonClass = {
    default: 'w-full mt-4 py-3 px-4 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors',
    compact: 'w-full mt-2 py-2 px-3 text-sm bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors',
    inverted: 'w-full mt-4 py-3 px-4 bg-white text-primary-800 font-semibold rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-800 transition-colors'
  }[variant];
  
  const titleClass = {
    default: 'text-2xl font-bold text-gray-900 mb-2',
    compact: 'text-lg font-bold text-gray-900 mb-1',
    inverted: 'text-2xl font-bold text-white mb-2'
  }[variant];
  
  const descriptionClass = {
    default: 'text-gray-600 mb-4',
    compact: 'text-sm text-gray-600 mb-3',
    inverted: 'text-primary-100 mb-4'
  }[variant];
  
  const disclaimerClass = {
    default: 'mt-3 text-xs text-gray-500',
    compact: 'mt-2 text-xs text-gray-500',
    inverted: 'mt-3 text-xs text-primary-200'
  }[variant];

  const messageClass = {
    success: 'mt-3 text-sm text-green-600 font-medium',
    error: 'mt-3 text-sm text-red-600 font-medium',
    info: 'mt-3 text-sm text-blue-600 font-medium',
  };
  
  return (
    <div className={containerClass}>
      <h3 className={titleClass}>Subscribe to our newsletter</h3>
      <p className={descriptionClass}>
        Stay updated with our latest news, insights, and events. 
        {variant === 'default' && ' We promise not to spam your inbox!'}
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="email"
            name="email"
            id="newsletter-email"
            placeholder="Your email address"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            aria-label="Email address for newsletter"
            required
          />
        </div>
        
        {message && (
          <div className={messageClass[message.type]}>
            {message.text}
          </div>
        )}
        
        <button 
          type="submit" 
          className={buttonClass}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Subscribe'
          )}
        </button>
        
        <p className={disclaimerClass}>
          By subscribing, you agree to our <a href="/privacy-policy" className="underline hover:text-gray-800">Privacy Policy</a>.
        </p>
      </form>
    </div>
  );
} 