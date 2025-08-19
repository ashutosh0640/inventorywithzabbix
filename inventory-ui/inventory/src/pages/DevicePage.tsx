import React, { useState, useMemo, useEffect } from 'react';
import type { Location, BareMetal, NetworkDevices } from '../types/responseDto';
import type { BareMetalReqDTO, NetworkDeviceReqDTO } from '../types/requestDto';

import { useLocationsForUser } from '../features/inventoryQuery/locationQuery';
import { useUsers } from '../features/inventoryQuery/userQuery';
import { useBaremetalByRackAndUser, useGetBareMetalByUser, useCreateBareMetal, useUpdateBareMetal, useDeleteBareMetal } from '../features/inventoryQuery/baremetalQuery';
import { useDeviceByRackAndUser, useNetworkDevicesByUser, useCreateNetworkDevice, useDeleteNetworkDevice, useUpdateNetworkDevice } from '../features/inventoryQuery/networkDeviceQuery';
import { DeviceTable } from '../components/ui/device/DeviceTable';
import { ServerTable } from '../components/ui/device/ServerTable';
import { NetworkDeviceTable } from '../components/ui/device/NetworkDeviceTable';
import { BaremetalForm } from '../components/ui/device/BaremetalForm';
import { NetworkDeviceForm } from '../components/ui/device/NetworkDeviceForm';
import { TableSkeleton, WaveLoader } from '../components/ui/LoadingSkeleton';
import {
  Server,
  Network,
  Search,
  Filter,
  MapPin,
  HardDrive
} from 'lucide-react';



