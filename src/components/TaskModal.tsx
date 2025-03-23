
import { useState, useEffect } from "react";
import { Task, Priority, TaskStatus } from "@/types";
import { useTaskContext } from "@/context/TaskContext";
import { X } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  projectId?: string;
}

const TaskModal = ({ isOpen, onClose, task, projectId }: TaskModalProps) => {
  const { createTask, updateTask, projects, users } = useTaskContext();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<Priority>("medium");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string>("");
  const [error, setError] = useState("");

  const isEditing = !!task;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setPriority(task.priority);
        setSelectedProjectId(task.projectId);
        setAssigneeId(task.assigneeId);
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
      } else {
        setTitle("");
        setDescription("");
        setStatus("todo");
        setPriority("medium");
        setSelectedProjectId(projectId || (projects.length > 0 ? projects[0].id : ""));
        setAssigneeId(null);
        setDueDate("");
      }
      setError("");
    }
  }, [isOpen, task, projectId, projects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError("Título da tarefa é obrigatório");
      return;
    }
    
    if (!selectedProjectId) {
      setError("Projeto é obrigatório");
      return;
    }
    
    if (isEditing && task) {
      updateTask(task.id, {
        title,
        description,
        status,
        priority,
        projectId: selectedProjectId,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : null,
      });
    } else {
      createTask({
        title,
        description,
        status,
        priority,
        projectId: selectedProjectId,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : null,
      });
    }
    
    onClose();
  };
  
  // Priority translations
  const getPriorityTranslation = (priority: string) => {
    switch (priority) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      default: return priority;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold">
            {isEditing ? "Editar Tarefa" : "Criar Nova Tarefa"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-10rem)] p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="task-title" className="block text-sm font-medium mb-1">
                Título da Tarefa
              </label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800"
                placeholder="Digite o título da tarefa"
                autoFocus
              />
            </div>
            
            <div>
              <label htmlFor="task-description" className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800"
                placeholder="Digite a descrição da tarefa"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="task-project" className="block text-sm font-medium mb-1">
                  Projeto
                </label>
                <select
                  id="task-project"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800"
                >
                  <option value="" disabled>Selecione um projeto</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="task-assignee" className="block text-sm font-medium mb-1">
                  Responsável
                </label>
                <select
                  id="task-assignee"
                  value={assigneeId || ""}
                  onChange={(e) => setAssigneeId(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800"
                >
                  <option value="">Não atribuído</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="task-status" className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800"
                >
                  <option value="todo">A Fazer</option>
                  <option value="in-progress">Em Andamento</option>
                  <option value="done">Concluída</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="task-priority" className="block text-sm font-medium mb-1">
                  Prioridade
                </label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="task-due-date" className="block text-sm font-medium mb-1">
                Data de Vencimento
              </label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800"
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
          </form>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
          >
            {isEditing ? "Atualizar Tarefa" : "Criar Tarefa"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
