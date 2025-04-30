import mongoose, { Schema, Document } from 'mongoose';

// Define the Contact interface
export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: Date;
}

// Create the Contact schema
const ContactSchema = new Schema<IContact>({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true
  },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export the model
// Check if the model already exists before creating a new one to prevent
// "Cannot overwrite model once compiled" errors during hot reloading
export const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact; 