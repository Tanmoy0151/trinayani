'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Filter, ChevronRight } from 'react-feather';

// Status colors for badges
const statusColors = {
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

// Mock expenses data
const mockExpenses = [
  {
    id: '1234',
    title: 'Client meeting lunch',
    amount: 45.50,
    date: '2023-11-15',
    category: 'Meals',
    status: 'approved',
    submittedAt: '2023-11-15T14:30:00Z'
  },
  {
    id: '1235',
    title: 'Office supplies',
    amount: 32.99,
    date: '2023-11-10',
    category: 'Office',
    status: 'pending',
    submittedAt: '2023-11-10T09:45:00Z'
  },
  {
    id: '1236',
    title: 'Taxi to airport',
    amount: 65.00,
    date: '2023-11-05',
    category: 'Transportation',
    status: 'rejected',
    submittedAt: '2023-11-05T17:20:00Z'
  },
  {
    id: '1237',
    title: 'Conference registration',
    amount: 350.00,
    date: '2023-10-28',
    category: 'Professional',
    status: 'approved',
    submittedAt: '2023-10-28T10:15:00Z'
  },
  {
    id: '1238',
    title: 'Hotel accommodation',
    amount: 425.75,
    date: '2023-10-25',
    category: 'Accommodation',
    status: 'approved',
    submittedAt: '2023-10-25T12:05:00Z'
  }
];

// Format date to readable format
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format currency
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}

export default function ExpensesPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });
  
  // Fetch expenses data
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, fetch from API
        // const response = await fetch('/api/expenses');
        // const data = await response.json();
        
        // For demo, use mock data
        const data = [...mockExpenses];
        setExpenses(data);
        setFilteredExpenses(data);
        
        // Calculate summary stats
        const stats = data.reduce((acc, expense) => {
          acc.total += expense.amount;
          
          if (expense.status === 'approved') {
            acc.approved += expense.amount;
          } else if (expense.status === 'pending') {
            acc.pending += expense.amount;
          } else if (expense.status === 'rejected') {
            acc.rejected += expense.amount;
          }
          
          return acc;
        }, { total: 0, approved: 0, pending: 0, rejected: 0 });
        
        setSummaryStats(stats);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, []);
  
  // Filter expenses by status and search term
  useEffect(() => {
    let filtered = [...expenses];
    
    // Apply status filter
    if (activeFilter) {
      filtered = filtered.filter(expense => expense.status === activeFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(expense => 
        expense.title.toLowerCase().includes(term) || 
        expense.category.toLowerCase().includes(term)
      );
    }
    
    setFilteredExpenses(filtered);
  }, [expenses, activeFilter, searchTerm]);
  
  // Handle filter click
  const handleFilterClick = (filter: string | null) => {
    setActiveFilter(prevFilter => prevFilter === filter ? null : filter);
  };
  
  // Loading state UI
  if (loading) {
    return (
      <div className="p-6">
        <PageHeader title="Expenses" description="View and manage your expense reports" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(index => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="animate-pulse p-4">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(index => (
                <div key={index} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <PageHeader title="Expenses" description="View and manage your expense reports" />
        <Button
          onClick={() => router.push('/employee/expenses/new')}
          className="mt-4 sm:mt-0 flex items-center"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Expense
        </Button>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-500 font-medium">Total Expenses</div>
          <div className="text-2xl font-bold mt-1 text-gray-900">
            {formatCurrency(summaryStats.total)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {expenses.length} reports
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-500 font-medium">Approved</div>
          <div className="text-2xl font-bold mt-1 text-green-600">
            {formatCurrency(summaryStats.approved)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {expenses.filter(e => e.status === 'approved').length} reports
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-500 font-medium">Pending</div>
          <div className="text-2xl font-bold mt-1 text-yellow-600">
            {formatCurrency(summaryStats.pending)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {expenses.filter(e => e.status === 'pending').length} reports
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-500 font-medium">Rejected</div>
          <div className="text-2xl font-bold mt-1 text-red-600">
            {formatCurrency(summaryStats.rejected)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {expenses.filter(e => e.status === 'rejected').length} reports
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-grow">
            <label htmlFor="search" className="sr-only">Search expenses</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search by title or category"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500 flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              <span>Filter:</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleFilterClick('approved')}
                className={`inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium ${
                  activeFilter === 'approved' 
                    ? 'bg-green-100 text-green-800 ring-1 ring-green-600'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => handleFilterClick('pending')}
                className={`inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium ${
                  activeFilter === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => handleFilterClick('rejected')}
                className={`inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium ${
                  activeFilter === 'rejected' 
                    ? 'bg-red-100 text-red-800 ring-1 ring-red-600'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Expenses</h2>
        </div>
        
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 text-gray-500 mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No expenses found</h3>
            <p className="text-gray-500">
              {activeFilter || searchTerm 
                ? "Try adjusting your filters or search terms"
                : "Submit your first expense to get started"
              }
            </p>
            
            {!activeFilter && !searchTerm.trim() && (
              <Button
                onClick={() => router.push('/employee/expenses/new')}
                className="mt-4"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Expense
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredExpenses.map((expense) => (
              <div 
                key={expense.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                <Link 
                  href={`/employee/expenses/${expense.id}`}
                  className="block p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{expense.title}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="truncate">{expense.category}</span>
                        <span className="mx-1">•</span>
                        <span>{formatDate(expense.date)}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center">
                      <div className={`mr-4 text-right flex flex-col items-end`}>
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(expense.amount)}</span>
                        <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[expense.status as keyof typeof statusColors]}`}>
                          {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 