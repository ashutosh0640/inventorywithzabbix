import React, { useState, useMemo } from 'react';
import type { BareMetal, NetworkDevices } from '../types/responseDto';
import { useBareMetalServerByRackAndUser } from '../features/inventoryQuery/baremetalQuery'
import { useDeviceByRackAndUser } from '../features/inventoryQuery/networkDeviceQuery';
import { mockServers, mockNetworkDevices } from '../data/mockEquipment';
import { mockLocations } from '../data/mockProjects';
import { mockRacks } from '../data/mockRacks';
import { DeviceTable } from '../components/ui/device/DeviceTable';
import { BaremetalForm } from './BaremetalForm';
import { NetworkDeviceForm } from './NetworkDeviceForm';
import { ErrorBoundary } from './ErrorBoundary';
import { TableSkeleton, WaveLoader } from '../components/ui/LoadingSkeleton';
import { 
  Server, 
  Network,
  Search, 
  Filter,
  MapPin,
  HardDrive
} from 'lucide-react';

// Simulate async data fetching
const fetchEquipmentData = async () => {
  // Simulate potential error (uncomment to test error handling)
  // if (Math.random() > 0.7) {
  //   throw new Error('Failed to fetch equipment data from server');
  // }
  
  return {
    servers: mockServers,
    networkDevices: mockNetworkDevices,
    racks: mockRacks,
    locations: mockLocations
  };
};

