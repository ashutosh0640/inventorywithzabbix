import React from 'react';
import type { ZabbixServerResDTO } from '../../../types/zabbix';
import { Server, Globe, FolderOpen, Trash2, Edit3, CheckCircle } from 'lucide-react';

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
        return 'status-badge bg-green-100 text-green-800';
      case 'disconnected':
        return 'status-badge bg-gray-100 text-gray-800';
      case 'error':
        return 'status-badge bg-red-100 text-red-800';
      case 'pending':
        return 'status-badge bg-yellow-100 text-yellow-800';
      default:
        return 'status-badge bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (server.status) {
      case 'connected':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'disconnected':
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      case 'pending':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  return (
    <div 
      className={`w-[400px] bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group ${
        isSelected ? 'ring-2 ring-blue-500 theme-bg-tertiary' : ''
      }`}
      onClick={() => onSelect(server)}
    >
      <div className=" border-2 border-green-500 flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 border-2 border-yellow-500">
          <div className="p-2 theme-bg-tertiary rounded-lg">
            <Server className="w-6 h-6 theme-text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold theme-text-primary flex items-center space-x-2">
              <span>{server.name}</span>
              {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
            </h3>
          </div>
        </div>
        <div className={getStatusClass()}>
          {getStatusIcon()}
          <span className="ml-1 capitalize">{server.status}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 theme-text-secondary" />
          <span className="text-sm theme-text-secondary font-mono">{server.url}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FolderOpen className="w-4 h-4 theme-text-secondary" />
          <span className="text-sm theme-text-secondary">{server.project.name}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t theme-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(server);
              }}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(server);
            }}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="pt-4 border-t theme-border">
        {/* <div className="flex items-center justify-between text-xs theme-text-secondary">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Created {server.createdAt.toLocaleDateString()}</span>
          </div>
          <span>Updated {server.lastUpdated.toLocaleDateString()}</span>
        </div> */}
      </div>
    </div>
  );
};