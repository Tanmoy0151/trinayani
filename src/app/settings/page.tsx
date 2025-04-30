'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Lock, Eye, Moon, Sun, Globe, CheckCircle } from 'lucide-react';
import logger from '@/utils/logger';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const router = useRouter();

  // Example settings that would be stored in a real application
  const [notifications, setNotifications] = useState({
    email: true,
    app: true,
    marketing: false
  });
  
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      logger.warn('SettingsPage', 'No user data found, redirecting to login');
      router.push('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      logger.info('SettingsPage', 'User data loaded', { id: String(parsedUser.id), role: parsedUser.role });
      
      // In a real app, we would load the user's settings from an API
      // For now, we'll simulate that by setting defaults
      
      // Retrieve saved settings from localStorage if they exist
      const savedSettings = localStorage.getItem('user_settings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          if (parsedSettings.notifications) {
            setNotifications(parsedSettings.notifications);
          }
          if (parsedSettings.theme) {
            setTheme(parsedSettings.theme);
          }
          if (parsedSettings.language) {
            setLanguage(parsedSettings.language);
          }
        } catch (error) {
          console.error('Error parsing saved settings:', error);
        }
      }
    } catch (error) {
      logger.error('SettingsPage', 'Error parsing user data', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);
  
  // Track changes to settings
  useEffect(() => {
    if (!loading) {
      setChangesMade(true);
      // Clear success message when changes are made
      setSaveSuccess(false);
    }
  }, [notifications, theme, language, loading]);

  const handleSaveSettings = () => {
    setSaving(true);
    logger.info('SettingsPage', 'Saving user settings');
    
    try {
      // In a real app, this would be an API call
      const settings = {
        notifications,
        theme,
        language
      };
      
      // Simulate API delay
      setTimeout(() => {
        // Save to localStorage for demo purposes
        localStorage.setItem('user_settings', JSON.stringify(settings));
        
        setSaving(false);
        setChangesMade(false);
        setSaveSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
        
        logger.info('SettingsPage', 'Settings saved successfully');
      }, 800);
    } catch (error) {
      logger.error('SettingsPage', 'Error saving settings', error);
      setSaving(false);
    }
  };

  const updateNotificationSetting = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          
          {saveSuccess && (
            <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-md">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">Settings saved successfully</span>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Notifications Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <Bell className="h-5 w-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email notifications about important updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notifications.email}
                    onChange={() => updateNotificationSetting('email')}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">App Notifications</p>
                  <p className="text-sm text-gray-500">Receive in-app notifications and alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notifications.app}
                    onChange={() => updateNotificationSetting('app')}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Marketing Emails</p>
                  <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notifications.marketing}
                    onChange={() => updateNotificationSetting('marketing')}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Appearance Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <Eye className="h-5 w-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">Theme</p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    className={`flex items-center px-4 py-2 rounded-md border ${
                      theme === 'light' 
                        ? 'border-primary-600 bg-primary-50 text-primary-600' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </button>
                  
                  <button 
                    className={`flex items-center px-4 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'border-primary-600 bg-primary-50 text-primary-600' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </button>
                  
                  <button 
                    className={`flex items-center px-4 py-2 rounded-md border ${
                      theme === 'system' 
                        ? 'border-primary-600 bg-primary-50 text-primary-600' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setTheme('system')}
                  >
                    System
                  </button>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">Language</p>
                <select 
                  className="h-10 w-full sm:w-64 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Security Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <Lock className="h-5 w-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            </div>
            
            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-800">
                  Security settings will be implemented in a future update. This includes password changes, two-factor authentication, and session management.
                </p>
              </div>
            </div>
          </div>
          
          {/* Save Button Section */}
          <div className="flex justify-end">
            <button 
              onClick={handleSaveSettings}
              disabled={saving || !changesMade}
              className={`relative px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors ${
                changesMade 
                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {saving ? (
                <>
                  <span className="inline-block opacity-0">Save Changes</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 