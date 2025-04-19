export interface Application {
  id: string;
  userId: number;
  jobId: number;
  jobTitle: string;
  appliedAt: string;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  resume?: string;
  coverLetter?: string;
  notes?: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  phone?: string;
  role: 'user' | 'admin';
  createdAt: string;
  applications: Application[];
}

// Mock users data
export const users: User[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // This would be hashed in a real app
    phone: '+918123456789',
    role: 'user',
    createdAt: '2023-05-15T10:00:00Z',
    applications: [
      {
        id: 'app-001',
        userId: 1,
        jobId: 101,
        jobTitle: 'Medical Equipment Technician',
        appliedAt: '2023-06-10T14:30:00Z',
        status: 'interview',
      },
      {
        id: 'app-002',
        userId: 1,
        jobId: 102,
        jobTitle: 'Sales Executive - Medical Devices',
        appliedAt: '2023-07-05T09:15:00Z',
        status: 'pending',
      }
    ]
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password456', // This would be hashed in a real app
    role: 'user',
    createdAt: '2023-06-20T11:30:00Z',
    applications: [
      {
        id: 'app-003',
        userId: 2,
        jobId: 103,
        jobTitle: 'Customer Support Specialist',
        appliedAt: '2023-07-12T16:45:00Z',
        status: 'reviewing',
      }
    ]
  },
  {
    id: 3,
    firstName: 'Admin',
    lastName: 'User',
    name: 'Admin User',
    email: 'admin@trinayanimedical.com',
    password: 'admin123', // This would be hashed in a real app
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z',
    applications: []
  }
];

// Additional mock applications with corrected property names
export const additionalApplications: Application[] = [
  {
    id: 'APP-0001',
    userId: 1,
    jobId: 1,
    jobTitle: 'Medical Equipment Sales Representative',
    status: 'interview',
    appliedAt: '2023-03-10T09:15:00Z',
    resume: '/uploads/john_doe_resume.pdf',
    notes: 'Candidate has excellent communication skills. Scheduled for second interview.'
  },
  {
    id: 'APP-0002',
    userId: 2,
    jobId: 2,
    jobTitle: 'Service Engineer',
    status: 'pending',
    appliedAt: '2023-04-12T16:20:00Z',
    resume: '/uploads/jane_smith_resume.pdf'
  },
  {
    id: 'APP-0003',
    userId: 4, // Imaginary user
    jobId: 3,
    jobTitle: 'Technical Support Specialist',
    status: 'rejected',
    appliedAt: '2023-03-22T13:10:00Z',
    resume: '/uploads/mike_resume.pdf',
    notes: 'Not enough experience with medical equipment.'
  },
  {
    id: 'APP-0004',
    userId: 5, // Imaginary user
    jobId: 1,
    jobTitle: 'Medical Equipment Sales Representative',
    status: 'accepted',
    appliedAt: '2023-02-28T10:30:00Z',
    resume: '/uploads/susan_resume.pdf',
    notes: 'Excellent candidate with relevant experience. Offer sent.'
  },
  {
    id: 'APP-0005',
    userId: 6, // Imaginary user
    jobId: 4,
    jobTitle: 'Marketing Specialist',
    status: 'reviewing',
    appliedAt: '2023-04-18T14:45:00Z',
    resume: '/uploads/tom_resume.pdf',
    notes: 'Good portfolio. Need to check references.'
  }
];

// Function to find user by email
export function findUserByEmail(email: string): User | undefined {
  return users.find(user => user.email === email);
}

// Function to find application by ID
export function findApplicationById(id: string): Application | undefined {
  // First look in user applications
  for (const user of users) {
    const application = user.applications.find(app => app.id === id);
    if (application) return application;
  }
  
  // Then check additional applications
  return additionalApplications.find(app => app.id === id);
}

// Function to get applications for a user
export function getUserApplications(userId: number): Application[] {
  const user = users.find(u => u.id === userId);
  return user?.applications || [];
}

// Function to update user profile data
export function updateUserProfile(userId: number, data: Partial<User>): User | null {
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return null;
  }
  
  // Update user data, but don't override the password, role, or applications
  users[userIndex] = {
    ...users[userIndex],
    ...data,
    password: users[userIndex].password,
    role: users[userIndex].role,
    applications: users[userIndex].applications,
  };
  
  return users[userIndex];
}

// Function to add a new application
export function addApplication(application: Omit<Application, 'id'>): Application {
  const newApplication: Application = {
    ...application,
    id: `app-${Date.now()}`,
  };
  
  const userIndex = users.findIndex(u => u.id === application.userId);
  
  if (userIndex !== -1) {
    users[userIndex].applications.push(newApplication);
  }
  
  return newApplication;
}

// Function to update application status
export function updateApplicationStatus(id: string, status: Application['status'], notes?: string): Application | null {
  // First try to find in user applications
  for (const user of users) {
    const appIndex = user.applications.findIndex(app => app.id === id);
    if (appIndex !== -1) {
      user.applications[appIndex].status = status;
      if (notes) user.applications[appIndex].notes = notes;
      return user.applications[appIndex];
    }
  }
  
  // Then try additional applications
  const appIndex = additionalApplications.findIndex(app => app.id === id);
  if (appIndex !== -1) {
    additionalApplications[appIndex].status = status;
    if (notes) additionalApplications[appIndex].notes = notes;
    return additionalApplications[appIndex];
  }
  
  return null;
} 