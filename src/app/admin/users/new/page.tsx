'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  User,
  Mail,
  Lock,
  Phone,
  UserCheck,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function NewUserPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'applicant' as 'applicant' | 'field_employee' | 'backoffice_admin' | 'super_admin'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  useEffect(() => {
    // Check if user is logged in and is a super admin
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      router.push('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setCurrentUser(parsedUser);
      
      // Only super admins should access this page
      if (parsedUser.role !== 'super_admin') {
        router.push('/unauthorized');
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formState.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formState.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formState.email.trim()) newErrors.email = 'Email is required';
    if (!formState.password) newErrors.password = 'Password is required';
    if (!formState.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
    if (!formState.role) newErrors.role = 'Role is required';
    
    // Email validation
    if (formState.email && !/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (formState.password && formState.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    // Password confirmation
    if (formState.password && formState.confirmPassword && formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Phone number validation (optional field)
    if (formState.phone && !/^\+?[0-9\s\-()]+$/.test(formState.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitResult(null);
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser?.id.toString() || ''
        },
        body: JSON.stringify({
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          password: formState.password,
          phone: formState.phone || undefined,
          role: formState.role
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }
      
      setSubmitResult({
        success: true,
        message: 'User created successfully!'
      });
      
      // Reset form
      setFormState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'applicant'
      });
      
      // Redirect to user management page after a delay
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (error) {
      console.error('Error creating user:', error);
      setSubmitResult({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred while creating the user'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <div className="p-6">
        <div className="mb-6">
          <Link href="/admin/users" className="flex items-center text-primary-600 hover:text-primary-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to User Management
          </Link>
          
          <PageHeader 
            title="Add New User"
            description="Create a new user account with specific role and permissions"
          />
        </div>
        
        {submitResult && (
          <div className={`mb-6 p-4 rounded-md ${
            submitResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-start">
              {submitResult.success ? (
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              )}
              <div>
                <p className="font-medium">{submitResult.message}</p>
                {submitResult.success && (
                  <p className="text-sm mt-1">You will be redirected to the user management page shortly.</p>
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
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="flex items-center">
                      <User className="h-4 w-4 mr-1.5" />
                      First Name <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formState.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="flex items-center">
                      <User className="h-4 w-4 mr-1.5" />
                      Last Name <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formState.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-1.5" />
                    Email Address <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center">
                      <Lock className="h-4 w-4 mr-1.5" />
                      Password <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formState.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  
                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center">
                      <Lock className="h-4 w-4 mr-1.5" />
                      Confirm Password <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formState.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center">
                      <Phone className="h-4 w-4 mr-1.5" />
                      Phone Number <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                  
                  {/* Role */}
                  <div className="space-y-2">
                    <Label htmlFor="role" className="flex items-center">
                      <UserCheck className="h-4 w-4 mr-1.5" />
                      User Role <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <select
                      id="role"
                      name="role"
                      value={formState.role}
                      onChange={handleInputChange}
                      className={`w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        errors.role ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="applicant">Applicant</option>
                      <option value="field_employee">Field Employee</option>
                      <option value="backoffice_admin">Backoffice Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                    {errors.role && (
                      <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {formState.role === 'super_admin' 
                        ? 'Super Admins have full system access including user management' 
                        : formState.role === 'backoffice_admin'
                        ? 'Backoffice Admins can manage job postings, applications, and expenses'
                        : formState.role === 'field_employee'
                        ? 'Field Employees can submit expenses and receive appraisals'
                        : 'Applicants can view job postings and submit applications'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/admin/users')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating User...' : 'Create User'}
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