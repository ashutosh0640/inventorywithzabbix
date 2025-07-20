import React, { useState, useEffect } from 'react';
import { NetworkDevice, EquipmentFormData } from '../types/equipment';
import { Rack } from '../types/rack';
import { X, Network, HardDrive, Router, Shield, Wifi, Zap } from 'lucide-react';

interface NetworkDeviceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (equipment: EquipmentFormData) => void;
  device?: NetworkDevice | null;
  availableRacks: Rack[];
}

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'switch': return <Network size={16} />;
    case 'router': return <Router size={16} />;
    case 'firewall': return <Shield size={16} />;
    case 'load-balancer': return <Zap size={16} />;
    default: return <Wifi size={16} />;
  }
};

export const NetworkDeviceForm: React.FC<NetworkDeviceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  device,
  availableRacks,
}) => {
  const [formData, setFormData] = useState<EquipmentFormData>({
    name: '',
    type: 'switch',
    slotPosition: 1,
    status: 'active',
    rackId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or device changes
  useEffect(() => {
    if (isOpen) {
      if (device) {
        // Edit mode - populate form with existing device data
        setFormData({
          name: device.name,
          type: device.type,
          slotPosition: device.slotPosition,
          status: device.status,
          rackId: device.rackId,
        });
      } else {
        // Add mode - reset form
        setFormData({
          name: '',
          type: 'switch',
          slotPosition: 1,
          status: 'active',
          rackId: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, device]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Device name is required';
    }

    if (!formData.rackId) {
      newErrors.rackId = 'Rack selection is required';
    }

    if (formData.slotPosition < 1 || formData.slotPosition > 100) {
      newErrors.slotPosition = 'Slot position must be between 1 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const deviceTypes = [
    { value: 'switch', label: 'Network Switch', description: 'Layer 2/3 switching device' },
    { value: 'router', label: 'Router', description: 'Layer 3 routing device' },
    { value: 'firewall', label: 'Firewall', description: 'Security filtering device' },
    { value: 'load-balancer', label: 'Load Balancer', description: 'Traffic distribution device' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Network size={24} className="text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {device ? 'Edit Network Device' : 'Add New Network Device'}
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
            {/* Device Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Device Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter device name (e.g., Core Switch 01)"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Device Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Device Type *
              </label>
              <div className="space-y-2">
                {deviceTypes.map((deviceType) => (
                  <label
                    key={deviceType.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.type === deviceType.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={deviceType.value}
                      checked={formData.type === deviceType.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <div className="ml-3 flex items-center">
                      <div className="text-green-600 mr-3">
                        {getDeviceIcon(deviceType.value)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{deviceType.label}</p>
                        <p className="text-xs text-gray-500">{deviceType.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.rackId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a rack</option>
                {availableRacks.map(rack => (
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
                value={formData.slotPosition}
                onChange={(e) => setFormData(prev => ({ ...prev, slotPosition: parseInt(e.target.value) || 1 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.slotPosition ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter slot position (1-100)"
              />
              {errors.slotPosition && (
                <p className="mt-1 text-sm text-red-600">{errors.slotPosition}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Slot position in the rack (network devices typically use 1U)
              </p>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Device Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Current operational status of the network device
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              {device ? 'Update Device' : 'Create Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};