import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { useTaskContext } from "@/context/TaskContext";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { Task, TaskStatus, Priority, FilterOptions } from "@/types";
import { Plus, Search, Filter, X } from "lucide-react";

const Tasks = () => {
  const { 
    tasks, 
    projects, 
    users, 
    filterOptions, 
    setFilterOptions, 
    filteredTasks 
  } = useTaskContext();
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilter, setLocalFilter] = useState<FilterOptions>(filterOptions);
  const [view, setView] = useState<"list" | "kanban">("list");
  
  // Initialize local filter with context filter
  useEffect(() => {
    setLocalFilter(filterOptions);
  }, [filterOptions]);
  
  // Apply filters
  const applyFilters = () => {
    setFilterOptions(localFilter);
    setIsFilterOpen(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    const emptyFilter: FilterOptions = {};
    setLocalFilter(emptyFilter);
    setFilterOptions(emptyFilter);
  };
  
  // Group tasks by status for kanban view
  const tasksByStatus = {
    todo: filteredTasks.filter(task => task.status === "todo"),
    "in-progress": filteredTasks.filter(task => task.status === "in-progress"),
    done: filteredTasks.filter(task => task.status === "done"),
  };
  
  const handleNewTask = () => {
    setSelectedTask(undefined);
    setIsTaskModalOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };
  
  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(undefined);
  };
  
  const toggleFilter = (key: keyof FilterOptions, value: any) => {
    setLocalFilter(prev => {
      const newFilter = { ...prev };
      
      if (key === "status" || key === "priority") {
        const values = prev[key] as any[] || [];
        if (values.includes(value)) {
          newFilter[key] = values.filter(v => v !== value);
        } else {
          newFilter[key] = [...values, value];
        }
      } else {
        newFilter[key] = value === prev[key] ? undefined : value;
      }
      
      return newFilter;
    });
  };
  
  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (localFilter.status && localFilter.status.length > 0) count++;
    if (localFilter.priority && localFilter.priority.length > 0) count++;
    if (localFilter.projectId) count++;
    if (localFilter.assigneeId) count++;
    if (localFilter.dueDate) count++;
    if (localFilter.searchQuery) count++;
    return count;
  };
  
  const activeFilterCount = countActiveFilters();

  return (
    <MainLayout title="Tarefas">
      <div className="animate-fade-in">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">Tarefas</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie e acompanhe todas as suas tarefas
            </p>
          </div>
          
          <div className="flex space-x-3">
            {/* View toggle buttons */}
            <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 text-sm font-medium ${
                  view === "list"
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                } transition-colors`}
              >
                Lista
              </button>
              <button
                onClick={() => setView("kanban")}
                className={`px-3 py-1.5 text-sm font-medium ${
                  view === "kanban"
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                } transition-colors`}
              >
                Kanban
              </button>
            </div>
            
            <button
              onClick={handleNewTask}
              className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md font-medium transition-colors"
            >
              <Plus size={18} className="mr-1.5" />
              <span>Nova tarefa</span>
            </button>
          </div>
        </div>
        
        {/* Search and filter */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Procurar tarefas..."
                value={localFilter.searchQuery || ""}
                onChange={(e) => setLocalFilter({ ...localFilter, searchQuery: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-md focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`inline-flex items-center justify-center px-4 py-2 border rounded-md font-medium text-sm transition-colors ${
                  activeFilterCount > 0
                    ? "border-primary bg-primary/10 text-primary dark:bg-primary/20"
                    : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Filter size={16} className="mr-1.5" />
                <span>Filtros</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1.5 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium text-sm transition-colors"
                >
                  <X size={16} className="mr-1.5" />
                  <span>Limpar</span>
                </button>
              )}
              
              <button
                onClick={applyFilters}
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md font-medium text-sm transition-colors"
              >
                <span>Aplicar</span>
              </button>
            </div>
          </div>
          
          {/* Filter panel */}
          {isFilterOpen && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
              {/* Status filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="space-y-2">
                  {["Pendente", "Em progresso", "Pronto"].map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(localFilter.status || []).includes(status as TaskStatus)}
                        onChange={() => toggleFilter("status", status)}
                        className="rounded text-primary focus:ring-primary/50 mr-2"
                      />
                      <div className="flex items-center">
                        <span className={`status-dot ${status} mr-2`}></span>
                        <span className="capitalize">{status.replace("-", " ")}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Priority filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Prioridade</label>
                <div className="space-y-2">
                  {["Baixo", "Médio", "Alta"].map((priority) => (
                    <label key={priority} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(localFilter.priority || []).includes(priority as Priority)}
                        onChange={() => toggleFilter("priority", priority)}
                        className="rounded text-primary focus:ring-primary/50 mr-2"
                      />
                      <span className={`priority-badge ${priority} capitalize`}>{priority}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Project filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Projeto</label>
                <select
                  value={localFilter.projectId || ""}
                  onChange={(e) => setLocalFilter({ ...localFilter, projectId: e.target.value || undefined })}
                  className="w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-md focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="">Todos</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Assignee filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Participante</label>
                <select
                  value={localFilter.assigneeId || ""}
                  onChange={(e) => setLocalFilter({ ...localFilter, assigneeId: e.target.value || undefined })}
                  className="w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-md focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="">Todos</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Due date filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Data de vencimento</label>
                <div className="space-y-2">
                  {[
                    { value: "today", label: "Vencimento hoje" },
                    { value: "thisWeek", label: "Vencimento esta semana" },
                    { value: "overdue", label: "Vencido" },
                    { value: "noDueDate", label: "Sem data de vencimento" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        checked={localFilter.dueDate === option.value}
                        onChange={() => toggleFilter("dueDate", option.value)}
                        className="rounded-full text-primary focus:ring-primary/50 mr-2"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Task list */}
        {view === "list" ? (
          <>
            {filteredTasks.length > 0 ? (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">Nenhuma tarefa encontrada correspondendo aos seus critérios</p>
                <div className="mt-4 space-x-4">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="text-primary hover:underline"
                    >
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={handleNewTask}
                    className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
                  >
                    Crie uma nova tarefa
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Todo column */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center">
                  <span className="status-dot todo mr-2"></span>
                  <h3 className="font-medium">Pendente</h3>
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {tasksByStatus.todo.length}
                </span>
              </div>
              <div className="p-3 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {tasksByStatus.todo.length > 0 ? (
                  tasksByStatus.todo.map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* In Progress column */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center">
                  <span className="status-dot in-progress mr-2"></span>
                  <h3 className="font-medium">Em progresso</h3>
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {tasksByStatus["in-progress"].length}
                </span>
              </div>
              <div className="p-3 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {tasksByStatus["in-progress"].length > 0 ? (
                  tasksByStatus["in-progress"].map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Done column */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center">
                  <span className="status-dot done mr-2"></span>
                  <h3 className="font-medium">Pronto</h3>
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {tasksByStatus.done.length}
                </span>
              </div>
              <div className="p-3 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {tasksByStatus.done.length > 0 ? (
                  tasksByStatus.done.map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleTaskModalClose}
        task={selectedTask}
      />
    </MainLayout>
  );
};

export default Tasks;
