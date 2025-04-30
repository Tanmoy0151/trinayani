import mongoose, { Schema, Document } from 'mongoose';

// Define the BlogPost interface
export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  authorId: mongoose.Types.ObjectId;
  category: string;
  tags: string[];
  publishedAt: Date;
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
}

// Create the BlogPost schema
const BlogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  featuredImage: { type: String },
  author: { type: String, required: true },
  authorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  category: { type: String, required: true },
  tags: [{ type: String }],
  publishedAt: { type: Date },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  viewCount: { type: Number, default: 0 }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export the model
// Check if the model already exists before creating a new one to prevent
// "Cannot overwrite model once compiled" errors during hot reloading
export const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost; 