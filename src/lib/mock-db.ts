// This file simulates a database for demonstration purposes
// In a real application, you would use a proper database

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // In a real app, this would be hashed
  createdAt: Date;
}

// Mock users database
export const users: User[] = [];

// Helper functions to work with the mock database
export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const createUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
  const newUser: User = {
    ...userData,
    id: Math.random().toString(36).substring(2, 15),
    createdAt: new Date()
  };
  
  users.push(newUser);
  return newUser;
}; 