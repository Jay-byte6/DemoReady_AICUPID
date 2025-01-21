import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/supabaseService';
import { supabase } from '../../lib/supabase';
import { Bell, Check, MessageCircle, Heart, Eye, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationContent {
  title: string;
  message: string;
  targetId?: string;
}

interface Notification {
  id: string;
  type: 'NEW_MATCH' | 'NEW_MESSAGE' | 'PROFILE_VIEW';
  content: NotificationContent;
  read: boolean;
  created_at: string;
}

interface NotificationError extends Error {
  code?: string;
  details?: string;
}

const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Load initial notifications
    loadNotifications();

    // Subscribe to new notifications
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      const notifications = await profileService.getNotifications(user.id);
      setNotifications(notifications);
      setUnreadCount(notifications.filter(n => !n.read).length);
      setError(null);
    } catch (error) {
      const notificationError = error as NotificationError;
      console.error('Error loading notifications:', notificationError);
      setError(notificationError.message || 'Failed to load notifications');
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read first
      await handleMarkAsRead(notification.id);

      // Navigate based on notification type and content
      switch (notification.type) {
        case 'NEW_MATCH':
          if (notification.content.targetId) {
            navigate(`/smart-matching/${notification.content.targetId}`);
          } else {
            navigate('/smart-matching');
          }
          break;
        case 'NEW_MESSAGE':
          if (notification.content.targetId) {
            navigate(`/messages/${notification.content.targetId}`);
          } else {
            navigate('/messages');
          }
          break;
        case 'PROFILE_VIEW':
          navigate('/profile');
          break;
        default:
          console.warn('Unknown notification type:', notification.type);
          break;
      }

      // Close notification panel
      setIsOpen(false);
      setError(null);
    } catch (error) {
      const notificationError = error as NotificationError;
      console.error('Error handling notification click:', notificationError);
      setError(notificationError.message || 'Failed to process notification');
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await profileService.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      setError(null);
    } catch (error) {
      const notificationError = error as NotificationError;
      console.error('Error marking notification as read:', notificationError);
      setError(notificationError.message || 'Failed to mark notification as read');
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'NEW_MATCH':
        return <Heart className="h-5 w-5 text-pink-500" />;
      case 'NEW_MESSAGE':
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      case 'PROFILE_VIEW':
        return <Eye className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-b border-red-100">
              <div className="flex items-center text-red-800">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.content.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {notification.content.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter; 