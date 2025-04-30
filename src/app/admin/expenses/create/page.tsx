'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Upload } from 'lucide-react';

// Sample employees data
const employees = [
  { id: 101, name: 'John Doe' },
  { id: 102, name: 'Jane Smith' },
  { id: 103, name: 'Robert Johnson' },
  { id: 104, name: 'Sarah Williams' },
  { id: 105, name: 'Michael Brown' },
];

// Expense categories
const expenseCategories = [
  'Travel',
  'Meals',
  'Office Supplies',
  'Equipment',
  'Software',
  'Training',
  'Miscellaneous'
];

export default function CreateExpensePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptFile(e.target.files[0]);
      
      // Clear receipt error if it exists
      if (formErrors.receipt) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.receipt;
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.employeeId) errors.employeeId = 'Please select an employee';
    if (!formData.category) errors.category = 'Please select a category';
    if (!formData.amount) {
      errors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Please enter a valid amount';
    }
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload the form data and file to your API
      // For this demo, we'll just simulate a successful submission
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form Data:', {
        ...formData,
        amount: parseFloat(formData.amount),
        receipt: receiptFile ? receiptFile.name : null
      });
      
      // Redirect to expenses list
      router.push('/admin/expenses');
    } catch (error) {
      console.error('Error submitting expense:', error);
      alert('Failed to submit expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link 
          href="/admin/expenses" 
          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Expenses
        </Link>
        
        <PageHeader 
          title="Add New Expense"
          description="Create a new expense report"
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                Employee*
              </label>
              <select
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} (ID: {employee.id})
                  </option>
                ))}
              </select>
              {formErrors.employeeId && (
                <p className="mt-1 text-sm text-red-600">{formErrors.employeeId}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Select Category</option>
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {formErrors.category && (
                <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($)*
              </label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleInputChange}
              />
              {formErrors.amount && (
                <p className="mt-1 text-sm text-red-600">{formErrors.amount}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date*
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
              {formErrors.date && (
                <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the expense purpose and details"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            ></textarea>
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Receipt Upload
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="receipt"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="receipt"
                      name="receipt"
                      type="file"
                      accept="image/*,.pdf"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                {receiptFile && (
                  <p className="text-sm text-primary-600">
                    Selected: {receiptFile.name}
                  </p>
                )}
              </div>
            </div>
            {formErrors.receipt && (
              <p className="mt-1 text-sm text-red-600">{formErrors.receipt}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <Link href="/admin/expenses">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Expense'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 