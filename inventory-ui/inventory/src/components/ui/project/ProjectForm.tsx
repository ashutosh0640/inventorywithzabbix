import React, { useState, useEffect } from 'react';
import type { Project, User, Location } from '../../../types/responseDto';
import { X, Plus, Trash2, MapPin, Users } from 'lucide-react';
import type { ProjectReqDTO } from '../../../types/requestDto';

interface ProjectFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (project: ProjectReqDTO) => void;
    project?: Project | null;
    availableUsers: User[] | [];
    availableLocations: Location[] | [];
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    project,
    availableUsers,
    availableLocations,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        selectedUserIds: [] as number[],
        selectedLocationIds: [] as number[],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when modal opens/closes or project changes
    useEffect(() => {
        if (isOpen) {
            if (project) {
                // Edit mode - populate form with existing project data
                setFormData({
                    name: project.name,
                    description: project.description,
                    selectedUserIds: project.user?.map(u => u.id),
                    selectedLocationIds: project.location?.map(l => l.id),
                });
            } else {
                // Add mode - reset form
                setFormData({
                    name: '',
                    description: '',
                    selectedUserIds: [],
                    selectedLocationIds: [],
                });
            }
            setErrors({});
        }
    }, [isOpen, project]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Project name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Project description is required';
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

        const selectedLocations = availableLocations
            .filter(location => formData.selectedLocationIds.includes(location.id))
            .map(location => location.id);


        onSubmit({
            name: formData.name.trim(),
            description: formData.description.trim(),
            usersId: selectedUsers,
            locationIds: selectedLocations,
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

    const handleLocationToggle = (locationId: number) => {
        setFormData(prev => ({
            ...prev,
            selectedLocationIds: prev.selectedLocationIds?.includes(locationId)
                ? prev.selectedLocationIds.filter(id => id !== locationId)
                : [...prev.selectedLocationIds, locationId]
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden ">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {project ? 'Edit Project' : 'Add New Project'}
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
                        {/* Project Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Project Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Enter project name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.description ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Enter project description"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        {/* Status */}
                        {/* <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Project['status'] }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="planning">Planning</option>
                                <option value="active">Active</option>
                                <option value="on-hold">On Hold</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div> */}

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

                        {/* Locations */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin size={16} className="inline mr-1" />
                                Add Locations
                            </label>
                            <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                                {availableLocations?.map((location) => (
                                    <label
                                        key={location.id}
                                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.selectedLocationIds?.includes(location.id)}
                                            onChange={() => handleLocationToggle(location.id)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{location.name}</p>
                                            {/* <p className="text-xs text-gray-500">{location.address}</p> */}
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Selected: {formData.selectedLocationIds?.length} location{formData.selectedLocationIds?.length !== 1 ? 's' : ''}
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
                            {project ? 'Update Project' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};