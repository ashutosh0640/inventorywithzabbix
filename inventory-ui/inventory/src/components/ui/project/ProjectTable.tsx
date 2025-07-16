import React from 'react';
import type { Project } from '../../../types/responseDto';
import { Calendar, MapPin, Users, Edit, Trash2, MoreHorizontal } from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  'on-hold': 'bg-yellow-100 text-yellow-800',
  planning: 'bg-purple-100 text-purple-800',
};

export const ProjectTable: React.FC<ProjectTableProps> = ({ projects, onEdit, onDelete }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Locations
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {project.description}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors["active"]}`}>
                    {/* {project.status.charAt(0).toUpperCase() + project.status.slice(1)} */}Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={14} className="mr-1 text-gray-400" />
                    {(project.createdAt).split('T')[0]}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-600">
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
                <td className="px-6 py-4">
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
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => onEdit(project)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit project"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};