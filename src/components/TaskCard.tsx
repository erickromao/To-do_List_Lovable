import { useState } from "react";
import { CalendarClock, MessageSquare, Paperclip, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import { Task } from "@/types";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { deleteTask, updateTaskStatus } = useTaskContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return "No due date";
    
    const taskDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if date is today, tomorrow, or yesterday
    if (taskDate.getTime() === today.getTime()) {
      return "Today";
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else if (taskDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    }
    
    // Otherwise return formatted date
    return taskDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: taskDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };
  
  // Check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate || task.status === "done") return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
    }
    setIsMenuOpen(false);
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTaskStatus(task.id, e.target.value as any);
  };
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Ignore clicks on buttons, dropdown, etc.
    if ((e.target as HTMLElement).closest('button, select')) {
      return;
    }
    
    navigate(`/tasks/${task.id}`);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-all hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 clickable"
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          {/* Status indicator */}
          <div className="flex items-center">
            <span className={`status-dot ${task.status}`} />
            <select
              value={task.status}
              onChange={handleStatusChange}
              className="ml-2 text-xs bg-transparent border-0 cursor-pointer focus:ring-0 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          
          {/* Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="More options"
            >
              <MoreHorizontal size={16} className="text-gray-500" />
            </button>
            
            {isMenuOpen && (
              <div 
                className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-800 z-10 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    onEdit(task);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Priority badge */}
        <div className="mt-2">
          <span className={`priority-badge ${task.priority}`}>
            {task.priority}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="font-medium mt-2 line-clamp-2">{task.title}</h3>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
          {task.description}
        </p>
        
        {/* Project */}
        {task.projectName && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Project: {task.projectName}
          </div>
        )}
        
        {/* Meta information */}
        <div className="mt-3 flex flex-wrap gap-3">
          {/* Due date */}
          <div className="flex items-center text-xs">
            <CalendarClock size={14} className={`mr-1 ${isOverdue() ? 'text-red-500' : 'text-gray-500'}`} />
            <span className={isOverdue() ? 'text-red-500 font-medium' : 'text-gray-600 dark:text-gray-400'}>
              {formatDate(task.dueDate)}
              {isOverdue() && ' (Overdue)'}
            </span>
          </div>
          
          {/* Comments count */}
          {task.comments.length > 0 && (
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <MessageSquare size={14} className="mr-1 text-gray-500" />
              <span>{task.comments.length}</span>
            </div>
          )}
          
          {/* Attachments count */}
          {task.attachments.length > 0 && (
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <Paperclip size={14} className="mr-1 text-gray-500" />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>
        
        {/* Assignee */}
        {task.assigneeName && (
          <div className="mt-3 flex items-center">
            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <img
                src={task.assigneeId ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${task.assigneeId}` : undefined}
                alt={task.assigneeName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="ml-1.5 text-xs text-gray-600 dark:text-gray-400">
              {task.assigneeName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
