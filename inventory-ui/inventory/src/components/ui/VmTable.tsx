import React from 'react';
import type { VirtualMachine } from '../../types/responseDto';
import { Power, PowerOff, Clock } from 'lucide-react';

interface VMTableProps {
  vms: VirtualMachine[];
}

export const VMTable: React.FC<VMTableProps> = ({ vms }) => {
  const getStatusIcon = (status: VirtualMachine['status']) => {
    switch (status) {
      case 'running':
        return <Power className="w-4 h-4 text-green-600" />;
      case 'stopped':
        return <PowerOff className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Power className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusClass = (status: VirtualMachine['status']) => {
    switch (status) {
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
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operating System
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resources
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vms.map((vm) => (
              <tr key={vm.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{vm.hostName}</div>
                  <div className="text-sm text-gray-500">ID: {vm.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{vm.os}</div>
                  <div className="text-sm text-gray-500">{vm.version}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {vm.cpuCores} CPU • {vm.ramSize} GB RAM
                  </div>
                  <div className="text-sm text-gray-500">{vm.storageSize} GB Storage</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-gray-900">{vm.ipAddress}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={getStatusClass(vm.status)}>
                    {getStatusIcon(vm.status)}
                    <span className="ml-1 capitalize">{vm.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vm.updatedAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};