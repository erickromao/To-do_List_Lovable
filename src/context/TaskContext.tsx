
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Task,
  Project,
  User,
  Notification,
  TaskStatus,
  FilterOptions,
} from "@/types";
import { useToast } from "@/components/ui/use-toast";

// Define the TaskContext type
type TaskContextType = {
  tasks: Task[];
  projects: Project[];
  users: User[];
  notifications: Notification[];
  currentUser: User;
  filterOptions: FilterOptions;
  filteredTasks: Task[]; // Added missing property
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getUnreadNotificationsCount: () => number;
  getTaskById: (id: string) => Task | undefined;
  createTask: (
    taskData: Omit<
      Task,
      "id" | "attachments" | "comments" | "createdAt" | "updatedAt"
    >
  ) => Task;
  updateTask: (
    id: string,
    updates: Partial<
      Omit<Task, "id" | "attachments" | "comments" | "createdAt" | "updatedAt">
    >
  ) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  deleteTask: (id: string) => void;
  addComment: (taskId: string, content: string) => void;
  createProject: (projectData: Omit<Project, "id" | "createdAt" | "updatedAt">) => Project;
  updateProject: (
    id: string,
    updates: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>
  ) => void;
  deleteProject: (id: string) => void;
  addNotification: (
    notificationData: Omit<Notification, "id" | "read" | "createdAt">
  ) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
};

// Create the TaskContext
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Create a custom hook to use the TaskContext
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

