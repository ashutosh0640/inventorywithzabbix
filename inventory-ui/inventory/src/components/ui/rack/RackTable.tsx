import React from 'react';
import { Rack } from '../types/rack';
import { Calendar, MapPin, Users, Edit, Trash2, MoreHorizontal, Server, Network } from 'lucide-react';

interface RackTableProps {
  racks: Rack[];
  onEdit: (rack: Rack) => void;
  onDelete: (rackId: string) => void;
  onClick: (rack: Rack) => void;
}

export const RackTable: React.FC<RackTableProps> = ({ racks, onEdit, onDelete, onClick }) => {
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
                Rack
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Utilization
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Equipment
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Assigned Users
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {racks.map((rack) => {
              const utilizationPercentage = Math.round((rack.occupiedSlot / rack.totalSlot) * 100);

              return (
                <tr 
                  key={rack.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onClick(rack)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Server size={20} className="text-blue-600 mr-3" />
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {rack.name}
                        </h3>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {rack.occupiedSlot}/{rack.totalSlot}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          utilizationPercentage > 80 ? 'bg-red-100 text-red-800' :
                          utilizationPercentage > 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {utilizationPercentage}%
                        </span>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            utilizationPercentage > 80 ? 'bg-red-500' :
                            utilizationPercentage > 60 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${utilizationPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-blue-600">
                        <Server size={14} className="mr-1" />
                        <span className="font-medium">{rack.servers.length}</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <Network size={14} className="mr-1" />
                        <span className="font-medium">{rack.networkDevices.length}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-1 text-gray-400" />
                      <div>
                        <p className="font-medium">{rack.location.name}</p>
                        <p className="text-xs text-gray-400">{rack.location.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-1 text-gray-400" />
                      {formatDate(rack.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex -space-x-1 mr-2">
                        {rack.users.slice(0, 3).map((user) => (
                          <div
                            key={user.id}
                            className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium border border-white"
                            title={user.name}
                          >
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        ))}
                        {rack.users.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border border-white">
                            +{rack.users.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
                        {rack.users.length}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-1">
                      <button
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};