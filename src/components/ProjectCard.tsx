
import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, CheckSquare, ArrowRight } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import { Project } from "@/types";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
}

const ProjectCard = ({ project, onEdit }: ProjectCardProps) => {
  const { tasks, deleteProject } = useTaskContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Count tasks by project
  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const completedTasks = projectTasks.filter((task) => task.status === "done").length;
  const totalTasks = projectTasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o projeto "${project.name}"?`)) {
      deleteProject(project.id);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-all hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 clickable">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg truncate">{project.name}</h3>
          
          {/* Dropdown menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Mais opções"
            >
              <MoreHorizontal size={18} className="text-gray-500" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-800 z-10 animate-fade-in">
                <button
                  onClick={() => {
                    onEdit(project);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2"
                >
                  <Edit size={14} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2"
                >
                  <Trash2 size={14} />
                  <span>Excluir</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2 h-10">
          {project.description}
        </p>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center space-x-1.5">
              <CheckSquare size={14} className="text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {completedTasks}/{totalTasks} tarefas
              </span>
            </div>
            <span className="text-xs font-medium">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Atualizado em {formatDate(project.updatedAt)}
          </div>
          
          <Link
            to={`/projects/${project.id}`}
            className="text-xs text-primary flex items-center hover:underline"
          >
            <span>Ver Projeto</span>
            <ArrowRight size={12} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
