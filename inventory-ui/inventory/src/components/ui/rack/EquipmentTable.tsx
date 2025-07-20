import React from 'react';
import { BareMetalServer, NetworkDevice, EquipmentType } from '../types/equipment';
import { 
  Server, 
  Network, 
  Edit, 
  Trash2, 
  MapPin, 
  HardDrive,
  Router,
  Shield,
  Wifi,
  Zap
} from 'lucide-react';

interface EquipmentTableProps {
  type: EquipmentType;
  equipment: (BareMetalServer | NetworkDevice)[];
  onEdit: (equipment: BareMetalServer | NetworkDevice) => void;
  onDelete: (equipmentId: string) => void;
}

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'switch': return <Network size={14} className="text-green-600" />;
    case 'router': return <Router size={14} className="text-green-600" />;
    case 'firewall': return <Shield size={14} className="text-green-600" />;
    case 'load-balancer': return <Zap size={14} className="text-green-600" />;
    default: return <Wifi size={14} className="text-green-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-gray-100 text-gray-800';
    case 'maintenance': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const EquipmentTable: React.FC<EquipmentTableProps> = ({
  type,
  equipment,
  onEdit,
  onDelete,
}) => {
  if (equipment.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          {type === 'server' ? (
            <Server size={24} className="text-gray-400" />
          ) : (
            <Network size={24} className="text-gray-400" />
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No {type === 'server' ? 'servers' : 'network devices'} found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {type === 'server' ? 'Server Name' : 'Device Name'}
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {type === 'server' ? 'Model' : 'Type'}
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Rack
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Slot Position
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {equipment.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {type === 'server' ? (
                    <Server size={16} className="text-blue-600 mr-3" />
                  ) : (
                    <div className="mr-3">
                      {getDeviceIcon((item as NetworkDevice).type)}
                    </div>
                  )}
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-600">
                  {type === 'server' 
                    ? (item as BareMetalServer).model 
                    : (item as NetworkDevice).type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                  }
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={14} className="mr-1 text-gray-400" />
                  <span>{item.locationName}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm text-gray-600">
                  <HardDrive size={14} className="mr-1 text-gray-400" />
                  <span>{item.rackName}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-medium text-gray-900">
                  Slot {item.slotPosition}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end space-x-1">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title={`Edit ${type === 'server' ? 'server' : 'device'}`}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title={`Delete ${type === 'server' ? 'server' : 'device'}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};