'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Receipt, 
  Settings, 
  Users, 
  ImageIcon, 
  LogOut, 
  Menu 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import logger from '@/utils/logger';
import { isAdminRole } from '@/utils/navigateToRole';

// Define types for menu items
interface SubMenuItem {
  name: string;
  path: string;
}

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  subItems?: SubMenuItem[];
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: number; name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') {
      return;
    }
    
    // Check if user is logged in and has admin role
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      logger.warn('AdminLayout', 'No user data found in localStorage');
      router.push('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      logger.info('AdminLayout', 'User data loaded', { 
        id: parsedUser.id, 
        name: parsedUser.name,
        role: parsedUser.role 
      });
      
      // Check if user has admin privileges using our utility function
      if (!isAdminRole(parsedUser.role)) {
        logger.warn('AdminLayout', 'Unauthorized access attempt', { 
          role: parsedUser.role, 
          requiredRoles: ['super_admin', 'backoffice_admin', 'admin'],
          path: pathname
        });
        router.push('/unauthorized');
        return;
      }
      
      // User has appropriate admin role, log access
      logger.info('AdminLayout', 'Admin access granted', {
        role: parsedUser.role,
        path: pathname
      });
      
      setUser(parsedUser);
    } catch (error) {
      logger.error('AdminLayout', 'Error parsing user data', error);
      router.push('/login');
    }
  }, [router, pathname]);

  const handleLogout = () => {
    // Convert id to string for the logger which expects string or undefined
    const userId = user?.id !== undefined ? String(user.id) : undefined;
    logger.auth('AdminLayout', 'logout', userId, user?.role);
    localStorage.removeItem('user');
    
    // Clear auth cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    logger.navigation('AdminLayout', pathname || '', '/login');
    router.push('/login');
  };

  // Get role-specific menu items
  const getRoleSpecificMenuItems = (): MenuItem[] => {
    if (!user) return [];
    
    // Base menu items available to all admin roles
    const baseMenuItems: MenuItem[] = [
      { 
        name: 'Dashboard', 
        path: '/admin/dashboard', 
        icon: <LayoutDashboard size={20} /> 
      }
    ];
    
    // Role-specific menu items
    if (user.role === 'super_admin') {
      // Super admin has access to everything
      return [
        ...baseMenuItems,
        { 
          name: 'User Management', 
          path: '/admin/users', 
          icon: <Users size={20} />,
          subItems: [
            { name: 'All Users', path: '/admin/users' },
            { name: 'Add User', path: '/admin/users/new' }
          ]
        },
        { 
          name: 'Blog Management', 
          path: '/admin/blog', 
          icon: <FileText size={20} />,
          subItems: [
            { name: 'All Posts', path: '/admin/blog' },
            { name: 'Create Post', path: '/admin/blog/create' }
          ]
        },
        { 
          name: 'Job Management', 
          path: '/admin/jobs', 
          icon: <Briefcase size={20} />,
          subItems: [
            { name: 'All Jobs', path: '/admin/jobs' },
            { name: 'Create Job', path: '/admin/jobs/new' }
          ]
        },
        { 
          name: 'Employee Expenses', 
          path: '/admin/expenses', 
          icon: <Receipt size={20} />,
          subItems: [
            { name: 'All Expenses', path: '/admin/expenses' },
            { name: 'Add Expense', path: '/admin/expenses/create' }
          ]
        },
        { 
          name: 'Image Manager', 
          path: '/admin/image-manager', 
          icon: <ImageIcon size={20} /> 
        },
        { 
          name: 'Settings', 
          path: '/admin/settings', 
          icon: <Settings size={20} /> 
        }
      ];
    } else if (user.role === 'backoffice_admin') {
      // Backoffice admin has access to most features except user management
      return [
        ...baseMenuItems,
        { 
          name: 'Blog Management', 
          path: '/admin/blog', 
          icon: <FileText size={20} />,
          subItems: [
            { name: 'All Posts', path: '/admin/blog' },
            { name: 'Create Post', path: '/admin/blog/create' }
          ]
        },
        { 
          name: 'Job Management', 
          path: '/admin/jobs', 
          icon: <Briefcase size={20} />,
          subItems: [
            { name: 'All Jobs', path: '/admin/jobs' },
            { name: 'Create Job', path: '/admin/jobs/new' }
          ]
        },
        { 
          name: 'Employee Expenses', 
          path: '/admin/expenses', 
          icon: <Receipt size={20} />,
          subItems: [
            { name: 'All Expenses', path: '/admin/expenses' },
            { name: 'Add Expense', path: '/admin/expenses/create' }
          ]
        },
        { 
          name: 'Image Manager', 
          path: '/admin/image-manager', 
          icon: <ImageIcon size={20} /> 
        },
        { 
          name: 'Settings', 
          path: '/admin/settings', 
          icon: <Settings size={20} /> 
        }
      ];
    } else if (user.role === 'admin') {
      // Standard admin has limited access
      return [
        ...baseMenuItems,
        { 
          name: 'Blog Management', 
          path: '/admin/blog', 
          icon: <FileText size={20} />,
          subItems: [
            { name: 'All Posts', path: '/admin/blog' },
            { name: 'Create Post', path: '/admin/blog/create' }
          ]
        },
        { 
          name: 'Job Management', 
          path: '/admin/jobs', 
          icon: <Briefcase size={20} />,
          subItems: [
            { name: 'All Jobs', path: '/admin/jobs' }
            // No job creation for regular admin
          ]
        },
        { 
          name: 'Image Manager', 
          path: '/admin/image-manager', 
          icon: <ImageIcon size={20} /> 
        }
      ];
    }
    
    return baseMenuItems;
  };

  // Replace the menuItems const with a call to get role-specific items
  const menuItems = getRoleSpecificMenuItems();

  // Add role indicator to the layout
  const getRoleBadge = () => {
    if (!user) return null;
    
    const roleBadges = {
      'super_admin': { 
        label: 'Super Admin',
        className: 'bg-purple-100 text-purple-800'
      },
      'backoffice_admin': { 
        label: 'Backoffice Admin',
        className: 'bg-blue-100 text-blue-800'
      },
      'admin': { 
        label: 'Admin',
        className: 'bg-green-100 text-green-800'
      }
    };
    
    const badge = roleBadges[user.role as keyof typeof roleBadges] || {
      label: user.role,
      className: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="md:hidden p-4 flex items-center border-b bg-white">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <Menu size={24} />
        </button>
        <div className="flex-grow font-bold text-xl text-primary-600">Admin Panel</div>
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {user.name.split(' ')[0]}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut size={16} />
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white w-64 min-h-screen overflow-y-auto">
            <div className="p-4 flex justify-between items-center border-b">
              <div className="font-bold text-xl text-primary-600">Admin Panel</div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
            
            <div className="p-2">
              {user && (
                <div className="mb-4 p-4 border-b">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">{user.name}</div>
                    {getRoleBadge()}
                  </div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
              )}
              
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <div key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 text-sm rounded-md ${
                        pathname === item.path || pathname?.startsWith(item.path + '/')
                          ? 'bg-primary-50 text-primary-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                    
                    {item.subItems && pathname?.startsWith(item.path) && (
                      <div className="ml-10 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-4 py-2 text-sm rounded-md ${
                              pathname === subItem.path
                                ? 'text-primary-600 font-medium'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <span className="mr-3"><LogOut size={20} /></span>
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div 
        className={`hidden md:block bg-white border-r shadow-sm transition-all duration-300 ${
          isExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <div className="sticky top-0 flex flex-col h-screen">
          <div className="flex items-center justify-between p-4 border-b">
            {isExpanded && <div className="font-bold text-xl text-primary-600">Admin</div>}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
            >
              {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-2">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <div key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center px-3 py-3 text-sm rounded-md ${
                      pathname === item.path || pathname?.startsWith(item.path + '/')
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={`${isExpanded ? 'mr-3' : 'mx-auto'}`}>{item.icon}</span>
                    {isExpanded && <span>{item.name}</span>}
                  </Link>
                  
                  {isExpanded && item.subItems && pathname?.startsWith(item.path) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          className={`block px-3 py-2 text-sm rounded-md ${
                            pathname === subItem.path
                              ? 'text-primary-600 font-medium'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t">
            {isExpanded ? (
              <div className="flex flex-col">
                {user && (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium truncate">{user.name}</div>
                      {getRoleBadge()}
                    </div>
                    <div className="text-xs text-gray-600 truncate mb-2">{user.email}</div>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" /> Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                <LogOut size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-hidden">
        <main className="mx-auto min-h-screen max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
} 