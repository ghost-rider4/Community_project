import React, { useState } from 'react';
import { Bell, X, Settings, Check, CheckCheck, Clock, AlertTriangle, Info, Star, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useNotifications, Notification } from '../../contexts/NotificationContext';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>('all');
  const { 
    notifications, 
    unreadCount, 
    preferences, 
    markAsRead, 
    markAllAsRead, 
    updatePreferences 
  } = useNotifications();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'mentor_request':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'tier_upgrade':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'event_reminder':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'club_activity':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'mentor_availability':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'system_maintenance':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'medium':
        return 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.read;
    return true;
  });

  const renderNotifications = () => (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </p>
        </div>
      ) : (
        filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
              notification.read 
                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                : getPriorityColor(notification.priority)
            }`}
            onClick={() => !notification.read && markAsRead(notification.id)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                  {notification.priority === 'urgent' && (
                    <Badge variant="default" className="bg-red-100 text-red-600 text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {notification.message}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {notification.createdAt.toLocaleDateString()} at {notification.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="text-xs"
                    >
                      <Check className="w-3 h-3" />
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Notification Types</h3>
        <div className="space-y-3">
          {[
            { key: 'mentorRequests', label: 'Mentor Requests', desc: 'New mentor request alerts' },
            { key: 'tierUpgrades', label: 'Tier Upgrades', desc: 'Student tier upgrade notifications' },
            { key: 'eventReminders', label: 'Event Reminders', desc: 'Upcoming event reminders' },
            { key: 'clubActivities', label: 'Club Activities', desc: 'Club activity updates' },
            { key: 'mentorAvailability', label: 'Mentor Availability', desc: 'Mentor availability changes' },
            { key: 'systemMaintenance', label: 'System Maintenance', desc: 'System maintenance alerts' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">{setting.label}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">{setting.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences[setting.key as keyof typeof preferences] as boolean}
                  onChange={(e) => updatePreferences({ [setting.key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Delivery Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Email Notifications</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => updatePreferences({ emailNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Push Notifications</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Browser and mobile notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={(e) => updatePreferences({ pushNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Event Reminder Timing</h3>
        <div className="space-y-2">
          {[
            { value: '24h', label: '24 hours before' },
            { value: '1h', label: '1 hour before' },
            { value: 'both', label: 'Both 24h and 1h before' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="reminderTiming"
                value={option.value}
                checked={preferences.reminderTiming === option.value}
                onChange={(e) => updatePreferences({ reminderTiming: e.target.value as any })}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-16">
      <Card className="w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
              {unreadCount > 0 && (
                <Badge variant="default" className="bg-purple-100 text-purple-600">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mt-4">
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
              >
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          {activeTab !== 'settings' && unreadCount > 0 && (
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={markAllAsRead} className="flex-1">
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {activeTab === 'settings' ? renderSettings() : renderNotifications()}
        </CardContent>
      </Card>
    </div>
  );
};