// Define the ExtendedUser interface that adds admin-specific fields to the basic User type
export interface ExtendedUser {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'super_admin' | 'backoffice_admin' | 'admin' | 'field_employee' | 'applicant' | 'user';
  createdAt: string;
  applications: any[]; // In a real app, this would have a proper Application interface
  isActive: boolean;
  isLoginRestricted: boolean;
}

// Sample users data for the admin panel
export const allUsers: ExtendedUser[] = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: 'User',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'super_admin',
    createdAt: '2023-09-01T10:00:00Z',
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
    password: 'password123',
    phone: '+1234567890',
    role: 'field_employee',
    createdAt: '2023-09-15T14:30:00Z',
    applications: [],
    isActive: true,
    isLoginRestricted: false
  },
  {
    id: 3,
    firstName: 'John',
    lastName: 'Applicant',
    name: 'John Applicant',
    email: 'johnapplicant@example.com',
    password: 'password123',
    role: 'applicant',
    createdAt: '2023-10-05T09:15:00Z',
    applications: [
      {
        id: 'app001',
        jobTitle: 'Field Technician',
        status: 'reviewing',
        appliedAt: '2023-10-06T11:30:00Z'
      }
    ],
    isActive: true,
    isLoginRestricted: false
  },
  {
    id: 4,
    firstName: 'Sarah',
    lastName: 'Manager',
    name: 'Sarah Manager',
    email: 'sarahmanager@example.com',
    password: 'password123',
    phone: '+9876543210',
    role: 'backoffice_admin',
    createdAt: '2023-08-20T13:45:00Z',
    applications: [],
    isActive: true,
    isLoginRestricted: false
  },
  {
    id: 5,
    firstName: 'Regular',
    lastName: 'User',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
    createdAt: '2023-11-01T16:20:00Z',
    applications: [],
    isActive: true,
    isLoginRestricted: true
  }
]; 