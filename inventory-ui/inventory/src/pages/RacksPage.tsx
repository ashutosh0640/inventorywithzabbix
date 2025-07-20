import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Pagination from '@mui/material/Pagination';
// import Stack from '@mui/material/Stack';
import type { Rack } from '../types/responseDto';
import { useUsers } from '../features/inventoryQuery/userQuery';
import { useLocationsForUser } from '../features/inventoryQuery/locationQuery';
import { useRacksForUser, useDeleteRack, useCreateRack, useUpdateRack } from '../features/inventoryQuery/rackQuery';
import { RackCard } from '../components/ui/rack/RackCard';
import { RackTable } from '../components/ui/rack/RackTable';
import { RackForm } from '../components/ui/rack/RackForm';
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
interface Pageable {
  page: number;
  size: number;
}


const RacksPage: React.FC = () => {

  const { data: locations } = useLocationsForUser();
  const { data: users } = useUsers();
  const navigate = useNavigate();

  const [pageable, setPageable] = useState<Pageable>({ page: 0, size: 5 });
  const { data: fetchedRack } = useRacksForUser();
  const [racklist, setRacklist] = useState<Rack[]>(fetchedRack || []);
  const { mutate: deleteRack } = useDeleteRack();
  const { mutate: createRack } = useCreateRack();
  const { mutate: updateRack } = useUpdateRack();


  const [rackForm, setRackForm] = useState<RackReqDTO>({
    name: '',
    totalSlot: 42,
    locationId: 0,
    usersId: [],
  });
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const [rackId, setRackId] = useState<number>(0);

  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);



  // Filter racks based on search and location
  const filteredRacks = racklist?.filter(rack => {
    const matchesSearch = rack.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || rack.location.name === locationFilter;
    return matchesSearch && matchesLocation;
  });
  console.log("filteredRacks: ", filteredRacks)

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPageable((prev) => ({ ...prev, page: newPage }));
  };

  // Handle size change
  const handleSizeChange = (newSize: number) => {
    setPageable((prev) => ({ ...prev, size: newSize }));
  };

  const handleEdit = (rack: Rack) => {

    const updatedRack: RackReqDTO = {
      name: rack.name,
      totalSlot: rack.totalSlot,
      locationId: rack.location.id,
      usersId: rack.user?.map(user => user.id)
    };
    setRackId(rack.id);
    setRackForm(updatedRack);
    setIsFormOpen(true);
    console.log("aval locations: ")
  };

  const handleDelete = (rackId: number) => {
    setRackId(rackId);
  };

  const handleAddRack = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = (rack: RackReqDTO) => {
    if (selectedRack) {
      updateRack({ id: rackId, data: rackForm }, {
        onSuccess: () => {
          setRacklist((prev) =>
            prev.map((r) => r.id === rackId ? { ...r, ...rackForm } : r)
          );
        },
        onError: (error) => {
          console.error('Error updating rack:', error);
        }
      });


    } else {

      createRack(rack, {
        onSuccess: (response) => {
          setRacklist((prev) => [...prev, response])
        },
        onError: (error) => {
          console.error('Error creating rack:', error);
        }
      })
    }
    setSelectedRack(null);
    setRackId(0);
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (rackId) {
      deleteRack(rackId, {
        onSuccess: () => {
          console.log('Rack deleted successfully');
        },
        onError: (error) => {
          console.error('Error updating rack:', error);
        }
      })
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedRack(null);
  };

  const handleRackClick = (rackid: number) => {
    console.log("RackId: ", rackid)
    navigate(`/inventory/racks/${rackid}`);
  };

  const handleCloseDetails = () => {
    setSelectedRack(null);
  };

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    ...(locations?.map(location => ({
      value: location.id,
      label: location.name
    })) || [])
  ];

  useEffect(() => {
    setRacklist(fetchedRack || [])
  }, [racklist])


  return (
    <div className="min-h-screen bg-gray-50 text-xs ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
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
        <div className=" mb-6 bg-white rounded-xl border border-gray-200 p-4">
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            Showing {filteredRacks?.length} of {racklist?.length} server racks
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

        {/* Rack Details Modal */}
        {/* {selectedRack && (
          <RackDetails
            rack={selectedRack}
            onClose={handleCloseDetails}
          />
        )} */}


        {/* Confirm Delete Modal */}
        {/* <ConfirmDeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => closeDeleteModal()}
                    onConfirm={handleDelete}
                    itemName={"Item"}
                /> */}

        {/* Alert Messages */}
        {/* <AlertMsg
                    message={{
                        show: {},
                        type: 'success',
                        title: editingProject ? 'Rack Updated' : 'Rack Created',
                        message: editingProject
                            ? 'The project was updated successfully.'
                            : 'The project was created successfully.'
                    }}
                    onClose={() => setEditingProject(null)}
                /> */}
      </div>
    </div>
  );
};

export default RacksPage;