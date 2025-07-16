import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Server, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { FiAlertTriangle } from "react-icons/fi";
import type { User, Rack, Location } from '../types/responseDto';
import { racksAPI, locationsAPI } from '../service/inventoryapi';
import type { RackReqDTO } from '../types/requestDto';

const RacksPage: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newRack, setNewRack] = useState<RackReqDTO>({
    rackName: '',
    locationId: 0,
    usersId: [1],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [racksData, locationsData] = await Promise.all([
        racksAPI.getAll(),
        locationsAPI.getAll()
      ]);
      setRacks(racksData);
      setLocations(locationsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRack(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setNewRack(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (value: any) => {
    setNewRack(prev => ({
      ...prev,
      locationId: value
    }));
  };

  const handleAddRack = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await racksAPI.create(newRack);
      await fetchData();
      setNewRack({
        rackName: '',
        locationId: 0,
        usersId: [1],
      });
    } catch (err) {
      setError('Failed to add rack');
      console.error('Error adding rack:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveRack = async (id: number) => {
    try {
      setIsLoading(true);
      await racksAPI.delete(id);
      await fetchData();
      setError(null);
    } catch (err) {
      setError('Failed to remove rack');
      console.error('Error removing rack:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRacks = searchTerm
    ? racks.filter(rack =>
      rack.rackName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : racks;

  if (isLoading && racks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search racks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <Button
          variant={showAddForm ? 'outline' : 'primary'}
          onClick={() => setShowAddForm(!showAddForm)}
          leftIcon={showAddForm ? <X size={16} /> : <Plus size={16} />}
        >
          {showAddForm ? 'Cancel' : 'Add Rack'}
        </Button>
      </div>

      {showAddForm && (
        <Card title="Add New Rack">
          <form onSubmit={handleAddRack} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Rack Name"
                name="name"
                value={newRack.rackName}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Select
                label="Location"
                options={locations.map(loc => ({
                  value: loc.id.toString(),
                  label: loc.name
                }))}
                value={newRack.locationId}
                onChange={handleLocationChange}
                required
                fullWidth
              />
              <Select
                label="Users"
                name='userIds'
                options={users.map(user => ({
                  value: user.id.toString(),
                  label: user.username
                }))}
                value={newRack.usersId?.map(id => id.toString()) || []}
                onChange={handleSelectChange('userIds')}
                required
                fullWidth
              />

            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
              >
                Add Rack
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRacks.map((rack) => (
          <Card key={rack.id} className="h-full">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <Server size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{rack.rackName}</h3>
                <p className="text-sm text-gray-500">
                  Location: {locations.find(l => l.id === rack.location.id)?.name}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  // style={{ width: `${(rack.usedCapacity / rack.capacity) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {/* Capacity: {rack.usedCapacity}U / {rack.capacity}U */}
              </p>
            </div>

            <div className="mt-4 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit size={14} />}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Trash2 size={14} />}
                className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => handleRemoveRack(rack.id)}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredRacks.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Server className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No racks found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new rack.'}
          </p>
          <div className="mt-6">
            <Button
              onClick={() => setShowAddForm(true)}
              leftIcon={<Plus size={16} />}
            >
              Add Rack
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RacksPage;