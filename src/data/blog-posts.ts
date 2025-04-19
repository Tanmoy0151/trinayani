import { IMAGE_CATEGORIES } from './images';

export interface Author {
  id: number;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: Author;
  publishedAt: string;
  readTime: number;
  featured?: boolean;
}

// Sample authors
export const authors: Author[] = [
  {
    id: 1,
    name: 'John Doe',
    role: 'CTO',
    avatar: 'https://placehold.co/120x120',
    bio: 'John has over 10 years of experience in the industry and leads our technology initiatives.'
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Product Manager',
    avatar: 'https://placehold.co/120x120',
    bio: 'Jane specializes in product strategy and user experience design with a background in engineering.'
  },
  {
    id: 3,
    name: 'David Johnson',
    role: 'Technical Writer',
    avatar: 'https://placehold.co/120x120',
    bio: 'David creates technical content that helps our customers understand and get the most out of our products.'
  }
];

// Blog categories
export const BLOG_CATEGORIES = {
  TECHNOLOGY: 'technology',
  INDUSTRY: 'industry',
  COMPANY: 'company',
  TUTORIALS: 'tutorials',
  CASE_STUDIES: 'case-studies',
} as const;

// Sample blog posts
const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'latest-technology-trends-2023',
    title: 'Latest Technology Trends in 2023',
    excerpt: 'Explore the cutting-edge technologies that are shaping our industry this year.',
    content: `
# Latest Technology Trends in 2023

The technology landscape continues to evolve at a rapid pace, with innovations emerging across various domains. Here are some of the key trends we're observing in 2023:

## Artificial Intelligence and Machine Learning

AI and ML continue to be at the forefront of technological advancement. This year, we're seeing:

- More accessible AI tools for businesses of all sizes
- Specialized AI solutions for industry-specific challenges
- Ethical AI frameworks gaining importance in development processes

## Edge Computing

As IoT devices become more prevalent, edge computing is increasingly important:

- Processing data closer to where it's generated
- Reducing latency for critical applications
- Enabling real-time analytics in environments with limited connectivity

## Sustainable Technology

Sustainability has become a central concern:

- Energy-efficient hardware and data centers
- Software designed to optimize resource usage
- Technology solutions focused on environmental challenges

These trends are not just shaping technology itself but how businesses operate and compete in the market. Companies that adapt quickly to these changes will be better positioned for success in the coming years.
    `,
    coverImage: 'https://placehold.co/600x400',
    category: BLOG_CATEGORIES.TECHNOLOGY,
    tags: ['AI', 'Edge Computing', 'Sustainability', 'Innovation'],
    author: authors[0],
    publishedAt: '2023-06-15T10:00:00Z',
    readTime: 8,
    featured: true
  },
  {
    id: 2,
    slug: 'how-to-optimize-your-workflow',
    title: 'How to Optimize Your Workflow for Maximum Productivity',
    excerpt: 'Learn practical strategies to streamline your work processes and achieve better results.',
    content: `
# How to Optimize Your Workflow for Maximum Productivity

In today's fast-paced work environment, optimizing your workflow is essential for maintaining productivity and achieving your goals. This article explores several proven strategies to help you work more efficiently.

## Assess Your Current Process

Before making changes:

1. Document your existing workflow
2. Identify bottlenecks and pain points
3. Determine which tasks consume the most time

## Implement Automation

Look for opportunities to automate repetitive tasks:

- Use task management software
- Set up email filters and templates
- Leverage batch processing for similar tasks

## Organize Your Work Environment

Both physical and digital organization matter:

- Maintain a clutter-free workspace
- Structure your digital files logically
- Use a consistent naming convention for documents

## Focus on One Task at a Time

Multitasking often reduces productivity:

- Block time for specific activities
- Minimize distractions during focused work periods
- Take regular breaks to maintain mental clarity

By implementing these strategies consistently, you'll likely see significant improvements in your productivity and work quality over time.
    `,
    coverImage: 'https://placehold.co/600x400',
    category: BLOG_CATEGORIES.TUTORIALS,
    tags: ['Productivity', 'Workflow', 'Time Management'],
    author: authors[1],
    publishedAt: '2023-05-22T14:30:00Z',
    readTime: 6
  },
  {
    id: 3,
    slug: 'case-study-enterprise-implementation',
    title: 'Case Study: Successful Enterprise Implementation',
    excerpt: 'How we helped a Fortune 500 company transform their operations with our solutions.',
    content: `
# Case Study: Successful Enterprise Implementation

## Client Background

Our client, a Fortune 500 manufacturing company with operations across 12 countries, was facing challenges with their legacy systems. They needed a solution that would:

- Integrate disparate systems across multiple locations
- Provide real-time data for decision-making
- Scale to accommodate future growth

## The Challenge

The client's existing infrastructure consisted of:

- 15+ separate systems with minimal integration
- Manual processes for data transfer between departments
- Limited visibility into overall operations

This resulted in delayed decision-making, increased costs, and reduced competitive advantage in the market.

## Our Approach

We developed a phased implementation strategy:

1. **Assessment Phase**: Comprehensive audit of existing systems and processes
2. **Design Phase**: Created a solution architecture tailored to their specific needs
3. **Implementation Phase**: Deployed our platform with customizations for their industry
4. **Training Phase**: Provided extensive training to ensure adoption

## Results

Six months after full implementation, the client reported:

- 37% reduction in processing time for key workflows
- 42% improvement in data accuracy
- $2.3M in annual cost savings from process efficiencies
- Improved employee satisfaction scores

This case study demonstrates how our enterprise solutions can transform operations when properly implemented with a strategic approach.
    `,
    coverImage: 'https://placehold.co/600x400',
    category: BLOG_CATEGORIES.CASE_STUDIES,
    tags: ['Enterprise', 'Digital Transformation', 'Success Story'],
    author: authors[2],
    publishedAt: '2023-04-10T09:15:00Z',
    readTime: 10,
    featured: true
  },
  {
    id: 4,
    slug: 'industry-insights-manufacturing',
    title: 'Industry Insights: The Changing Landscape of Manufacturing',
    excerpt: 'Examining how technology is reshaping manufacturing processes worldwide.',
    content: `
# Industry Insights: The Changing Landscape of Manufacturing

The manufacturing sector is undergoing significant transformation, driven by technological innovation and changing market demands. This article explores the key developments shaping the industry.

## Industry 4.0 and Smart Manufacturing

The fourth industrial revolution is well underway:

- IoT devices connecting factory equipment
- AI-powered predictive maintenance reducing downtime
- Digital twins enabling better production planning

## Sustainable Manufacturing Practices

Environmental considerations are increasingly important:

- Reduced energy consumption in production processes
- Recycled and sustainable materials in product development
- Circular economy principles in product lifecycle management

## Reshoring and Supply Chain Resilience

Recent global disruptions have led to strategic shifts:

- Companies bringing manufacturing closer to end markets
- Increased focus on supply chain visibility
- Diversification of supplier relationships to reduce risk

## Workforce Evolution

The nature of manufacturing work is changing:

- Increased demand for technical and digital skills
- Collaborative robots working alongside human operators
- Remote monitoring and management of production facilities

These trends represent both challenges and opportunities for manufacturing businesses. Companies that embrace these changes strategically will be better positioned to thrive in this evolving landscape.
    `,
    coverImage: 'https://placehold.co/600x400',
    category: BLOG_CATEGORIES.INDUSTRY,
    tags: ['Manufacturing', 'Industry 4.0', 'Supply Chain'],
    author: authors[0],
    publishedAt: '2023-03-18T11:45:00Z',
    readTime: 7
  },
  {
    id: 5,
    slug: 'company-announces-new-partnership',
    title: 'Trinayani Announces Strategic Partnership with Industry Leader',
    excerpt: 'Our new collaboration will expand our service offerings and enhance customer value.',
    content: `
# Trinayani Announces Strategic Partnership with Industry Leader

We are excited to announce a new strategic partnership between Trinayani and TechGlobal, a leader in enterprise software solutions. This collaboration marks an important milestone in our company's growth strategy.

## Partnership Overview

The partnership will focus on:

- Integrating TechGlobal's advanced analytics platform with our core products
- Joint development of industry-specific solutions
- Expanded market reach through combined distribution channels

## Benefits for Our Customers

This partnership will deliver several key advantages:

- Enhanced functionality across our product suite
- More comprehensive end-to-end solutions
- Access to specialized expertise in data analytics

## Looking Forward

Over the coming months, we will be rolling out the first jointly developed offerings. Our product teams are already working closely together to ensure seamless integration and an enhanced user experience.

"This partnership represents a significant opportunity for both companies," said John Doe, CEO of Trinayani. "By combining our strengths, we'll be able to deliver even more value to our clients and accelerate our innovation roadmap."

Stay tuned for more updates on this exciting development and the new capabilities it will bring to our platform.
    `,
    coverImage: 'https://placehold.co/600x400',
    category: BLOG_CATEGORIES.COMPANY,
    tags: ['Partnership', 'Company News', 'Growth'],
    author: authors[1],
    publishedAt: '2023-02-28T13:00:00Z',
    readTime: 5
  }
];

export default blogPosts; 