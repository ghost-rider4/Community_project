import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  userId: string;
  type: 'mentor_request' | 'tier_upgrade' | 'event_reminder' | 'club_activity' | 'mentor_availability' | 'system_maintenance';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  scheduledFor?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface NotificationPreferences {
  mentorRequests: boolean;
  tierUpgrades: boolean;
  eventReminders: boolean;
  clubActivities: boolean;
  mentorAvailability: boolean;
  systemMaintenance: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderTiming: '24h' | '1h' | 'both';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  isLoading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
  sendNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Promise<void>;
  scheduleEventReminder: (eventId: string, eventTitle: string, eventDate: Date) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    mentorRequests: true,
    tierUpgrades: true,
    eventReminders: true,
    clubActivities: true,
    mentorAvailability: true,
    systemMaintenance: true,
    emailNotifications: true,
    pushNotifications: true,
    reminderTiming: 'both'
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    // Load user notification preferences
    const loadPreferences = async () => {
      try {
        // In a real implementation, load from user document
        // For now, use defaults
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading notification preferences:', error);
        setIsLoading(false);
      }
    };

    // Set up real-time listener for notifications
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        scheduledFor: doc.data().scheduledFor?.toDate()
      })) as Notification[];
      
      setNotifications(notificationData);
      setIsLoading(false);
    });

    loadPreferences();

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        readAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      const updatePromises = unreadNotifications.map(notification =>
        updateDoc(doc(db, 'notifications', notification.id), {
          read: true,
          readAt: serverTimestamp()
        })
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);
      
      // Save to user document
      if (user) {
        await updateDoc(doc(db, 'users', user.id), {
          notificationPreferences: updatedPreferences
        });
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  };

  const sendNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const scheduleEventReminder = async (eventId: string, eventTitle: string, eventDate: Date) => {
    try {
      if (!user) return;

      const reminders = [];
      
      if (preferences.reminderTiming === '24h' || preferences.reminderTiming === 'both') {
        const reminder24h = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
        reminders.push({
          userId: user.id,
          type: 'event_reminder' as const,
          title: 'Event Tomorrow',
          message: `Don't forget: "${eventTitle}" is tomorrow at ${eventDate.toLocaleTimeString()}`,
          data: { eventId, reminderType: '24h' },
          priority: 'medium' as const,
          scheduledFor: reminder24h
        });
      }

      if (preferences.reminderTiming === '1h' || preferences.reminderTiming === 'both') {
        const reminder1h = new Date(eventDate.getTime() - 60 * 60 * 1000);
        reminders.push({
          userId: user.id,
          type: 'event_reminder' as const,
          title: 'Event Starting Soon',
          message: `"${eventTitle}" starts in 1 hour!`,
          data: { eventId, reminderType: '1h' },
          priority: 'high' as const,
          scheduledFor: reminder1h
        });
      }

      const reminderPromises = reminders.map(reminder =>
        addDoc(collection(db, 'scheduledNotifications'), {
          ...reminder,
          read: false,
          createdAt: serverTimestamp()
        })
      );

      await Promise.all(reminderPromises);
    } catch (error) {
      console.error('Error scheduling event reminders:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      preferences,
      isLoading,
      markAsRead,
      markAllAsRead,
      updatePreferences,
      sendNotification,
      scheduleEventReminder
    }}>
      {children}
    </NotificationContext.Provider>
  );
};