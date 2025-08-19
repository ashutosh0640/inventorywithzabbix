import React from 'react';
import type { BareMetal, NetworkDevices } from '../../../types/responseDto';
import { 
  Server, 
  Network, 
  Edit, 
  Trash2,
  HardDrive,
  Router,
  Shield,
  Wifi,
} from 'lucide-react';

type Type = 'PHYSICAL_SERVER' | 'NETWORK_DEVICE' 

interface DeviceTableProps {
  type: Type;
  equipment: (BareMetal | NetworkDevices)[];
  onEdit: (equipment: BareMetal | NetworkDevices) => void;
  onDelete: (equipmentId: number) => void;
}

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'SWITCH': return <Network size={14} className="text-green-600" />;
    case 'ROUTER': return <Router size={14} className="text-green-600" />;
    case 'FIREWALL': return <Shield size={14} className="text-green-600" />;
    default: return <Wifi size={14} className="text-green-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ONLINE': return 'bg-green-100 text-green-800';
    case 'OFFLINE': return 'bg-red-100 text-gray-800';
    case 'maintenance': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const DeviceTable: React.FC<DeviceTableProps> = ({
  type,
  equipment,
  onEdit,
  onDelete,
}) => {
  if (equipment.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          {type === 'PHYSICAL_SERVER' ? (
            <Server size={24} className="text-gray-400" />
          ) : (
            <Network size={24} className="text-gray-400" />
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No {type === 'PHYSICAL_SERVER' ? 'servers' : 'network devices'} found
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
            <th className="p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {type === 'PHYSICAL_SERVER' ? 'Server Name' : 'Device Name'}
            </th>
            <th className="p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Vendor
            </th>
            <th className="p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {type === 'PHYSICAL_SERVER' ? 'Model' : 'Type'}
            </th>
            <th className="p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {/* <MapPin size={14} className="mr-1 text-gray-400" /> */}
              Location
            </th>
            <th className="p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Rack
            </th>
            <th className="p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Slot Position
            </th>
            <th className="p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="p-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {equipment.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-2">
                <div className="flex items-center">
                  {type === 'PHYSICAL_SERVER' ? (
                    <Server size={16} className="text-blue-600 mr-3" />
                  ) : (
                    <div className="mr-3">
                      {getDeviceIcon((item as NetworkDevices).type)}
                    </div>
                  )}
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
              </td>
              <td className="p-2">
                <span className="text-sm font-medium text-gray-900">
                  {item.manufacturer}
                </span>
              </td>
              <td className="p-2">
                <span className="text-sm text-gray-600">
                  {type === 'PHYSICAL_SERVER' 
                    ? (item as BareMetal).modelName
                    : (item as NetworkDevices).type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                  }
                </span>
              </td>
              <td className="p-2">
                <div className="flex items-center text-sm text-gray-600">
                  
                  <span>{item.rack.location.name}</span>
                </div>
              </td>
              <td className="p-2">
                <div className="flex items-center text-sm text-gray-600">
                  <HardDrive size={14} className="mr-1 text-gray-400" />
                  <span>{item.name}</span>
                </div>
              </td>
              <td className="p-2">
                <span className="text-sm font-medium text-gray-900">
                  Slot {item.rackSlotNumber}
                </span>
              </td>
              <td className="p-2">
                {/* <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.interfaces[0].status)}`}>
                  {item.interfaces[0].status.charAt(0).toUpperCase() + item.interfaces[0].status.slice(1)}
                </span> */}
              </td>
              <td className="p-2">
                <div className="flex items-center justify-end space-x-1">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title={`Edit ${type === 'PHYSICAL_SERVER' ? 'server' : 'device'}`}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title={`Delete ${type === 'PHYSICAL_SERVER' ? 'server' : 'device'}`}
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