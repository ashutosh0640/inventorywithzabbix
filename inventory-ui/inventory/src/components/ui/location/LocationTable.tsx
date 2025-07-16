import React from 'react';
import type { Location } from '../../../types/responseDto';
import { Calendar, Warehouse, BriefcaseBusiness, Edit, Trash2, MoreHorizontal } from 'lucide-react';

interface LocationTableProps {
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (locationId: number) => void;
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  'on-hold': 'bg-yellow-100 text-yellow-800',
  planning: 'bg-purple-100 text-purple-800',
};

export const LocationTable: React.FC<LocationTableProps> = ({ locations, onEdit, onDelete }) => {

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Locations
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Racks
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Projects
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
            {locations.map((location) => (
              <tr key={location.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      {location.name}
                    </h3>
                    {/* <p className="text-sm text-gray-500 line-clamp-1">
                      {location.address}
                    </p> */}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors["active"]}`}>
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={14} className="mr-1 text-gray-400" />
                    {(location.createdAt).split('T')[0]}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Warehouse size={14} className="mr-1 text-gray-400" />
                    <span className="line-clamp-1">
                      {location.rack?.length ?? 0} rack{location.rack?.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  {location.project?.length > 0 && (
                    <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {location.rack?.map(r => r.rackName).join(', ')}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <BriefcaseBusiness size={14} className="mr-1 text-gray-400" />
                    <span className="line-clamp-1">
                      {location.project?.length ?? 0} project{location.project?.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  {location.project?.length > 0 && (
                    <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {location.project.map(loc => loc.name).join(', ')}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex -space-x-1 mr-2">
                      {location.user?.slice(0, 3).map((user) => (
                        <div
                          key={user.id}
                          className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium border border-white"
                          title={user.fullName}
                        >
                          {user.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {location.user?.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border border-white">
                          +{location.user?.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {location.user?.length}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => onEdit(location)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit project"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(location.id)}
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