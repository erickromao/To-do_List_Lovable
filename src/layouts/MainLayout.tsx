
import { ReactNode, useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useTaskContext } from "@/context/TaskContext";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

const MainLayout = ({ children, title }: MainLayoutProps) => {
  const { getUnreadNotificationsCount } = useTaskContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile view on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Close sidebar by default on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const pageTitle = title ? title : "Gerenciador de Tarefas";
  
  // Update document title
  useEffect(() => {
    const unreadCount = getUnreadNotificationsCount();
    document.title = unreadCount > 0 ? `(${unreadCount}) ${pageTitle}` : pageTitle;
  }, [pageTitle, getUnreadNotificationsCount]);

  return (
    <div className="flex h-full w-full">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 overflow-auto px-4 py-6 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
