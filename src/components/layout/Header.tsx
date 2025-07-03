import React, { useState, createContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, Home, Compass, Briefcase, Users, UserCheck, Menu, X, Trophy, Upload, BookOpen, Calendar } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

export const SidebarContext = createContext({
  isMenuExpanded: false,
  sidebarCollapsedWidth: 56,
  sidebarExpandedWidth: 180,
  setIsMenuExpanded: (v: boolean) => {},
});

export const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const sidebarCollapsedWidth = 56;
  const sidebarExpandedWidth = 180;

  const isActive = (path: string) => location.pathname === path;

  const handleMobileSearch = () => {
    navigate('/explore');
    // You could also implement a search modal here instead
  };

  // Different navigation items based on user role
  const getNavigationItems = () => {
    if (user?.role === 'mentor') {
      return [
        { path: '/mentor-dashboard', label: 'Dashboard', icon: BookOpen },
        { path: '/explore', label: 'Explore', icon: Compass },
        { path: '/events', label: 'Events', icon: Calendar },
        { path: '/opportunities', label: 'Opportunities', icon: Briefcase },
        { path: '/clubs', label: 'Clubs', icon: Users }
      ];
    } else {
      return [
        { path: '/dashboard', label: 'Home', icon: Home },
        { path: '/explore', label: 'Explore', icon: Compass },
        { path: '/upload', label: 'Upload', icon: Upload },
        { path: '/events', label: 'Events', icon: Calendar },
        { path: '/opportunities', label: 'Opportunities', icon: Briefcase },
        { path: '/mentors', label: 'Mentors', icon: UserCheck },
        { path: '/clubs', label: 'Clubs', icon: Users },
        { path: '/progress', label: 'Progress', icon: Trophy }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  if (!isAuthenticated) {
    return (
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/image.png" 
                alt="ElevatED" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  ElevatED
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1">
                  Where gifted minds meet
                </p>
              </div>
            </Link>
            
            {/* Auth Actions */}
            <div className="flex items-center gap-4">
              <Link to="/signin" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium">
                Sign In
              </Link>
              <Link to="/signup" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <SidebarContext.Provider value={{ isMenuExpanded, sidebarCollapsedWidth, sidebarExpandedWidth, setIsMenuExpanded }}>
      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-50 flex flex-col items-center transition-all duration-200"
        onMouseEnter={() => setIsMenuExpanded(true)}
        onMouseLeave={() => setIsMenuExpanded(false)}
        style={{ width: isMenuExpanded ? sidebarExpandedWidth : sidebarCollapsedWidth, minWidth: isMenuExpanded ? sidebarExpandedWidth : sidebarCollapsedWidth }}
      >
        <nav className="flex flex-col items-center gap-2 mt-8 w-full">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sm w-[90%] mx-auto ${
                  isActive(item.path)
                    ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10'
                }`}
                style={{ justifyContent: isMenuExpanded ? 'flex-start' : 'center' }}
              >
                <Icon className="w-5 h-5" />
                {isMenuExpanded && <span className="whitespace-nowrap ml-2">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
      {/* Main Content Wrapper */}
      <div style={{ marginLeft: sidebarCollapsedWidth }}>
        {/* Main Header Content */}
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40" style={{ width: `calc(100% - ${sidebarCollapsedWidth}px)` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img 
              src="/image.png" 
              alt="ElevatED" 
              className="w-10 h-10 object-contain"
            />
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ElevatED
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1">
                Where gifted minds meet
              </p>
            </div>
          </Link>
          
          {/* Search - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects, mentors, events..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Button */}
            <button 
              onClick={handleMobileSearch}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* Notifications */}
            <button 
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Profile Dropdown */}
            <ProfileDropdown />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </SidebarContext.Provider>
  );
};