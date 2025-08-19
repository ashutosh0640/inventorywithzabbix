import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Monitor, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { FiAlertTriangle } from "react-icons/fi";
import type { VirtualPlatform, BareMetal } from '../types/responseDto';
import type { VirtualPlatformReqDTO } from '../types/requestDto';
import { baremetalsAPI, virtualPlatformsAPI } from '../service/inventoryapi';

const VirtualizationPage: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [platforms, setPlatforms] = useState<VirtualPlatform[]>([]);
  const [servers, setServers] = useState<BareMetal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newPlatform, setNewPlatform] = useState<VirtualPlatformReqDTO>({
    platformName: '',
    version: '',
    ipAddress: '',
    cpuCores: 0,
    ramSize: 0,
    ramSizeUnit: '',
    storageSize: 0,
    storageSizeUnit: '',
    serverId: 0,
    usersId: [1]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [platformsData, serversData] = await Promise.all([
        virtualPlatformsAPI.getAll(),
        baremetalsAPI.getAll()
      ]);
      setPlatforms(platformsData);
      setServers(serversData);
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
    setNewPlatform(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setNewPlatform(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await virtualPlatformsAPI.create(newPlatform);
      await fetchData();
      setNewPlatform({
        platformName: '',
        version: '',
        ipAddress: '',
        cpuCores: 0,
        ramSize: 0,
        ramSizeUnit: '',
        storageSize: 0,
        storageSizeUnit: '',
        serverId: 0,
        usersId: [1]
      });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to add platform');
      console.error('Error adding platform:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePlatform = async (id: number) => {
    try {
      setIsLoading(true);
      await virtualPlatformsAPI.delete(id);
      await fetchData();
      setError(null);
    } catch (err) {
      setError('Failed to remove platform');
      console.error('Error removing platform:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlatforms = searchTerm
    ? platforms.filter(platform =>
      platform.platformName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      platform.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      platform.version.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : platforms;

  if (isLoading && platforms.length === 0) {
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
            placeholder="Search platforms..."
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
          {showAddForm ? 'Cancel' : 'Add Platform'}
        </Button>
      </div>

      {showAddForm && (
        <Card title="Add New Virtualization Platform">
          <form onSubmit={handleAddPlatform} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Platform Name"
                name="platformName"
                value={newPlatform.platformName}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Input
                label="Version"
                name="version"
                value={newPlatform.version}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Input
                label="IP Address"
                name="ipAddress"
                value={newPlatform.ipAddress}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Select
                label="CPU Cores"
                name="cpuCores"
                options={[
                  { value: '2', label: '2 Cores' },
                  { value: '4', label: '4 Cores' },
                  { value: '6', label: '6 Cores' },
                  { value: '8', label: '8 Cores' },
                  { value: '10', label: '10 Cores' },
                  { value: '12', label: '12 Cores' },
                  { value: '16', label: '16 Cores' },
                  { value: '24', label: '24 Cores' },
                  { value: '32', label: '32 Cores' },
                  { value: '64', label: '64 Cores' },
                  { value: '128', label: '128 Cores' }
                ]}
                value={newPlatform.cpuCores.toString()}
                onChange={handleSelectChange('cpuCores')}
                required
                fullWidth
              />
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  name="ramSize"
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Enter RAM size"
                  value={newPlatform.ramSize}
                  onChange={(e) =>
                    setNewPlatform((prev) => ({
                      ...prev,
                      ramSizeValue: Number(e.target.value),
                    }))
                  }
                  required
                />
                <select
                  name="ramSizeUnit"
                  className="border px-3 py-2 rounded"
                  value={newPlatform.ramSizeUnit}
                  onChange={(e) =>
                    setNewPlatform((prev) => ({
                      ...prev,
                      ramSizeUnit: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                  <option value="GB">GB</option>
                  <option value="TB">TB</option>
                </select>
              </div>


              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  name="storageSize"
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Enter Storage size"
                  value={newPlatform.storageSize}
                  onChange={(e) =>
                    setNewPlatform((prev) => ({
                      ...prev,
                      storageSize: Number(e.target.value),
                    }))
                  }
                  required
                />
                <select
                  name="storageSizeUnit"
                  className="border px-3 py-2 rounded"
                  value={newPlatform.storageSizeUnit}
                  onChange={(e) =>
                    setNewPlatform((prev) => ({
                      ...prev,
                      storageSizeUnit: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                  <option value="GB">GB</option>
                  <option value="TB">TB</option>
                </select>
              </div>

              <Select
                label="Host Server"
                options={servers.map(server => ({
                  value: server.id.toString(),
                  label: server.serverName + ' (' + server.ipAddress + ')'
                }))}
                value={newPlatform.serverId}
                onChange={handleSelectChange('baremetalId')}
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
                Add Platform
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlatforms.map((platform) => (
          <Card key={platform.id} className="h-full">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <Monitor size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{platform.platformName}</h3>
                <p className="text-sm text-gray-500">
                  Type: {platform.platformName} {platform.version}
                </p>
                <p className="text-sm text-gray-500">
                  {/* Host: {servers.find(s => s.id === platform.)?.name} */}
                  Host
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>License: {platform.ramSize} {platform.ramSizeUnit}</p>
              <p>Total VMs: {platform.vm.length}</p>
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
                onClick={() => handleRemovePlatform(platform.id)}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredPlatforms.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Monitor className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No platforms found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new virtualization platform.'}
          </p>
          <div className="mt-6">
            <Button
              onClick={() => setShowAddForm(true)}
              leftIcon={<Plus size={16} />}
            >
              Add Platform
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualizationPage;