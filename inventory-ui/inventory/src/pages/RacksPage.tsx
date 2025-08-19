import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Rack } from '../types/responseDto';
import { useUsers } from '../features/inventoryQuery/userQuery';
import { useLocationsForUser } from '../features/inventoryQuery/locationQuery';
import { useRacksForUser, useDeleteRack, useCreateRack, useUpdateRackByUser } from '../features/inventoryQuery/rackQuery';
import { RackCard } from '../components/ui/rack/RackCard';
import { RackTable } from '../components/ui/rack/RackTable';
import { RackForm } from '../components/ui/rack/RackForm';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { AlertMessage } from '../components/ui/AlertMessage';
import {
  Grid3X3,
  List,
  Plus,
  Search,
  Filter,
  SortAsc,
  Server
} from 'lucide-react';
import type { RackReqDTO } from '../types/requestDto';

type ViewMode = 'cards' | 'table';
type AlertType = 'success' | 'error' | 'warning' | 'info';

const RacksPage: React.FC = () => {

  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<AlertType | null>(null);


  const { data: users } = useUsers();
  const { data: locations } = useLocationsForUser();
  const { data: rack } = useRacksForUser();

  const { mutate: createRack } = useCreateRack();
  const { mutate: updateRack } = useUpdateRackByUser();
  const { mutate: deleteRack } = useDeleteRack();

  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);



  // Filter racks based on search and location
  const filteredRacks = rack?.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =  r.location.name === locationFilter || locationFilter === 'all';
    return matchesSearch && matchesLocation;
  });



  const handleEdit = (rack: Rack) => {
    setSelectedRack(rack);
    setIsFormOpen(true);
  };

  const handleDelete = (rackId: number) => {
    deleteRack(rackId, {
      onSuccess: () => {
        //setRacks(racks.filter(r => r.id !== rackId));
        setAlertType('success');
        setAlertMessage('Rack deleted successfully');
      },
      onError: (error) => {
        console.error(error.message);
        setAlertType('error')
        setAlertMessage(`Failed to delete rack.`);
      },
    })
    setTimeout(() => {
      setAlertType(null);
      setAlertMessage(null);
    }, 3000);
  };

  const handleAddRack = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = (rack: RackReqDTO) => {
    if (selectedRack) {
      updateRack({ id: selectedRack.id, data: rack }, {
        onSuccess: (response) => {
          setAlertType('success');
          setAlertMessage(`Rack ${response.name} updated successfully.`);
        },
        onError: (error) => {
          //console.error('Error updating rack:', error.message);
          setAlertType('error');
          setAlertMessage(`Failed to update rack. ${error.message}`);
        }
      });

    } else {
      console.log('Creating rack: ', rack)

      createRack(rack, {
        onSuccess: (response) => {
          //setRacks([...racks, response]);
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
    setSelectedRack(null);
    setIsFormOpen(false);

    setTimeout(() => {
      setAlertType(null);
      setAlertMessage(null);
    }, 3000);

  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedRack(null);
  };

  const handleRackClick = (rackid: number) => {
    console.log("Handle click is working...")
    navigate(`/inventory/racks/${rackid}`);
  };


  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    ...(locations?.map(location => ({
      value: location.name,
      label: location.name
    })) || [])
  ];


  if (!filteredRacks) {
    return (
      <LoadingSkeleton />
    )
  }

  return (
    <div className="min-h-fit bg-gray-50 text-xs">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="mb-8 ">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center mb-2">
                <Server size={20} className="text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Server Racks</h1>
              </div>
              <p className="text-xsm text-gray-500">
                Manage and monitor your server room infrastructure
              </p>
            </div>
            <button
              onClick={handleAddRack}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Add Rack
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className=" mb-6 bg-white rounded-md border border-gray-200 p-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search racks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {locationOptions?.map(option => (
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
            Showing {filteredRacks?.length} of {rack?.length} server racks
          </p>
        </div>



        {/* Content */}
        {filteredRacks?.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Server size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No server racks found</h3>
            <p className="text-gray-500">
              {searchTerm || locationFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first server rack'
              }
            </p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRacks?.map((rack) => (
              <RackCard
                key={rack.id}
                rack={rack}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClick={handleRackClick}
              />
            ))}
          </div>
        ) : (
          <RackTable
            racks={filteredRacks || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClick={handleRackClick}
          />
        )}

        {/* Rack Form Modal */}
        <RackForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          rack={selectedRack}
          availableUsers={users || []}
          availableLocations={locations || []}
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

export default RacksPage;