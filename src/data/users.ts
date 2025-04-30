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
  role: 'user' | 'admin' | 'field_employee' | 'super_admin' | 'backoffice_admin' | 'applicant';
  createdAt: string;
  applications: Application[];
  isActive: boolean;
  isLoginRestricted: boolean;
  permissions?: {
    users?: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
      manage_roles: boolean;
    };
    jobs?: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    applications?: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    system?: {
      manage_settings: boolean;
      view_logs: boolean;
      manage_backups: boolean;
    };
  };
}

// Mock users data
export const users: User[] = [
  {
    id: 1,
    firstName: 'Applicant',
    lastName: 'User',
    name: 'Applicant User',
    email: 'applicant@example.com',
    password: 'password123', // This would be hashed in a real app
    role: 'applicant',
    createdAt: '2023-05-15T10:00:00Z',
    applications: [],
    isActive: true,
    isLoginRestricted: false
  },
  {
    id: 2,
    firstName: 'Field',
    lastName: 'Employee',
    name: 'Field Employee',
    email: 'fieldemployee@example.com',
    password: 'password456', // This would be hashed in a real app
    role: 'field_employee',
    createdAt: '2023-06-20T11:30:00Z',
    applications: [],
    isActive: true,
    isLoginRestricted: false
  },
  {
    id: 3,
    firstName: 'Admin',
    lastName: 'User',
    name: 'Admin User',
    email: 'admin@trinayanimedical.com',
    password: 'admin123', // This would be hashed in a real app
    role: 'backoffice_admin',
    createdAt: '2023-01-01T00:00:00Z',
    applications: [],
    isActive: true,
    isLoginRestricted: false
  },
  {
    id: 4,
    firstName: 'Super',
    lastName: 'Admin',
    name: 'Super Admin',
    email: 'superadmin@trinayanimedical.com',
    password: 'super123', // This would be hashed in a real app
    role: 'super_admin',
    createdAt: '2022-12-01T00:00:00Z',
    applications: [],
    isActive: true,
    isLoginRestricted: false,
    permissions: {
      users: {
        create: true,
        read: true,
        update: true,
        delete: true,
        manage_roles: true
      },
      jobs: {
        create: true,
        read: true,
        update: true,
        delete: true
      },
      applications: {
        create: true,
        read: true,
        update: true,
        delete: true
      },
      system: {
        manage_settings: true,
        view_logs: true,
        manage_backups: true
      }
    }
  },
  {
    id: 5,
    firstName: 'Regular',
    lastName: 'User',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password789', // This would be hashed in a real app
    role: 'user',
    createdAt: '2023-08-15T14:30:00Z',
    applications: [],
    isActive: true,
    isLoginRestricted: false
  },
  {
    id: 6,
    firstName: 'Standard',
    lastName: 'Admin',
    name: 'Standard Admin',
    email: 'standardadmin@trinayanimedical.com',
    password: 'admin456', // This would be hashed in a real app
    role: 'admin',
    createdAt: '2023-03-10T09:30:00Z',
    applications: [],
    isActive: true,
    isLoginRestricted: false
  }
];

// Empty the additional mock applications
export const additionalApplications: Application[] = [];

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
    isActive: users[userIndex].isActive,
    isLoginRestricted: users[userIndex].isLoginRestricted
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