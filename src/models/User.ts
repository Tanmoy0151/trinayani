import mongoose, { Schema, Document } from 'mongoose';

// Define the User interface
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'super_admin' | 'backoffice_admin' | 'field_employee' | 'applicant';
  createdAt: Date;
  applications: string[];
  isActive: boolean;
  isLoginRestricted: boolean;
}

// Create the User schema
const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'super_admin', 'backoffice_admin', 'field_employee', 'applicant'],
    default: 'user'
  },
  createdAt: { type: Date, default: Date.now },
  applications: [{ type: String }],
  isActive: { type: Boolean, default: true },
  isLoginRestricted: { type: Boolean, default: false }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export the model
// Check if the model already exists before creating a new one to prevent
// "Cannot overwrite model once compiled" errors during hot reloading
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User; 