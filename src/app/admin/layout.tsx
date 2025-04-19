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
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      router.push('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      
      // Allow both admin and super_admin roles to access admin dashboard
      if (parsedUser.role !== 'admin' && parsedUser.role !== 'backoffice_admin' && parsedUser.role !== 'super_admin') {
        router.push('/dashboard');
        return;
      }
      
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: <LayoutDashboard size={20} /> 
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
    // Only show user management to super admins
    ...(user?.role === 'super_admin' ? [{
      name: 'User Management', 
      path: '/admin/users', 
      icon: <Users size={20} />,
      subItems: [
        { name: 'All Users', path: '/admin/users' },
        { name: 'Add User', path: '/admin/users/new' }
      ]
    }] : []),
    { 
      name: 'Image Manager', 
      path: '/admin/image-manager', 
      icon: <ImageIcon size={20} /> 
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: <Settings size={20} /> 
    },
  ];

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
                  <div className="font-medium">{user.name}</div>
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
              <div className="flex items-center justify-between">
                {user && (
                  <div className="truncate">
                    <div className="font-medium truncate">{user.name}</div>
                    <div className="text-xs text-gray-600 truncate">{user.email}</div>
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut size={16} />
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