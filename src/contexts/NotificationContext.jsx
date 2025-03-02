import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useContext(AuthContext);

  // Load notifications from localStorage when component mounts or user changes
  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser]);

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const loadNotifications = () => {
    try {
      const storedNotifications = localStorage.getItem(`notifications_${currentUser.id}`);
      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications);
        setNotifications(parsedNotifications);
      } else {
        // Initialize with empty array if no notifications exist
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    }
  };

  const saveNotifications = (updatedNotifications) => {
    if (currentUser) {
      localStorage.setItem(
        `notifications_${currentUser.id}`,
        JSON.stringify(updatedNotifications)
      );
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
    return newNotification.id;
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const removeNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    saveNotifications([]);
  };

  // For sending system notifications between users
  const sendNotification = (toUserId, message, type = 'info') => {
    // In a real app, this would call an API to send to the server
    // Here we just save to localStorage as if we're the recipient
    
    try {
      const storedNotifications = localStorage.getItem(`notifications_${toUserId}`) || '[]';
      const existingNotifications = JSON.parse(storedNotifications);
      
      const newNotification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        message,
        type,
        read: false,
        sender: currentUser ? {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.role
        } : null
      };
      
      const updatedNotifications = [newNotification, ...existingNotifications];
      localStorage.setItem(`notifications_${toUserId}`, JSON.stringify(updatedNotifications));
      
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  };

  // Create sample notifications for demo purposes
  const createSampleNotifications = () => {
    if (!currentUser) return;
    
    const sampleNotifications = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
        message: 'New analysis result is ready for review',
        type: 'info',
        read: false,
        sender: { id: 2, name: 'Engineer User', role: 'engineer' }
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
        message: 'Designer has recommended PVC pipes for the project',
        type: 'success',
        read: false,
        sender: { id: 3, name: 'Designer User', role: 'designer' }
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 180 * 60000).toISOString(), // 3 hours ago
        message: 'System maintenance scheduled for tomorrow',
        type: 'warning',
        read: true,
        sender: { id: 1, name: 'Admin User', role: 'admin' }
      }
    ];
    
    setNotifications(sampleNotifications);
    saveNotifications(sampleNotifications);
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    sendNotification,
    createSampleNotifications // For demo purposes
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};