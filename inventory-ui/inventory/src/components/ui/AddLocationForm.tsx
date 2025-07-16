import React, { useState, useEffect } from 'react';
import { MapPin, Plus, X, Users, AlertCircle, CheckCircle } from 'lucide-react';
import type { LocationReqDTO } from '../../types/requestDto';
import type { Location, User } from '../../types/responseDto';
import { locationsAPI } from '../../service/inventoryapi';


interface LocationFormProps {
    locations: Location[];
    users: User[]
}


const LocationForm: React.FC<LocationFormProps> = ({ locations, users }) => {
    const [locationDetails, setLocationDetails] = useState<LocationReqDTO>({ name: "", userIds: [1] });
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState<Boolean>(false);
    const [lastAddedLocation, setLastAddedLocation] = useState<String>('');

    // Check if location already exists
    const locationExists = locationDetails?.name.trim() &&
        locations.some(loc => loc.name.toLowerCase() === locationDetails?.name.trim().toLowerCase());

    const isAddDisabled = !locationDetails?.name.trim() || selectedUsers.length === 0 || locationExists || isSubmitting;

    useEffect(() => {
        if (locationExists) {
            setError('This location already exists');
        } else if (locationDetails?.name.trim() && selectedUsers.length === 0) {
            setError('Please select at least one user');
        } else {
            setError('');
        }
    }, [locationDetails?.name, selectedUsers, locationExists]);

    const handleUserToggle = (user: User) => {
        setSelectedUsers(prev =>
            prev.includes(user)
                ? prev.filter(u => u !== user)
                : [...prev, user]
        );

        setLocationDetails(prev => {
            if (!prev) return prev;
            const userIds = prev.userIds ? [...prev.userIds] : [];
            if (userIds.includes(user.id)) {
                return {
                    ...prev,
                    userIds: userIds.filter(id => id !== user.id)
                };
            } else {
                return {
                    ...prev,
                    userIds: [...userIds, user.id]
                };
            }
        })
    };




    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocationDetails(prev => ({
            ...prev,
            name: value
        }));
    }

    const handleAddLocation = async () => {
        if (isAddDisabled) return;

        setIsSubmitting(true);
        try {
            const response = await locationsAPI.create(locationDetails!);
            if (!response) {
                setError('Failed to add location. Please try again.');
                return;
            }
            setShowSuccessNotification(true);
            setLastAddedLocation(locationDetails.name);

            // Hide notification after 2 seconds
            setTimeout(() => {
                setShowSuccessNotification(false);
            }, 2000);

            setLocationDetails({ name: "", userIds: [] });
            setSelectedUsers([]);
            setError('');
        } catch (err) {
            setError('Failed to add location. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setLocationDetails({ name: "", userIds: [] });
        setSelectedUsers([]);
        setError('');
        setIsSelectOpen(false);
    };

    return (
        <div className="w-3/4 h-auto max-w-xl mx-auto border-red-500 border-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                    <div className="flex items-center space-x-3 ">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text font-bold text-white">Add New Location</h2>
                            <p className="text-blue-100">Create a new location and assign users</p>
                        </div>
                        {/* Success Notification */}
                        {showSuccessNotification && (
                            <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right-full duration-300">
                                <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg border border-green-400 flex items-center space-x-3 min-w-[200px]">
                                    <div className="p-1 bg-green-400 rounded-full">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Location Added Successfully!</p>
                                        <p className="text-sm text-green-100">"{lastAddedLocation}" has been created</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                    <div className="space-y-6">
                        {/* Location Name Input */}
                        <div className="space-y-2">
                            <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
                                Location Name
                            </label>
                            <div className="relative">
                                <input
                                    id="location"
                                    type="text"
                                    name='name'
                                    value={locationDetails.name}
                                    onChange={handleLocationChange}
                                    placeholder="Enter location name..."
                                    className={`w-full h-10 px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${error && locationExists
                                        ? 'border-red-300 bg-red-50 focus:border-red-500'
                                        : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white'
                                        }`}
                                />
                                {locationExists && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Users Multi-Select */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Assign Users
                            </label>
                            <div className="relative">
                                <div
                                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                                    className={`w-full px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSelectOpen
                                        ? 'border-blue-500 bg-white ring-2 ring-blue-500/20'
                                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Users className="w-4 h-4 text-gray-500" />
                                            <span className={selectedUsers.length === 0 ? 'text-gray-500' : 'text-gray-700'}>
                                                {selectedUsers.length === 0
                                                    ? 'Select users...'
                                                    : `${selectedUsers.length} user${selectedUsers.length !== 1 ? 's' : ''} selected`
                                                }
                                            </span>
                                        </div>
                                        <div className={`transform transition-transform duration-200 ${isSelectOpen ? 'rotate-180' : ''}`}>
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Dropdown */}
                                {isSelectOpen && (
                                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                        {users.map((user) => (
                                            <div
                                                key={user.id}
                                                onClick={() => handleUserToggle(user)}
                                                className=" h-5 flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 "
                                            >
                                                <div className="flex items-center space-x-3 ">
                                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${selectedUsers.includes(user)
                                                        ? 'bg-blue-600 border-blue-600'
                                                        : 'border-gray-300 hover:border-blue-400'
                                                        }`}>
                                                        {selectedUsers.includes(user) && (
                                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={6} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className="text-gray-700 select-none">{user.username}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Selected Users Pills */}
                            {selectedUsers.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {selectedUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                                        >
                                            <span>{user.username}</span>
                                            <button
                                                onClick={() => handleUserToggle(user)}
                                                className="ml-2 hover:bg-blue-200 rounded-full p-0.5 transition-colors duration-150"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <span className="text-sm text-red-700">{error}</span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                onClick={handleAddLocation}
                                disabled={isAddDisabled}
                                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${isAddDisabled
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        <span>Add Location</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleCancel}
                                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationForm;