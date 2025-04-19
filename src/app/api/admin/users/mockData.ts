// Extended user type that includes our system roles and active status
export interface ExtendedUser {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'applicant' | 'field_employee' | 'backoffice_admin' | 'super_admin';
  createdAt: string;
  applications: any[];
  isActive: boolean;
  isLoginRestricted?: boolean;
}

// Mock database of all users with Trinayani user roles
export const allUsers: ExtendedUser[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+918123456789',
    role: 'applicant',
    createdAt: '2023-05-15T10:00:00Z',
    applications: [],
    isActive: true,
    isLoginRestricted: false
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password456',
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
    password: 'admin123',
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
    password: 'super123',
    role: 'super_admin',
    createdAt: '2022-12-01T00:00:00Z',
    applications: [],
    isActive: true,
    isLoginRestricted: false
  },
  {
    id: 5,
    firstName: 'David',
    lastName: 'Johnson',
    name: 'David Johnson',
    email: 'david@example.com',
    password: 'david123',
    role: 'field_employee',
    createdAt: '2023-07-10T09:20:00Z',
    applications: [],
    isActive: true,
    isLoginRestricted: false
  },
  {
    id: 6,
    firstName: 'Sarah',
    lastName: 'Williams',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    password: 'sarah123',
    role: 'applicant',
    createdAt: '2023-07-15T14:30:00Z',
    applications: [],
    isActive: false,
    isLoginRestricted: true
  }
]; 