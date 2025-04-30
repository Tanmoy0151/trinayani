'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function NewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    experience: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    isActive: true
  });
  
  // Handle text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle array inputs (requirements and responsibilities)
  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    index: number, 
    field: 'requirements' | 'responsibilities'
  ) => {
    const { value } = e.target;
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };
  
  // Add new item to array
  const handleAddItem = (field: 'requirements' | 'responsibilities') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };
  
  // Remove item from array
  const handleRemoveItem = (index: number, field: 'requirements' | 'responsibilities') => {
    if (formData[field].length <= 1) return; // Keep at least one item
    
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);
    
    try {
      // Filter out empty items from arrays
      const cleanedFormData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        responsibilities: formData.responsibilities.filter(resp => resp.trim() !== '')
      };
      
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanedFormData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create job posting');
      }
      
      setSuccess(true);
      
      // Reset form or redirect after success
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating job:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while creating the job posting');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader 
        title="Create New Job Posting"
        description="Add a new job opening to the careers page"
      />
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Job posting created successfully! Redirecting to dashboard...</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input 
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Medical Equipment Sales Representative"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Sales"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Mumbai, India"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Employment Type</Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Required</Label>
                <Input 
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 3-5 years"
                />
              </div>
              
              <div className="space-y-2 flex items-center">
                <div className="flex items-center">
                  <Input 
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                  />
                  <Label htmlFor="isActive">Active Job Posting</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea 
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Provide a detailed description of the job"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Requirements</Label>
                <Button 
                  type="button" 
                  onClick={() => handleAddItem('requirements')}
                  variant="outline"
                  size="sm"
                >
                  Add Requirement
                </Button>
              </div>
              
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={req}
                    onChange={e => handleArrayChange(e, index, 'requirements')}
                    placeholder={`Requirement ${index + 1}`}
                    className="flex-grow"
                  />
                  {formData.requirements.length > 1 && (
                    <Button 
                      type="button" 
                      onClick={() => handleRemoveItem(index, 'requirements')}
                      variant="outline"
                      className="flex-shrink-0 w-8 h-8 p-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M18 6L6 18M6 6l12 12"></path>
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Responsibilities</Label>
                <Button 
                  type="button" 
                  onClick={() => handleAddItem('responsibilities')}
                  variant="outline"
                  size="sm"
                >
                  Add Responsibility
                </Button>
              </div>
              
              {formData.responsibilities.map((resp, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={resp}
                    onChange={e => handleArrayChange(e, index, 'responsibilities')}
                    placeholder={`Responsibility ${index + 1}`}
                    className="flex-grow"
                  />
                  {formData.responsibilities.length > 1 && (
                    <Button 
                      type="button" 
                      onClick={() => handleRemoveItem(index, 'responsibilities')}
                      variant="outline" 
                      className="flex-shrink-0 w-8 h-8 p-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M18 6L6 18M6 6l12 12"></path>
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                onClick={() => router.back()}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : 'Create Job Posting'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 