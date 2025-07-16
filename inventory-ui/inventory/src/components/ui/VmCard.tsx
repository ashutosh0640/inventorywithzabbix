import React from 'react';
import type { VirtualMachine } from '../../types/responseDto';
import { Server, Cpu, HardDrive, MemoryStick, Network, Calendar, Power, PowerOff, Clock } from 'lucide-react';


interface VMCardProps {
  vm: VirtualMachine;
}



export const VMCard: React.FC<VMCardProps> = ({ vm }) => {


  const getStatusIcon = () => {
    switch (vm.status) {
      case 'running':
        return <Power className="w-4 h-4" />;
      case 'stopped':
        return <PowerOff className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Power className="w-4 h-4" />;
    }
  };

  const getStatusClass = () => {
    switch (vm.status) {
      case 'running':
        return 'status-badge status-running';
      case 'stopped':
        return 'status-badge status-stopped';
      case 'pending':
        return 'status-badge status-pending';
      default:
        return 'status-badge status-stopped';
    }
  };

  return (
    <div className="card p-6 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Server className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{vm.hostName}</h3>
            <p className="text-sm text-gray-500">{vm.os} {vm.version}</p>
          </div>
        </div>
        <div className={getStatusClass()}>
          {getStatusIcon()}
          <span className="ml-1 capitalize">{vm.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{vm.cpuCores} cores</span>
        </div>
        <div className="flex items-center space-x-2">
          <MemoryStick className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{vm.ramSize} {vm.ramSizeUnit} RAM</span>
        </div>
        <div className="flex items-center space-x-2">
          <HardDrive className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{vm.storageSize} {vm.storageSizeUnit}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Network className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{vm.ipAddress}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Created {vm.createdAt.toString()}</span>
          </div>
          <span>Updated {vm.updatedAt.toString()}</span>
        </div>
      </div>
    </div>
  );
};