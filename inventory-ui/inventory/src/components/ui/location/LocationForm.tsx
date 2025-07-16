import React, { useState, useEffect } from 'react';
import type { User } from '../../../types/responseDto';
import { X, Users } from 'lucide-react';
import type { Location } from '../../../types/responseDto';
import type { LocationReqDTO } from '../../../types/requestDto';

interface LoationFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (locationDto: LocationReqDTO) => void;
    location?: Location | null;
    availableUsers: User[] | []
}

export const LocationForm: React.FC<LoationFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    location,
    availableUsers
}) => {
    const [formData, setFormData] = useState({
        name: '',
        selectedUserIds: [] as number[]
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when modal opens/closes or project changes
    useEffect(() => {
        if (isOpen) {
            if (location) {
                // Edit mode - populate form with existing location data
                setFormData({
                    name: location.name,
                    selectedUserIds: location.user?.map(u => u.id),
                });
            } else {
                // Add mode - reset form
                setFormData({
                    name: '',
                    selectedUserIds: []
                });
            }
            setErrors({});
        }
    }, [isOpen, location]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Project name is required';
        }

        if (formData.selectedUserIds?.length === 0) {
            newErrors.users = 'At least one user must be assigned';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const selectedUsers = availableUsers
            .filter(user => formData.selectedUserIds.includes(user.id))
            .map(user => user.id);



        onSubmit({
            name: formData.name.trim(),
            userIds: selectedUsers
        });

        onClose();
    };

    const handleUserToggle = (userId: number) => {
        setFormData(prev => ({
            ...prev,
            selectedUserIds: prev.selectedUserIds?.includes(userId)
                ? prev.selectedUserIds.filter(id => id !== userId)
                : [...prev.selectedUserIds, userId]
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden ">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {location ? 'Edit Location' : 'Add New Location'}
                    </h2>
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
                        {/* Location Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Location Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Enter location name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Users */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users size={16} className="inline mr-1" />
                                Assign Users *
                            </label>
                            <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                                {availableUsers.map((user) => (
                                    <label
                                        key={user.id}
                                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.selectedUserIds.includes(user.id)}
                                            onChange={() => handleUserToggle(user.id)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <div className="flex items-center space-x-2 flex-1">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                                                {user.fullName.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.users && (
                                <p className="mt-1 text-sm text-red-600">{errors.users}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Selected: {formData.selectedUserIds.length} user{formData.selectedUserIds.length !== 1 ? 's' : ''}
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
                            {location ? 'Update Loation' : 'Create Location'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};