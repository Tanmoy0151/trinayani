'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { JobOpening } from '@/data/job-openings';
import PageHeader from '@/components/PageHeader';

export default function EditJobClient({ id }: { id: string }) {
  const router = useRouter();
  const jobId = parseInt(id);
  
  const [formData, setFormData] = useState<Omit<JobOpening, 'id' | 'postedAt'>>({
    title: '',
    department: '',
    location: '',
    type: 'Full-time' as 'Full-time' | 'Part-time' | 'Contract' | 'Internship',
    experience: '',
    description: '',
    requirements: [],
    responsibilities: [],
    isActive: true
  });
  
  const [requirementsText, setRequirementsText] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is logged in and has appropriate role
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      console.warn('EditJobPage: No user data found in localStorage. Redirecting to login page.');
      router.push('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      console.log('EditJobPage: User data retrieved.', { role: parsedUser.role, jobId });
      
      // Only admin roles should access this page
      if (parsedUser.role !== 'super_admin' && parsedUser.role !== 'backoffice_admin' && parsedUser.role !== 'admin') {
        console.warn(`EditJobPage: Unauthorized access attempt. User role: ${parsedUser.role}`);
        router.push('/unauthorized');
        return;
      }
      
      fetchJobData();
    } catch (error) {
      console.error('EditJobPage: Error parsing user data:', error);
      router.push('/login');
    }
  }, [router, jobId]);
  
  const fetchJobData = async () => {
    setLoading(true);
    setError(null);
    console.log(`EditJobPage: Fetching job data for ID: ${jobId}`);
    
    try {
      // In a real app, this would be an API call to get job by ID
      const jobOpeningsModule = await import('@/data/job-openings');
      const job = jobOpeningsModule.getJobById(jobId);
      
      if (!job) {
        console.error(`EditJobPage: Job not found for ID: ${jobId}`);
        setError('Job not found');
        return;
      }
      
      console.log(`EditJobPage: Job data retrieved successfully for ID: ${jobId}`);
      
      // Set form data from job
      const { id, postedAt, ...jobData } = job;
      setFormData(jobData);
      
      // Convert arrays to newline-separated text for editing
      setRequirementsText(job.requirements.join('\n'));
      setResponsibilitiesText(job.responsibilities.join('\n'));
    } catch (error) {
      console.error('EditJobPage: Error fetching job data:', error);
      setError('Failed to load job data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // For checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    console.log(`EditJobPage: Submitting job update for ID: ${jobId}`);
    
    try {
      // Process requirements and responsibilities from text to arrays
      const requirements = requirementsText
        .split('\n')
        .filter(line => line.trim() !== '');
      
      const responsibilities = responsibilitiesText
        .split('\n')
        .filter(line => line.trim() !== '');
      
      // Create updated job data
      const updatedJob = {
        ...formData,
        requirements,
        responsibilities
      };
      
      console.log('EditJobPage: Processed form data for submission', { 
        title: updatedJob.title,
        department: updatedJob.department,
        requirementsCount: requirements.length,
        responsibilitiesCount: responsibilities.length
      });
      
      // In a real app, this would be an API call to update the job
      const jobOpeningsModule = await import('@/data/job-openings');
      jobOpeningsModule.updateJobPosting(jobId, updatedJob);
      
      console.log(`EditJobPage: Job updated successfully for ID: ${jobId}`);
      setSuccess('Job updated successfully');
      
      // Navigate back to jobs list after short delay
      setTimeout(() => {
        console.log('EditJobPage: Redirecting to jobs list');
        router.push('/admin/jobs');
      }, 1500);
    } catch (error) {
      console.error('EditJobPage: Error updating job:', error);
      setError('Failed to update job. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/jobs')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <PageHeader 
          title="Edit Job Posting"
          description="Update the details of this job posting"
        />
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
          {success}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Employment Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Experience <span className="text-red-500">*</span>
              </label>
              <Input
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                className="w-full"
                placeholder="e.g. 3-5 years"
              />
            </div>
            
            <div>
              <label htmlFor="isActive" className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Active job posting</span>
              </label>
              <p className="text-gray-500 text-xs mt-1">
                Inactive jobs will not be visible to job seekers
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Job Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full h-32"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
              Requirements <span className="text-red-500">*</span>
            </label>
            <p className="text-gray-500 text-xs mb-2">
              Enter each requirement on a new line
            </p>
            <Textarea
              id="requirements"
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              required
              className="w-full h-32"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-1">
              Responsibilities <span className="text-red-500">*</span>
            </label>
            <p className="text-gray-500 text-xs mb-2">
              Enter each responsibility on a new line
            </p>
            <Textarea
              id="responsibilities"
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              required
              className="w-full h-32"
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => router.push('/admin/jobs')}
            >
              Cancel
            </Button>
            
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Job'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 