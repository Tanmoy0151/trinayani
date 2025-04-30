'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Briefcase, Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Application {
  id: string;
  jobId: number;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  lastUpdated: string;
}

// Mock data for applications
const mockApplications: Application[] = [
  {
    id: 'APP001',
    jobId: 1,
    jobTitle: 'Medical Sales Representative',
    company: 'Trinayani Medical',
    appliedAt: '2023-10-15',
    status: 'interview',
    lastUpdated: '2023-10-25'
  },
  {
    id: 'APP002',
    jobId: 2,
    jobTitle: 'Technical Support Specialist',
    company: 'Trinayani Medical',
    appliedAt: '2023-11-02',
    status: 'reviewing',
    lastUpdated: '2023-11-05'
  },
  {
    id: 'APP003',
    jobId: 3,
    jobTitle: 'Marketing Coordinator',
    company: 'Trinayani Medical',
    appliedAt: '2023-11-10',
    status: 'pending',
    lastUpdated: '2023-11-10'
  },
  {
    id: 'APP004',
    jobId: 4,
    jobTitle: 'Customer Service Representative',
    company: 'Trinayani Medical',
    appliedAt: '2023-09-22',
    status: 'rejected',
    lastUpdated: '2023-10-05'
  },
  {
    id: 'APP005',
    jobId: 5,
    jobTitle: 'Sales Assistant',
    company: 'Trinayani Medical',
    appliedAt: '2023-08-15',
    status: 'accepted',
    lastUpdated: '2023-09-01'
  }
];

export default function ApplicantDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchApplications();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);
  
  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch data from API
      // For this demo, we'll use mock data
      setTimeout(() => {
        setApplications(mockApplications);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };
  
  const filteredApplications = applications.filter(app => 
    app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'reviewing':
        return <Search className="h-5 w-5 text-blue-500" />;
      case 'interview':
        return <Briefcase className="h-5 w-5 text-purple-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Application Received';
      case 'reviewing':
        return 'Under Review';
      case 'interview':
        return 'Interview Stage';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Not Selected';
      default:
        return status;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <RoleGuard allowedRoles={['applicant', 'super_admin']}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <PageHeader 
              title={`Welcome, ${user?.name || 'Applicant'}`}
              description="Track your job applications and search for new opportunities"
            />
          </div>
          
          <Button onClick={handleLogout} variant="outline">
            Sign Out
          </Button>
        </div>
        
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <div className="text-blue-500 font-medium">Active Applications</div>
              <div className="text-2xl font-bold mt-2">
                {applications.filter(a => ['pending', 'reviewing', 'interview'].includes(a.status)).length}
              </div>
            </div>
            
            <div className="bg-green-50 p-5 rounded-lg border border-green-100">
              <div className="text-green-500 font-medium">Accepted</div>
              <div className="text-2xl font-bold mt-2">
                {applications.filter(a => a.status === 'accepted').length}
              </div>
            </div>
            
            <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
              <div className="text-purple-500 font-medium">Interview Stage</div>
              <div className="text-2xl font-bold mt-2">
                {applications.filter(a => a.status === 'interview').length}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Link href="/careers">
              <Button className="w-full md:w-auto">
                Browse New Job Openings
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <h2 className="text-xl font-bold">Your Applications</h2>
          
          <div className="w-full md:w-72">
            <Input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-4">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No applications found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchQuery ? (
                  "No applications match your search criteria."
                ) : (
                  "You haven't applied to any jobs yet. Browse our job listings to get started."
                )}
              </p>
              <div className="mt-6">
                <Link href="/careers">
                  <Button>Browse Job Openings</Button>
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
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Application ID
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Job Title
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Applied Date
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Updated
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{application.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.jobTitle}</div>
                        <div className="text-xs text-gray-500">{application.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(application.appliedAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(application.status)}
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(application.lastUpdated)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/applicant/applications/${application.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </Link>
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