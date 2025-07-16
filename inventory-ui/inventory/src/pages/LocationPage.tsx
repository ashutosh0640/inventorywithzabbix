import React, { useState, useEffect } from 'react';
import { useProjects } from '../features/inventoryQuery/projectQuery';
import { useUsers } from '../features/inventoryQuery/userQuery';
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from '../features/inventoryQuery/locationQuery';
import { useAlertMsg } from '../hooks/useAlertMsg';
import type { Project, Location, User } from '../types/responseDto';
import type { LocationReqDTO } from '../types/requestDto';
import { LocationCard } from '../components/ui/location/LocationCard';
import { LocationTable } from '../components/ui/location/LocationTable';
import { LocationForm } from '../components/ui/location/LocationForm';
import {
  Grid3X3,
  List,
  Plus,
  Search,
  Filter,
  SortAsc
} from 'lucide-react';

type ViewMode = 'cards' | 'table';

const LocationPage: React.FC = () => {
  const { data: location,
    isLoading: locationsLoading,
    isError: locationsError,
    error: locationsFetchError
  } = useLocations();

  const { data: user } = useUsers();

  const { data: project } = useProjects();

  const { mutate: createLocation, isPending: createpending, isError: createError, isSuccess: createSuccess } = useCreateLocation();
  const { mutate: updateLocation, isPending: updatePending, isError: updateError, isSuccess: updateSuccess } = useUpdateLocation();
  const { mutate: deleteLocation, isPending: deletePending, isError: deleteError, isSuccess: deleteSuccess } = useDeleteLocation();

  const [projects, setProjects] = useState<Project[]>(project || []);
  const [users, setUsers] = useState<User[]>(user || []);
  const [locations, setLocations] = useState<Location[]>(location || []);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [editingLocation, setEditingLocation] = useState<LocationReqDTO | null>(null);
  const [addingLocation, setAddingLocation] = useState<LocationReqDTO | null>(null);
  const {
    alertMsg,
    showAlertMsg,
    hideAlertMsg
  } = useAlertMsg();

  // Filter locations based on search and status
  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setIsFormOpen(true);
  };

  const handleDelete = (projectId: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
    deleteLocation(projectId, {
      onSuccess: () => {
        setLocations(locations.filter(l => l.id != projectId));
      },
      onError: (error) => {
        console.error('❌ Failed to delete location:', error);
        showAlertMsg('error', 'Error Deleting Location', 'Failed to delete location.');
      }
    });
    
  };

  const handleAddLocation = () => {
    setAddingLocation(addingLocation);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (locationData: LocationReqDTO) => {
    if (selectedLocation) {
      // Update existing project
      console.log('Updating location:', selectedLocation.id, locationData);
      updateLocation({
        id: selectedLocation.id,
        dto: locationData
      });

    } else {
      // Add new project
      console.log('Creating new project:', locationData);
      createLocation(locationData, {
        onSuccess: (response) => {
          setLocations([...locations, response]);
          showAlertMsg('success', 'Location Created', 'The location was created successfully.');
        },
        onError: (error) => {
          console.error('❌ Failed to create location:', error);
        }
      });
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingLocation(null);
  };

  useEffect(() => {
    setUsers(user || []);
    setProjects(project || []);
    if (locationsLoading) {
      console.log('Fetching projects...');
    } else if (locationsError) {
      console.warn('API not available, using demo data:', locationsFetchError);
    } else if (locations) {
      setLocations(location || []);
      console.log('Locations loaded:', location);
    }
  }, [locationsLoading, locationsError, locations, locationsFetchError]);

  // Show success messages
  useEffect(() => {
    if (!createSuccess)
      console.log('Project created successfully:', !createSuccess);
    showAlertMsg('success', 'Location Created', 'The location was created successfully.');
    if (!updateSuccess)
      console.log('Project updated successfully:', !updateSuccess);
    showAlertMsg('success', 'Location Updated', 'The location was updated successfully.');
    if (!deleteSuccess)
      console.log('Project deleted successfully:', !deleteSuccess);
    showAlertMsg('success', 'Location Deleted', 'The location was deleted successfully.');
  }, [createSuccess, updateSuccess, deleteSuccess, showAlertMsg]);

  // Show error messages
  useEffect(() => {
    if (createError)
      showAlertMsg('error', 'Error Creating Location', 'Failed to create location.');
    if (updateError)
      showAlertMsg('error', 'Error Updating Location', 'Failed to update location.');
    if (deleteError)
      showAlertMsg('error', 'Error Deleting Location', 'Failed to delete location.');
  }, [createError, updateError, deleteError, showAlertMsg]);


  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'planning', label: 'Planning' },
  ];



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track your location portfolio
              </p>
            </div>
            <button
              onClick={handleAddLocation}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Add Location
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* View Toggle and Actions */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'cards'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  title="Card view"
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  title="Table view"
                >
                  <List size={16} />
                </button>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <SortAsc size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredLocations.length} of {locations.length} locations
          </p>
        </div>

        {/* Content */}
        {filteredLocations.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first project'
              }
            </p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <LocationTable
            locations={filteredLocations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Project Form Modal */}
        <LocationForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          location={selectedLocation}
          availableUsers={users}
        />
      </div>
    </div>
  );
};

export default LocationPage;