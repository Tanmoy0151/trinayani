'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Briefcase, ClipboardList, MapPin, FileText, Clock, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { hasPermission } from '@/lib/auth';

// Mock data for tasks - in a real app, this would come from an API
const mockTasks = [
  {
    id: 't1',
    title: 'Equipment installation at Krishna Hospital',
    dueDate: '2023-12-15',
    priority: 'high',
    location: 'Mumbai',
    status: 'pending',
    type: 'installation'
  },
  {
    id: 't2',
    title: 'Maintenance check for X-ray machine',
    dueDate: '2023-12-12',
    priority: 'medium',
    location: 'Delhi',
    status: 'in-progress',
    type: 'maintenance'
  },
  {
    id: 't3',
    title: 'Client demo for new ultrasound equipment',
    dueDate: '2023-12-20',
    priority: 'high',
    location: 'Bangalore',
    status: 'scheduled',
    type: 'demo'
  },
  {
    id: 't4',
    title: 'Training session for hospital staff',
    dueDate: '2023-12-18',
    priority: 'medium',
    location: 'Chennai',
    status: 'scheduled',
    type: 'training'
  }
];

export default function EmployeeDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    upcoming: 0,
    total: 0
  });
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'scheduled': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate days remaining
  const getDaysRemaining = (dateStr: string) => {
    const dueDate = new Date(dateStr);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Check auth and load data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get user data from localStorage
        const storedUser = localStorage.getItem('user');
        
        if (!storedUser) {
          router.push('/login');
          return;
        }
        
        const user = JSON.parse(storedUser);
        
        // Super admin can access all dashboards
        if (user.role === 'super_admin') {
          setUserData(user);
          setUserPermissions(['tasks.view', 'tasks.update', 'expenses.create', 'expenses.view_own', 'client.view']);
          
          // For demo, use mock data
          setTasks(mockTasks);
          
          // Calculate stats
          const statusCounts = mockTasks.reduce((acc, task) => {
            if (task.status === 'completed') acc.completed++;
            else if (task.status === 'pending') acc.pending++;
            else acc.upcoming++;
            acc.total++;
            return acc;
          }, { completed: 0, pending: 0, upcoming: 0, total: 0 });
          
          setStats(statusCounts);
          setLoading(false);
          return;
        }
        
        // Check if user has permission to view employee dashboard
        if (!hasPermission(user, 'dashboard.employee.view')) {
          setPermissionError('You do not have permission to view the employee dashboard');
          return;
        }
        
        setUserData(user);
        
        // Get all permissions for this user's role
        const allPermissions = [];
        if (hasPermission(user, 'tasks.view')) allPermissions.push('tasks.view');
        if (hasPermission(user, 'tasks.update')) allPermissions.push('tasks.update');
        if (hasPermission(user, 'expenses.create')) allPermissions.push('expenses.create');
        if (hasPermission(user, 'expenses.view_own')) allPermissions.push('expenses.view_own');
        if (hasPermission(user, 'client.view')) allPermissions.push('client.view');
        
        setUserPermissions(allPermissions);
        
        // In a real app, fetch tasks from API
        // const response = await fetch('/api/employee/tasks');
        // const data = await response.json();
        
        // For demo, use mock data
        setTasks(mockTasks);
        
        // Calculate stats
        const statusCounts = mockTasks.reduce((acc, task) => {
          if (task.status === 'completed') acc.completed++;
          else if (task.status === 'pending') acc.pending++;
          else acc.upcoming++;
          acc.total++;
          return acc;
        }, { completed: 0, pending: 0, upcoming: 0, total: 0 });
        
        setStats(statusCounts);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Permission error state
  if (permissionError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {permissionError}
              </p>
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push('/')}
                >
                  Go to homepage
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <PageHeader 
          title="Field Employee Dashboard" 
          description={`Welcome back, ${userData?.name || 'Field Employee'}`} 
        />
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={() => router.push('/employee/profile')}
          >
            Profile
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-blue-50">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500 font-medium">Total Tasks</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-green-50">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500 font-medium">Completed</div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-amber-50">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500 font-medium">Pending</div>
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-purple-50">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500 font-medium">Upcoming</div>
              <div className="text-2xl font-bold text-purple-600">{stats.upcoming}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tasks List */}
      {userPermissions.includes('tasks.view') && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Your Tasks</h2>
            <Link href="/employee/tasks" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          
          <div className="divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <div className="p-6 text-center">
                <ClipboardList className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <h3 className="text-base font-medium text-gray-900 mb-1">No tasks assigned</h3>
                <p className="text-sm text-gray-500">
                  You don't have any tasks assigned yet.
                </p>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h3 className="text-base font-medium text-gray-900 mr-2">{task.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {task.location}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                        
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        Due: {formatDate(task.dueDate)}
                      </div>
                      
                      {getDaysRemaining(task.dueDate) > 0 ? (
                        <div className="text-xs text-amber-600">
                          {getDaysRemaining(task.dueDate)} days remaining
                        </div>
                      ) : (
                        <div className="text-xs text-red-600">
                          Overdue by {Math.abs(getDaysRemaining(task.dueDate))} days
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {userPermissions.includes('tasks.update') && (
                    <div className="mt-4 flex justify-end">
                      <Link href={`/employee/tasks/${task.id}`}>
                        <Button size="sm" variant="outline">Update Status</Button>
                      </Link>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-medium text-gray-900 mb-3">Quick Links</h3>
          <div className="space-y-2">
            {userPermissions.includes('expenses.create') && (
              <Link href="/employee/expenses/new" className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <span>Submit Expenses</span>
              </Link>
            )}
            
            {userPermissions.includes('expenses.view_own') && (
              <Link href="/employee/expenses" className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <span>View Expenses</span>
              </Link>
            )}
            
            {userPermissions.includes('tasks.view') && (
              <Link href="/employee/schedule" className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <span>View Schedule</span>
              </Link>
            )}
            
            {userPermissions.includes('client.view') && (
              <Link href="/employee/clients" className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <span>Client Directory</span>
              </Link>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:col-span-2">
          <h3 className="text-base font-medium text-gray-900 mb-3">Upcoming Schedule</h3>
          {tasks.filter(task => task.status === 'scheduled').length === 0 ? (
            <div className="p-6 text-center">
              <Calendar className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                No upcoming tasks scheduled.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.filter(task => task.status === 'scheduled').map(task => (
                <div key={task.id} className="flex items-center p-2 border border-gray-100 rounded-md hover:bg-gray-50">
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-md flex items-center justify-center text-blue-600">
                    <div className="text-center">
                      <div className="text-xs font-semibold">{new Date(task.dueDate).toLocaleString('default', { month: 'short' })}</div>
                      <div className="text-lg font-bold">{new Date(task.dueDate).getDate()}</div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{task.title}</div>
                    <div className="text-sm text-gray-500">{task.location}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 