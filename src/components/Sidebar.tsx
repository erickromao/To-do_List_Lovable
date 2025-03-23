
import { Link, useLocation } from "react-router-dom";
import { Home, Folder, CheckSquare, History, Bell, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { getUnreadNotificationsCount } = useTaskContext();
  const unreadCount = getUnreadNotificationsCount();

  const navItems = [
    { name: "Painel", path: "/", icon: Home },
    { name: "Projetos", path: "/projects", icon: Folder },
    { name: "Tarefas", path: "/tasks", icon: CheckSquare },
    { name: "Histórico", path: "/history", icon: History },
    { name: "Notificações", path: "/notifications", icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
    { name: "Configurações", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden" 
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-md z-30 transition-all duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16",
          "md:w-64 w-[80%] max-w-[300px]"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo and header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className={cn("flex items-center space-x-2 transition-all duration-300", 
              !isOpen && "md:opacity-0")
            }>
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-white font-semibold">TM</span>
              </div>
              <h1 className="text-lg font-semibold">Taskia</h1>
            </div>
            
            {/* Toggle button for desktop */}
            <button 
              onClick={onToggle} 
              className="hidden md:flex items-center justify-center rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150"
              aria-label={isOpen ? "Fechar menu lateral" : "Abrir menu lateral"}
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            
            {/* Toggle button for mobile */}
            <button 
              onClick={onToggle} 
              className="md:hidden flex items-center justify-center rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150"
              aria-label="Fechar menu lateral"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg transition-all duration-150",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      location.pathname === item.path
                        ? "bg-primary/10 text-primary dark:bg-primary/20"
                        : "text-gray-700 dark:text-gray-300"
                    )}
                  >
                    <item.icon size={isOpen ? 18 : 20} className={cn(
                      "transition-all duration-150",
                      !isOpen && "md:mx-auto"
                    )} />
                    
                    <span className={cn(
                      "ml-3 transition-all duration-300",
                      !isOpen && "md:hidden"
                    )}>
                      {item.name}
                    </span>
                    
                    {item.badge && (
                      <span className={cn(
                        "ml-auto bg-primary text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center",
                        !isOpen && "md:hidden"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* User profile */}
          <div className={cn(
            "p-4 border-t flex items-center",
            !isOpen && "md:justify-center"
          )}>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <img 
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=John" 
                alt="Avatar do usuário" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className={cn(
              "ml-3 transition-all duration-300",
              !isOpen && "md:hidden"
            )}>
              <p className="text-sm font-medium">Você</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Usuário Atual</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
