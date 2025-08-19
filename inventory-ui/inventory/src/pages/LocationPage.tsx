import React, { useState, useEffect } from 'react';
import { useProjects } from '../features/inventoryQuery/projectQuery';
import { useUsers } from '../features/inventoryQuery/userQuery';
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from '../features/inventoryQuery/locationQuery';
import { useCreateRack } from '../features/inventoryQuery/rackQuery';
import type { Project, Location, User } from '../types/responseDto';
import type { LocationReqDTO, RackReqDTO } from '../types/requestDto';
import { LocationCard } from '../components/ui/location/LocationCard';
import { LocationTable } from '../components/ui/location/LocationTable';
import { LocationForm } from '../components/ui/location/LocationForm';
import { RackForm } from '../components/ui/location/RackForm';
import { AlertMessage } from '../components/ui/AlertMessage';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

import {
  Grid3X3,
  List,
  Plus,
  Search,
  SortAsc
} from 'lucide-react';

type ViewMode = 'cards' | 'table';
type AlertType = 'success' | 'error' | 'warning' | 'info';

const LocationPage: React.FC = () => {

  const loginDetails = JSON.parse(sessionStorage.getItem('loginDetails') || 'null');
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [alertType, setAlertType] = useState<AlertType | null>(null)

  const { data: location = [] } = useLocations();

  const { data: user } = useUsers();

  const { data: project } = useProjects();

  const { mutate: createRack } = useCreateRack();
  const { mutate: createLocation } = useCreateLocation();
  const { mutate: updateLocation } = useUpdateLocation();
  const { mutate: deleteLocation } = useDeleteLocation();

  const [projects, setProjects] = useState<Project[]>(project || []);
  const [users, setUsers] = useState<User[]>(user || []);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRackFormOpen, setIsRackFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);


  // Filter locations based on search and status
  const filteredLocations = location.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setIsFormOpen(true);
  };

  const handleDelete = (locationId: number) => {
    deleteLocation(locationId, {
      onSuccess: () => {
        //setLocations(location.filter(l => l.id != locationId));
        setAlertType('success');
        setAlertMessage('Location deleted successfully.');
      },
      onError: () => {
        setAlertType('error')
        setAlertMessage(`Failed to delete location.`);
      }
    });
    setTimeout(() => {
      setAlertType(null);
      setAlertMessage(null);
    }, 3000);
  };

  const handleAddLocation = () => {
    setIsFormOpen(true);
  };

  const handleAddRack = (location: Location) => {
    setSelectedLocation(location);
    setIsRackFormOpen(true);
    console.log("add rack handle")
  }

  const handleFormSubmit = (locationData: LocationReqDTO) => {
    if (selectedLocation) {
      // Update existing location
      updateLocation({
        id: selectedLocation.id,
        dto: locationData
      }, {
        onSuccess: (response) => {
          console.log("Location updated: ", response)
          //setLocations(locations.map(location => location.id === response.id ? response : location));
          setAlertType('success');
          setAlertMessage(`Location ${response.name} updated successfully.`);
        },
        onError: (error) => {
          console.error('Failed to update location:', error);
          setAlertType('error');
          setAlertMessage('Failed to update location.');
        }
      });

    } else {
      // Create new location

      createLocation(locationData, {
        onSuccess: (response) => {
          //setLocations(prev => [...prev, response]);
          console.log("Location created...")
          setAlertType('success');
          setAlertMessage(`Location ${response.name} created successfully.`);
        },
        onError: (error) => {
          console.error('Failed to create location:', error);
          setAlertType('error');
          setAlertMessage('Failed to add location.');
        }
      });
    }
    setIsFormOpen(false);
    setSelectedLocation(null);

    setTimeout(() => {
      setAlertType(null);
      setAlertMessage(null);
    }, 3000);
  };

  const handleRackFormSubmit = (rack: RackReqDTO) => {
    createRack(rack, {
      onSuccess: (response) => {
        setAlertType('success');
        setAlertMessage(`Rack ${response.name} created successfully.`);
      },
      onError: (error) => {
        console.error('Error creating rack:', error.message);
        setAlertType('error');
        setAlertMessage(`Failed to create rack. ${error.message}`);
      }
    })
  }

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedLocation(null);
  };

  const handleRackFormClose = () => {
    setIsRackFormOpen(false);
    setSelectedLocation(null);
  }

  useEffect(() => {
    setUsers(user || []);
    setProjects(project || []);
    //setLocations(location || [])
  }, [location, filteredLocations]);


  if (!location) {
    return (
      <LoadingSkeleton />
    );
  }




  return (
    <div className="min-h-fit bg-gray-50 ">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-xl font-bold text-gray-900">Locations</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track your location portfolio
              </p>
            </div>


            {loginDetails?.role.includes('LOCATION_WRITE_LOCATION') && (

            <button
              onClick={handleAddLocation}
              className="inline-flex items-center p-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Add Location
            </button>)}
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 bg-white rounded-md border border-gray-200 p-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
            Showing {filteredLocations.length} of {location.length} locations
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
              {searchTerm !== 'all'
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
            addRack={handleAddRack}
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

        {/* Rack Form Modal */}
        <RackForm
          isOpen={isRackFormOpen}
          onClose={handleRackFormClose}
          onSubmit={handleRackFormSubmit}
          location={selectedLocation}
          availableUsers={users || []}
        />

        {alertMessage && (
          <AlertMessage
            message={alertMessage}
            type={alertType}
          />
        )}
      </div>
    </div>
  );
};

export default LocationPage;