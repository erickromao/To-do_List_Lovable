
import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { useTaskContext } from "@/context/TaskContext";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const History = () => {
  const { tasks } = useTaskContext();
  const navigate = useNavigate();
  
  // Get tasks with the most recent updates first
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  // Get completed tasks
  const completedTasks = sortedTasks.filter(task => task.status === "done");
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Group tasks by date
  const groupTasksByDate = () => {
    const groups: { [key: string]: typeof sortedTasks } = {};
    
    sortedTasks.forEach(task => {
      const dateKey = formatDate(task.updatedAt);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(task);
    });
    
    return Object.entries(groups);
  };
  
  const groupedTasks = groupTasksByDate();
  
  // Status translations
  const getStatusTranslation = (status: string) => {
    switch (status) {
      case 'todo': return 'Pendente';
      case 'in-progress': return 'Em Andamento';
      case 'done': return 'Concluída';
      default: return status;
    }
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

  return (
    <MainLayout title="Histórico">
      <div className="animate-fade-in">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Histórico de Atividades</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Acompanhe o progresso de suas tarefas ao longo do tempo</p>
        </div>
        
        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Tarefas</h3>
            <p className="text-2xl font-semibold mt-1">{tasks.length}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tarefas Concluídas</h3>
            <p className="text-2xl font-semibold mt-1">{completedTasks.length}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Taxa de Conclusão</h3>
            <p className="text-2xl font-semibold mt-1">
              {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
            </p>
          </div>
        </div>
        
        {/* Activity feed */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold">Atividades Recentes</h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {groupedTasks.length > 0 ? (
              groupedTasks.map(([date, tasks]) => (
                <div key={date} className="p-6">
                  <h3 className="text-md font-medium mb-4">{date}</h3>
                  
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 rounded-md transition-colors"
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        <div className={`status-dot ${task.status} mt-1.5`}></div>
                        
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {task.projectName && `Projeto: ${task.projectName}`}
                              </p>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Clock size={14} className="mr-1" />
                                <span>{formatTime(task.updatedAt)}</span>
                              </div>
                              <div className="mt-1">
                                <span className={`priority-badge ${task.priority}`}>
                                  {getPriorityTranslation(task.priority)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-2">
                            {task.assigneeName && (
                              <div className="flex items-center">
                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-1.5">
                                  <img
                                    src={task.assigneeId ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${task.assigneeId}` : undefined}
                                    alt={task.assigneeName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {task.assigneeName}
                                </span>
                              </div>
                            )}
                            
                            <div className="text-sm text-primary flex items-center">
                              <span>Ver detalhes</span>
                              <ArrowRight size={14} className="ml-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">Nenhum histórico de atividade disponível</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default History;
