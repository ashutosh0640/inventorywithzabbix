import React, { useState, useEffect } from 'react';
import { MapPin, X, Users, Plus, Minus, Save } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  users: string[];
}

interface EditLocationModalProps {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (locationId: string, name: string, users: string[]) => Promise<void>;
  existingLocations: Location[];
}

const availableUsers = [
  'John Doe',
  'Jane Smith',
  'Mike Johnson',
  'Sarah Wilson',
  'David Brown',
  'Emily Davis',
  'Chris Miller',
  'Amanda Garcia',
  'Robert Taylor',
  'Lisa Anderson'
];

const EditLocationModal: React.FC<EditLocationModalProps> = ({
  location,
  isOpen,
  onClose,
  onUpdate,
  existingLocations
}) => {
  const [locationName, setLocationName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isUserSelectOpen, setIsUserSelectOpen] = useState(false);

  // Initialize form data when location changes
  useEffect(() => {
    if (location && isOpen) {
      setLocationName(location.name);
      setSelectedUsers([...location.users]);
      setError('');
    }
  }, [location, isOpen]);

  // Check if location name already exists (excluding current location)
  const locationExists = locationName.trim() && 
    existingLocations.some(loc => 
      loc.id !== location?.id && 
      loc.name.toLowerCase() === locationName.trim().toLowerCase()
    );

  const isUpdateDisabled = !locationName.trim() || selectedUsers.length === 0 || locationExists || isSubmitting;

  useEffect(() => {
    if (locationExists) {
      setError('This location name already exists');
    } else if (locationName.trim() && selectedUsers.length === 0) {
      setError('Please select at least one user');
    } else {
      setError('');
    }
  }, [locationName, selectedUsers, locationExists]);

  const handleUserToggle = (user: string) => {
    setSelectedUsers(prev => 
      prev.includes(user)
        ? prev.filter(u => u !== user)
        : [...prev, user]
    );
  };

  const handleUpdate = async () => {
    if (!location || isUpdateDisabled) return;

    setIsSubmitting(true);
    try {
      await onUpdate(location.id, locationName.trim(), selectedUsers);
      handleCancel();
    } catch (err) {
      setError('Failed to update location. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setLocationName('');
    setSelectedUsers([]);
    setError('');
    setIsUserSelectOpen(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!isOpen || !location) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Edit Location</h2>
                <p className="text-blue-100">Update location details and manage users</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Location Name Input */}
            <div className="space-y-2">
              <label htmlFor="edit-location" className="block text-sm font-semibold text-gray-700">
                Location Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="edit-location"
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Enter location name..."
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    error && locationExists
                      ? 'border-red-300 bg-red-50 focus:border-red-500'
                      : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            {/* Users Management */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Assigned Users <span className="text-red-500">*</span>
              </label>
              
              {/* Current Users List */}
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Current Users ({selectedUsers.length})
                  </span>
                  <button
                    onClick={() => setIsUserSelectOpen(!isUserSelectOpen)}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add User</span>
                  </button>
                </div>

                {/* Selected Users */}
                {selectedUsers.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUsers.map((user) => (
                      <div
                        key={user}
                        className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{user}</span>
                        </div>
                        <button
                          onClick={() => handleUserToggle(user)}
                          className="p-1 hover:bg-red-100 rounded-full transition-colors duration-200 text-red-500"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No users assigned
                  </div>
                )}
              </div>

              {/* Add Users Dropdown */}
              {isUserSelectOpen && (
                <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-3 bg-blue-50 border-b border-blue-200">
                    <span className="text-sm font-medium text-blue-800">Available Users</span>
                  </div>
                  {availableUsers
                    .filter(user => !selectedUsers.includes(user))
                    .map((user) => (
                      <div
                        key={user}
                        onClick={() => {
                          handleUserToggle(user);
                          setIsUserSelectOpen(false);
                        }}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <Plus className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700 select-none">{user}</span>
                        </div>
                      </div>
                    ))}
                  {availableUsers.filter(user => !selectedUsers.includes(user)).length === 0 && (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      All users are already assigned
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleUpdate}
                disabled={isUpdateDisabled}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isUpdateDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Location</span>
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

export default EditLocationModal;