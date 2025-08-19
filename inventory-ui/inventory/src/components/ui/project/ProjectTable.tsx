import React, { useState } from 'react';
import type { Project } from '../../../types/responseDto';
import { ConfirmDeleteModal } from '../ConfirmDeleteModel';
import { Calendar, MapPin, Edit, Trash2, Plus, Eye } from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
  addZabbixServer: (project: Project) => void;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  onEdit,
  onDelete,
  addZabbixServer
}) => {

  const loginDetails = JSON.parse(sessionStorage.getItem('loginDetails') || 'null');
  const projectAddPermission = loginDetails?.role.includes('PROJECT_WRITE_PROJECT') || false;
  const projectEditPermission = loginDetails?.role.includes('PROJECT_EDIT_PROJECT') || false;
  const projectDeletePermission = loginDetails?.role.includes('PROJECT_DELETE_PROJECT') || false;
  const projectViewPermission = !loginDetails?.role.includes('PROJECT_WRITE_PROJECT') && !loginDetails?.role.includes('PROJECT_EDIT_PROJECT') && !loginDetails?.role.includes('PROJECT_DELETE_PROJECT') || false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const openModal = (id: number) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const handleModelClose = () => {
    setIsModalOpen(false);
  }

  const handleDelete = () => {
    if (itemToDelete !== null) {
      onDelete(itemToDelete);
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Locations
              </th>
              <th className="p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="p-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-2">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-900 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {project.description}
                    </p>
                  </div>
                </td>
                <td>
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar size={14} className="mr-1 text-gray-400" />
                    {(project.createdAt).split('T')[0]}
                  </div>
                </td>
                <td>
                  <div className="flex items-center text-xs text-gray-600">
                    <MapPin size={14} className="mr-1 text-gray-400" />
                    <span className="line-clamp-1">
                      {project.location?.length ?? 0} location{project.location?.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {project.location?.length > 0 && (
                    <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {project.location.map(loc => loc.name).join(', ')}
                    </div>
                  )}
                </td>
                <td>
                  <div className="flex items-center">
                    <div className="flex -space-x-1 mr-2">
                      {project.user?.slice(0, 3).map((user) => (
                        <div
                          key={user.id}
                          className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium border border-white"
                          title={user.fullName}
                        >
                          {user.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {project.user?.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border border-white">
                          +{project.user?.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {project.user?.length}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-left justify-center space-x-1">
                    {projectEditPermission && (
                      <button
                        onClick={() => onEdit(project)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit project"
                      >
                        <Edit size={16} />
                      </button>)}
                    {projectDeletePermission && (
                      <button
                        onClick={() => openModal(project.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete project"
                      >
                        <Trash2 size={16} />
                      </button>)}
                    {projectAddPermission && (
                      <button
                        onClick={() => addZabbixServer(project)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title={`Add zabbix server`}
                      >
                        <Plus size={16} />
                      </button>)}
                    {projectViewPermission && (
                      <p className=' text-gray-500 text-xs'>View only</p>
                    )}

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={handleModelClose}
        onConfirm={handleDelete}
      />
    </div >
  );
};