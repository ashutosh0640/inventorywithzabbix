import { useRackByIdAndUser } from '../../../features/inventoryQuery/rackQuery';
import { useBaremetalByRackAndUser } from '../../../features/inventoryQuery/baremetalQuery';
import { useDeviceByRackAndUser } from '../../../features/inventoryQuery/networkDeviceQuery';
import { StatusIndicator } from '../StatusIndecator';
import { LoadingSkeleton } from '../LoadingSkeleton';
import {
  Undo2,
  Server,
  Network,
  MapPin,
  Users,
  Calendar,
  Activity,
  HardDrive,
  Wifi,
  Shield,
  Router,
  Zap
} from 'lucide-react';
import { useParams } from 'react-router-dom';

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'SWITCH': return <Network size={10} />;
    case 'ROUTER': return <Router size={10} />;
    case 'FIREWALL': return <Shield size={10} />;
    case 'load-balancer': return <Zap size={10} />;
    default: return <Wifi size={10} />;
  }
};



export const RackDetails = () => {

  const { id } = useParams();
  const rackId = parseInt(id || "0");
  const { data: rack } = useRackByIdAndUser(rackId);
  const { data: bareMetal } = useBaremetalByRackAndUser(rackId);
  const { data: device } = useDeviceByRackAndUser(rackId);

  if (!rack) {
    return (
      <LoadingSkeleton />
    )
  }

  const handleGoBack = () => {
    window.history.back();
  }


  // Create slot visualization
  const createSlotVisualization = () => {
    const slots = Array.from({ length: (rack.totalSlot / 2) + 1 }, (_, index) => {
      const slotNumber = (rack.totalSlot / 2 - index) * 2;
      const server = rack.server.find(s => s.rackSlotNumber === slotNumber);
      const networkDevice = rack.networkDevices?.find(d => d.rackSlotNumber === slotNumber);



      return {
        number: slotNumber,
        server,
        networkDevice,
        occupied: !!(server || networkDevice)
      };
    });

    return slots;
  };

  const slots = createSlotVisualization();
  const utilizationPercentage = Math.round((rack?.occupiedSlot / rack?.totalSlot) * 100);



  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl min-h-screen overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-1 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center">
            <Server size={20} className="text-blue-600 mr-3" />
            <div>
              <h2 className="text-base font-bold text-gray-900 ">{rack.name}</h2>
              <p className="text-xs text-gray-600  mt-1">
                {rack.occupiedSlot} of {rack.totalSlot} slots occupied ({utilizationPercentage}% utilization)
              </p>
            </div>
          </div>
          <button
            onClick={handleGoBack}
            className="p-2 text-gray-400  hover:text-gray-600 hover:bg-white  rounded-lg transition-colors"
          >
            <Undo2 size={24} />
          </button>
        </div>

        <div className=" min-h-[90vh] flex overflow-hidden">
          {/* Left Panel - Rack Visualization */}
          <div className="w-1/4 border-r border-gray-200  p-2 overflow-y-auto bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <HardDrive size={14} className="mr-2" />
              Rack Layout
            </h3>

            <div className="bg-white rounded-lg border-2 border-gray-300 p-1">
              <div className="space-y-0.5">
                {slots.map((slot) => (
                  <div
                    key={slot.number}
                    className={`flex items-center justify-between p-1 rounded border text-xs ${slot.occupied
                      ? slot.server
                        ? 'bg-blue-100 border-blue-300 '
                        : 'bg-green-100 border-green-300'
                      : 'bg-gray-50 border-gray-200 '
                      }`}
                  >
                    <span className="font-mono text-xs text-gray-500 w-8">
                      {slot.number.toString().padStart(2, '0')}
                    </span>

                    {slot.server && (
                      <div className="flex items-center flex-1 ml-2">
                        <Server size={10} className="text-blue-600 mr-1" />
                        <span className="text-xs font-medium truncate text-gray-900">
                          {slot.server.name}
                        </span>
                      </div>
                    )}

                    {slot.networkDevice && (
                      <div className="flex items-center flex-1 ml-2">
                        {getDeviceIcon(slot.networkDevice.type)}
                        <span className="text-xs font-medium truncate ml-1 text-gray-900">
                          {slot.networkDevice.name}
                        </span>
                      </div>
                    )}

                    {!slot.occupied && (
                      <span className="text-xs text-gray-400 flex-1 ml-2">Empty</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Utilization Stats */}
            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Utilization</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Total Slots</span>
                  <span className="font-medium text-gray-900">{rack.totalSlot}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Occupied</span>
                  <span className="font-medium text-blue-600">{rack.occupiedSlot.toString().padStart(2, '0')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Available</span>
                  <span className="font-medium text-green-600">{rack.totalSlot - rack.occupiedSlot}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${utilizationPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Details */}
          <div className="flex-1 p-2 overflow-y-auto">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center text-xs text-gray-600 ">
                    <MapPin size={12} className="text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium text-gray-900">{rack.location.name}</p>
                      {/* <p className="text-gray-500 dark:text-gray-400">{rack.location.address}</p> */}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Calendar size={12} className="text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium text-gray-900">Created At</p>
                      <p className=" text-xs text-gray-500">{rack.createdAt.split('T')[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Activity size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Last Updated</p>
                      <p className=" text-xs text-gray-500">{rack.updatedAt.split('T')[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 ">
                    <Users size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className=" text-xs font-semibold text-gray-900">Assigned Users</p>
                      <p className=" text-xs text-gray-500 ">{rack.user.length} user{rack.user.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Servers */}
              <div className="bg-white rounded-lg border border-gray-200 p-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <Server size={12} className="mr-2 text-blue-600" />
                  Servers ({bareMetal?.length || 0})
                </h3>
                {bareMetal && bareMetal.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-200 border-b border-gray-200  ">
                        <tr>
                          <th className="p-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="p-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Server Name
                          </th>
                          <th className="p-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Vendor
                          </th>
                          <th className="p-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Management
                          </th>
                          <th className="p-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Model
                          </th>
                          <th className="p-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            S. No
                          </th>
                          <th className="p-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            IP
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bareMetal?.map((server) => (
                          <tr key={server.id} className=" hover:bg-gray-100 text-xs transition-colors">
                            <td>
                              {server.interfaces.length > 0 ? (

                                <StatusIndicator status={server.interfaces[0].status as 'ONLINE' | 'OFFLINE' | 'MAINTENANCE'} size={4} />

                              ) : (
                                <StatusIndicator status='MAINTENANCE' size={4} />
                              )}

                            </td>
                            <td>
                              <div className="flex items-center">
                                <Server size={12} className="text-blue-600 mr-3" />
                                <span className="font-medium text-gray-900">{server.name}</span>
                              </div>
                            </td>
                            <td>
                              <span className="text-xs text-gray-600">{server.manufacturer}</span>
                            </td>
                            <td>
                              <span className="text-xs text-gray-600">{server.management}</span>
                            </td>
                            <td>
                              <span className="text-xs text-gray-600">{server.modelName}</span>
                            </td>
                            <td >
                              <span className="text-xs text-gray-600">{server.serialNumber}</span>
                            </td>
                            <td>
                              <span className="text-xs text-gray-600">{server.interfaces[0].ip}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
                  : (
                    <p className="text-gray-500 text-center py-4">No servers installed</p>
                  )}
              </div>

              {/* Network Devices */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">

                  <Network size={12} className="mr-2 text-green-600" />
                  Network Devices ({device?.length || 0})
                </h3>
                {device && device.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-200 border-b border-gray-200 ">
                        <tr>
                          <th className="p-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="p-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Device Name
                          </th>
                          <th className="p-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Vendor
                          </th>
                          <th className="p-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Model
                          </th>
                          <th className="p-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            S. No
                          </th>
                          <th className="p-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            IP
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {device?.map((device) => (
                          <tr key={device.id} className=" hover:bg-gray-100 text-xs transition-colors">
                            <td>
                              {device.interfaces.length > 0 ? (
                                <StatusIndicator status={device.interfaces[0].status as 'ONLINE' | 'OFFLINE' | 'MAINTENANCE'} size={4} />
                              ) : (
                                <StatusIndicator status='MAINTENANCE' size={4} />
                              )}

                            </td>
                            <td>
                              <div className=" flex items-center justify-start">
                                <div className="text-green-600 mr-3">
                                  {getDeviceIcon(device.type)}
                                </div>
                                <span className=" text-xs font-medium text-gray-900">{device.name}</span>
                              </div>
                            </td>
                            <td>
                              <span className=" text-xs text-gray-600">{device.manufacturer}</span>
                            </td>
                            <td>
                              <span className=" text-xs text-gray-600">{device.model}</span>
                            </td>
                            <td >
                              <span className=" text-xs text-gray-600">{device.serialNumber}</span>
                            </td>
                            <td>
                              {device.interfaces.length > 0 ? (
                                <span className={`rounded-full text-xs text-gray-600 `}>
                                  {device.interfaces[0].ip}
                                </span>
                              ) : (
                                <span className={`rounded-full text-xs text-gray-600`}>
                                  <p>NO IP</p>
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No network devices installed</p>
                )}
              </div>

              {/* Assigned Users */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <Users size={12} className="mr-2 text-purple-600" />
                  Assigned Users ({rack.user.length})
                </h3>
                {rack.user.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {rack.user.map((user) => (
                      <div key={user.id} className=" px-2 flex items-center bg-purple-50 rounded-lg border border-purple-200">
                        <div className="w-8 h-8 text-center rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-sm font-medium mr-3">
                          {user.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.fullName}</p>
                          <p className="text-xs text-gray-500 ">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No users assigned</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};