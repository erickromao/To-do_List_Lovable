
import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { useTaskContext } from "@/context/TaskContext";
import { FilterOptions, Task } from "@/types";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { Plus, ArrowRight, Clock, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { tasks, projects, filterOptions, setFilterOptions, currentUser } = useTaskContext();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get user's tasks
  const myTasks = tasks.filter(task => task.assigneeId === currentUser.id);
  const todayTasks = myTasks.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  });
  
  // Get overdue tasks
  const overdueTasks = myTasks.filter(task => {
    if (!task.dueDate || task.status === "done") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  });
  
  // Get upcoming tasks (next 7 days, excluding today)
  const upcomingTasks = myTasks.filter(task => {
    if (!task.dueDate || task.status === "done") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return dueDate >= tomorrow && dueDate <= nextWeek;
  });
  
  // Calculate project stats
  const inProgressProjects = projects.filter(project => {
    const projectTasks = tasks.filter(task => task.projectId === project.id);
    return projectTasks.some(task => task.status !== "done") && projectTasks.some(task => task.status === "done");
  }).length;
  
  const taskCompletionRate = myTasks.length > 0 
    ? Math.round((myTasks.filter(task => task.status === "done").length / myTasks.length) * 100) 
    : 0;

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };
  
  const handleNewTask = () => {
    setSelectedTask(undefined);
    setIsTaskModalOpen(true);
  };
  
  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(undefined);
  };

  return (
    <MainLayout title="Dashboard">
      <div className="animate-fade-in">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Bem-vindo, {currentUser.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Aqui está uma visão de suas tarefas e projetos.</p>
        </div>
        
        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Minha tarefa</h3>
                <p className="text-2xl font-semibold mt-1">{myTasks.length}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <CheckSquare className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Taxa de conclusão</span>
              <span className="ml-auto font-medium">{taskCompletionRate}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${taskCompletionRate}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Projetos</h3>
                <p className="text-2xl font-semibold mt-1">{projects.length}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                <Folder className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Em progresso</span>
              <span className="ml-auto font-medium">{inProgressProjects}</span>
            </div>
            <div className="mt-2 flex items-center space-x-1">
              {projects.slice(0, 5).map((project, index) => (
                <div
                  key={project.id}
                  className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden"
                  style={{ zIndex: 5 - index }}
                >
                  <span className="text-xs font-medium">{project.name.substring(0, 2)}</span>
                </div>
              ))}
              {projects.length > 5 && (
                <div className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-xs font-medium">+{projects.length - 5}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue</h3>
                <p className="text-2xl font-semibold mt-1">{overdueTasks.length}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                <Clock className="text-red-600 dark:text-red-400" size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Vencimento hoje </span>
              <span className="ml-auto font-medium">{todayTasks.length}</span>
            </div>
            <div className="mt-2 flex items-center space-x-1">
              {todayTasks.length > 0 ? (
                <Link
                  to="/tasks"
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  <span>View tasks due today</span>
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">Nenhuma tarefa para vencer hoje
</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Tasks section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Today's tasks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Tarefas de hoje</h2>
                <button
                  onClick={handleNewTask}
                  className="flex items-center text-sm text-primary hover:bg-primary/5 px-2 py-1 rounded-md transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  <span>Nova tarefa</span>
                </button>
              </div>
              
              {todayTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {todayTasks.slice(0, 4).map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">Você não tem nenhuma tarefa para entregar hoje
                  </p>
                  <button
                    onClick={handleNewTask}
                    className="mt-4 px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
                  >
                    Criar uma nova tarefa
                  </button>
                </div>
              )}
              
              {todayTasks.length > 4 && (
                <div className="mt-4 text-center">
                  <Link
                    to="/tasks"
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    <span>View all ({todayTasks.length})</span>
                    <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              )}
            </div>
            
            {/* Upcoming tasks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Próximas tarefas</h2>
              </div>
              
              {upcomingTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingTasks.slice(0, 4).map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma tarefa futura para os próximos 7 dias</p>
                </div>
              )}
              
              {upcomingTasks.length > 4 && (
                <div className="mt-4 text-center">
                  <Link
                    to="/tasks"
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    <span>View all ({upcomingTasks.length})</span>
                    <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Right sidebar - Overdue tasks */}
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Tarefas atrasadas</h2>
                {overdueTasks.length > 0 && (
                  <span className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-red-900/30 dark:text-red-400">
                    {overdueTasks.length}
                  </span>
                )}
              </div>
              
              {overdueTasks.length > 0 ? (
                <div className="space-y-3">
                  {overdueTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No overdue tasks</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Good job staying on top of things!</p>
                </div>
              )}
            </div>
          </div>
        </div>
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

// Need to add the CheckSquare icon from Lucide for the My Tasks stat card
import { CheckSquare, Folder } from "lucide-react";

export default Dashboard;
