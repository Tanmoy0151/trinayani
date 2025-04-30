'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import RoleGuard from '@/components/RoleGuard';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarIcon, DollarSign, FileText, Clock, Tag, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// Mock data for a single expense
const mockExpense = {
  id: '1234',
  title: 'Client meeting lunch',
  amount: 45.50,
  date: '2023-11-15',
  category: 'Meals',
  description: 'Lunch meeting with potential client to discuss project requirements and timeline. Discussed scope of work and budget constraints.',
  receiptUrl: '/mock-receipt.jpg',
  status: 'approved', // approved, rejected, pending
  submittedAt: '2023-11-15T14:30:00Z',
  updatedAt: '2023-11-16T09:15:00Z',
  comments: [
    {
      id: '1',
      author: 'Jane Smith',
      role: 'Manager',
      message: 'Looks good, approved.',
      timestamp: '2023-11-16T09:15:00Z'
    }
  ]
};

// Status mapping for visual elements
const statusConfig: Record<string, { color: string, icon: React.ReactNode, text: string }> = {
  approved: {
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: <CheckCircle className="h-5 w-5" />,
    text: 'Approved'
  },
  rejected: {
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: <XCircle className="h-5 w-5" />,
    text: 'Rejected'
  },
  pending: {
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: <Clock className="h-5 w-5" />,
    text: 'Pending'
  }
};

// Format date to a readable format
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format timestamp to a readable format with time
function formatTimestamp(timestamp: string) {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(timestamp).toLocaleDateString(undefined, options);
}

interface Params {
  id: string;
}

export default function ExpenseDetailsPage({ params }: { params: Params }) {
  const router = useRouter();
  const { id } = params;
  const [expense, setExpense] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real app, fetch the expense details from an API
    // For this demo, we'll use the mock data with a simulated delay
    const fetchExpense = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, you would fetch the expense by ID
        // const response = await fetch(`/api/expenses/${id}`);
        // const data = await response.json();
        // if (!response.ok) throw new Error(data.message || 'Failed to fetch expense');
        
        // For demo, we'll use the mock data and pretend it matches the ID
        const data = { ...mockExpense, id };
        setExpense(data);
      } catch (err) {
        console.error('Error fetching expense:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpense();
  }, [id]);
  
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse space-y-4 w-full max-w-3xl">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error || !expense) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">
                {error || 'Unable to load expense details. The expense may not exist.'}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => router.push('/employee/dashboard')}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const status = statusConfig[expense.status];
  
  return (
    <RoleGuard allowedRoles={['field_employee', 'super_admin']}>
      <div className="p-6">
        <div className="mb-6">
          <Link href="/employee/dashboard" className="flex items-center text-primary-600 hover:text-primary-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          
          <PageHeader 
            title="Expense Details"
            description={`Viewing details for expense #${expense.id}`}
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Status Banner */}
          <div className={`px-6 py-3 border-b ${status.color}`}>
            <div className="flex items-center">
              {status.icon}
              <span className="ml-2 font-medium">{status.text}</span>
              <span className="ml-auto text-sm">
                Last updated: {formatTimestamp(expense.updatedAt)}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {/* Expense Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{expense.title}</h2>
                <div className="mt-1 text-sm text-gray-500">
                  Submitted on {formatTimestamp(expense.submittedAt)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">${expense.amount.toFixed(2)}</div>
                <div className="flex items-center justify-end mt-1 text-sm text-gray-500">
                  <Tag className="h-4 w-4 mr-1" />
                  {expense.category}
                </div>
              </div>
            </div>
            
            {/* Expense Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-900 whitespace-pre-line">{expense.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Date of Expense</h3>
                <div className="flex items-center text-gray-900">
                  <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                  {formatDate(expense.date)}
                </div>
              </div>
            </div>
            
            {/* Receipt */}
            {expense.receiptUrl && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Receipt / Invoice</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 flex justify-between items-center border-b">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1.5 text-gray-500" />
                      <span className="text-sm text-gray-700">Receipt-{expense.id}.jpg</span>
                    </div>
                    <a 
                      href={expense.receiptUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-800"
                    >
                      Download
                    </a>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="relative h-72 w-full">
                      <Image
                        src={expense.receiptUrl}
                        alt="Receipt"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Comments</h3>
          </div>
          
          <div className="p-6">
            {expense.comments && expense.comments.length > 0 ? (
              <div className="space-y-4">
                {expense.comments.map((comment: any) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-800 mr-3">
                          {comment.author.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900">{comment.author}</h4>
                            <span className="ml-2 text-xs px-2 py-0.5 bg-gray-200 text-gray-800 rounded-full">
                              {comment.role}
                            </span>
                          </div>
                          <p className="mt-1 text-gray-700">{comment.message}</p>
                        </div>
                      </div>
                      <time className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</time>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No comments yet</p>
              </div>
            )}
            
            {/* Add response button when rejected */}
            {expense.status === 'rejected' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button 
                  onClick={() => router.push(`/employee/expenses/edit/${expense.id}`)}
                  className="w-full sm:w-auto"
                >
                  Respond to Rejection
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
} 