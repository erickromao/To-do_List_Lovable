
import { useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { useTaskContext } from "@/context/TaskContext";
import { useNavigate } from "react-router-dom";
import { Bell, Check, Calendar, MessageSquare, User, RefreshCw } from "lucide-react";

const Notifications = () => {
  const { notifications, markAllNotificationsAsRead, markNotificationAsRead } = useTaskContext();
  const navigate = useNavigate();
  
  // Sort notifications by date (newest first)
  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Format time
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    
    // Convert to seconds, minutes, hours, days
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return days === 1 ? 'Ontem' : `${days} dias atrás`;
    }
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return 'Agora mesmo';
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <User size={18} className="text-blue-500" />;
      case 'due-date':
        return <Calendar size={18} className="text-amber-500" />;
      case 'comment':
        return <MessageSquare size={18} className="text-green-500" />;
      case 'status-update':
        return <RefreshCw size={18} className="text-purple-500" />;
      default:
        return <Bell size={18} className="text-gray-500" />;
    }
  };
  
  // Handle notification click
  const handleNotificationClick = (notificationId: string, taskId?: string) => {
    markNotificationAsRead(notificationId);
    if (taskId) {
      navigate(`/tasks/${taskId}`);
    }
  };

  // Mark all as read when leaving the page
  useEffect(() => {
    return () => {
      markAllNotificationsAsRead();
    };
  }, [markAllNotificationsAsRead]);

  return (
    <MainLayout title="Notificações">
      <div className="animate-fade-in">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">Notificações</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Mantenha-se atualizado com as últimas atividades</p>
          </div>
          
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllNotificationsAsRead}
              className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md font-medium text-sm transition-colors"
            >
              <Check size={16} className="mr-1.5" />
              <span>Marcar Todas como Lidas</span>
            </button>
          )}
        </div>
        
        {/* Notifications list */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {sortedNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {sortedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id, notification.taskId)}
                  className={`p-5 cursor-pointer transition-colors ${
                    !notification.read
                      ? "bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-4">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className={`${!notification.read ? "font-medium" : ""}`}>
                          {notification.content}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary rounded-full mt-1.5"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell size={32} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Sem notificações</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Você verá atualizações sobre suas tarefas e projetos aqui
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Notifications;
