'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  RefreshCw,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserMinus
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'applicant' | 'field_employee' | 'backoffice_admin' | 'super_admin';
  createdAt: string;
  isActive: boolean;
  isLoginRestricted: boolean;
}

type Params = {
  id: string;
};

export default function Page({ params }: { params: Params }) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
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
      
      // Don't fetch users here - will be done in another useEffect
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);
  
  // Separate useEffect to fetch users once currentUser is available
  useEffect(() => {
    if (currentUser?.id) {
      fetchUsers();
    }
  }, [currentUser]);
  
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching users with authorization:', currentUser?.id.toString());
      // In a real app, you would include an auth token
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': currentUser?.id.toString()
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRoleChange = async (userId: number, newRole: User['role']) => {
    try {
      // In a real app, you would include an auth token
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser?.id.toString()
        },
        body: JSON.stringify({
          id: userId,
          role: newRole
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user role');
      }
      
      // Update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      setSuccessMessage('User role updated successfully');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Failed to update user role. Please try again.');
    }
  };
  
  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      // In a real app, you would include an auth token
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser?.id.toString()
        },
        body: JSON.stringify({
          id: userId,
          isActive: !currentStatus
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
      
      // Update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );
      
      setSuccessMessage(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Failed to update user status. Please try again.');
    }
  };
  
  const toggleLoginRestriction = async (userId: number, currentRestriction: boolean) => {
    try {
      // Send request to the specialized login restriction endpoint
      const response = await fetch('/api/admin/users/restricted', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser?.id.toString()
        },
        body: JSON.stringify({
          userId,
          isRestricted: !currentRestriction
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user login restriction');
      }
      
      // Update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, isLoginRestricted: !currentRestriction } : user
        )
      );
      
      setSuccessMessage(`User login ${currentRestriction ? 'allowed' : 'restricted'} successfully`);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error updating user login restriction:', error);
      setError('Failed to update user login restriction. Please try again.');
    }
  };
  
  const deleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to deactivate this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      // In a real app, you would include an auth token
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': currentUser?.id.toString()
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to deactivate user');
      }
      
      // Update the user in the local state (mark as inactive)
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, isActive: false } : user
        )
      );
      
      setSuccessMessage('User deactivated successfully');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error deactivating user:', error);
      setError('Failed to deactivate user. ' + (error instanceof Error ? error.message : 'Please try again.'));
    }
  };
  
  // Filter users based on search query, role filter, and status filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery.trim() === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) || 
      (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800';
      case 'backoffice_admin':
        return 'bg-blue-100 text-blue-800';
      case 'field_employee':
        return 'bg-green-100 text-green-800';
      case 'applicant':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatRoleLabel = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <PageHeader 
            title="User Management"
            description="Manage system users, roles, and permissions"
          />
          
          <div className="mt-4 sm:mt-0">
            <Button
              onClick={() => router.push('/admin/users/new')}
              className="flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}
        
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-md p-4 flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>{successMessage}</div>
          </div>
        )}
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <select
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="backoffice_admin">Backoffice Admin</option>
                  <option value="field_employee">Field Employee</option>
                  <option value="applicant">Applicant</option>
                </select>
              </div>
              
              <div>
                <select
                  className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                title="Refresh users"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">System Users</h2>
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 text-gray-500 mb-4">
                <UserPlus className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || roleFilter !== 'all' || statusFilter !== 'all' 
                  ? "No users match your search criteria. Try adjusting your filters."
                  : "You haven't added any users yet."
                }
              </p>
              
              {!searchQuery && roleFilter === 'all' && statusFilter === 'all' && (
                <Button
                  onClick={() => router.push('/admin/users/new')}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Login
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={!user.isActive ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {user.name.split(' ').map(name => name[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <select
                            className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${getRoleBadgeClass(user.role)}`}
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                            disabled={!user.isActive || (user.role === 'super_admin' && currentUser.id === user.id)}
                          >
                            <option value="applicant">Applicant</option>
                            <option value="field_employee">Field Employee</option>
                            <option value="backoffice_admin">Backoffice Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isLoginRestricted 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.isLoginRestricted ? 'Restricted' : 'Allowed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => toggleUserStatus(user.id, user.isActive)}
                            className={`${user.isActive ? 'text-amber-600 hover:text-amber-900' : 'text-green-600 hover:text-green-900'}`}
                            title={user.isActive ? 'Deactivate User' : 'Activate User'}
                            disabled={user.role === 'super_admin' && currentUser.id === user.id}
                          >
                            {user.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </button>
                          
                          {user.isActive && (
                            <>
                              <Button
                                onClick={() => toggleLoginRestriction(user.id, user.isLoginRestricted)}
                                variant="ghost"
                                size="sm"
                                className={`${user.isLoginRestricted ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`}
                                title={user.isLoginRestricted ? 'Allow Login' : 'Restrict Login'}
                                disabled={user.role === 'super_admin' && currentUser.id === user.id}
                              >
                                {user.isLoginRestricted ? 
                                  <Unlock className="h-4 w-4" /> : 
                                  <UserMinus className="h-4 w-4" />
                                }
                              </Button>
                              
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete User"
                                disabled={user.role === 'super_admin' && currentUser.id === user.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
} 