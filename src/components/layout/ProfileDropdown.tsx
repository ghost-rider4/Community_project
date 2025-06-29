import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, Moon, Sun, LogOut, Upload, Award } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { icon: Upload, label: 'Upload Content', path: '/upload' },
    { icon: User, label: 'Public Profile', path: '/profile' },
    { icon: Settings, label: 'Account Settings', path: '/account' },
    { icon: Award, label: 'My Progress', path: '/progress' }
  ];

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Avatar name={user.name} size="sm" />
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</p>
          <div className="flex items-center gap-1">
            <Badge variant="silver" className="text-xs">
              Student
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400">Level 1</span>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Avatar name={user.name} size="md" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="silver" className="text-xs">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    New Member
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};