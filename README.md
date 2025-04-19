# Trinayani Medical - Portfolio Website

A portfolio website for Trinayani Medical, a business partner of GE Healthcare and Carl Zeiss, providing sales and service for medical equipment.

## Features

- **Product Showcase**: Display of medical equipment (CT, MRI, Cathlab, Ultrasound from GE Healthcare)
- **Equipment Portfolio**: Eye checkup equipment (Biometry, Perimetry, Surgical Microscopes from Carl Zeiss)
- **Company Information**: About us, services, and mission
- **Career Opportunities**: Job listings with online application functionality
- **Blog Platform**: Articles and news updates with categorization
- **Maintenance Mode**: Custom component for scheduled downtime
- **Responsive Design**: Optimized for all devices

## Admin Dashboard

- **Collapsible Sidebar**: Toggle between expanded and compact views
- **Mobile-Responsive Menu**: Slide-out navigation for small screens
- **Role-Based Access Control**: Different permissions for various user roles
- **Visual Indicators**: Clear marking of current active section

### Admin Modules

1. **User Management** (Super Admin only)
   - User listing with filtering and search
   - User creation with role assignment
   - Account status management (active/inactive)
   - Login restriction capabilities

2. **Blog Management**
   - Article listing and creation
   - Rich text editing
   - Category management
   - Featured post selection

3. **Job Management**
   - Job posting creation and editing
   - Application tracking
   - Applicant management

4. **Employee Expenses**
   - Expense submission and tracking
   - Approval workflows
   - Reporting capabilities

5. **Image Manager**
   - Upload and organization of media assets
   - Usage in blog posts and product showcase

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard pages
│   │   ├── blog/           # Blog management
│   │   ├── jobs/           # Job management
│   │   ├── users/          # User management (Super Admin)
│   │   └── expenses/       # Employee expenses
│   ├── api/                # API routes
│   │   ├── admin/          # Admin-specific endpoints
│   │   └── auth/           # Authentication endpoints
│   ├── blog/               # Public blog pages
│   ├── careers/            # Public careers/jobs pages
│   └── server-down/        # Maintenance page
├── components/             # Reusable components
│   ├── ui/                 # UI components (buttons, inputs, etc.)
│   ├── BlogCard.tsx        # Blog post preview card
│   ├── Header.tsx          # Site navigation header
│   ├── MaintenanceMode.tsx # Maintenance mode component
│   └── RoleGuard.tsx       # Authentication/authorization wrapper
├── data/                   # Data access layer
└── lib/                    # Utility functions
```

## Authentication and Authorization

- **User Roles**:
  - `super_admin`: Full system access including user management
  - `backoffice_admin`: Access to content, jobs, and expenses management
  - `field_employee`: Limited access to submit expenses
  - `applicant`: Access to job applications

- **Role Guards**: Components to restrict page access based on user role
- **Login Restrictions**: Super admins can restrict user login access

## Technologies Used

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Form Handling**: React Hook Form
- **Authentication**: JWT tokens

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website in your browser.

## Environment Variables

```env
# Authentication
JWT_SECRET=your_jwt_secret_key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Email Service
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.example.com
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

## Development Workflow

1. **Authentication**: Users must log in to access protected routes
2. **Admin Access**: Only users with admin roles can access the admin dashboard
3. **User Management**: Only super admins can manage users and their permissions
4. **Content Management**: Admin users can manage blog posts and job listings
5. **Public Access**: Public users can view the website, blog posts, and apply for jobs

## Error Handling

- **Server Down Page**: Custom page displayed during server maintenance
- **Error Boundaries**: Catch and display user-friendly error messages
- **Maintenance Mode**: Configurable component that can be enabled during planned downtime

## Deployment

- Configure environment variables for production
- Build the project with `npm run build`
- Deploy using your preferred hosting service 