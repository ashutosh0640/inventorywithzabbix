import React, { useState, useEffect } from 'react';
import { Rack } from '../types/rack';
import { User, Location } from '../types/project';
import { X, Server, MapPin, Users } from 'lucide-react';

interface RackFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rack: Omit<Rack, 'id' | 'createdAt'>) => void;
  rack?: Rack | null;
  availableUsers: User[];
  availableLocations: Location[];
}

export const RackForm: React.FC<RackFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  rack,
  availableUsers,
  availableLocations,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    totalSlot: 24,
    locationId: '',
    usersId: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or rack changes
  useEffect(() => {
    if (isOpen) {
      if (rack) {
        // Edit mode - populate form with existing rack data
        setFormData({
          name: rack.name,
          totalSlot: rack.totalSlot,
          locationId: rack.location.id,
          usersId: rack.users.map(u => u.id),
        });
      } else {
        // Add mode - reset form
        setFormData({
          name: '',
          totalSlot: 24,
          locationId: '',
          usersId: [],
        });
      }
      setErrors({});
    }
  }, [isOpen, rack]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Rack name is required';
    }

    if (!formData.locationId) {
      newErrors.locationId = 'Location is required';
    }

    if (formData.totalSlot < 1 || formData.totalSlot > 100) {
      newErrors.totalSlot = 'Total slots must be between 1 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      totalSlot: formData.totalSlot,
      locationId: formData.locationId,
      usersId: formData.usersId,
    });

    onClose();
  };

  const handleUserToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      usersId: prev.usersId.includes(userId)
        ? prev.usersId.filter(id => id !== userId)
        : [...prev.usersId, userId]
    }));
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
              {rack ? 'Edit Server Rack' : 'Add New Server Rack'}
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
            {/* Rack Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Rack Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter rack name (e.g., Main Server Rack A1)"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Total Slots */}
            <div>
              <label htmlFor="totalSlot" className="block text-sm font-medium text-gray-700 mb-2">
                Total Slots *
              </label>
              <input
                type="number"
                id="totalSlot"
                min="1"
                max="100"
                value={formData.totalSlot}
                onChange={(e) => setFormData(prev => ({ ...prev, totalSlot: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.totalSlot ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter total number of slots"
              />
              {errors.totalSlot && (
                <p className="mt-1 text-sm text-red-600">{errors.totalSlot}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Standard rack sizes: 24U, 42U, 48U slots
              </p>
            </div>

            {/* Location Selection (Single) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Select Location *
              </label>
              <div className={`border rounded-lg p-3 max-h-40 overflow-y-auto ${
                errors.locationId ? 'border-red-300' : 'border-gray-300'
              }`}>
                {availableLocations.map((location) => (
                  <label
                    key={location.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="location"
                      checked={formData.locationId === location.id}
                      onChange={() => setFormData(prev => ({ ...prev, locationId: location.id }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{location.name}</p>
                      <p className="text-xs text-gray-500">{location.address}</p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.locationId && (
                <p className="mt-1 text-sm text-red-600">{errors.locationId}</p>
              )}
            </div>

            {/* Users Selection (Multiple) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users size={16} className="inline mr-1" />
                Assign Users (Optional)
              </label>
              <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                {availableUsers.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.usersId.includes(user.id)}
                      onChange={() => handleUserToggle(user.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Selected: {formData.usersId.length} user{formData.usersId.length !== 1 ? 's' : ''}
              </p>
            </div>
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
              {rack ? 'Update Rack' : 'Create Rack'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};