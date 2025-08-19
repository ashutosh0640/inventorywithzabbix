import React from 'react';
import type { NetworkDevices } from '../../../types/responseDto';
import { Edit, Trash2 } from 'lucide-react'



interface NetworkDeviceTableProps {
    equipment: (NetworkDevices)[];
    onEdit: (equipment: NetworkDevices) => void;
    onDelete: (equipmentId: number) => void;
}

export const NetworkDeviceTable: React.FC<NetworkDeviceTableProps> = ({
    equipment,
    onEdit,
    onDelete,
}) => {

    return (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rack Details
                            </th>
                            <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Device Type
                            </th>
                            <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vendor
                            </th>
                            <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Model Detail
                            </th>
                            <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Device IP
                            </th>
                            <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Port
                            </th>
                            <th className="p-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {equipment.map((device) => (
                            <tr key={device.id} className="hover:bg-gray-50 transition-colors duration-150">

                                {/* Rack */}
                                <td className="p-2 whitespace-nowrap">
                                    <div className="text-xs text-gray-900">{device.rack.location.name}</div>
                                    <div className="text-xs text-gray-600">{device.rack.name} ({device.rackSlotNumber})</div>
                                </td>

                                {/* Device Type */}
                                <td className="p-2 whitespace-nowrap">
                                    <div className="text-xs text-gray-900">{device.type}</div>
                                </td>

                                {/* Vendor */}
                                <td className="p-2 whitespace-nowrap">
                                    <div className="text-xs text-gray-900">{device.manufacturer}</div>
                                    <div className="text-xs text-gray-600">{device.osVersion}</div>
                                </td>

                                {/* Model Detail */}
                                <td className="p-2 whitespace-nowrap">
                                    <div className="text-xs text-gray-900">{device.model}</div>
                                    <div className="text-xs text-gray-600">{device.serialNumber}</div>
                                </td>
                                
                                {/* Device IP */}
                                <td className="p-2 whitespace-nowrap">
                                    {device.interfaces.length > 0 ? (
                                        <div className="text-xs text-gray-900">{device.interfaces[0].ip}</div>
                                    ) : (
                                        <div className="text-xs text-gray-600">No IP</div>
                                    )}
                                </td>

                                {/* Port */}
                                <td className="p-2 whitespace-nowrap">
                                    <div className="text-xs text-gray-900">{device.numberOfPort}</div>
                                </td>
                                
                                <td className="p-2">
                                    <div className="flex items-center justify-end space-x-1">
                                        <button
                                            onClick={() => onEdit(device)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title={`Edit server`}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(device.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title={`Delete server`}
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
        </div>
    );
};