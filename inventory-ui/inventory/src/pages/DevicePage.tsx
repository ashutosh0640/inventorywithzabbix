import React, { useState, useMemo } from 'react';
import type { Location, BareMetal, NetworkDevices } from '../types/responseDto';
import type { BareMetalReqDTO, NetworkDeviceReqDTO, VirtualPlatformReqDTO } from '../types/requestDto';
import { useLocationsForUser } from '../features/inventoryQuery/locationQuery';
import { useUsers } from '../features/inventoryQuery/userQuery';
import {
  useBaremetalByRackAndUser, useGetBareMetalByUser, useCreateBareMetal,
  useUpdateBareMetal, useDeleteBareMetal
} from '../features/inventoryQuery/baremetalQuery';

import {
  useDeviceByRackAndUser, useNetworkDevicesByUser, useCreateNetworkDevice,
  useDeleteNetworkDevice, useUpdateNetworkDevice
} from '../features/inventoryQuery/networkDeviceQuery';

import { useCreateVP, useUpdateVPForUser } from '../features/inventoryQuery/vpQuery'

import { ServerTable } from '../components/ui/device/ServerTable';
import { NetworkDeviceTable } from '../components/ui/device/NetworkDeviceTable';
import { BaremetalForm } from '../components/ui/device/BaremetalForm';
import { NetworkDeviceForm } from '../components/ui/device/NetworkDeviceForm';
import { VirtualizationForm } from '../components/ui/device/VirtualizationForm';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { AlertMessage } from '../components/ui/AlertMessage';
import {
  Server,
  Network,
  Search,
  Filter,
  MapPin,
  HardDrive,
} from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

