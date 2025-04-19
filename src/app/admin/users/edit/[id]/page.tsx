'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  User,
  Mail,
  Lock,
  Phone,
  UserCheck,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Shield
} from 'lucide-react';

interface Params {
  id: string;
}

export default function EditUserPage({ params }: { params: Params }) {
  const router = useRouter();
  const { id } = params;
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '' as 'applicant' | 'field_employee' | 'backoffice_admin' | 'super_admin',
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
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
      
      fetchUser();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [id, router]);
  
  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, you would include an auth token
      const response = await fetch(`/api/admin/users?id=${id}`, {
        headers: {
          'Authorization': currentUser?.id.toString() || ''
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      
      const data = await response.json();
      const userData = data.user;
      
      if (!userData) {
        throw new Error('User not found');
      }
      
      setUser(userData);
      setFormState({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'applicant',
        isActive: userData.isActive
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to load user details. The user may not exist or you may not have permission to view it.');
    } finally {
      setLoading(false);
    }
  };
  
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
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState(prev => ({ ...prev, [name]: checked }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formState.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formState.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formState.email.trim()) newErrors.email = 'Email is required';
    if (!formState.role) newErrors.role = 'Role is required';
    
    // Email validation
    if (formState.email && !/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Please enter a valid email address';
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
      // In a real app, you would include an auth token
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser?.id.toString() || ''
        },
        body: JSON.stringify({
          id: Number(id),
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          phone: formState.phone || undefined,
          role: formState.role,
          isActive: formState.isActive
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }
      
      setSubmitResult({
        success: true,
        message: 'User updated successfully!'
      });
      
      // Refresh user data
      setUser({
        ...user,
        ...data.user
      });
      
      // Redirect to user management page after a delay
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (error) {
      console.error('Error updating user:', error);
      setSubmitResult({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred while updating the user'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">
                {error || 'Unable to load user details. The user may not exist.'}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => router.push('/admin/users')}
              >
                Return to User Management
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const isSelfEdit = currentUser && user && currentUser.id === user.id;
  
  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <div className="p-6">
        <div className="mb-6">
          <Link href="/admin/users" className="flex items-center text-primary-600 hover:text-primary-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to User Management
          </Link>
          
          <PageHeader 
            title={`Edit User: ${user.name}`}
            description="Update user details, role, and status"
          />
        </div>
        
        {isSelfEdit && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 flex items-start">
            <Shield className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">You are editing your own account</p>
              <p className="text-sm mt-1">
                Be careful when changing your role or status as this could affect your access to the system.
              </p>
            </div>
          </div>
        )}
        
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
                      disabled={isSelfEdit && formState.role === 'super_admin'}
                    >
                      <option value="applicant">Applicant</option>
                      <option value="field_employee">Field Employee</option>
                      <option value="backoffice_admin">Backoffice Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                    {errors.role && (
                      <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                    )}
                    {isSelfEdit && formState.role === 'super_admin' && (
                      <p className="text-amber-500 text-sm mt-1">
                        You cannot change your own role from Super Admin
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Status */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={formState.isActive}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      disabled={isSelfEdit}
                    />
                    <Label htmlFor="isActive" className="ml-2">
                      Active Account
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Inactive accounts cannot log in to the system
                  </p>
                  {isSelfEdit && (
                    <p className="text-amber-500 text-sm">
                      You cannot deactivate your own account
                    </p>
                  )}
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
                      {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
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