const DevicePage: React.FC = () => {
  const { data, loading, error, refetch } = useAsyncData(fetchEquipmentData);
  
  const [servers, setServers] = useState<BareMetalServer[]>([]);
  const [networkDevices, setNetworkDevices] = useState<NetworkDevice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedRack, setSelectedRack] = useState<string>('all');
  
  // Update local state when data is loaded
  React.useEffect(() => {
    if (data) {
      setServers(data.servers);
      setNetworkDevices(data.networkDevices);
    }
  }, [data]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBaremetalFormOpen, setIsBaremetalFormOpen] = useState(false);
  const [isNetworkDeviceFormOpen, setIsNetworkDeviceFormOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<BareMetalServer | null>(null);
  const [editingNetworkDevice, setEditingNetworkDevice] = useState<NetworkDevice | null>(null);

  // Get available racks for selected location
  const availableRacks = useMemo(() => {
    if (selectedLocation === 'all') return [];
    return data?.racks.filter(rack => rack.location.id === selectedLocation) || [];
  }, [selectedLocation]);

  // Reset rack selection when location changes
  React.useEffect(() => {
    setSelectedRack('all');
  }, [selectedLocation]);

  // Filter equipment based on search, location, and rack
  const filteredServers = useMemo(() => {
    return servers.filter(server => {
      const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           server.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = selectedLocation === 'all' || server.locationId === selectedLocation;
      const matchesRack = selectedRack === 'all' || server.rackId === selectedRack;
      return matchesSearch && matchesLocation && matchesRack;
    });
  }, [servers, searchTerm, selectedLocation, selectedRack]);

  const filteredNetworkDevices = useMemo(() => {
    return networkDevices.filter(device => {
      const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           device.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = selectedLocation === 'all' || device.locationId === selectedLocation;
      const matchesRack = selectedRack === 'all' || device.rackId === selectedRack;
      return matchesSearch && matchesLocation && matchesRack;
    });
  }, [networkDevices, searchTerm, selectedLocation, selectedRack]);

  const handleEditServer = (server: BareMetalServer) => {
    setEditingServer(server);
    setIsBaremetalFormOpen(true);
  };

  const handleEditNetworkDevice = (device: NetworkDevice) => {
    setEditingNetworkDevice(device);
    setIsNetworkDeviceFormOpen(true);
  };

  const handleDeleteServer = (serverId: string) => {
    if (window.confirm('Are you sure you want to delete this server?')) {
      setServers(servers.filter(s => s.id !== serverId));
    }
  };

  const handleDeleteNetworkDevice = (deviceId: string) => {
    if (window.confirm('Are you sure you want to delete this network device?')) {
      setNetworkDevices(networkDevices.filter(d => d.id !== deviceId));
    }
  };

  const handleAddEquipment = (type: EquipmentType) => {
    if (type === 'server') {
      setEditingServer(null);
      setIsBaremetalFormOpen(true);
    } else {
      setEditingNetworkDevice(null);
      setIsNetworkDeviceFormOpen(true);
    }
  };

  const handleBaremetalFormSubmit = (equipmentData: any) => {
    const selectedRackData = data?.racks.find(rack => rack.id === equipmentData.rackId);
    if (!selectedRackData) return;

    if (editingServer) {
      // Update existing server
      setServers(servers.map(s => 
        s.id === editingServer.id 
          ? { 
              ...s,
              name: equipmentData.name,
              model: equipmentData.model,
              slotPosition: equipmentData.slotPosition,
              status: equipmentData.status,
              rackId: equipmentData.rackId,
              rackName: selectedRackData.name,
              locationId: selectedRackData.location.id,
              locationName: selectedRackData.location.name,
            }
          : s
      ));
    } else {
      // Add new server
      const newServer: BareMetalServer = {
        id: Date.now().toString(),
        name: equipmentData.name,
        model: equipmentData.model,
        slotPosition: equipmentData.slotPosition,
        status: equipmentData.status,
        rackId: equipmentData.rackId,
        rackName: selectedRackData.name,
        locationId: selectedRackData.location.id,
        locationName: selectedRackData.location.name,
      };
      setServers([...servers, newServer]);
    }
  };

  const handleNetworkDeviceFormSubmit = (equipmentData: any) => {
    const selectedRackData = data?.racks.find(rack => rack.id === equipmentData.rackId);
    if (!selectedRackData) return;

    if (editingNetworkDevice) {
      // Update existing network device
      setNetworkDevices(networkDevices.map(d => 
        d.id === editingNetworkDevice.id 
          ? { 
              ...d,
              name: equipmentData.name,
              type: equipmentData.type,
              slotPosition: equipmentData.slotPosition,
              status: equipmentData.status,
              rackId: equipmentData.rackId,
              rackName: selectedRackData.name,
              locationId: selectedRackData.location.id,
              locationName: selectedRackData.location.name,
            }
          : d
      ));
    } else {
      // Add new network device
      const newDevice: NetworkDevice = {
        id: Date.now().toString(),
        name: equipmentData.name,
        type: equipmentData.type,
        slotPosition: equipmentData.slotPosition,
        status: equipmentData.status,
        rackId: equipmentData.rackId,
        rackName: selectedRackData.name,
        locationId: selectedRackData.location.id,
        locationName: selectedRackData.location.name,
      };
      setNetworkDevices([...networkDevices, newDevice]);
    }
  };

  const handleBaremetalFormClose = () => {
    setIsBaremetalFormOpen(false);
    setEditingServer(null);
  };

  const handleNetworkDeviceFormClose = () => {
    setIsNetworkDeviceFormOpen(false);
    setEditingNetworkDevice(null);
  };

  const handleFormSubmit = (equipmentData: any) => {
    const selectedRackData = data?.racks.find(rack => rack.id === equipmentData.rackId);
    if (!selectedRackData) return;

    if (equipmentType === 'server') {
      if (editingEquipment) {
        // Update existing server
        setServers(servers.map(s => 
          s.id === editingEquipment.id 
            ? { 
                ...s,
                name: equipmentData.name,
                model: equipmentData.model,
                slotPosition: equipmentData.slotPosition,
                status: equipmentData.status,
                rackId: equipmentData.rackId,
                rackName: selectedRackData.name,
                locationId: selectedRackData.location.id,
                locationName: selectedRackData.location.name,
              }
            : s
        ));
      } else {
        // Add new server
        const newServer: BareMetalServer = {
          id: Date.now().toString(),
          name: equipmentData.name,
          model: equipmentData.model,
          slotPosition: equipmentData.slotPosition,
          status: equipmentData.status,
          rackId: equipmentData.rackId,
          rackName: selectedRackData.name,
          locationId: selectedRackData.location.id,
          locationName: selectedRackData.location.name,
        };
        setServers([...servers, newServer]);
      }
    } else {
      if (editingEquipment) {
        // Update existing network device
        setNetworkDevices(networkDevices.map(d => 
          d.id === editingEquipment.id 
            ? { 
                ...d,
                name: equipmentData.name,
                type: equipmentData.type,
                slotPosition: equipmentData.slotPosition,
                status: equipmentData.status,
                rackId: equipmentData.rackId,
                rackName: selectedRackData.name,
                locationId: selectedRackData.location.id,
                locationName: selectedRackData.location.name,
              }
            : d
        ));
      } else {
        // Add new network device
        const newDevice: NetworkDevice = {
          id: Date.now().toString(),
          name: equipmentData.name,
          type: equipmentData.type,
          slotPosition: equipmentData.slotPosition,
          status: equipmentData.status,
          rackId: equipmentData.rackId,
          rackName: selectedRackData.name,
          locationId: selectedRackData.location.id,
          locationName: selectedRackData.location.name,
        };
        setNetworkDevices([...networkDevices, newDevice]);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingEquipment(null);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <HardDrive size={32} className="text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
            </div>
            <p className="text-sm text-gray-500">
              Loading equipment data...
            </p>
          </div>
          
          <WaveLoader />
          
          <div className="space-y-8">
            <TableSkeleton 
              title="Servers" 
              icon={<Server size={20} className="text-blue-600" />} 
            />
            <TableSkeleton 
              title="Network Devices" 
              icon={<Network size={20} className="text-green-600" />} 
            />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <ErrorBoundary 
        showBackButton={true}
        fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HardDrive size={32} className="text-red-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Failed to Load Equipment
              </h2>
              
              <p className="text-gray-600 mb-6">
                {error.message}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Go Back
                </button>
                
                <button
                  onClick={refetch}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (!data) return null;

  return (
    <ErrorBoundary showBackButton={true}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <div className="flex items-center mb-2">
                  <HardDrive size={32} className="text-blue-600 mr-3" />
                  <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
                </div>
                <p className="text-sm text-gray-500">
                  Manage servers and network devices across all locations
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleAddEquipment('server')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Server size={16} className="mr-2" />
                  Add Server
                </button>
                <button
                  onClick={() => handleAddEquipment('network-device')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <Network size={16} className="mr-2" />
                  Add Network Device
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Locations</option>
                    {data.locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  <MapPin size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedRack}
                    onChange={(e) => setSelectedRack(e.target.value)}
                    disabled={selectedLocation === 'all'}
                    className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="all">All Racks</option>
                    {availableRacks.map(rack => (
                      <option key={rack.id} value={rack.id}>
                        {rack.name}
                      </option>
                    ))}
                  </select>
                  <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredServers.length} servers and {filteredNetworkDevices.length} network devices
            </p>
          </div>

          {/* Equipment Tables */}
          <div className="space-y-8">
            {/* Servers Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <div className="flex items-center">
                  <Server size={20} className="text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Servers ({filteredServers.length})
                  </h2>
                </div>
              </div>
              <EquipmentTable
                type="server"
                equipment={filteredServers}
                onEdit={handleEditServer}
                onDelete={handleDeleteServer}
              />
            </div>

            {/* Network Devices Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
                <div className="flex items-center">
                  <Network size={20} className="text-green-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Network Devices ({filteredNetworkDevices.length})
                  </h2>
                </div>
              </div>
              <EquipmentTable
                type="network-device"
                equipment={filteredNetworkDevices}
                onEdit={handleEditNetworkDevice}
                onDelete={handleDeleteNetworkDevice}
              />
            </div>
          </div>

          {/* Baremetal Form Modal */}
          <BaremetalForm
            isOpen={isBaremetalFormOpen}
            onClose={handleBaremetalFormClose}
            onSubmit={handleBaremetalFormSubmit}
            server={editingServer}
            availableRacks={data.racks}
          />

          {/* Network Device Form Modal */}
          <NetworkDeviceForm
            isOpen={isNetworkDeviceFormOpen}
            onClose={handleNetworkDeviceFormClose}
            onSubmit={handleNetworkDeviceFormSubmit}
            device={editingNetworkDevice}
            availableRacks={data.racks}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DevicePage;