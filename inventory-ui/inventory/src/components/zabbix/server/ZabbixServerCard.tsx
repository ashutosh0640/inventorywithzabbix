import React from 'react';
import type { ZabbixServerResDTO } from '../../../types/zabbix';
import { Trash2, Edit3, CircleCheckBig  } from 'lucide-react';

interface ZabbixServerCardProps {
  server: ZabbixServerResDTO;
  isSelected: boolean;
  onSelect: (server: ZabbixServerResDTO) => void;
  onDelete: (server: ZabbixServerResDTO) => void;
  onEdit: (server: ZabbixServerResDTO) => void;
  isLoading?: boolean;
}

export const ZabbixServerCard: React.FC<ZabbixServerCardProps> = ({
  server,
  isSelected,
  onSelect,
  onDelete,
  onEdit,
  isLoading = false,
}) => {
  const getStatusClass = () => {
    switch (server.status) {
      case 'CONNECTED':
        return 'bg-gradient-to-r from-green-600 to-green-400';
      case 'OFFLINE':
        return 'bg-gradient-to-r from-red-600 to-red-400';
      case "ERROR":
        return 'bg-gradient-to-r from-yellow-600 to-yellow-400';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-400';
    }
  };

  return (
    <div className={`max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden transform cursor-pointer hover:scale-95 transition-transform duration-100 ease-in-out 
      ${isSelected ? 'ring-2 ring-gray-500 theme-bg-tertiary' : ''
      }`} onClick={() => onSelect(server)}>

      {/* Card Header */}
      <div id="cardHeader" className={`p-5 flex justify-between items-center transition-colors duration-300 ${getStatusClass()}  `}>
        <h2 className="text-xl font-bold text-white">{server.name}</h2>
          {isSelected && <CircleCheckBig className="w-8 h-8 text-white" />}
        <span id="status" className="px-4 py-1.5 text-sm font-semibold text-green-800 bg-white/90 rounded-full shadow-sm">{server.status}</span>
      </div>

      {/* Card Body  */}
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">URL</h3>
          <p className="mt-1 text-gray-700 break-words font-medium">{server.url}</p>
        </div>
        <div className="border-t border-gray-200"></div>
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Project Name</h3>
          <p className="mt-1 text-gray-700 font-medium">{server.project.name}</p>
        </div>

      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-gray-50 flex justify-end items-center space-x-4">
        <button className="p-2 rounded-full text-blue-500 hover:bg-green-200 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors" disabled={isLoading}>
          <Edit3 className="w-5 h-5" onClick={(e) => {
            e.stopPropagation();
            onEdit(server);
          }}
          />
        </button>
        <button className="p-2 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors" disabled={isLoading}>
          <Trash2 className="w-5 h-5" onClick={(e) => {
            e.stopPropagation();
            onDelete(server);
          }}
          />
        </button>
      </div>
    </div>
  );
};