// This file will handle MongoDB connection
// Import mongoose when available after installing packages
import mongoose from 'mongoose';

// MongoDB connection string - using the one provided by the user
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trinayanienterprises';

// Define types for global mongoose cache to maintain connection across hot reloads
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global mongoose property
declare global {
  var mongoose: MongooseCache | undefined;
}

// Use cached connection to avoid multiple connections in development with hot reloading
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB database
 * This function maintains a cached connection to prevent multiple connections during development
 */
async function connectToDatabase() {
  if (cached.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    console.log(`Connecting to MongoDB at ${MONGODB_URI}`);
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(mongoose => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch(error => {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default connectToDatabase; 