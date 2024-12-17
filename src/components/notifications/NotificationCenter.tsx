import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/supabaseService';
import { supabase } from '../../lib/supabase';
import { Bell, Check, MessageCircle, Heart, Eye, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'REQUEST_RECEIVED' | 'REQUEST_APPROVED' | 'REQUEST_EXPIRED' | 'NEW_MESSAGE' | 'NEW_MATCH';
  content: any;
  read: boolean;
  created_at: string;
}

const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

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
    } catch (error) {
      console.error('Error loading notifications:', error);
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
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'REQUEST_RECEIVED':
        return <Eye className="h-5 w-5 text-blue-500" />;
      case 'REQUEST_APPROVED':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'REQUEST_EXPIRED':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'NEW_MESSAGE':
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      case 'NEW_MATCH':
        return <Heart className="h-5 w-5 text-pink-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationMessage = (notification: Notification) => {
    const { type, content } = notification;
    switch (type) {
      case 'REQUEST_RECEIVED':
        return `New ${content.request_type.toLowerCase()} request received`;
      case 'REQUEST_APPROVED':
        return `Your ${content.request_type.toLowerCase()} request was approved`;
      case 'REQUEST_EXPIRED':
        return `A ${content.request_type.toLowerCase()} request has expired`;
      case 'NEW_MESSAGE':
        return 'You have a new message';
      case 'NEW_MATCH':
        return 'You have a new match!';
      default:
        return 'New notification';
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

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {getNotificationMessage(notification)}
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