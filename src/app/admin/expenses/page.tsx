'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowUpDown, 
  FileText, 
  Check, 
  X, 
  Edit, 
  MoreHorizontal, 
  Plus, 
  Download 
} from 'lucide-react';

// Define expense types
interface Expense {
  id: number;
  employeeId: number;
  employeeName: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  receiptUrl?: string;
}

// Mock data for expenses
const mockExpenses: Expense[] = [
  {
    id: 1001,
    employeeId: 101,
    employeeName: 'John Doe',
    category: 'Travel',
    amount: 125.50,
    date: '2023-06-15',
    description: 'Taxi fare to client meeting',
    status: 'approved',
    receiptUrl: '/receipts/1001.pdf'
  },
  {
    id: 1002,
    employeeId: 102,
    employeeName: 'Jane Smith',
    category: 'Office Supplies',
    amount: 45.99,
    date: '2023-06-18',
    description: 'Printer cartridges',
    status: 'pending',
    receiptUrl: '/receipts/1002.pdf'
  },
  {
    id: 1003,
    employeeId: 103,
    employeeName: 'Robert Johnson',
    category: 'Meals',
    amount: 78.25,
    date: '2023-06-20',
    description: 'Business lunch with clients',
    status: 'approved',
    receiptUrl: '/receipts/1003.pdf'
  },
  {
    id: 1004,
    employeeId: 101,
    employeeName: 'John Doe',
    category: 'Equipment',
    amount: 299.99,
    date: '2023-06-25',
    description: 'External monitor',
    status: 'rejected',
    receiptUrl: '/receipts/1004.pdf'
  },
  {
    id: 1005,
    employeeId: 104,
    employeeName: 'Sarah Williams',
    category: 'Travel',
    amount: 345.75,
    date: '2023-07-02',
    description: 'Flight to regional office',
    status: 'pending',
    receiptUrl: '/receipts/1005.pdf'
  },
];

const expenseCategories = [
  'Travel',
  'Meals',
  'Office Supplies',
  'Equipment',
  'Software',
  'Training',
  'Miscellaneous'
];

export default function ExpensesPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(mockExpenses);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Expense>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    filterAndSortExpenses();
  }, [expenses, searchQuery, statusFilter, categoryFilter, sortField, sortDirection]);

  const filterAndSortExpenses = () => {
    let filtered = [...expenses];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(exp => exp.status === statusFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(exp => exp.category === categoryFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(exp => 
        exp.employeeName.toLowerCase().includes(query) ||
        exp.description.toLowerCase().includes(query) ||
        exp.id.toString().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      // Handle special cases for sorting
      if (sortField === 'amount') {
        return sortDirection === 'asc' ? Number(fieldA) - Number(fieldB) : Number(fieldB) - Number(fieldA);
      }
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      
      // Default comparison
      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredExpenses(filtered);
  };

  const handleSort = (field: keyof Expense) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const updateExpenseStatus = (id: number, status: Expense['status']) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(exp => 
        exp.id === id ? { ...exp, status } : exp
      )
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <PageHeader 
          title="Employee Expenses"
          description="Manage and approve employee expense reports"
        />
        
        <Link href="/admin/expenses/create">
          <Button className="w-full md:w-auto">
            <Plus size={16} className="mr-2" />
            Add New Expense
          </Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <Input
                type="text"
                placeholder="Search by employee or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 text-sm"
              >
                <option value="all">All Categories</option>
                {expenseCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No expenses match your current filters.
            </p>
            <div className="mt-6">
              <Link href="/admin/expenses/create">
                <Button>
                  <Plus size={16} className="mr-2" />
                  New Expense Report
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>ID</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('employeeName')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Employee</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Category</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Amount</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{expense.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{expense.employeeName}</div>
                      <div className="text-xs text-gray-500">ID: {expense.employeeId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{expense.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatAmount(expense.amount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(expense.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(expense.status)}`}>
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/admin/expenses/${expense.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <FileText size={16} className="inline-block" />
                          <span className="sr-only">View</span>
                        </Link>
                        
                        {expense.receiptUrl && (
                          <a 
                            href={expense.receiptUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Download size={16} className="inline-block" />
                            <span className="sr-only">Download Receipt</span>
                          </a>
                        )}
                        
                        {expense.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateExpenseStatus(expense.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Check size={16} className="inline-block" />
                              <span className="sr-only">Approve</span>
                            </button>
                            <button
                              onClick={() => updateExpenseStatus(expense.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X size={16} className="inline-block" />
                              <span className="sr-only">Reject</span>
                            </button>
                          </>
                        )}
                        
                        <Link
                          href={`/admin/expenses/edit/${expense.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit size={16} className="inline-block" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredExpenses.length}</span> of <span className="font-medium">{expenses.length}</span> expenses
          </div>
          <div className="text-sm text-gray-500">
            Total: <span className="font-medium">{formatAmount(filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0))}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 