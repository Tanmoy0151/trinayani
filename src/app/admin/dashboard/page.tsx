'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Application } from '@/data/users';
import { JobOpening } from '@/data/job-openings';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [user, setUser] = useState<{ id: number; name: string; email: string; role: string } | null>(null);
  const [selectedTab, setSelectedTab] = useState<'applications' | 'jobs'>('applications');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      router.push('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      
      if (parsedUser.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      
      setUser(parsedUser);
      fetchData();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);
  
  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch applications
      const applicationsResponse = await fetch('/api/applications');
      const applicationsData = await applicationsResponse.json();
      
      if (applicationsData.success) {
        setApplications(applicationsData.applications);
      }
      
      // In a real app, you would fetch job openings from an API
      // For this demo, we're mocking the data
      const jobOpeningsData = await import('@/data/job-openings').then(module => module.default);
      setJobOpenings(jobOpeningsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };
  
  const updateApplicationStatus = async (id: string, status: Application['status']) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the application in the local state
        setApplications(prevApplications => 
          prevApplications.map(app => 
            app.id === id ? { ...app, status } : app
          )
        );
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };
  
  const toggleJobActiveStatus = (id: number) => {
    setJobOpenings(prevJobs => 
      prevJobs.map(job => 
        job.id === id ? { ...job, isActive: !job.isActive } : job
      )
    );
  };
  
  const getStatusColorClass = (status: string) => {
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
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Filter applications based on status and search query
  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = searchQuery.trim() === '' || 
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
  
  // Filter job openings based on search query
  const filteredJobs = jobOpenings.filter(job => 
    searchQuery.trim() === '' || 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <PageHeader 
          title={`Admin Dashboard`}
          description="Manage job applications and job postings"
        />
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Logged in as <span className="font-medium">{user?.name}</span>
          </span>
          <Button 
            onClick={handleLogout}
            variant="outline"
          >
            Sign Out
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="sm:hidden">
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            value={selectedTab}
            onChange={(e) => setSelectedTab(e.target.value as 'applications' | 'jobs')}
          >
            <option value="applications">Applications</option>
            <option value="jobs">Job Postings</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setSelectedTab('applications')}
                className={`${
                  selectedTab === 'applications'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Applications
              </button>
              <button
                onClick={() => setSelectedTab('jobs')}
                className={`${
                  selectedTab === 'jobs'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Job Postings
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        {selectedTab === 'applications' && (
          <div className="flex space-x-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              className="text-xs py-1 h-8"
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('pending')}
              className="text-xs py-1 h-8"
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === 'reviewing' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('reviewing')}
              className="text-xs py-1 h-8"
            >
              Reviewing
            </Button>
            <Button
              variant={statusFilter === 'interview' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('interview')}
              className="text-xs py-1 h-8"
            >
              Interview
            </Button>
            <Button
              variant={statusFilter === 'accepted' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('accepted')}
              className="text-xs py-1 h-8"
            >
              Accepted
            </Button>
            <Button
              variant={statusFilter === 'rejected' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('rejected')}
              className="text-xs py-1 h-8"
            >
              Rejected
            </Button>
          </div>
        )}
        
        {selectedTab === 'jobs' && (
          <Button className="text-xs py-1 h-8">
            <Link href="/admin/jobs/new">Add New Job</Link>
          </Button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {selectedTab === 'applications' ? (
          <>
            <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Job Applications</h2>
              <span className="text-sm text-gray-500">
                {filteredApplications.length} application(s) found
              </span>
            </div>
            
            {filteredApplications.length === 0 ? (
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No applications match your current filters.
                </p>
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
                        ID
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Position
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date Applied
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
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{application.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{application.jobTitle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(application.appliedAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(application.status)}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-3">
                            <Link
                              href={`/admin/applications/${application.id}`}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              View
                            </Link>
                            <div className="relative inline-block text-left">
                              <select
                                className="block w-32 rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 text-sm"
                                value={application.status}
                                onChange={(e) => updateApplicationStatus(application.id, e.target.value as Application['status'])}
                              >
                                <option value="pending">Pending</option>
                                <option value="reviewing">Reviewing</option>
                                <option value="interview">Interview</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Job Postings</h2>
              <span className="text-sm text-gray-500">
                {filteredJobs.length} job(s) found
              </span>
            </div>
            
            {filteredJobs.length === 0 ? (
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No job postings match your search.
                </p>
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
                        Title
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Department
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Location
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Posted Date
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
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{job.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{job.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{job.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(job.postedAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {job.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <Link
                              href={`/admin/jobs/${job.id}`}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => toggleJobActiveStatus(job.id)}
                              className={job.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                            >
                              {job.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 