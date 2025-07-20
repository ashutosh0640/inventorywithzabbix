import React, { useState, useEffect } from 'react';
import type { Location, Rack, BareMetal } from '../../../types/responseDto';
import type { BareMetalReqDTO, InterfacesDTO, ManagementType } from '../../../types/requestDto';
import { X, Server, HardDrive } from 'lucide-react';

interface BaremetalFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (baremetal: BareMetalReqDTO) => void;
    server?: BareMetal | null;
    availableLocations: Location[];
}

const managementOptions: ManagementType[] = [
    'ILO',
    'IDRAC',
    'KVM',
    'IPMI',
    'RMM',
    'CIMC',
    'BMC_GENERIC',
    'OTHER'
];

export const BaremetalForm: React.FC<BaremetalFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    server,
    availableLocations,
}) => {
    const [racklist, setRacklist] = useState<Rack[]>([]);
    const [formData, setFormData] = useState<BareMetalReqDTO>({
        name: '',
        type: 'PHYSICAL_SERVER',
        management: '',
        manufacturer: '',
        modelName: '',
        serialNumber: '',
        interfaces: [],
        rackId: 0,
        rackSlotNumber: 0,
        userIds: []
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when modal opens/closes or server changes
    useEffect(() => {
        if (isOpen) {
            if (server) {
                // Edit mode - populate form with existing server data
                setFormData({
                    name: server.name,
                    type: server.type,
                    management: server.management,
                    manufacturer: server.manufacturer,
                    modelName: server.modelName,
                    serialNumber: server.serialNumber,
                    interfaces: server.interfaces,
                    rackId: server.rack.id,
                    rackSlotNumber: server.rackSlotNumber,
                    userIds: server.user.map(u => u.id)
                });
            } else {
                // Add mode - reset form
                setFormData({
                    name: '',
                    type: 'PHYSICAL_SERVER',
                    management: '',
                    manufacturer: '',
                    modelName: '',
                    serialNumber: '',
                    interfaces: [],
                    rackId: 0,
                    rackSlotNumber: 0,
                    userIds: []
                });
            }
            setErrors({});
        }
    }, [isOpen, server]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Server name is required';
        }

        if (!formData.modelName?.trim()) {
            newErrors.model = 'Server model is required';
        }

        if (!formData.rackId) {
            newErrors.rackId = 'Rack selection is required';
        }

        if (formData.rackSlotNumber < 1 || formData.rackSlotNumber > 100) {
            newErrors.slotPosition = 'Slot position must be between 1 and 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLocation = (e: React.FormEvent) => {
        e.preventDefault();
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <Server size={24} className="text-blue-600 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-900">
                            {server ? 'Edit Baremetal Server' : 'Add New Baremetal Server'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="p-6 space-y-6">
                        {/* Server Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Server Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Enter server name (e.g., Web Server 01)"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Management */}
                        <select
                            id="management"
                            value={formData.management}
                            onChange={(e) => setFormData(prev => ({ ...prev, management: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select management</option>
                            {managementOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>

                        {/* Server Model */}
                        <div>
                            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                                Server Model *
                            </label>
                            <input
                                type="text"
                                id="model"
                                value={formData.modelName || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, modelName: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.model ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Enter server model (e.g., Dell PowerEdge R740)"
                            />
                            {errors.model && (
                                <p className="mt-1 text-sm text-red-600">{errors.modelName}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Common models: Dell PowerEdge, HP ProLiant, Supermicro SuperServer
                            </p>
                        </div>

                        {/* Location Selection */}
                        <div>
                            <label htmlFor="rackId" className="block text-sm font-medium text-gray-700 mb-2">
                                <HardDrive size={16} className="inline mr-1" />
                                Select Location *
                            </label>
                            <select
                                id="locationId"
                                value="Select Location"
                                onChange={handleLocation}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.rackId ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select a location</option>
                                {availableLocations.map(loc => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </option>
                                ))}
                            </select>
                            {errors.locationId && (
                                <p className="mt-1 text-sm text-red-600">{errors.locationId}</p>
                            )}
                        </div>

                        {/* Rack Selection */}
                        <div>
                            <label htmlFor="rackId" className="block text-sm font-medium text-gray-700 mb-2">
                                <HardDrive size={16} className="inline mr-1" />
                                Select Rack *
                            </label>
                            <select
                                id="rackId"
                                value={formData.rackId}
                                onChange={(e) => setFormData(prev => ({ ...prev, rackId: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.rackId ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select a rack</option>
                                {racklist.map(rack => (
                                    <option key={rack.id} value={rack.id}>
                                        {rack.name} - {rack.location.name}
                                    </option>
                                ))}
                            </select>
                            {errors.rackId && (
                                <p className="mt-1 text-sm text-red-600">{errors.rackId}</p>
                            )}
                        </div>

                        {/* Slot Position */}
                        <div>
                            <label htmlFor="slotPosition" className="block text-sm font-medium text-gray-700 mb-2">
                                Slot Position *
                            </label>
                            <input
                                type="number"
                                id="slotPosition"
                                min="1"
                                max="100"
                                value={formData.rackSlotNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, slotPosition: parseInt(e.target.value) || 1 }))}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.slotPosition ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Enter slot position (1-100)"
                            />
                            {errors.slotPosition && (
                                <p className="mt-1 text-sm text-red-600">{errors.slotPosition}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Slot position in the rack (typically 1U = 1 slot)
                            </p>
                        </div>

                        {/* Status */}

                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            {server ? 'Update Server' : 'Create Server'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};