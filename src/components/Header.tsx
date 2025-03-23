
import { useState, useRef, useEffect } from "react";
import { Bell, Search, Menu } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import { Notification } from "@/types";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadNotificationsCount } = useTaskContext();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadCount = getUnreadNotificationsCount();

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format notification time
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    
    // Convert to seconds, minutes, hours, days
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md md:hidden text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
          
          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks, projects..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-md focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>
        
        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-gray-700 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-primary text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Notifications dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden z-50 animate-fade-in">
                <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <h3 className="font-medium">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsAsRead()}
                      className="text-xs text-primary hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  ) : (
                    <div>
                      {notifications.map((notification: Notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markNotificationAsRead(notification.id)}
                          className={`p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${
                            !notification.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm">{notification.content}</p>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary rounded-full mt-1.5"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
