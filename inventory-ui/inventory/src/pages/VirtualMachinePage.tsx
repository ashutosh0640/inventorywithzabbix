import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { MonitorPlay, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { FiAlertTriangle } from "react-icons/fi";
import type { VirtualMachineReqDTO, VirtualPlatformReqDTO } from '../types/requestDto';
import type { VirtualMachine } from '../types/responseDto';
import { virtualMachineAPI } from '../service/inventoryapi';

const VirtualMachinePage: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [vms, setVMs] = useState<VirtualMachineReqDTO[]>([]);
  const [vmRes, setVMRes] = useState<VirtualMachine[]>([]);
  const [platforms, setPlatforms] = useState<VirtualPlatformReqDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newVM, setNewVM] = useState<VirtualMachineReqDTO>({
    vmName: '',
    os: '',
    osVersion: '',
    ipAddress: '',
    cpuCores: 0,
    ramSize: 0,
    ramSizeUnit: 'GB',
    storageSize: 0,
    storageSizeUnit: 'GB',
    vpId: 0,
    usersId: [1]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [vmsData, platformsData] = await Promise.all([
        virtualMachineAPI.getAll(),
        virtualMachineAPI.getAll()
      ]);
      setVMs(vmsData);
      setPlatforms(platformsData);
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
    setNewVM(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setNewVM(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddVM = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await virtualMachineAPI.create(newVM);
      await fetchData();
      setNewVM({
        vmName: '',
        os: '',
        osVersion: '',
        ipAddress: '',
        cpuCores: 0,
        ramSize: 0,
        ramSizeUnit: 'GB',
        storageSize: 0,
        storageSizeUnit: 'GB',
        vpId: 0,
        usersId: [1]
      });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to add virtual machine');
      console.error('Error adding virtual machine:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveVM = async (id: number) => {
    try {
      setIsLoading(true);
      await virtualMachineAPI.delete(id);
      await fetchData();
      setError(null);
    } catch (err) {
      setError('Failed to remove virtual machine');
      console.error('Error removing virtual machine:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVMs = searchTerm
    ? vmRes.filter(vm =>
      vm.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vm.os.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vm.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : vmRes;

  if (isLoading && vms.length === 0) {
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
            placeholder="Search virtual machines..."
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
          {showAddForm ? 'Cancel' : 'Add Virtual Machine'}
        </Button>
      </div>

      {showAddForm && (
        <Card title="Add New Virtual Machine">
          <form onSubmit={handleAddVM} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="VM Name"
                name="name"
                value={newVM.vmName}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Select
                label="Platform"
                options={platforms.map(platform => ({
                  value: platform.platformName.toString(),
                  label: platform.platformName + ' (' + platform.version + ')'
                }))}
                value={newVM.vpId.toString()}
                onChange={handleSelectChange('platformId')}
                required
                fullWidth
              />
              <Input
                label="CPU Cores"
                type="number"
                name="cpuCores"
                value={newVM.cpuCores.toString()}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Input
                label="RAM (GB)"
                type="number"
                name="ramGB"
                value={newVM.ramSize.toString()}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Input
                label="Storage (GB)"
                type="number"
                name="storageGB"
                value={newVM.storageSize.toString()}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Input
                label="IP Address"
                name="ipAddress"
                value={newVM.ipAddress}
                onChange={handleInputChange}
                required
                fullWidth
              />
              {/* <Input
                label="MAC Address"
                name="macAddress"
                value={newVM.macAddress}
                onChange={handleInputChange}
                required
                fullWidth
              /> */}
              <Input
                label="Operating System"
                name="operatingSystem"
                value={newVM.os}
                onChange={handleInputChange}
                required
                fullWidth
              />
              {/* <Select
                label="Status"
                options={[
                  { value: 'running', label: 'Running' },
                  { value: 'stopped', label: 'Stopped' },
                  { value: 'suspended', label: 'Suspended' },
                ]}
                value={newVM.status || 'running'}
                onChange={handleSelectChange('status')}
                required
                fullWidth
              /> */}
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
                Add Virtual Machine
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVMs.map((vm) => (
          <Card key={vm.hostName} className="h-full">
            <div className="flex items-start mb-4">
              <div className={`p-3 rounded-full ${vm.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-600'
                  : vm.status === 'suspended'
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-red-100 text-red-600'
                } mr-4`}>
                <MonitorPlay size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{vm.hostName}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${vm.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : vm.status === 'suspended'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {vm.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {/* Platform: {platformsRes.find(p => p.id === vm.virtualPlatform.)?.platformName} */}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>CPU: {vm.cpuCores} cores</p>
              <p>Memory: {vm.ramSize}{vm.ramSizeUnit} RAM</p>
              <p>Storage: {vm.storageSize}{vm.storageSizeUnit}</p>
              <p>IP: {vm.ipAddress}</p>
              <p>Status: {vm.status}</p>
              <p>OS: {vm.os}</p>
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
                onClick={() => handleRemoveVM(vm.id)}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredVMs.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <MonitorPlay className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No virtual machines found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new virtual machine.'}
          </p>
          <div className="mt-6">
            <Button
              onClick={() => setShowAddForm(true)}
              leftIcon={<Plus size={16} />}
            >
              Add Virtual Machine
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualMachinePage;