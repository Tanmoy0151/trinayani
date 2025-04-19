'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload,
  FileText,
  Calendar,
  DollarSign,
  Tag,
  ArrowLeft,
  Check,
  AlertCircle
} from 'lucide-react';

// Define expense category options
const EXPENSE_CATEGORIES = [
  'Meals',
  'Travel',
  'Accommodation',
  'Office Supplies',
  'Client Entertainment',
  'Training',
  'Conference',
  'Communication',
  'Miscellaneous'
];

interface FormState {
  title: string;
  amount: string;
  date: string;
  category: string;
  description: string;
  receipt?: File | null;
}

interface FormErrors {
  title?: string;
  amount?: string;
  date?: string;
  category?: string;
  description?: string;
  receipt?: string;
}

export default function NewExpensePage() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    receipt: null
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormState(prev => ({ ...prev, receipt: file }));
    
    // Clear error for this field when user selects a file
    if (errors.receipt) {
      setErrors(prev => ({ ...prev, receipt: undefined }));
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formState.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formState.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formState.amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formState.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      }
    }
    
    if (!formState.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formState.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formState.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formState.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    // Receipt is not required, but if provided, check size
    if (formState.receipt && formState.receipt.size > 5 * 1024 * 1024) {
      newErrors.receipt = 'Receipt file must be less than 5MB';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0] as keyof FormErrors;
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }
    
    setIsSubmitting(true);
    setSubmitResult(null);
    
    try {
      // In a real application, you would send this to your backend
      // For this demo, we'll simulate an API call
      
      // Create FormData to handle the file upload
      const formData = new FormData();
      formData.append('title', formState.title);
      formData.append('amount', formState.amount);
      formData.append('date', formState.date);
      formData.append('category', formState.category);
      formData.append('description', formState.description);
      
      if (formState.receipt) {
        formData.append('receipt', formState.receipt);
      }
      
      // Simulate API call
      console.log('Submitting expense:', Object.fromEntries(formData));
      
      // Simulate server response delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful response
      setSubmitResult({
        success: true,
        message: 'Expense report submitted successfully!'
      });
      
      // In a real app, you might redirect to the dashboard after a short delay
      setTimeout(() => {
        router.push('/employee/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting expense:', error);
      setSubmitResult({
        success: false,
        message: 'An error occurred while submitting your expense. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatAmount = (value: string) => {
    // Remove any non-digit characters except decimal point
    const sanitized = value.replace(/[^\d.]/g, '');
    
    // Handle cases with multiple decimal points
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    return sanitized;
  };
  
  return (
    <RoleGuard allowedRoles={['field_employee', 'super_admin']}>
      <div className="p-6">
        <div className="mb-6">
          <Link href="/employee/dashboard" className="flex items-center text-primary-600 hover:text-primary-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          
          <PageHeader 
            title="Submit New Expense"
            description="Complete the form below to submit a new expense report"
          />
        </div>
        
        {submitResult && (
          <div 
            className={`mb-6 p-4 rounded-md ${
              submitResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            <div className="flex items-start">
              {submitResult.success ? (
                <Check className="h-5 w-5 mr-2 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              )}
              <div>
                <p className="font-medium">{submitResult.message}</p>
                {submitResult.success && (
                  <p className="text-sm mt-1">You will be redirected to the dashboard shortly.</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center">
                      <FileText className="h-4 w-4 mr-1.5" />
                      Expense Title <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formState.title}
                      onChange={handleInputChange}
                      placeholder="Brief title for the expense"
                      maxLength={100}
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {formState.title.length}/100 characters
                    </p>
                  </div>
                  
                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1.5" />
                      Amount <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <Input
                        id="amount"
                        name="amount"
                        value={formState.amount}
                        onChange={(e) => {
                          const formattedValue = formatAmount(e.target.value);
                          setFormState(prev => ({ ...prev, amount: formattedValue }));
                          if (errors.amount) {
                            setErrors(prev => ({ ...prev, amount: undefined }));
                          }
                        }}
                        placeholder="0.00"
                        className={`pl-8 ${errors.amount ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1.5" />
                      Date of Expense <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formState.date}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={errors.date ? 'border-red-500' : ''}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                  </div>
                  
                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="flex items-center">
                      <Tag className="h-4 w-4 mr-1.5" />
                      Category <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <select
                      id="category"
                      name="category"
                      value={formState.category}
                      onChange={handleInputChange}
                      className={`w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        errors.category ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="">Select a category</option>
                      {EXPENSE_CATEGORIES.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center">
                    Description <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    placeholder="Please provide details about this expense"
                    rows={4}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {formState.description.length}/500 characters
                  </p>
                </div>
                
                {/* Receipt Upload */}
                <div className="space-y-2">
                  <Label htmlFor="receipt" className="flex items-center">
                    <Upload className="h-4 w-4 mr-1.5" />
                    Receipt / Invoice
                  </Label>
                  
                  <input 
                    ref={fileInputRef}
                    type="file"
                    id="receipt"
                    name="receipt"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  
                  <div 
                    onClick={triggerFileInput}
                    className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                      errors.receipt ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {formState.receipt ? (
                      <div className="flex flex-col items-center">
                        <FileText className="h-8 w-8 text-primary-500 mb-2" />
                        <p className="text-sm font-medium text-gray-900">
                          {formState.receipt.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(formState.receipt.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormState(prev => ({ ...prev, receipt: null }));
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="mt-2 text-sm text-primary-600 hover:text-primary-800"
                        >
                          Replace file
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900">
                          Click to upload receipt or invoice
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, JPG or PNG up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {errors.receipt && (
                    <p className="text-red-500 text-sm mt-1">{errors.receipt}</p>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    While not required, including a receipt helps with faster approval.
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/employee/dashboard')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Expense'}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
} 