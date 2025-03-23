
// Status types
export type TaskStatus = "todo" | "in-progress" | "done";

// Priority types
export type Priority = "low" | "medium" | "high";

// Project interface
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: Date | null;
  projectId: string;
  projectName?: string;
  assigneeId: string | null;
  assigneeName?: string | null;
  attachments: Attachment[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

// Attachment interface
export interface Attachment {
  id: string;
  name: string;
  url: string;
  taskId: string;
  uploadedAt: Date;
}

// Comment interface
export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

// Notification interface
export interface Notification {
  id: string;
  type: "assignment" | "due-date" | "mention" | "status-update" | "comment";
  content: string;
  read: boolean;
  taskId?: string;
  projectId?: string;
  createdAt: Date;
}

// Filter options
export interface FilterOptions {
  status?: TaskStatus[];
  priority?: Priority[];
  projectId?: string;
  assigneeId?: string;
  dueDate?: "today" | "thisWeek" | "overdue" | "noDueDate";
  searchQuery?: string;
}
