export type UserRole = 'applicant' | 'field_employee' | 'backoffice_admin' | 'super_admin';

export type Permission = 
  // Application permissions
  | 'view_own_applications'
  | 'apply_for_jobs'
  | 'track_applications'
  
  // Field Employee permissions
  | 'submit_expenses'
  | 'view_own_expenses'
  | 'track_expense_status'
  | 'receive_appraisal'
  | 'request_appraisal'
  
  // Backoffice Admin permissions
  | 'view_all_applications'
  | 'manage_applications'
  | 'manage_job_postings'
  | 'view_all_expenses'
  | 'approve_expenses'
  | 'reject_expenses'
  | 'send_messages'
  
  // Super Admin permissions
  | 'manage_users'
  | 'manage_roles'
  | 'view_system_logs'
  | 'handle_appraisals'
  | 'send_direct_messages';

// Role-based permissions map
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  applicant: [
    'view_own_applications',
    'apply_for_jobs',
    'track_applications'
  ],
  
  field_employee: [
    'submit_expenses',
    'view_own_expenses',
    'track_expense_status',
    'receive_appraisal',
    'request_appraisal'
  ],
  
  backoffice_admin: [
    'view_all_applications',
    'manage_applications',
    'manage_job_postings',
    'view_all_expenses',
    'approve_expenses',
    'reject_expenses',
    'send_messages'
  ],
  
  super_admin: [
    'view_own_applications',
    'apply_for_jobs',
    'track_applications',
    'submit_expenses',
    'view_own_expenses',
    'track_expense_status',
    'receive_appraisal',
    'request_appraisal',
    'view_all_applications',
    'manage_applications',
    'manage_job_postings',
    'view_all_expenses',
    'approve_expenses',
    'reject_expenses',
    'send_messages',
    'manage_users',
    'manage_roles',
    'view_system_logs',
    'handle_appraisals',
    'send_direct_messages'
  ]
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  position?: string;
  joinDate?: string;
  lastLogin?: string;
  avatar?: string;
  permissions?: Permission[];
}

// Helper function to check if a user has a specific permission
export function hasPermission(user: User, permission: Permission): boolean {
  if (!user) return false;
  
  // If user has explicit permissions defined, check those
  if (user.permissions) {
    return user.permissions.includes(permission);
  }
  
  // Otherwise check role-based permissions
  return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
}

// Helper function to get all permissions for a user
export function getUserPermissions(user: User): Permission[] {
  if (!user) return [];
  
  // If user has explicit permissions defined, use those
  if (user.permissions) {
    return user.permissions;
  }
  
  // Otherwise return role-based permissions
  return ROLE_PERMISSIONS[user.role] || [];
} 