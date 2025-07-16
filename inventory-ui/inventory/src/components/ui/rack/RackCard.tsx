import React from 'react';
import type { Rack } from '../../../types/responseDto';
import { Calendar, MapPin, Users, Edit, Trash2, MoreHorizontal, Server, Network } from 'lucide-react';

interface RackCardProps {
  rack: Rack;
  onEdit: (rack: Rack) => void;
  onDelete: (rackId: string) => void;
  onClick: (rack: Rack) => void;
}

export const RackCard: React.FC<RackCardProps> = ({ rack, onEdit, onDelete, onClick }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const utilizationPercentage = Math.round((rack.occupiedSlot / rack.totalSlot) * 100);

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group cursor-pointer"
      onClick={() => onClick(rack)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Server size={20} className="text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {rack.name}
            </h3>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
              {rack.totalSlot} Slots
            </span>
            <span className={`px-2 py-1 rounded-full font-medium ${
              utilizationPercentage > 80 ? 'bg-red-100 text-red-800' :
              utilizationPercentage > 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {utilizationPercentage}% Used
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(rack)}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(rack);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit rack"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(rack.id)}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(rack.id);
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete rack"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Equipment Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center text-sm text-gray-600 bg-blue-50 rounded-lg p-2">
            <Server size={14} className="mr-2 text-blue-600" />
            <span className="font-medium">{rack.servers.length}</span>
            <span className="ml-1">Server{rack.servers.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 bg-green-50 rounded-lg p-2">
            <Network size={14} className="mr-2 text-green-600" />
            <span className="font-medium">{rack.networkDevices.length}</span>
            <span className="ml-1">Device{rack.networkDevices.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Utilization Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Slot Utilization</span>
            <span>{rack.occupiedSlot}/{rack.totalSlot}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                utilizationPercentage > 80 ? 'bg-red-500' :
                utilizationPercentage > 60 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${utilizationPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={14} className="mr-2 text-gray-400" />
          Created {formatDate(rack.createdAt)}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <MapPin size={14} className="mr-2 text-gray-400" />
          <span className="line-clamp-1">
            {rack.location.name}
          </span>
        </div>
        <div className="text-xs text-gray-400 ml-6">
          {rack.location.address}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Users size={14} className="mr-2 text-gray-400" />
            {rack.users.length} assigned user{rack.users.length !== 1 ? 's' : ''}
          </div>
          
          <div className="flex -space-x-2">
            {rack.users.slice(0, 3).map((user, index) => (
              <div
                key={user.id}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                title={user.name}
              >
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            ))}
            {rack.users.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                +{rack.users.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};