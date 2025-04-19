'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [status, setStatus] = useState<'loading' | 'verifying' | 'confirmed' | 'unsubscribed' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');
    
    if (!emailParam || !tokenParam) {
      setStatus('error');
      setMessage('Invalid unsubscribe link. Please check the link or contact support.');
      return;
    }
    
    setEmail(emailParam);
    verifyUnsubscribeRequest(emailParam, tokenParam);
  }, [searchParams]);

  const verifyUnsubscribeRequest = async (email: string, token: string) => {
    try {
      setStatus('verifying');
      
      const response = await fetch(`/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
      const data = await response.json();
      
      if (!response.ok) {
        setStatus('error');
        setMessage(data.message || 'Failed to verify unsubscribe request.');
        return;
      }
      
      // If already unsubscribed
      if (data.message === 'You are already unsubscribed') {
        setStatus('unsubscribed');
        setMessage('You have already unsubscribed from our newsletter.');
        return;
      }
      
      setStatus('confirmed');
    } catch (error) {
      console.error('Error verifying unsubscribe:', error);
      setStatus('error');
      setMessage('An error occurred while verifying your unsubscribe request. Please try again later.');
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, reason }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setStatus('error');
        setMessage(data.message || 'Failed to complete unsubscribe request.');
        return;
      }
      
      setStatus('unsubscribed');
      setMessage(data.message || 'You have been successfully unsubscribed from our newsletter.');
    } catch (error) {
      console.error('Error unsubscribing:', error);
      setStatus('error');
      setMessage('An error occurred while processing your unsubscribe request. Please try again later.');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary-600 rounded-full border-t-transparent"></div>
          </div>
        );
        
      case 'verifying':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Verifying your request...</h2>
            <div className="flex items-center">
              <div className="animate-spin h-5 w-5 border-2 border-primary-600 rounded-full border-t-transparent mr-3"></div>
              <p>Please wait while we verify your information.</p>
            </div>
          </div>
        );
        
      case 'confirmed':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Confirm Unsubscribe</h2>
            <p>
              Are you sure you want to unsubscribe <span className="font-semibold">{email}</span> from our newsletter?
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Would you mind telling us why you're unsubscribing? (Optional)
                </label>
                <select
                  id="reason"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Select a reason...</option>
                  <option value="too_many">Emails are too frequent</option>
                  <option value="not_relevant">Content is not relevant to me</option>
                  <option value="never_signed_up">I never signed up</option>
                  <option value="different_content">Expected different content</option>
                  <option value="other">Other reason</option>
                </select>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleUnsubscribe}
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Unsubscribe
                </button>
                <Link href="/" className="py-2 px-4 border border-gray-300 text-gray-700 rounded-md">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        );
        
      case 'unsubscribed':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Successfully Unsubscribed</h2>
            <p>{message}</p>
            <div className="pt-4">
              <Link href="/" className="text-primary-600 hover:underline">
                Return to homepage
              </Link>
            </div>
          </div>
        );
        
      case 'error':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-red-600">Error</h2>
            <p className="text-red-600">{message}</p>
            <div className="pt-4">
              <Link href="/" className="text-primary-600 hover:underline">
                Return to homepage
              </Link>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Newsletter Unsubscribe</h1>
        {renderContent()}
      </div>
    </div>
  );
} 