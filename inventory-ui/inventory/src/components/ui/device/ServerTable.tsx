import React from 'react';
import type { BareMetal } from '../../../types/responseDto';
import { Edit, Trash2 } from 'lucide-react'



interface ServerTableProps {
    equipment: (BareMetal)[];
    onEdit: (equipment: BareMetal) => void;
    onDelete: (equipmentId: number) => void;
}

export const ServerTable: React.FC<ServerTableProps> = ({
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
                                Vendor
                            </th>
                            <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Model Detail
                            </th>
                            <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Server IP
                            </th>
                            <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Virtualization
                            </th>
                            {/* <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Virtualization IP
                            </th> */}
                            <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CPU
                            </th>
                            <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                RAM/Storage
                            </th>
                            <th className="p-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {equipment.map((server) => (
                            <tr key={server.id} className="hover:bg-gray-50 transition-colors duration-150">

                                {/* Rack */}
                                <td className="p-2 whitespace-nowrap">
                                    <div className="text-xs text-gray-900">{server.rack.location.name}</div>
                                    <div className="text-xs text-gray-600">{server.rack.name} ({server.rackSlotNumber})</div>
                                </td>

                                {/* Vendor */}
                                <td className="p-2 whitespace-nowrap">
                                    <div className="text-xs text-gray-900">{server.manufacturer}</div>
                                    <div className="text-xs text-gray-600">{server.management}</div>
                                </td>

                                {/* Model Detail */}
                                <td className="p-2 whitespace-nowrap">
                                    <div className="text-xs text-gray-900">{server.modelName}</div>
                                    <div className="text-xs text-gray-600">{server.serialNumber}</div>
                                </td>
                                
                                {/* Management IP */}
                                <td className="p-2 whitespace-nowrap">
                                    {server.interfaces.length > 0 ? (
                                        <div className="text-xs text-gray-900">{server.interfaces[0].ip}</div>
                                    ) : (
                                        <div className="text-xs text-gray-600">No IP</div>
                                    )}
                                </td>

                                {/* Virtualization */}
                                <td className="p-2 whitespace-nowrap">
                                    {server.vp.length > 0 ? (
                                        <div className='flex'>
                                            <div className="text-xs text-gray-900">{server.vp[0].type}</div>
                                            <div className="text-xs text-gray-600">{server.vp[0].version}</div>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-600">No Virtualization</div>
                                    )}
                                </td>

                                {/* <td className="p-2 whitespace-nowrap">
                                    {server.interfaces.length > 0 ? (
                                        <div className="text-xs text-gray-900">{server.vp[0].interface.ip}</div>
                                    ) : (
                                        <div className="text-xs text-gray-600">No IP</div>
                                    )}
                                </td> */}


                                {/* CPU */}
                                <td className="p-2 whitespace-nowrap">
                                    {server.vp.length > 0 ? (
                                        <div className='flex'>
                                            <div className="text-xs text-gray-900">{server.vp[0].cpuCores}</div>
                                            <div className="text-xs text-gray-600">{server.vp[0].cpuModel}</div>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-600">No Virtualization</div>
                                    )}
                                </td>

                                {/* Ram and Storage */}
                                <td className="p-2 whitespace-nowrap">
                                    {server.vp.length > 0 ? (
                                        <div className='flex'>
                                            <div className="text-xs text-gray-900">
                                                {server.vp[0].ramSize} {server.vp[0].ramSizeUnit} RAM
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {server.vp[0].storageSize} {server.vp[0].storageSizeUnit} ( {server.vp[0].storageType})
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-600">No Virtualization</div>
                                    )}

                                </td>

                                
                                <td className="p-2">
                                    <div className="flex items-center justify-end space-x-1">
                                        <button
                                            onClick={() => onEdit(server)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title={`Edit server`}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(server.id)}
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