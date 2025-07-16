import React, { useState, useEffect } from 'react';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../features/inventoryQuery/projectQuery';
import { useUsers } from '../features/inventoryQuery/userQuery';
import { useLocations } from '../features/inventoryQuery/locationQuery';
import type { Project, Location, User } from '../types/responseDto';
import type { ProjectReqDTO } from '../types/requestDto';
import { ProjectCard } from '../components/ui/project/ProjectCard';
import { ProjectTable } from '../components/ui/project/ProjectTable';
import { ProjectForm } from '../components/ui/project/ProjectForm';
import AlertMsg from '../components/ui/AlertMsg';
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModel';
import {
    Grid3X3,
    List,
    Plus,
    Search,
    Filter,
    SortAsc
} from 'lucide-react';

type ViewMode = 'cards' | 'table';

const ProjectPage: React.FC = () => {
    const { data: project,
        isLoading: projectsLoading,
        isError: projectsError,
        error: projectsFetchError
    } = useProjects();

    const { data: user } = useUsers();

    const { data: location } = useLocations();

    const { mutate: createProject } = useCreateProject();
    const { mutate: updateProject } = useUpdateProject();
    const { mutate: deleteProject } = useDeleteProject();


    const [projects, setProjects] = useState<Project[]>(project || []);
    const [users, setUsers] = useState<User[]>(user || []);
    const [locations, setLocations] = useState<Location[]>(location || []);
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [addingProject, setAddingProject] = useState<ProjectReqDTO | null>(null);

    // Filter projects based on search and status
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsFormOpen(true);
    };

    const handleDeletemodel = (projectId: number) => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        console.log('Delete modal closed', isDeleteModalOpen);
    }

    const handleDelete = (projectId: number) => {
        console.log('Deleting project with ID:', projectId);
        deleteProject(projectId, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setProjects(projects.filter(l => l.id !== projectId));
            },
            onError: (error) => {
                console.error(error);
            },

        });
    };

    const handleAddProject = () => {
        setAddingProject(addingProject);
        setIsFormOpen(true);
    };

    const handleFormSubmit = (projectData: ProjectReqDTO) => {
        if (editingProject) {
            // Update existing project
            console.log('Updating project:', projectData);
            updateProject({
                id: editingProject.id,
                dto: projectData
            });
            setIsFormOpen(false);
        } else {
            // Add new project
            console.log('Creating new project:', projectData);
            createProject(projectData, {
                onSuccess: (respones) => {
                    setIsFormOpen(false);
                    setProjects([...projects, respones]);
                },
                onError: (error) => {
                    console.error('Error creating project:', error);
                }
            });

        }
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingProject(null);
    };

    useEffect(() => {
        setUsers(user || []);
        setLocations(location || []);
        if (projectsLoading) {
            console.log('Fetching projects...');
        } else if (projectsError) {
            console.warn('API not available, using demo data:', projectsFetchError);
        } else if (project) {
            setProjects(project);
            console.log('Projects loaded:', project);
        }
    }, [projectsLoading, projectsError, projects, projectsFetchError]);

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'on-hold', label: 'On Hold' },
        { value: 'planning', label: 'Planning' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage and track your project portfolio
                            </p>
                        </div>
                        <button
                            onClick={handleAddProject}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <Plus size={16} className="mr-2" />
                            Add Project
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
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
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
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
                        Showing {filteredProjects.length} of {projects.length} projects
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
                            {searchTerm || statusFilter !== 'all'
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
                    />
                )}

                {/* Project Form Modal */}
                <ProjectForm
                    isOpen={isFormOpen}
                    onClose={handleFormClose}
                    onSubmit={handleFormSubmit}
                    project={editingProject}
                    availableUsers={users}
                    availableLocations={locations}
                />


                {/* Confirm Delete Modal */}
                {/* <ConfirmDeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => closeDeleteModal()}
                    onConfirm={handleDelete}
                    itemName={"Item"}
                /> */}

                {/* Alert Messages */}
                {/* <AlertMsg
                    message={{
                        show: {},
                        type: 'success',
                        title: editingProject ? 'Project Updated' : 'Project Created',
                        message: editingProject
                            ? 'The project was updated successfully.'
                            : 'The project was created successfully.'
                    }}
                    onClose={() => setEditingProject(null)}
                /> */}
            </div>

        </div>
    );
};

export default ProjectPage;