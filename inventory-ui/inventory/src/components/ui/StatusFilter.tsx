import React from 'react';
import type { VirtualMachine } from '../../types/responseDto';

interface StatusFilterProps {
  selectedStatus: VirtualMachine['status'] | 'all';
  onStatusChange: (status: VirtualMachine['status'] | 'all') => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ selectedStatus, onStatusChange }) => {
  const statuses: Array<{ value: VirtualMachine['status'] | 'all'; label: string }> = [
    { value: 'all', label: 'All Status' },
    { value: 'running', label: 'Running' },
    { value: 'stopped', label: 'Stopped' },
    { value: 'pending', label: 'Pending' },
  ];

  return (
    <select
      value={selectedStatus}
      onChange={(e) => onStatusChange(e.target.value as VirtualMachine['status'] | 'all')}
      className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
    >
      {statuses.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  );
};