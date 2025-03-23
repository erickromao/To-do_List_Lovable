
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskProvider } from "@/context/TaskContext";
import { useEffect } from "react";

// Pages
import Dashboard from "./pages/Index";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import History from "./pages/History";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Add dark mode support
  useEffect(() => {
    // Check for dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TaskProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<Tasks />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:taskId" element={<TaskDetail />} />
              <Route path="/history" element={<History />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TaskProvider>
    </QueryClientProvider>
  );
};

export default App;
