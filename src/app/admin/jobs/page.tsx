'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Plus, Edit, Trash, CheckCircle, XCircle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JobOpening } from '@/data/job-openings';

export default function JobsManagementPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    // Check if user is logged in and has appropriate role
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      router.push('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      
      // Only admin roles should access this page
      if (parsedUser.role !== 'super_admin' && parsedUser.role !== 'backoffice_admin' && parsedUser.role !== 'admin') {
        router.push('/unauthorized');
        return;
      }
      
      fetchJobs();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);
  
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      const jobOpeningsData = await import('@/data/job-openings').then(module => module.default);
      setJobs(jobOpeningsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleJobStatus = async (jobId: number) => {
    try {
      // Find the job
      const job = jobs.find(j => j.id === jobId);
      if (!job) return;
      
      // In a real app, this would be an API call to update the job
      const updatedJobs = jobs.map(j => 
        j.id === jobId ? { ...j, isActive: !j.isActive } : j
      );
      
      setJobs(updatedJobs);
      
      setSuccessMessage(`Job ${!job.isActive ? 'activated' : 'deactivated'} successfully`);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error updating job status:', error);
      setError('Failed to update job status. Please try again.');
    }
  };
  
  const deleteJob = async (jobId: number) => {
    if (!confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }
    
    try {
      // In a real app, this would be an API call to delete the job
      setJobs(jobs.filter(job => job.id !== jobId));
      
      setSuccessMessage('Job deleted successfully');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Failed to delete job. Please try again.');
    }
  };
  
  // Filter jobs based on search query and status filter
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery.trim() === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && job.isActive) || 
      (statusFilter === 'inactive' && !job.isActive);
    
    return matchesSearch && matchesStatus;
  });
  
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
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <PageHeader 
          title="Job Management"
          description="Manage job postings and track applications"
        />
        
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => router.push('/admin/jobs/new')}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Job
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-start">
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
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
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
            onClick={fetchJobs}
            title="Refresh jobs"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Job Postings</h2>
        </div>
        
        {filteredJobs.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 text-gray-500 mb-4">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? "No jobs match your search criteria. Try adjusting your filters."
                : "You haven't added any job postings yet."
              }
            </p>
            
            {!searchQuery && statusFilter === 'all' && (
              <Button
                onClick={() => router.push('/admin/jobs/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Job
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className={!job.isActive ? 'bg-gray-50' : 'hover:bg-gray-50'}>
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
                      <div className="text-sm text-gray-500">{job.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(job.postedAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => router.push(`/admin/jobs/edit/${job.id}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Job"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => toggleJobStatus(job.id)}
                          className={`${job.isActive ? 'text-amber-600 hover:text-amber-900' : 'text-green-600 hover:text-green-900'}`}
                          title={job.isActive ? 'Deactivate Job' : 'Activate Job'}
                        >
                          {job.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </button>
                        
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Job"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
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
  );
} 