// Define the TaskProvider component
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  // Initialize state variables
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [projects, setProjects] = useState<Project[]>(() => {
    const storedProjects = localStorage.getItem("projects");
    return storedProjects ? JSON.parse(storedProjects) : [];
  });
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers
      ? JSON.parse(storedUsers)
      : [
          {
            id: "user-1",
            name: "John Doe",
            email: "john.doe@example.com",
            avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=John",
          },
          {
            id: "user-2",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jane",
          },
        ];
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const storedNotifications = localStorage.getItem("notifications");
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

  // Current user
  const [currentUser] = useState<User>({
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=John",
  });

  // Persist tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Persist projects to localStorage
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  // Persist notifications to localStorage
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);
  
  // Add notification - Moving this function to the top to fix the reference issue
  const addNotification = useCallback(
    (notificationData: Omit<Notification, "id" | "read" | "createdAt">) => {
      const newNotification: Notification = {
        id: uuidv4(),
        ...notificationData,
        read: false,
        createdAt: new Date(),
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  // Get tasks filtered by status
  const getTasksByStatus = useCallback(
    (status: TaskStatus) => {
      return tasks.filter((task) => task.status === status);
    },
    [tasks]
  );

  // Get unread notifications count
  const getUnreadNotificationsCount = useCallback(() => {
    return notifications.filter((notification) => !notification.read).length;
  }, [notifications]);

  // Get task by ID
  const getTaskById = useCallback(
    (id: string) => {
      return tasks.find((task) => task.id === id);
    },
    [tasks]
  );

  // Mark notification as read
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  }, []);

  // Create a new task
  const createTask = useCallback(
    (
      taskData: Omit<
        Task,
        "id" | "attachments" | "comments" | "createdAt" | "updatedAt"
      >
    ) => {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        ...taskData,
        attachments: [],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTasks((prev) => [...prev, newTask]);

      // Find project name
      const project = projects.find((p) => p.id === taskData.projectId);

      // Add notification for new task
      addNotification({
        type: "status-update",
        content: `Nova tarefa "${newTask.title}" criada${
          project ? ` no projeto "${project.name}"` : ""
        }.`,
        taskId: newTask.id,
        projectId: taskData.projectId,
      });

      // Add notification for assignment if assigned
      if (taskData.assigneeId) {
        const assignee = users.find((u) => u.id === taskData.assigneeId);
        if (assignee) {
          addNotification({
            type: "assignment",
            content: `Tarefa "${newTask.title}" atribuída a ${assignee.name}.`,
            taskId: newTask.id,
            projectId: taskData.projectId,
          });
        }
      }

      toast({
        title: "Tarefa Criada!",
        description: "A tarefa foi criada com sucesso.",
      });

      return newTask;
    },
    [projects, users, addNotification, toast]
  );

  // Update task
  const updateTask = useCallback(
    (
      id: string,
      updates: Partial<
        Omit<Task, "id" | "attachments" | "comments" | "createdAt" | "updatedAt">
      >
    ) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
        )
      );

      toast({
        title: "Tarefa Atualizada!",
        description: "A tarefa foi atualizada com sucesso.",
      });
    },
    [toast]
  );

  // Update task status
  const updateTaskStatus = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      const task = getTaskById(taskId);
      if (!task) return;

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date() } : t
        )
      );

      // Add notification for status change
      let statusText = "";
      if (newStatus === "todo") statusText = "A Fazer";
      else if (newStatus === "in-progress") statusText = "Em Andamento";
      else if (newStatus === "done") statusText = "Concluída";

      addNotification({
        type: "status-update",
        content: `Status da tarefa "${task.title}" alterado para ${statusText}.`,
        taskId,
        projectId: task.projectId,
      });
    },
    [getTaskById, addNotification]
  );

  // Delete task
  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== id));

      toast({
        title: "Tarefa Excluída!",
        description: "A tarefa foi excluída com sucesso.",
      });
    },
    [toast]
  );

  // Add comment to task
  const addComment = useCallback(
    (taskId: string, content: string) => {
      const newComment = {
        id: uuidv4(),
        content,
        taskId,
        authorId: currentUser.id,
        authorName: currentUser.name,
        createdAt: new Date(),
      };

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, comments: [...task.comments, newComment] }
            : task
        )
      );

      // Add notification for new comment
      const task = getTaskById(taskId);
      if (task) {
        addNotification({
          type: "comment",
          content: `Novo comentário adicionado à tarefa "${task.title}".`,
          taskId,
          projectId: task.projectId,
        });
      }

      toast({
        title: "Comentário Adicionado!",
        description: "O comentário foi adicionado com sucesso.",
      });
    },
    [currentUser, getTaskById, addNotification, toast]
  );

  // Create a new project
  const createProject = useCallback(
    (projectData: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
      const newProject: Project = {
        id: `project-${Date.now()}`,
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProjects((prev) => [...prev, newProject]);

      toast({
        title: "Projeto Criado!",
        description: "O projeto foi criado com sucesso.",
      });

      return newProject;
    },
    [toast]
  );

  // Update project
  const updateProject = useCallback(
    (
      id: string,
      updates: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>
    ) => {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === id ? { ...project, ...updates, updatedAt: new Date() } : project
        )
      );

      toast({
        title: "Projeto Atualizado!",
        description: "O projeto foi atualizado com sucesso.",
      });
    },
    [toast]
  );

  // Delete project
  const deleteProject = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.projectId === id ? { ...task, projectId: "" } : task
        )
      );
      setProjects((prev) => prev.filter((project) => project.id !== id));

      toast({
        title: "Projeto Excluído!",
        description: "O projeto foi excluído com sucesso.",
      });
    },
    [toast]
  );

  // Calculate filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by search query
      if (filterOptions.searchQuery && !task.title.toLowerCase().includes(filterOptions.searchQuery.toLowerCase()) && 
          !task.description.toLowerCase().includes(filterOptions.searchQuery.toLowerCase())) {
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

      // Filter by project
      if (filterOptions.projectId && task.projectId !== filterOptions.projectId) {
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
        
        const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
        
        if (filterOptions.dueDate === 'today') {
          if (!taskDueDate) return false;
          const dueDate = new Date(taskDueDate);
          dueDate.setHours(0, 0, 0, 0);
          if (dueDate.getTime() !== today.getTime()) return false;
        } else if (filterOptions.dueDate === 'thisWeek') {
          if (!taskDueDate) return false;
          const dueDate = new Date(taskDueDate);
          dueDate.setHours(0, 0, 0, 0);
          
          const endOfWeek = new Date(today);
          endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
          
          if (dueDate < today || dueDate > endOfWeek) return false;
        } else if (filterOptions.dueDate === 'overdue') {
          if (!taskDueDate) return false;
          const dueDate = new Date(taskDueDate);
          if (dueDate >= today) return false;
        } else if (filterOptions.dueDate === 'noDueDate') {
          if (taskDueDate) return false;
        }
      }

      return true;
    });
  }, [tasks, filterOptions]);

  // Provider value
  const value: TaskContextType = {
    tasks,
    projects,
    users,
    notifications,
    currentUser,
    filterOptions,
    filteredTasks,
    setFilterOptions,
    getTasksByStatus,
    getUnreadNotificationsCount,
    getTaskById,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    addComment,
    createProject,
    updateProject,
    deleteProject,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
