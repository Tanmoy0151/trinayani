'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import PageHeader from '@/components/PageHeader';
import MaintenanceMode from '@/components/MaintenanceMode';

// Country codes for phone numbers
const countryCodes = [
  { code: '+91', country: 'India' },
  { code: '+1', country: 'USA/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+971', country: 'UAE' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
  { code: '+61', country: 'Australia' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+86', country: 'China' },
];

const jobOpenings = [
  {
    id: 1,
    title: 'Carl Zeiss Field service engineer',
    department: 'Engineering',
    location: 'Bihar/jharkhand',
    description: 'We are looking for a talented freshare Engineer to join our team. The ideal candidate has experience with basic electrical and electronics knowladge with hand on expreience using tool like tork wrench ,multimeter,earth tester.'
  },
  {
    id: 2,
    title: 'UX Designer',
    department: 'Design',
    location: 'Remote',
    description: 'Join our design team to create intuitive and engaging user experiences. You should have a strong portfolio showcasing your design process and outcomes.'
  },
  {
    id: 3,
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Hybrid',
    description: 'We need a Backend Engineer with experience in Node.js, Express, and database design. Knowledge of cloud infrastructure is a plus.'
  }
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91', // Default country code for India
    phone: '',
    coverLetter: '',
    resume: null as File | null,
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    coverLetter?: string;
    resume?: string;
    job?: string;
  }>({});
  
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isServerDown, setIsServerDown] = useState(false);

  // Clear errors when field is updated
  useEffect(() => {
    setErrors({});
  }, [formData, selectedJob]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when field is changed
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent event from bubbling up
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          resume: 'File size exceeds 5MB. Please choose a smaller file.' 
        }));
        return;
      }
      
      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        setErrors(prev => ({ 
          ...prev, 
          resume: 'Invalid file type. Please upload PDF, DOC, or DOCX files only.' 
        }));
        return;
      }
      
      setFormData(prev => ({ ...prev, resume: file }));
      
      // Clear resume error if exists
      if (errors.resume) {
        setErrors(prev => ({ ...prev, resume: undefined }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // Validate job selection
    if (!selectedJob) {
      newErrors.job = 'Please select a job position before submitting';
    }
    
    // Validate name (at least 3 characters)
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      newErrors.name = 'Please enter your full name (minimum 3 characters)';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate phone (optional but if provided, must be valid)
    if (formData.phone) {
      const phoneRegex = /^\d{10}$/; // Simple validation for 10-digit phone number
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
    }
    
    // Validate cover letter (optional but if provided, at least 50 characters)
    if (formData.coverLetter && formData.coverLetter.trim().length < 50) {
      newErrors.coverLetter = 'Cover letter should be at least 50 characters';
    }
    
    // Validate resume (required)
    if (!formData.resume) {
      newErrors.resume = 'Please upload your resume/CV';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    if (!validateForm()) {
      setSubmitResult({
        success: false,
        message: 'Please fix the errors in the form before submitting.'
      });
      return;
    }
    
    setSubmitting(true);
    setSubmitResult(null);
    
    try {
      // Create form data to send
      const submitFormData = new FormData();
      
      // Add all form fields to FormData
      submitFormData.append('name', formData.name);
      submitFormData.append('email', formData.email);
      submitFormData.append('phone', `${formData.countryCode}${formData.phone}`);
      submitFormData.append('coverLetter', formData.coverLetter);
      submitFormData.append('jobId', selectedJob!.toString());
      submitFormData.append('jobTitle', jobOpenings.find(job => job.id === selectedJob)?.title || '');
      
      // Add resume if available
      if (formData.resume) {
        submitFormData.append('resume', formData.resume);
      }
      
      const response = await fetch('/api/careers', {
        method: 'POST',
        body: submitFormData,
      });
      
      if (!response.ok) {
        throw new Error('Server responded with an error');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          countryCode: '+91',
          phone: '',
          coverLetter: '',
          resume: null,
        });
        setSelectedJob(null);
      }
      
      setSubmitResult({
        success: result.success,
        message: result.message
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitResult({
        success: false,
        message: 'Failed to submit application. Please try again later.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader 
        title="Careers" 
        description="Join our team and be part of something extraordinary. Check out our current openings below."
      />
      
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Current Openings</h2>
        <p className="text-gray-600 mb-6">
          Select a position you're interested in to apply. Click on any job card below or the "Apply Now" button to proceed.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobOpenings.map(job => (
            <div 
              key={job.id} 
              className={`border rounded-lg p-6 cursor-pointer transition-all ${
                selectedJob === job.id 
                  ? 'border-primary-500 bg-primary-50 shadow-md' 
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedJob(job.id)}
            >
              <h3 className="text-xl font-bold text-primary-700">{job.title}</h3>
              <div className="text-sm text-gray-500 mt-2">
                <span className="mr-4 inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  {job.department}
                </span>
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {job.location}
                </span>
              </div>
              <p className="mt-4 text-gray-700">{job.description}</p>
              <Button 
                className="mt-4 w-full"
                variant={selectedJob === job.id ? "default" : "outline"}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  setSelectedJob(job.id);
                  
                  // Clear job selection error if exists
                  if (errors.job) {
                    setErrors(prev => ({ ...prev, job: undefined }));
                  }
                  
                  window.scrollTo({
                    top: document.getElementById('application-form')?.offsetTop,
                    behavior: 'smooth'
                  });
                }}
              >
                {selectedJob === job.id ? 'Selected - Apply Now' : 'Apply Now'}
              </Button>
            </div>
          ))}
        </div>
        
        {errors.job && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {errors.job}
          </div>
        )}
      </section>
      
      <section id="application-form" className="my-12">
        <h2 className="text-2xl font-bold mb-4">
          {selectedJob 
            ? `Apply for ${jobOpenings.find(job => job.id === selectedJob)?.title}` 
            : 'Apply for a Position'}
        </h2>
        
        {!selectedJob && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-700 flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <p>Please select a job position from the list above before submitting your application.</p>
          </div>
        )}
        
        {submitResult && (
          <div className={`p-4 mb-6 rounded-md ${submitResult.success ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
            <div className="flex items-start">
              {submitResult.success ? (
                <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
              <p>{submitResult.message}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 border border-gray-200 rounded-md shadow-sm">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
                className={errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
                className={errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className={`flex ${errors.phone ? "border rounded-md border-red-300" : ""}`}>
              <select
                id="countryCode"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                className="rounded-l-md border-r-0 border-gray-300 bg-gray-50 text-gray-900 focus:border-primary-500 focus:ring-primary-500"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code} ({country.country})
                  </option>
                ))}
              </select>
              <Input 
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={`rounded-l-none ${errors.phone ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
            <p className="text-gray-500 text-sm">Format: 10-digit number without spaces or dashes</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea 
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows={6}
              placeholder="Tell us why you're interested in this position and what makes you a great fit"
              className={errors.coverLetter ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
            />
            {errors.coverLetter && (
              <p className="text-red-500 text-sm mt-1">{errors.coverLetter}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resume">Resume/CV <span className="text-red-500">*</span></Label>
            <div onClick={(e) => e.stopPropagation()}>
              <Input 
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className={`cursor-pointer ${errors.resume ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {errors.resume ? (
              <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
            ) : (
              <>
                <p className="text-sm text-gray-500">Accepted formats: PDF, DOC, DOCX. Max size: 5MB</p>
                <p className="text-sm text-blue-500">Your resume will be uploaded to our Google Drive folder for review.</p>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              type="submit" 
              className="md:w-auto"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Submit Application'}
            </Button>
            
            {formData.resume && !errors.resume && (
              <span className="text-green-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Resume attached: {formData.resume.name}
              </span>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-sm text-gray-500">
              <span className="text-red-500">*</span> Required fields
            </p>
          </div>
        </form>
      </section>
      
      {isServerDown && (
        <MaintenanceMode 
          plannedEndTime="2023-06-01T15:00:00Z" 
          message="We're upgrading our systems to serve you better."
        />
      )}
    </div>
  );
} 