const DevicePage: React.FC = () => {

  const [selectedRack, setSelectedRack] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const { data: baremetals = [] } = useGetBareMetalByUser();
  const { data: networkDevices } = useNetworkDevicesByUser();

  const { data: baremetalsByRack } = useBaremetalByRackAndUser(selectedRack);
  const { mutate: createBaremetal } = useCreateBareMetal();
  const { mutate: deleteBaremetal } = useDeleteBareMetal();
  const { mutate: updateBaremetal } = useUpdateBareMetal();

  const { data: deviceByRack } = useDeviceByRackAndUser(selectedRack);
  const { mutate: createNetworkDevice } = useCreateNetworkDevice();
  const { mutate: deleteNetworkDevice } = useDeleteNetworkDevice();
  const { mutate: updateNetworkDevice } = useUpdateNetworkDevice();



  const [selectedServer, setSelectedServer] = useState<BareMetal | null>(null);
  const [selectedNetworkDevice, setSelectedNetworkDevice] = useState<NetworkDevices | null>(null);


  const { data: locationList } = useLocationsForUser();
  const { data: userList } = useUsers();

  const [searchTerm, setSearchTerm] = useState('');


  const [isBaremetalFormOpen, setIsBaremetalFormOpen] = useState(false);
  const [isNetworkDeviceFormOpen, setIsNetworkDeviceFormOpen] = useState(false);

  // Get available racks for selected location
  useMemo(() => {
    if (selectedLocation === null) return [];
    const loc = locationList?.find(loc => loc.id === selectedLocation.id);
    return loc?.rack;
  }, [selectedLocation]);


  const baremetalList = baremetalsByRack ?? baremetals;


  const filteredBaremetals = baremetalList.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchIp = b.interfaces.map(i => i.ip.includes(searchTerm));
  })



  // Filter equipment based on search, location, and rack
  const filteredServers = useMemo(() => {
    return servers.filter(server => {
      const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        server.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        server.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchIp =  server.interfaces.map(i=>i.ip.includes(searchTerm))
      //const matchesLocation = selectedLocation === null || server.rack.location === selectedLocation;
      const matchesRack = selectedRack === null || server.rack.id === selectedRack;
      return matchesSearch && matchesRack && matchIp;
    });
  }, [servers, searchTerm, selectedLocation, selectedRack]);

  const filteredNetworkDevices = useMemo(() => {
    return networkDevices.filter(device => {
      const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.type.toLowerCase().includes(searchTerm.toLowerCase());
      //const matchesLocation = selectedLocation === null || device.rack.location === selectedLocation;
      const matchesRack = selectedRack === null || device.rack.id === selectedRack;
      return matchesSearch && matchesRack;
    });
  }, [networkDevices, searchTerm, selectedLocation, selectedRack]);


  const handleSelectLocation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    const location = locationList?.find(loc => loc.id === selectedId);
    setSelectedLocation(location ?? null);
  };

  const handleEdit = (data: BareMetal | NetworkDevices) => {
    if (data.type === "PHYSICAL_SERVER") {
      setSelectedServer(data as BareMetal);
      setIsBaremetalFormOpen(true);
    } else {
      setSelectedNetworkDevice(data as NetworkDevices);
      setIsNetworkDeviceFormOpen(true);
    }
  }


  const handleDeleteServer = (serverId: number) => {
    if (window.confirm('Are you sure you want to delete this server?')) {
      deleteBaremetal(serverId, {
        onSuccess: () => {
          setServers(servers.filter(server => server.id !== serverId));
        },
        onError: (error) => {
          console.error('Fount Error deleting server, Reason: ', error.message);
        },
      })

    }
  };

  const handleDeleteNetworkDevice = (deviceId: number) => {
    if (window.confirm('Are you sure you want to delete this network device?')) {
      deleteNetworkDevice(deviceId, {
        onSuccess: () => {
          setNetworkDevices(networkDevices.filter(device => device.id !== deviceId));
        },
        onError: (error) => {
          console.error('Fount Error deleting network device, Reason: ', error.message);
        },
      })
    }
  };


  const handleAddBaremetal = () => {
    setIsBaremetalFormOpen(true);
  }

  const handleAddNetworkDevice = () => {
    setIsBaremetalFormOpen(true);
  }

  const handleBaremetalFormSubmit = (server: BareMetalReqDTO) => {

    if (selectedServer) {
      // Update existing server
      updateBaremetal({
        id: selectedServer.id,
        baremetalData: server
      }, {
        onSuccess: (response) => {
          setServers(servers.map(server => server.id === selectedServer.id ? response.data : server));
        },
        onError: (error) => {
          console.error('Fount Error updating server, Reason: ', error.message);
        },
      })
      setIsBaremetalFormOpen(false);
    } else {
      // Add new server
      createBaremetal(server,
        {
          onSuccess: (response) => {
            setServers([...servers, response.data]);
            setIsBaremetalFormOpen(false);
          },
          onError: (error) => {
            console.error('Fount Error creating server, Reason: ', error.message);
          },
        }
      )
      setIsBaremetalFormOpen(false);
    }
  };

  const handleNetworkDeviceFormSubmit = (device: NetworkDeviceReqDTO) => {

    if (selectedNetworkDevice) {
      updateNetworkDevice({
        id: selectedNetworkDevice.id,
        data: device
      }, {
        onSuccess: (response) => {
          setNetworkDevices(networkDevices.map(device => device.id === selectedNetworkDevice.id ? response.data :
            device));
        },
        onError: (error) => {
          console.error('Fount Error updating device, Reason: ', error.message);
        },
      })
      setIsNetworkDeviceFormOpen(false);
    } else {
      // Add new network device
      createNetworkDevice(device,
        {
          onSuccess: (response) => {
            setNetworkDevices([...networkDevices, response.data]);
            setIsBaremetalFormOpen(false);
          },
          onError: (error) => {
            console.error('Fount Error creating device, Reason: ', error.message);
          },
        }
      )
      setIsNetworkDeviceFormOpen(false);
    }
  };

  const handleBaremetalFormClose = () => {
    setIsBaremetalFormOpen(false);
    setSelectedServer(null);
  };

  const handleNetworkDeviceFormClose = () => {
    setIsNetworkDeviceFormOpen(false);
    setSelectedNetworkDevice(null);
  };

  // Show loading state



  return (

    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center mb-2">
                <HardDrive size={20} className="text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Equipment Management</h1>
              </div>
              <p className="text-sm text-gray-500">
                Manage servers and network devices across all locations
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddBaremetal}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Server size={16} className="mr-2" />
                Add Server
              </button>
              <button
                onClick={handleAddNetworkDevice}
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
                  value={selectedLocation?.id ?? "Select location"}
                  onChange={handleSelectLocation}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Locations</option>
                  {locationList?.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                <MapPin size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedRack ?? "Select rack"}
                  onChange={(e) => setSelectedRack(parseInt(e.target.value))}
                  disabled={selectedLocation === null}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {selectedLocation != null ? (
                    <>
                      <option value="all">All Racks</option>
                      {selectedLocation.rack?.map(rack => (
                        <option key={rack.id} value={rack.id}>
                          {rack.name} - {selectedLocation.name}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option value="all">Select location first</option>
                  )}
                </select>
                <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-xs text-gray-600">
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
                <h2 className="text-sm font-semibold text-gray-900">
                  Servers ({filteredServers.length})
                </h2>
              </div>
            </div>
            <ServerTable
              equipment={filteredServers}
              onEdit={handleEdit}
              onDelete={handleDeleteServer}
            />
          </div>

          {/* Network Devices Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
              <div className="flex items-center">
                <Network size={20} className="text-green-600 mr-2" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Network Devices ({filteredNetworkDevices.length})
                </h2>
              </div>
            </div>
            <NetworkDeviceTable
              equipment={filteredNetworkDevices}
              onEdit={handleEdit}
              onDelete={handleDeleteNetworkDevice}
            />
          </div>
        </div>

        {/* Baremetal Form Modal */}
        <BaremetalForm
          isOpen={isBaremetalFormOpen}
          onClose={handleBaremetalFormClose}
          onSubmit={handleBaremetalFormSubmit}
          server={selectedServer}
          availableLocations={locationList}
          availableUsers={userList}
        />

        {/* Network Device Form Modal */}
        <NetworkDeviceForm
          isOpen={isNetworkDeviceFormOpen}
          onClose={handleNetworkDeviceFormClose}
          onSubmit={handleNetworkDeviceFormSubmit}
          device={selectedNetworkDevice}
          availableLocations={locationList}
          availableUsers={userList}
        />
      </div>
    </div>
  );
};

export default DevicePage;