const DevicePage: React.FC = () => {


  const loginDetails = JSON.parse(sessionStorage.getItem('loginDetails') || 'null');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<AlertType | null>(null);

  const [selectedRack, setSelectedRack] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const { data: baremetals = [] } = useGetBareMetalByUser();
  const { data: networkDevices = [] } = useNetworkDevicesByUser();

  const { data: baremetalsByRack } = useBaremetalByRackAndUser(selectedRack);
  const { mutate: createBaremetal } = useCreateBareMetal();
  const { mutate: deleteBaremetal } = useDeleteBareMetal();
  const { mutate: updateBaremetal } = useUpdateBareMetal();

  const { data: deviceByRack } = useDeviceByRackAndUser(selectedRack);
  const { mutate: createNetworkDevice } = useCreateNetworkDevice();
  const { mutate: deleteNetworkDevice } = useDeleteNetworkDevice();
  const { mutate: updateNetworkDevice } = useUpdateNetworkDevice();

  const { mutate: createVP } = useCreateVP();
  const { mutate: updateVP } = useUpdateVPForUser();
  //const { mutate: deleteVP } = useDeleteVPByUser();

  const [selectedServer, setSelectedServer] = useState<BareMetal | null>(null);
  const [selectedNetworkDevice, setSelectedNetworkDevice] = useState<NetworkDevices | null>(null);

  const { data: locationList } = useLocationsForUser();
  const { data: userList } = useUsers();

  const [searchTerm, setSearchTerm] = useState('');


  const [isBaremetalFormOpen, setIsBaremetalFormOpen] = useState(false);
  const [isNetworkDeviceFormOpen, setIsNetworkDeviceFormOpen] = useState(false);
  const [isVirtualizationFormOpen, setIsVirtualizationFormOpen] = useState(false);

  // Get available racks for selected location
  useMemo(() => {
    if (selectedLocation === null) return [];
    const loc = locationList?.find(loc => loc.id === selectedLocation.id);
    return loc?.rack;
  }, [selectedLocation]);



  //Filter server
  const baremetalList = baremetalsByRack ?? baremetals;
  const filteredBaremetals = baremetalList.filter(b => {
    const matchSearch = b.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchIp = b.interfaces.map(i => i.ip.includes(searchTerm));

    const matchRack = selectedRack === null || b.rack.id === selectedRack;

    return matchSearch && matchIp && matchRack;
  })



  // Filter network device
  const networkDeviceList = networkDevices ?? deviceByRack;
  const filteredNetworkDevices = networkDeviceList.filter(n => {
    const matchSearch = n.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchIp = n.interfaces.map(i => i.ip.includes(searchTerm));

    const matchRack = selectedRack === null || n.rack.id === selectedRack;

    return matchSearch && matchIp && matchRack;
  })



  // Handle select location
  const handleSelectLocation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    const location = locationList?.find(loc => loc.id === selectedId);
    setSelectedLocation(location ?? null);
  };


  // Handle edit Baremetal or network device
  const handleEdit = (data: BareMetal | NetworkDevices) => {
    if (data.type === "PHYSICAL_SERVER") {
      setSelectedServer(data as BareMetal);
      setIsBaremetalFormOpen(true);
    } else {
      setSelectedNetworkDevice(data as NetworkDevices);
      setIsNetworkDeviceFormOpen(true);
    }
  }


  // Handle delete server
  const handleDeleteServer = (serverId: number) => {
    deleteBaremetal(serverId, {
      onSuccess: () => {
        setAlertType("success");
        setAlertMessage(`Server deleted successfully.`);
      },
      onError: (error) => {
        setAlertType("error");
        setAlertMessage(`Failed to delete server. ${error.message}`);
      },
    })
  };

  // Handle delete network device
  const handleDeleteNetworkDevice = (deviceId: number) => {
    deleteNetworkDevice(deviceId, {
      onSuccess: () => {
        setAlertType("success");
        setAlertMessage(`Device deleted successfully.`);
      },
      onError: (error) => {
        setAlertType("error");
        setAlertMessage(`Failed to delete device. ${error.message}`);
      },
    })
  };


  // Handle delete network device
  // const handleDeleteVirtualPlatform = (vpId: number) => {
  //     deleteVP(vpId, {
  //       onSuccess: () => {
  //         setAlertType("success");
  //         setAlertMessage(`Device deleted successfully.`);
  //       },
  //       onError: (error) => {
  //         setAlertType("error");
  //         setAlertMessage(`Failed to delete device. ${error.message}`);
  //       },
  //     })
  // };







  // Handle Add Baremetal
  const handleAddBaremetal = () => {
    setIsBaremetalFormOpen(true);
  }

  // Handle Add Network Device
  const handleAddNetworkDevice = () => {
    setIsBaremetalFormOpen(true);
  }

  // Handle Add Virtual Platform
  const handleAddVirtualization = (data: BareMetal) => {
    if (data.type === "PHYSICAL_SERVER") {
      setSelectedServer(data as BareMetal);
      setIsVirtualizationFormOpen(true);
    }
  }



  // Handle Submit Baremetal
  const handleBaremetalFormSubmit = (server: BareMetalReqDTO) => {

    if (selectedServer) {
      // Update baremetal
      updateBaremetal({
        id: selectedServer.id,
        baremetalData: server
      }, {
        onSuccess: (response) => {
          setAlertType('success');
          setAlertMessage(`Server ${response.serialNumber} updated successfully.`);
        },
        onError: (error) => {
          setAlertType('error');
          setAlertMessage(`Failed to update server. ${error.message}`);
        }
      })

    } else {
      // Add new server
      createBaremetal(server, {
        onSuccess: (response) => {
          setAlertType('success');
          setAlertMessage(`Server ${response.serialNumber} created successfully.`);
        },
        onError: (error) => {
          setAlertType('error');
          setAlertMessage(`Failed to update project. ${error.message}`);
        }
      })
    }
    setSelectedServer(null);
    setIsBaremetalFormOpen(false);
  };

  // Handle submit network device
  const handleNetworkDeviceFormSubmit = (device: NetworkDeviceReqDTO) => {

    if (selectedNetworkDevice) {
      // Update a network device
      updateNetworkDevice({
        id: selectedNetworkDevice.id,
        data: device
      }, {
        onSuccess: (response) => {
          setAlertType('success');
          setAlertMessage(`Device ${response.name} updated successfully.`);
        },
        onError: (error) => {
          setAlertType('error');
          setAlertMessage(`Failed to update device. ${error.message}`);
        }
      })

    } else {
      // Add new network device
      createNetworkDevice(device, {
        onSuccess: (response) => {
          setAlertType('success');
          setAlertMessage(`Device ${response.name} created successfully.`);
        },
        onError: (error) => {
          setAlertType('error');
          setAlertMessage(`Failed to update project. ${error.message}`);
        }
      })
    }
    setSelectedNetworkDevice(null);
    setIsNetworkDeviceFormOpen(false);
  };


  // Handle submit virtual platform
  const handleVirtualizationFormSubmit = async (equipment: VirtualPlatformReqDTO) => {
    if (selectedServer) {
      updateVP({
        vpId: selectedServer.id,
        vpData: equipment
      }, {
        onSuccess: () => {
          setAlertType('success');
          setAlertMessage(`Virtual platform updated successfully.`);
        },
        onError: (error) => {
          setAlertType('error');
          setAlertMessage(`Failed to update virtual platform. ${error.message}`);
        }
      })
    } else {
      createVP(equipment, {
        onSuccess: (response) => {
          setAlertType('success');
          setAlertMessage(`Virtual platform ${response.name} created successfully.`);
        },
        onError: (error) => {
          setAlertType('error');
          setAlertMessage(`Failed to create virtual platform. ${error.message}`);
        }
      })
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

  const handleVirtualizationFormClose = () => {
    setIsVirtualizationFormOpen(false);
    setSelectedServer(null);
  }

  // Show loading state

  if (!filteredBaremetals || !filteredNetworkDevices) {
    return (
      <LoadingSkeleton />
    )
  }



  return (

    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center mb-2">
                <HardDrive size={20} className="text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Device Management</h1>
              </div>
              <p className="text-sm text-gray-500">
                Manage servers and network devices across all locations
              </p>
            </div>
            <div className="flex items-center space-x-3">
              { loginDetails?.role.includes('AREMETAL_WRITE_BAREMETAL') && (
              <button
                onClick={handleAddBaremetal}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Server size={16} className="mr-2" />
                Add Server
              </button>
              )}


              { loginDetails?.role.includes('WRITE_FIREWALL') && (

              <button
                onClick={handleAddNetworkDevice}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Network size={16} className="mr-2" />
                Add Network Device
              </button>)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-md border-gray-200 p-2">
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            Showing {filteredBaremetals.length} servers and {filteredNetworkDevices.length} network devices
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
                  Servers ({filteredBaremetals.length})
                </h2>
              </div>
            </div>
            <ServerTable
              equipment={filteredBaremetals}
              onEdit={handleEdit}
              onDelete={handleDeleteServer}
              addVirtualization={handleAddVirtualization}
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

        <VirtualizationForm
          isOpen={isVirtualizationFormOpen}
          onClose={handleVirtualizationFormClose}
          onSubmit={handleVirtualizationFormSubmit}
          server={selectedServer}
          availableUsers={userList}
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

export default DevicePage;