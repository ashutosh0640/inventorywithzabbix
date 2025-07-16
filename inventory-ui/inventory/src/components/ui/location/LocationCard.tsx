import React from 'react';
import type { Location } from '../../../types/responseDto';
import { Calendar,Warehouse, BriefcaseBusiness, Users, Edit, Trash2, MoreHorizontal } from 'lucide-react';

interface LocationCardProps {
  location: Location;
  onEdit: (location: Location) => void;
  onDelete: (locationId: number) => void;
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
  'on-hold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  planning: 'bg-purple-100 text-purple-800 border-purple-200',
};

export const LocationCard: React.FC<LocationCardProps> = ({ location, onEdit, onDelete }) => {

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {location.name}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors["active"]}`}>
            {/* {project.status.charAt(0).toUpperCase() + project.status.slice(1)} */} Active
          </span>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(location)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit location"
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
      </div>

      {/* <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {location.createdAt ? `Created on ${formatDate(new Date(location.createdAt))}` : 'No creation date available'}
      </p> */}

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={14} className="mr-2 text-gray-400" />
          Created {(location.createdAt).split('T')[0]}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Warehouse  size={14} className="mr-2 text-gray-400" />
          <span className="line-clamp-1">
            {location.rack?.length ?? 0} Rack{location.rack?.length > 1 ? 's' : ''}: {' '}
            {location.rack?.map(r => r.rackName).join(', ')}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <BriefcaseBusiness  size={14} className="mr-2 text-gray-400" />
          <span className="line-clamp-1">
            {location.project?.length ?? 0} Project{location.project?.length > 1 ? 's' : ''}: {' '}
            {location.project?.map(loc => loc.name).join(', ')}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Users size={14} className="mr-2 text-gray-400" />
            {location.user?.length} team member{location.user?.length > 1 ? 's' : ''}
          </div>
          
          <div className="flex -space-x-2">
            {location.user?.slice(0, 3).map((user, index) => (
              <div
                key={user.id}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                title={user.fullName}
              >
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </div>
            ))}
            {location.user?.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                +{location.user?.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};