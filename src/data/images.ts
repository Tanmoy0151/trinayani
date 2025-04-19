// Image data structure for organizing and accessing images throughout the application
// This centralizes image paths and metadata to make maintenance easier

export interface ImageData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  category?: string;
}

// Define image categories as constants to prevent typos
export const IMAGE_CATEGORIES = {
  HERO: 'hero',
  TEAM: 'team',
  PRODUCTS: 'products',
  SERVICES: 'services',
  CAREERS: 'careers',
  TESTIMONIALS: 'testimonials',
  PARTNERS: 'partners',
  PROJECTS: 'projects',
  LOGOS: 'logos',
} as const;

// Main images object organized by category
const images = {
  // Hero images for different pages
  [IMAGE_CATEGORIES.HERO]: {
    home: {
      src: 'https://placehold.co/600x400',
      alt: 'Trinayani home page hero image',
      width: 1920,
      height: 800,
    },
    about: {
      src: 'https://placehold.co/600x400',
      alt: 'About Us page hero image',
      width: 1920,
      height: 600,
    },
    careers: {
      src: 'https://placehold.co/600x400',
      alt: 'Careers page hero image',
      width: 1920,
      height: 600,
    },
    contact: {
      src: 'https://placehold.co/600x400',
      alt: 'Contact page hero image',
      width: 1920,
      height: 600,
    },
  },

  // Team member images
  [IMAGE_CATEGORIES.TEAM]: [
    {
      src: 'https://placehold.co/600x400',
      alt: 'Team Member - CEO',
      caption: 'Dr. Suresh Kumar, CEO',
      width: 400,
      height: 400,
    },
    {
      src: 'https://placehold.co/600x400',
      alt: 'Team Member - CTO',
      caption: 'Ms. Priya Singh, CTO',
      width: 400,
      height: 400,
    },
    {
      src: 'https://placehold.co/600x400',
      alt: 'Team Member - Sales Director',
      caption: 'Mr. Rahul Gupta, Sales Director',
      width: 400,
      height: 400,
    },
  ],

  // Product images
  [IMAGE_CATEGORIES.PRODUCTS]: [
    {
      src: 'https://placehold.co/600x400',
      alt: 'MRI Machine',
      caption: 'GE Healthcare MRI System',
      width: 800,
      height: 600,
    },
    {
      src: 'https://placehold.co/600x400',
      alt: 'CT Scanner',
      caption: 'Advanced CT Scanner System',
      width: 800,
      height: 600,
    },
    {
      src: 'https://placehold.co/600x400',
      alt: 'Ultrasound Machine',
      caption: 'Portable Ultrasound System',
      width: 800,
      height: 600,
    },
  ],

  // Service illustrations
  [IMAGE_CATEGORIES.SERVICES]: [
    {
      src: 'https://placehold.co/600x400',
      alt: 'Equipment Installation',
      caption: 'Professional Equipment Installation',
      width: 400,
      height: 400,
    },
    {
      src: 'https://placehold.co/600x400',
      alt: 'Maintenance Services',
      caption: 'Regular Maintenance Services',
      width: 400,
      height: 400,
    },
    {
      src: 'https://placehold.co/600x400',
      alt: 'Technical Support',
      caption: '24/7 Technical Support',
      width: 400,
      height: 400,
    },
  ],

  // Career-related images
  [IMAGE_CATEGORIES.CAREERS]: {
    engineer: {
      src: 'https://placehold.co/600x400',
      alt: 'Service Engineer at work',
      caption: 'Our service engineers receive continuous training',
      width: 800,
      height: 600,
    },
    designer: {
      src: 'https://placehold.co/600x400',
      alt: 'Product designer working',
      caption: 'Designing innovative solutions for healthcare',
      width: 800,
      height: 600,
    },
    developer: {
      src: 'https://placehold.co/600x400',
      alt: 'Software developer',
      caption: 'Developing software for medical equipment',
      width: 800,
      height: 600,
    },
    office: {
      src: 'https://placehold.co/600x400',
      alt: 'Trinayani office space',
      caption: 'Our modern office in Bangalore',
      width: 1200,
      height: 800,
    },
  },

  // Testimonial author images
  [IMAGE_CATEGORIES.TESTIMONIALS]: [
    {
      src: 'https://placehold.co/600x400',
      alt: 'Dr. Patel',
      caption: 'Dr. Anita Patel, Chief Radiologist',
      width: 120,
      height: 120,
    },
    {
      src: 'https://placehold.co/600x400',
      alt: 'Hospital Director',
      caption: 'Mr. Sharma, Hospital Director',
      width: 120,
      height: 120,
    },
    {
      src: 'https://placehold.co/600x400',
      alt: 'Lead Technician',
      caption: 'Ms. Lakshmi, Lead Technician',
      width: 120,
      height: 120,
    },
  ],

  // Partner/client logos
  [IMAGE_CATEGORIES.PARTNERS]: [
    {
      src: 'https://placehold.co/600x400',
      alt: 'GE Healthcare Logo',
      width: 200,
      height: 100,
    },
    {
      src: 'https://placehold.co/600x400',
      alt: 'Carl Zeiss Logo',
      width: 200,
      height: 100,
    },
    {
      src: 'https://placehold.co/600x400',
      alt: 'Siemens Healthineers Logo',
      width: 200,
      height: 100,
    },
    {
      src: 'https://placehold.co/600x400',
      alt: 'Philips Healthcare Logo',
      width: 200,
      height: 100,
    },
  ],

  // Project showcase images
  [IMAGE_CATEGORIES.PROJECTS]: [
    {
      src: 'https://placehold.co/600x400',
      alt: 'Hospital Installation Project',
      caption: 'Complete radiology department setup at AIIMS Delhi',
      width: 800,
      height: 600,
    },
    {
      src: 'https://placehold.co/600x400',
      alt: 'Rural Healthcare Initiative',
      caption: 'Mobile diagnostic units for rural healthcare',
      width: 800,
      height: 600,
    },
  ],

  // Logo variations
  [IMAGE_CATEGORIES.LOGOS]: {
    primary: {
      src: 'https://placehold.co/600x400',
      alt: 'Trinayani Medical Logo',
      width: 240,
      height: 80,
    },
    white: {
      src: 'https://placehold.co/600x400',
      alt: 'Trinayani Medical Logo (White)',
      width: 240,
      height: 80,
    },
    icon: {
      src: 'https://placehold.co/600x400',
      alt: 'Trinayani Icon',
      width: 80,
      height: 80,
    },
  },
};

export default images; 