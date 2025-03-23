
import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { useTaskContext } from "@/context/TaskContext";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import { Project } from "@/types";
import { Plus, Search } from "lucide-react";

const Projects = () => {
  const { projects } = useTaskContext();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleNewProject = () => {
    setSelectedProject(undefined);
    setIsProjectModalOpen(true);
  };
  
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };
  
  const handleProjectModalClose = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(undefined);
  };

  return (
    <MainLayout title="Projetos">
      <div className="animate-fade-in">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">Projetos</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie e acompanhe seus projetos em andamento</p>
          </div>
          
          <button
            onClick={handleNewProject}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md font-medium transition-colors"
          >
            <Plus size={18} className="mr-1.5" />
            <span>Novo Projeto</span>
          </button>
        </div>
        
        {/* Search and filter */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-md focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>
        
        {/* Projects grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onEdit={handleEditProject} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center">
            {searchQuery ? (
              <>
                <p className="text-gray-600 dark:text-gray-400">Nenhum projeto encontrado para "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-primary hover:underline"
                >
                  Limpar busca
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-400">Você ainda não tem projetos</p>
                <button
                  onClick={handleNewProject}
                  className="mt-4 px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
                >
                  Criar Seu Primeiro Projeto
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={handleProjectModalClose}
        project={selectedProject}
      />
    </MainLayout>
  );
};

export default Projects;
