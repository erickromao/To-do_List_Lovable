
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { Task, Project, Notification, User, Priority, TaskStatus, FilterOptions } from "@/types";

// Mock data for initial state
const mockUsers: User[] = [
  { id: "user1", name: "You", email: "you@example.com", avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=John" },
  { id: "user2", name: "Alex Johnson", email: "alex@example.com", avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex" },
  { id: "user3", name: "Sam Wilson", email: "sam@example.com", avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sam" },
  { id: "user4", name: "Taylor Morgan", email: "taylor@example.com", avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Taylor" },
];

const mockProjects: Project[] = [
  {
    id: "project1",
    name: "Website Redesign",
    description: "Complete overhaul of company website with new branding",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "project2",
    name: "Mobile App Development",
    description: "Create a new mobile app for iOS and Android platforms",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "project3",
    name: "Marketing Campaign",
    description: "Launch Q4 marketing campaign across all platforms",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

const mockTasks: Task[] = [
  {
    id: "task1",
    title: "Design homepage mockup",
    description: "Create initial design concepts for the new homepage",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    projectId: "project1",
    projectName: "Website Redesign",
    assigneeId: "user1",
    assigneeName: "You",
    attachments: [],
    comments: [
      {
        id: "comment1",
        content: "I've started working on the wireframes",
        taskId: "task1",
        authorId: "user1",
        authorName: "You",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "task2",
    title: "Setup development environment",
    description: "Configure development servers and tools",
    status: "done",
    priority: "medium",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    projectId: "project2",
    projectName: "Mobile App Development",
    assigneeId: "user3",
    assigneeName: "Sam Wilson",
    attachments: [],
    comments: [],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "task3",
    title: "Create content calendar",
    description: "Plan out content for the next quarter",
    status: "todo",
    priority: "low",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    projectId: "project3",
    projectName: "Marketing Campaign",
    assigneeId: "user4",
    assigneeName: "Taylor Morgan",
    attachments: [],
    comments: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "task4",
    title: "User testing",
    description: "Conduct user testing sessions for the new design",
    status: "todo",
    priority: "high",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    projectId: "project1",
    projectName: "Website Redesign",
    assigneeId: "user2",
    assigneeName: "Alex Johnson",
    attachments: [],
    comments: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "task5",
    title: "API development",
    description: "Create RESTful API endpoints for the mobile app",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    projectId: "project2",
    projectName: "Mobile App Development",
    assigneeId: "user1",
    assigneeName: "You",
    attachments: [],
    comments: [],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

const mockNotifications: Notification[] = [
  {
    id: "notif1",
    type: "assignment",
    content: "You have been assigned to 'Design homepage mockup'",
    read: false,
    taskId: "task1",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "notif2",
    type: "due-date",
    content: "Task 'API development' is due in 2 days",
    read: false,
    taskId: "task5",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: "notif3",
    type: "status-update",
    content: "Sam Wilson marked 'Setup development environment' as done",
    read: true,
    taskId: "task2",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

// Define context type
interface TaskContextType {
  users: User[];
  currentUser: User;
  projects: Project[];
  tasks: Task[];
  notifications: Notification[];
  filterOptions: FilterOptions;
  setFilterOptions: (filterOptions: FilterOptions) => void;
  filteredTasks: Task[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  
  // Task operations
  getTaskById: (id: string) => Task | undefined;
  createTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "attachments" | "comments">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  
  // Project operations
  getProjectById: (id: string) => Project | undefined;
  createProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Comment operations
  addComment: (taskId: string, content: string) => void;
  
  // Notification operations
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  getUnreadNotificationsCount: () => number;
}

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Create provider
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [users] = useState<User[]>(mockUsers);
  const [currentUser] = useState<User>(mockUsers[0]);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Filter tasks based on filterOptions
  const filteredTasks = tasks.filter((task) => {
    // Filter by project
    if (filterOptions.projectId && task.projectId !== filterOptions.projectId) {
      return false;
    }

    // Filter by status
    if (filterOptions.status && filterOptions.status.length > 0 && !filterOptions.status.includes(task.status)) {
      return false;
    }

    // Filter by priority
    if (filterOptions.priority && filterOptions.priority.length > 0 && !filterOptions.priority.includes(task.priority)) {
      return false;
    }

    // Filter by assignee
    if (filterOptions.assigneeId && task.assigneeId !== filterOptions.assigneeId) {
      return false;
    }

    // Filter by due date
    if (filterOptions.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      oneWeekFromNow.setHours(23, 59, 59, 999);

      if (filterOptions.dueDate === "today") {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        if (dueDate.getTime() !== today.getTime()) return false;
      } else if (filterOptions.dueDate === "thisWeek") {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        if (dueDate < today || dueDate > oneWeekFromNow) return false;
      } else if (filterOptions.dueDate === "overdue") {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        if (dueDate >= today) return false;
      } else if (filterOptions.dueDate === "noDueDate") {
        if (task.dueDate) return false;
      }
    }

    // Filter by search query
    if (filterOptions.searchQuery) {
      const query = filterOptions.searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        (task.projectName && task.projectName.toLowerCase().includes(query)) ||
        (task.assigneeName && task.assigneeName.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Get task by ID
  const getTaskById = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  // Get project by ID
  const getProjectById = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  // Create task
  const createTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "attachments" | "comments">) => {
    const project = projects.find(p => p.id === task.projectId);
    const assignee = users.find(u => u.id === task.assigneeId);
    
    const newTask: Task = {
      ...task,
      id: `task${tasks.length + 1}`,
      projectName: project?.name,
      assigneeName: assignee?.name || null,
      attachments: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks([...tasks, newTask]);
    
    // Create notification for assignment
    if (task.assigneeId && task.assigneeId !== currentUser.id) {
      const notification: Notification = {
        id: `notif${notifications.length + 1}`,
        type: "assignment",
        content: `You have been assigned to '${task.title}'`,
        read: false,
        taskId: newTask.id,
        createdAt: new Date(),
      };
      
      setNotifications([notification, ...notifications]);
    }
    
    toast.success("Task created successfully");
  };

  // Update task
  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        // If assignee is changing, update assigneeName
        let assigneeName = task.assigneeName;
        if (updates.assigneeId && updates.assigneeId !== task.assigneeId) {
          const assignee = users.find(u => u.id === updates.assigneeId);
          assigneeName = assignee?.name || null;
          
          // Create notification for new assignment
          if (updates.assigneeId !== currentUser.id) {
            const notification: Notification = {
              id: `notif${notifications.length + 1}`,
              type: "assignment",
              content: `You have been assigned to '${task.title}'`,
              read: false,
              taskId: task.id,
              createdAt: new Date(),
            };
            
            setNotifications([notification, ...notifications]);
          }
        }
        
        // If project is changing, update projectName
        let projectName = task.projectName;
        if (updates.projectId && updates.projectId !== task.projectId) {
          const project = projects.find(p => p.id === updates.projectId);
          projectName = project?.name;
        }
        
        return {
          ...task,
          ...updates,
          assigneeName: assigneeName,
          projectName: projectName,
          updatedAt: new Date(),
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    toast.success("Task updated successfully");
  };

  // Delete task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    // Remove related notifications
    setNotifications(notifications.filter((notif) => notif.taskId !== id));
    toast.success("Task deleted successfully");
  };

  // Update task status
  const updateTaskStatus = (id: string, status: TaskStatus) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      updateTask(id, { status });
      
      // Create notification for status update if someone else did it
      if (task.assigneeId && task.assigneeId !== currentUser.id) {
        const notification: Notification = {
          id: `notif${notifications.length + 1}`,
          type: "status-update",
          content: `${currentUser.name} marked '${task.title}' as ${status}`,
          read: false,
          taskId: task.id,
          createdAt: new Date(),
        };
        
        setNotifications([notification, ...notifications]);
      }
    }
  };

  // Create project
  const createProject = (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    const newProject: Project = {
      ...project,
      id: `project${projects.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setProjects([...projects, newProject]);
    toast.success("Project created successfully");
  };

  // Update project
  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === id) {
        return {
          ...project,
          ...updates,
          updatedAt: new Date(),
        };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    
    // Update project name in tasks if it changed
    if (updates.name) {
      const updatedTasks = tasks.map((task) => {
        if (task.projectId === id) {
          return {
            ...task,
            projectName: updates.name,
          };
        }
        return task;
      });
      
      setTasks(updatedTasks);
    }
    
    toast.success("Project updated successfully");
  };

  // Delete project
  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
    // Optional: Delete or reassign tasks associated with this project
    const projectTasks = tasks.filter((task) => task.projectId === id);
    if (projectTasks.length > 0) {
      setTasks(tasks.filter((task) => task.projectId !== id));
      toast.info(`${projectTasks.length} tasks were deleted with the project`);
    }
    toast.success("Project deleted successfully");
  };

  // Add comment
  const addComment = (taskId: string, content: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const newComment = {
          id: `comment${task.comments.length + 1}`,
          content,
          taskId,
          authorId: currentUser.id,
          authorName: currentUser.name,
          createdAt: new Date(),
        };
        
        return {
          ...task,
          comments: [...task.comments, newComment],
          updatedAt: new Date(),
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    // Create notification for comment if someone else is assigned
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.assigneeId && task.assigneeId !== currentUser.id) {
      const notification: Notification = {
        id: `notif${notifications.length + 1}`,
        type: "comment",
        content: `${currentUser.name} commented on '${task.title}'`,
        read: false,
        taskId: task.id,
        createdAt: new Date(),
      };
      
      setNotifications([notification, ...notifications]);
    }
    
    toast.success("Comment added");
  };

  // Mark notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) => {
        if (notif.id === id) {
          return { ...notif, read: true };
        }
        return notif;
      })
    );
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, read: true }))
    );
    toast.success("All notifications marked as read");
  };

  // Get unread notifications count
  const getUnreadNotificationsCount = () => {
    return notifications.filter((notif) => !notif.read).length;
  };

  // Check for due date notifications
  useEffect(() => {
    const checkDueDates = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      tasks.forEach((task) => {
        if (task.dueDate && task.status !== "done") {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          
          // Task is due today
          if (dueDate.getTime() === today.getTime()) {
            // Check if we already have a notification for this
            const hasNotification = notifications.some(
              (notif) => notif.taskId === task.id && notif.type === "due-date" && 
              notif.content.includes("is due today")
            );
            
            if (!hasNotification) {
              const notification: Notification = {
                id: `notif${notifications.length + 1}`,
                type: "due-date",
                content: `Task '${task.title}' is due today`,
                read: false,
                taskId: task.id,
                createdAt: new Date(),
              };
              
              setNotifications((prev) => [notification, ...prev]);
            }
          }
          
          // Task is overdue
          if (dueDate < today && task.status !== "done") {
            // Check if we already have a notification for this
            const hasNotification = notifications.some(
              (notif) => notif.taskId === task.id && notif.type === "due-date" && 
              notif.content.includes("is overdue")
            );
            
            if (!hasNotification) {
              const notification: Notification = {
                id: `notif${notifications.length + 1}`,
                type: "due-date",
                content: `Task '${task.title}' is overdue`,
                read: false,
                taskId: task.id,
                createdAt: new Date(),
              };
              
              setNotifications((prev) => [notification, ...prev]);
            }
          }
        }
      });
    };
    
    // Check on initial load
    checkDueDates();
    
    // Set interval to check daily
    const intervalId = setInterval(checkDueDates, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [tasks, notifications]);

  return (
    <TaskContext.Provider
      value={{
        users,
        currentUser,
        projects,
        tasks,
        notifications,
        filterOptions,
        setFilterOptions,
        filteredTasks,
        selectedProjectId,
        setSelectedProjectId,
        selectedTaskId,
        setSelectedTaskId,
        getTaskById,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        getProjectById,
        createProject,
        updateProject,
        deleteProject,
        addComment,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getUnreadNotificationsCount,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
