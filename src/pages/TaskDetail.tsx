
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { useTaskContext } from "@/context/TaskContext";
import TaskModal from "@/components/TaskModal";
import { ArrowLeft, Edit, Trash2, Paperclip, Calendar, Clock } from "lucide-react";

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { getTaskById, deleteTask, addComment, updateTaskStatus } = useTaskContext();
  const [task, setTask] = useState(getTaskById(taskId || ""));
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  useEffect(() => {
    const foundTask = getTaskById(taskId || "");
    setTask(foundTask);
    
    if (!foundTask) {
      navigate("/tasks", { replace: true });
    }
  }, [taskId, getTaskById, navigate]);
  
  if (!task) {
    return null;
  }
  
  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return "No due date";
    
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
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
  
  const handleDeleteTask = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
      navigate("/tasks", { replace: true });
    }
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTaskStatus(task.id, e.target.value as any);
    setTask(getTaskById(task.id));
  };
  
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    addComment(task.id, commentText);
    setCommentText("");
    setTask(getTaskById(task.id));
  };

  return (
    <MainLayout title={`Task: ${task.title}`}>
      <div className="animate-fade-in">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back</span>
        </button>
        
        {/* Task header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <select
                value={task.status}
                onChange={handleStatusChange}
                className="bg-gray-100 dark:bg-gray-800 border-0 rounded-md focus:ring-2 focus:ring-primary/50 py-1"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <span className={`priority-badge ${task.priority} capitalize`}>
                {task.priority}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="inline-flex items-center justify-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
              >
                <Edit size={16} className="mr-1.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDeleteTask}
                className="inline-flex items-center justify-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/40 dark:text-red-400 rounded-md text-sm font-medium transition-colors"
              >
                <Trash2 size={16} className="mr-1.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mt-4">{task.title}</h1>
          
          {/* Task metadata */}
          <div className="flex flex-wrap gap-6 mt-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar size={16} className="mr-1.5" />
              <span>Created on {formatDate(task.createdAt)}</span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock size={16} className={`mr-1.5 ${isOverdue() ? 'text-red-500' : ''}`} />
              <span className={isOverdue() ? 'text-red-500 font-medium' : ''}>
                {task.dueDate ? `Due on ${formatDate(task.dueDate)}` : 'No due date'}
                {isOverdue() && ' (Overdue)'}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-6 mt-4">
            {task.projectName && (
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Project</span>
                <p className="font-medium mt-1">{task.projectName}</p>
              </div>
            )}
            
            {task.assigneeName && (
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Assignee</span>
                <div className="flex items-center mt-1">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                    <img
                      src={task.assigneeId ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${task.assigneeId}` : undefined}
                      alt={task.assigneeName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium">{task.assigneeName}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Task description */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Description</h2>
          {task.description ? (
            <p className="whitespace-pre-line">{task.description}</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No description provided</p>
          )}
        </div>
        
        {/* Attachments */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Attachments</h2>
            <button className="inline-flex items-center justify-center text-primary hover:underline text-sm">
              <Paperclip size={16} className="mr-1" />
              <span>Add Attachment</span>
            </button>
          </div>
          
          {task.attachments.length > 0 ? (
            <div className="space-y-3">
              {task.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md"
                >
                  <Paperclip size={16} className="text-gray-500 mr-2" />
                  <div className="flex-1">
                    <p className="font-medium">{attachment.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Uploaded on {formatDate(attachment.uploadedAt)}
                    </p>
                  </div>
                  <a
                    href={attachment.url}
                    download
                    className="text-primary hover:underline text-sm"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No attachments</p>
          )}
        </div>
        
        {/* Comments */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Comments</h2>
          
          {/* Comment form */}
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Comment
              </button>
            </div>
          </form>
          
          {/* Comments list */}
          {task.comments.length > 0 ? (
            <div className="space-y-4">
              {task.comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                      <img
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${comment.authorId}`}
                        alt={comment.authorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium">{comment.authorName}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                      {formatDate(comment.createdAt)} at {formatTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="whitespace-pre-line">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
          )}
        </div>
      </div>
      
      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTask(getTaskById(task.id));
        }}
        task={task}
      />
    </MainLayout>
  );
};

export default TaskDetail;
