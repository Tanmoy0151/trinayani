export interface JobOpening {
  id: number;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedAt: string;
  isActive: boolean;
}

const jobOpenings: JobOpening[] = [
  {
    id: 1,
    title: 'Medical Equipment Sales Representative',
    department: 'Sales',
    location: 'Mumbai, India',
    type: 'Full-time',
    experience: '3-5 years',
    description: 'We are seeking a motivated Medical Equipment Sales Representative to join our sales team. In this role, you will be responsible for promoting and selling our GE Healthcare and Carl Zeiss medical equipment to hospitals and healthcare providers.',
    requirements: [
      'Bachelor\'s degree in business, marketing, or a related field',
      '3-5 years of experience in medical equipment sales',
      'Strong knowledge of medical equipment and healthcare industry',
      'Excellent communication and negotiation skills',
      'Willingness to travel within the assigned territory'
    ],
    responsibilities: [
      'Develop and maintain relationships with clients in the healthcare industry',
      'Demonstrate and present medical equipment to potential customers',
      'Negotiate sales terms and close deals',
      'Meet or exceed sales targets',
      'Stay updated on product developments and competitor activities',
      'Attend trade shows and industry conferences'
    ],
    postedAt: '2023-05-15T10:00:00Z',
    isActive: true
  },
  {
    id: 2,
    title: 'Service Engineer',
    department: 'Technical Support',
    location: 'Delhi, India',
    type: 'Full-time',
    experience: '2-4 years',
    description: 'We are looking for a skilled Service Engineer to maintain and repair medical equipment at client sites. The ideal candidate will have experience with diagnostic imaging equipment and a strong technical background.',
    requirements: [
      'Bachelor\'s degree in biomedical engineering, electronics, or a related field',
      '2-4 years of experience in servicing medical equipment',
      'Knowledge of diagnostic imaging systems (CT, MRI, etc.)',
      'Strong troubleshooting and problem-solving skills',
      'Good customer service orientation'
    ],
    responsibilities: [
      'Install, maintain, and repair medical equipment at customer sites',
      'Perform preventive maintenance according to schedules',
      'Diagnose and resolve technical issues',
      'Document service activities and maintain service records',
      'Train customers on equipment operation and basic maintenance',
      'Maintain inventory of spare parts'
    ],
    postedAt: '2023-06-02T14:30:00Z',
    isActive: true
  },
  {
    id: 3,
    title: 'Technical Support Specialist',
    department: 'Customer Service',
    location: 'Bangalore, India',
    type: 'Full-time',
    experience: '1-3 years',
    description: 'Join our technical support team to provide remote assistance to customers using our medical equipment. You will troubleshoot issues, guide users through solutions, and ensure customer satisfaction.',
    requirements: [
      'Bachelor\'s degree in a technical field',
      '1-3 years of experience in technical support',
      'Understanding of medical equipment or healthcare technology',
      'Strong communication and problem-solving skills',
      'Ability to explain technical concepts in simple terms'
    ],
    responsibilities: [
      'Respond to customer inquiries via phone and email',
      'Troubleshoot and resolve technical issues remotely',
      'Escalate complex problems to the appropriate teams',
      'Document all support interactions',
      'Contribute to knowledge base and support documentation',
      'Identify trends in customer issues for product improvement'
    ],
    postedAt: '2023-06-10T09:15:00Z',
    isActive: true
  },
  {
    id: 4,
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    experience: '2-4 years',
    description: 'We are seeking a creative Marketing Specialist to develop and implement marketing strategies for our medical equipment products. The ideal candidate will have experience in healthcare marketing and digital campaign management.',
    requirements: [
      'Bachelor\'s degree in marketing, communications, or a related field',
      '2-4 years of experience in marketing, preferably in healthcare',
      'Experience with digital marketing platforms and analytics',
      'Strong content creation and copywriting skills',
      'Knowledge of marketing automation tools'
    ],
    responsibilities: [
      'Develop marketing campaigns for medical equipment products',
      'Create compelling content for website, social media, and marketing materials',
      'Manage email marketing campaigns',
      'Analyze marketing metrics and adjust strategies accordingly',
      'Coordinate with sales team to support lead generation',
      'Stay updated on industry trends and competitor activities'
    ],
    postedAt: '2023-05-28T11:45:00Z',
    isActive: true
  },
  {
    id: 5,
    title: 'Quality Assurance Specialist',
    department: 'Operations',
    location: 'Chennai, India',
    type: 'Full-time',
    experience: '3-5 years',
    description: 'We are looking for a detail-oriented Quality Assurance Specialist to ensure our medical equipment meets all quality standards and regulatory requirements before delivery to customers.',
    requirements: [
      'Bachelor\'s degree in engineering, quality management, or a related field',
      '3-5 years of experience in quality assurance, preferably in medical devices',
      'Knowledge of ISO 13485 and other relevant standards',
      'Experience with quality management systems',
      'Strong attention to detail and analytical skills'
    ],
    responsibilities: [
      'Conduct quality inspections of medical equipment',
      'Verify compliance with quality standards and specifications',
      'Document quality procedures and test results',
      'Investigate quality issues and implement corrective actions',
      'Collaborate with technical teams to improve product quality',
      'Stay updated on regulatory requirements and industry standards'
    ],
    postedAt: '2023-06-05T13:30:00Z',
    isActive: false
  }
];

/**
 * Add a new job posting
 * @param job The job posting to add (without id)
 * @returns The added job with an id
 */
export function addJobPosting(job: Omit<JobOpening, 'id' | 'postedAt'>): JobOpening {
  // Generate the next ID
  const maxId = Math.max(...jobOpenings.map(j => j.id));
  const newId = maxId + 1;
  
  // Create new job with current timestamp
  const newJob: JobOpening = {
    ...job,
    id: newId,
    postedAt: new Date().toISOString(),
  };
  
  // Add to array
  jobOpenings.push(newJob);
  
  return newJob;
}

/**
 * Update an existing job posting
 * @param id The ID of the job to update
 * @param jobData The updated job data
 * @returns The updated job or null if not found
 */
export function updateJobPosting(id: number, jobData: Partial<Omit<JobOpening, 'id'>>): JobOpening | null {
  const index = jobOpenings.findIndex(job => job.id === id);
  
  if (index === -1) {
    return null;
  }
  
  jobOpenings[index] = {
    ...jobOpenings[index],
    ...jobData,
  };
  
  return jobOpenings[index];
}

/**
 * Get a job by ID
 * @param id The ID of the job to find
 * @returns The job or undefined if not found
 */
export function getJobById(id: number): JobOpening | undefined {
  return jobOpenings.find(job => job.id === id);
}

export default jobOpenings; 