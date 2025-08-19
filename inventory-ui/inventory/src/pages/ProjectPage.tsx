import React, { useState } from 'react';
import { useProjects, useCreateProject, useUpdateProjectBUser, useDeleteProject } from '../features/inventoryQuery/projectQuery';
import { useUsers } from '../features/inventoryQuery/userQuery';
import { useLocations } from '../features/inventoryQuery/locationQuery';
import { useCreateZabbixServer } from '../features/zabbixQuery/zabbixServerQuery'
import type { Project } from '../types/responseDto';
import type { ProjectReqDTO } from '../types/requestDto';
import { ProjectCard } from '../components/ui/project/ProjectCard';
import { ProjectTable } from '../components/ui/project/ProjectTable';
import { ProjectForm } from '../components/ui/project/ProjectForm';
import { ZabbixServerForm } from '../components/ui/project/ZabbixServerForm';
import { AlertMessage } from '../components/ui/AlertMessage';
import {
    Grid3X3,
    List,
    Plus,
    Search,
    SortAsc
} from 'lucide-react';
import type { ZabbixServerReqDTO } from '../types/zabbix';

type ViewMode = 'cards' | 'table';
type AlertType = 'success' | 'error' | 'warning' | 'info';

const ProjectPage: React.FC = () => {

    const loginDetails = JSON.parse(sessionStorage.getItem('loginDetails') || 'null');
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<AlertType | null>(null);

    const { data: project = [] } = useProjects();

    const { data: user } = useUsers();
    const { data: location } = useLocations();

    const { mutate: createProject } = useCreateProject();
    const { mutate: updateProject } = useUpdateProjectBUser();
    const { mutate: deleteProject } = useDeleteProject();
    const { mutate: createZabbixServer } = useCreateZabbixServer();

    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const [isZabbixFormOpen, setIsZabbixFormOpen] = useState<boolean>(false);

    // Filter projects based on search and status
    const filteredProjects = project.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch;
    });

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsFormOpen(true);
    };


    const handleDelete = (projectId: number) => {
        deleteProject(projectId, {
            onSuccess: () => {
                setAlertType('success');
                setAlertMessage('Project deleted successfully.');
            },
            onError: () => {
                setAlertType('error')
                setAlertMessage(`Failed to delete location.`);
            },
        });
    };

    const handleAddProject = () => {
        setIsFormOpen(true);
    };

    const handleAddZabbix = (project: Project) => {
        setEditingProject(project);
        setIsZabbixFormOpen(true);
    }

    const handleFormSubmit = (projectData: ProjectReqDTO) => {
        if (editingProject) {
            // Update existing project
            updateProject({
                id: editingProject.id,
                dto: projectData
            }, {
                onSuccess: (response) => {
                    setAlertType('success');
                    setAlertMessage(`Project ${response.name} updated successfully.`);
                },
                onError: () => {
                    setAlertType('error');
                    setAlertMessage('Failed to update project.');
                }
            });

        } else {
            // Add new project
            createProject(projectData, {
                onSuccess: (response) => {
                    setAlertType('success');
                    setAlertMessage(`Project ${response.name} created successfully.`);
                },
                onError: (error) => {
                    console.error('Error creating project:', error);
                    setAlertType('error');
                    setAlertMessage('Failed to create project.');
                }
            });
        }
        setIsFormOpen(false);
        setEditingProject(null)
    };

    const handleZabbixFormSubmit = (dto: ZabbixServerReqDTO) => {
        console.log("zabbix form data: ", dto)
        createZabbixServer(dto), {
            onSuccess: () => {
                setAlertType('success');
                setAlertMessage(`Zabbix server created successfully.`);
            },
            onError: () => {
                setAlertType('error');
                setAlertMessage('Failed to create zabbix server.');
            }
        }
        setIsZabbixFormOpen(false);
        setEditingProject(null)

    }

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingProject(null);
    };

    const handleZabbixFormClose = () => {
        setIsZabbixFormOpen(false);

    }


    return (
        <div className="min-h-fit bg-gray-50">
            <div className="max-w-7xl mx-auto ">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage and track your project portfolio
                            </p>
                        </div>

                        { loginDetails?.role.includes('PROJECT_WRITE_PROJECT') && (
                            
                        <button
                            onClick={handleAddProject}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <Plus size={16} className="mr-2" />
                            Add Project
                        </button>)}
                    </div>
                </div>

                {/* Controls */}
                <div className="mb-6 bg-white rounded-md border border-gray-200 p-2">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* View Toggle and Actions */}
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('cards')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'cards'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    title="Card view"
                                >
                                    <Grid3X3 size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'table'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    title="Table view"
                                >
                                    <List size={16} />
                                </button>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                                <SortAsc size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Showing {filteredProjects.length} of {project.length} projects
                    </p>
                </div>

                {/* Content */}
                {filteredProjects.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Search size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                        <p className="text-gray-500">
                            {searchTerm
                                ? 'Try adjusting your search or filter criteria'
                                : 'Get started by creating your first project'
                            }
                        </p>
                    </div>
                ) : viewMode === 'cards' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <ProjectTable
                        projects={filteredProjects}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        addZabbixServer={handleAddZabbix}
                    />
                )}

                {/* Project Form Modal */}
                <ProjectForm
                    isOpen={isFormOpen}
                    onClose={handleFormClose}
                    onSubmit={handleFormSubmit}
                    project={editingProject}
                    availableUsers={user || []}
                    availableLocations={location || []}
                />

                <ZabbixServerForm
                    isOpen={isZabbixFormOpen}
                    onClose={handleZabbixFormClose}
                    onSubmit={handleZabbixFormSubmit}
                    project={editingProject}
                />

                {alertMessage && (
                    <AlertMessage
                        message={alertMessage}
                        type={alertType}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectPage;