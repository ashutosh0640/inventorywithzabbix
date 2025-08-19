import React, { useState, useEffect } from 'react';
import type { NetworkDeviceReqDTO, InterfacesDTO, HostType } from '../../../types/requestDto';
import type { User, Location, NetworkDevices, Rack } from '../../../types/responseDto';
import { useRackSlots } from '../../../features/inventoryQuery/rackQuery';
import { X, Network, HardDrive, MapPin, Router, Shield, Wifi, Zap, ChevronRight, ChevronLeft, Settings, Plus, Trash2, Users } from 'lucide-react';

interface NetworkDeviceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (equipment: NetworkDeviceReqDTO) => void;
  device?: NetworkDevices | null;
  availableLocations?: Location[];
  availableUsers?: User[];
}

interface InterfaceProps {
  id: string;
  ip: string;
  gateway: string;
  primaryDns: string;
  secondaryDns: string;
}

const hostTypes: HostType[] = [
  'SWITCH',
  'ROUTER',
  'FIREWALL',
  'ACCESS_POINT'
];


const commonPortCounts: number[] = [
  4,
  5,
  8,
  12,
  16,
  24,
  48,
  96
];

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'switch': return <Network size={16} />;
    case 'router': return <Router size={16} />;
    case 'firewall': return <Shield size={16} />;
    case 'load-balancer': return <Zap size={16} />;
    default: return <Wifi size={16} />;
  }
};

export const NetworkDeviceForm: React.FC<NetworkDeviceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  device,
  availableLocations,
  availableUsers = [],
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<number | string>("No location selected");
  const [racklist, setRacklist] = useState<Rack[]>([]);
  const [selectedRack, setSelectedRack] = useState<number>(0);
  const { data: rackSlots } = useRackSlots(selectedRack);
  const [formData, setFormData] = useState<NetworkDeviceReqDTO>({
    type: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    interfaces: [],
    osVersion: '',
    numberOfPort: 0,
    rackId: 0,
    rackSlotNumber: 0,
    userIds: []
  });

  const [interfaceList, setInterfaceList] = useState<InterfaceProps[]>([
    {
      id: crypto.randomUUID(),
      ip: '',
      gateway: '',
      primaryDns: '',
      secondaryDns: ''
    }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { number: 1, title: 'Basic Information', icon: <Network size={16} /> },
    { number: 2, title: 'Interface Information', icon: <Wifi size={16} /> },
  ];

  // Reset form when modal opens/closes or device changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      if (device) {
        // Edit mode - populate form with existing device data
        setFormData({
          type: device.type,
          manufacturer: device.manufacturer,
          model: device.model,
          serialNumber: device.serialNumber,
          interfaces: device.interfaces,
          osVersion: device.osVersion,
          numberOfPort: device.numberOfPort,
          rackId: device.rack.id,
          rackSlotNumber: device.rackSlotNumber,
          userIds: device.users.map(u => u.id),
        });

      } else {
        // Add mode - reset form
        setFormData({
          type: '',
          manufacturer: '',
          model: '',
          serialNumber: '',
          interfaces: [],
          osVersion: '',
          numberOfPort: 0,
          rackId: 0,
          rackSlotNumber: 0,
          userIds: []
        });
      }
      setErrors({});
    }
  }, [isOpen, device]);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.type.trim()) {
        newErrors.type = 'Host type is required';
      }
      if (!formData.manufacturer.trim()) {
        newErrors.manufacturer = 'Manufacturer is required';
      }
      if (!formData.model.trim()) {
        newErrors.modelName = 'Model name is required';
      }
      if (!formData.serialNumber.trim()) {
        newErrors.serialNumber = 'Serial number is required';
      }
      if (!selectedLocation) {
        newErrors.selectedLocation = 'Location selection is required';
      }
      if (!formData.rackId) {
        newErrors.rackId = 'Rack selection is required';
      }
      if (!formData.rackSlotNumber) {
        newErrors.rackSlotNumber = 'Rack slot is required';
      }
      if (formData.rackSlotNumber < 0 || formData.rackSlotNumber > 84 || formData.rackSlotNumber % 2 != 0) {
        newErrors.rackSlotNumber = 'Slot position must be even number between 0 and 42';
      }
    }

    if (step === 2) {
      interfaceList.forEach((iface, index) => {
        if (iface.ip && !/^(\d{1,3}\.){3}\d{1,3}$/.test(iface.ip)) {
          newErrors[`interface_${index}_ip`] = 'Please enter a valid IP address';
        }
        if (iface.gateway && !/^(\d{1,3}\.){3}\d{1,3}$/.test(iface.gateway)) {
          newErrors[`interface_${index}_gateway`] = 'Please enter a valid gateway address';
        }
        if (iface.primaryDns && !/^(\d{1,3}\.){3}\d{1,3}$/.test(iface.primaryDns)) {
          newErrors[`interface_${index}_primaryDns`] = 'Please enter a valid DNS address';
        }
        if (iface.secondaryDns && !/^(\d{1,3}\.){3}\d{1,3}$/.test(iface.secondaryDns)) {
          newErrors[`interface_${index}_secondaryDns`] = 'Please enter a valid DNS address';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    const submitData: NetworkDeviceReqDTO = {
      ...formData,
      interfaces: interfaceList.map(i => {
        return {
          ip: i.ip,
          gateway: i.gateway,
          primaryDns: i.primaryDns,
          secondaryDns: i.secondaryDns,
        }
      }),
    };

    onSubmit(submitData);
    onClose();
  };

  const addInterface = () => {
    setInterfaceList(prevInterfaces => [
      ...prevInterfaces,
      {
        id: crypto.randomUUID(), // Assign a new unique ID
        ip: '',
        gateway: '',
        primaryDns: '',
        secondaryDns: ''
      }
    ]);
  };

  const removeInterface = (id: string) => {
    setInterfaceList(prevInterfaces => prevInterfaces.filter(iface => iface.id !== id));
    // Also remove any associated errors
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      for (const key in newErrors) {
        if (key.startsWith(`interface_${id}_`)) {
          delete newErrors[key];
        }
      }
      return newErrors;
    });
  };


  const updateInterface = (id: string, field: keyof InterfacesDTO, value: string) => {
    setInterfaceList(prevInterfaces =>
      prevInterfaces.map(iface =>
        iface.id === id ? { ...iface, [field]: value } : iface
      )
    );
    // Clear the error for this specific field when it's being updated
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[`interface_${id}_${field}`];
      return newErrors;
    });
  };


  const validateField = (iface: InterfaceProps, field: keyof InterfaceProps) => {
    let isValid = true;
    let errorMessage = '';

    switch (field) {
      case 'ip':
        // Simple IP regex for demonstration
        const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (!iface.ip || !ipRegex.test(iface.ip)) {
          isValid = false;
          errorMessage = 'Invalid IP address format.';
        }
        break;
      case 'gateway':
        const gatewayRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (!iface.gateway || !gatewayRegex.test(iface.gateway)) {
          isValid = false;
          errorMessage = 'Invalid Gateway format.';
        }
        break;
      case 'primaryDns':
      case 'secondaryDns':
        const dnsRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (iface[field] && !dnsRegex.test(iface[field])) { // DNS can be optional but if present, must be valid
          isValid = false;
          errorMessage = 'Invalid DNS format.';
        }
        break;
      default:
        break;
    }

    if (!isValid) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [`interface_${iface.id}_${field}`]: errorMessage
      }));
    } else {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[`interface_${iface.id}_${field}`];
        return newErrors;
      });
    }
    return isValid;
  };

  const handleUserToggle = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      userIds: prev.userIds.includes(userId)
        ? prev.userIds.filter(id => id !== userId)
        : [...prev.userIds, userId]
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = parseInt(e.target.value);
    if (locationId) {
      const loc = availableLocations?.find(l => l.id === locationId);
      if (loc) {
        setSelectedLocation(loc.id)
        setRacklist(loc?.rack || []);
      }
    }
  };

  const handleRackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRack = parseInt(e.target.value);
    if (selectedRack) {
      setSelectedRack(selectedRack);
    }
  }

  if (!isOpen) return null;

  const deviceTypes = [
    { value: 'switch', label: 'Network Switch', description: 'Layer 2/3 switching device' },
    { value: 'router', label: 'Router', description: 'Layer 3 routing device' },
    { value: 'firewall', label: 'Firewall', description: 'Security filtering device' },
    { value: 'load-balancer', label: 'Load Balancer', description: 'Traffic distribution device' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center">
            <Network size={24} className="text-green-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {device ? 'Edit Network Device' : 'Add New Network Device'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${currentStep >= step.number
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                    }`}>
                    {currentStep > step.number ? '✓' : step.number}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-green-600' : 'text-gray-500'
                      }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center mb-4">
                  <Network size={20} className="text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label htmlFor="rackId" className="block text-sm font-medium text-gray-700 mb-2">
                      <HardDrive size={16} className="inline mr-1" />
                      Device Type *
                    </label>
                    <select
                      id="typeSelect"
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.rackId ? 'border-red-300' : 'border-gray-300'
                        }`}
                    >
                      <option value={0}>Select device type</option>
                      {hostTypes.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    {errors.rackId && (
                      <p className="mt-1 text-sm text-red-600">{errors.rackId}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturer *
                    </label>
                    <input
                      type="text"
                      id="manufacturer"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.manufacturer ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="Enter manufacturer (e.g., Dell, HP, Supermicro)"
                    />
                    {errors.manufacturer && (
                      <p className="mt-1 text-sm text-red-600">{errors.manufacturer}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-2">
                      Model Name *
                    </label>
                    <input
                      type="text"
                      id="modelName"
                      value={formData.model}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.model ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="Enter model name (e.g., PowerEdge R740)"
                    />
                    {errors.model && (
                      <p className="mt-1 text-sm text-red-600">{errors.model}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-2">
                      Serial Number *
                    </label>
                    <input
                      type="text"
                      id="serialnumber"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.modelName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="Enter model name (e.g., PowerEdge R740)"
                    />
                    {errors.serialNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.serialNumber}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-2">
                      OS version *
                    </label>
                    <input
                      type="text"
                      id="modelName"
                      value={formData.osVersion}
                      onChange={(e) => setFormData(prev => ({ ...prev, osVersion: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.osVersion ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="Enter model name (e.g., PowerEdge R740)"
                    />
                    {errors.osVersion && (
                      <p className="mt-1 text-sm text-red-600">{errors.osVersion}</p>
                    )}
                  </div>



                  <div>
                    <label htmlFor="rackId" className="block text-sm font-medium text-gray-700 mb-2">
                      <HardDrive size={16} className="inline mr-1" />
                      Port count
                    </label>
                    <select
                      id="portCount"
                      value={formData.numberOfPort}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberOfPort: parseInt(e.target.value) }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.rackId ? 'border-red-300' : 'border-gray-300'
                        }`}
                    >
                      <option value={0}>Select port count</option>
                      {hostTypes.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    {/* {errors.rackId && (
                      <p className="mt-1 text-sm text-red-600">{errors.rackId}</p>
                    )} */}
                  </div>

                  <div>
                    <label htmlFor="rackId" className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="inline mr-1" />
                      Select Location *
                    </label>
                    <select
                      id="locationselect"
                      value={selectedLocation}
                      onChange={handleLocationChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.rackId ? 'border-red-300' : 'border-gray-300'
                        }`}
                    >
                      <option value={0}>Select a Location</option>
                      {availableLocations?.map(loc => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} {loc.rack.length} racks.
                        </option>
                      ))}
                    </select>
                    {errors.selectedLocation && (
                      <p className="mt-1 text-sm text-red-600">{errors.selectedLocation}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="rackId" className="block text-sm font-medium text-gray-700 mb-2">
                      <HardDrive size={16} className="inline mr-1" />
                      Select Rack *
                    </label>
                    <select
                      id="rackId"
                      value={formData.rackId}
                      //onChange={(e) => setFormData(prev => ({ ...prev, rackId: parseInt(e.target.value) }))}
                      onChange={handleRackChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.rackId ? 'border-red-300' : 'border-gray-300'
                        }`}
                    >
                      <option value={0}>Select a rack</option>
                      {racklist.map(rack => (
                        <option key={rack.id} value={rack.id}>
                          {rack.name} - {rack.location.name}
                        </option>
                      ))}
                    </select>
                    {errors.rackId && (
                      <p className="mt-1 text-sm text-red-600">{errors.rackId}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="rackId" className="block text-sm font-medium text-gray-700 mb-2">
                      <HardDrive size={16} className="inline mr-1" />
                      Select slot *
                    </label>
                    <select
                      id="rackId"
                      value={formData.rackSlotNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, rackSlotNumber: parseInt(e.target.value) }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.rackId ? 'border-red-300' : 'border-gray-300'
                        }`}
                    >
                      <option value={0}>Select a slot</option>
                      {rackSlots?.map(slot => (
                        <option disabled={slot.status == 'OCCUPIED'} key={slot.slotNumber} value={slot.slotNumber}>
                          {slot.slotNumber} - {slot.status}
                        </option>
                      ))}
                    </select>
                    {errors.rackSlotNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.rackSlotNumber}</p>
                    )}
                  </div>
                </div>

                {/* Users */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users size={16} className="inline mr-1" />
                    Assign Users *
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                    {availableUsers.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.userIds.includes(user.id)}
                          onChange={() => handleUserToggle(user.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2 flex-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                            {user.fullName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.users && (
                    <p className="mt-1 text-sm text-red-600">{errors.users}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Selected: {formData.userIds.length} user{formData.userIds.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Interface Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Network size={20} className="text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Interface Information</h3>
                  </div>
                  <button
                    type="button"
                    onClick={addInterface}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Interface
                  </button>
                </div>

                <div className="space-y-6">
                  {interfaceList.map((iface, index) => (
                    // Use iface.id as the key for stable rendering
                    <div key={iface.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                      {/* Remove button for interfaces (except if only one remains) */}
                      {interfaceList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInterface(iface.id)}
                          className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label="Remove interface"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 01-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}

                      {/* IP Address Input */}
                      <div>
                        <label htmlFor={`ip-${iface.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                          IP Address
                        </label>
                        <input
                          type="text"
                          id={`ip-${iface.id}`} // Unique ID for label association
                          value={iface.ip}
                          onChange={(e) => updateInterface(iface.id, 'ip', e.target.value)}
                          onBlur={() => validateField(iface, 'ip')} // Validate on blur
                          className={`w-full p-2 text-xs border rounded-md focus:outline-none
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                        ${errors[`interface_${iface.id}_ip`] ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="192.168.1.100"
                        />
                        {errors[`interface_${iface.id}_ip`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`interface_${iface.id}_ip`]}</p>
                        )}
                      </div>

                      {/* Gateway Input */}
                      <div>
                        <label htmlFor={`gateway-${iface.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Gateway
                        </label>
                        <input
                          type="text"
                          id={`gateway-${iface.id}`} // Unique ID for label association
                          value={iface.gateway}
                          onChange={(e) => updateInterface(iface.id, 'gateway', e.target.value)}
                          onBlur={() => validateField(iface, 'gateway')} // Validate on blur
                          className={`w-full p-2 text-xs border rounded-md focus:outline-none
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                        ${errors[`interface_${iface.id}_gateway`] ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="192.168.1.1"
                        />
                        {errors[`interface_${iface.id}_gateway`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`interface_${iface.id}_gateway`]}</p>
                        )}
                      </div>

                      {/* Primary DNS Input */}
                      <div>
                        <label htmlFor={`primaryDns-${iface.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Primary DNS
                        </label>
                        <input
                          type="text"
                          id={`primaryDns-${iface.id}`}
                          value={iface.primaryDns}
                          onChange={(e) => updateInterface(iface.id, 'primaryDns', e.target.value)}
                          onBlur={() => validateField(iface, 'primaryDns')}
                          className={`w-full p-2 text-xs border rounded-md focus:outline-none
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                        ${errors[`interface_${iface.id}_primaryDns`] ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="8.8.8.8"
                        />
                        {errors[`interface_${iface.id}_primaryDns`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`interface_${iface.id}_primaryDns`]}</p>
                        )}
                      </div>

                      {/* Secondary DNS Input */}
                      <div>
                        <label htmlFor={`secondaryDns-${iface.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Secondary DNS
                        </label>
                        <input
                          type="text"
                          id={`secondaryDns-${iface.id}`}
                          value={iface.secondaryDns}
                          onChange={(e) => updateInterface(iface.id, 'secondaryDns', e.target.value)}
                          onBlur={() => validateField(iface, 'secondaryDns')}
                          className={`w-full p-2 text-xs border rounded-md focus:outline-none
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                        ${errors[`interface_${iface.id}_secondaryDns`] ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="8.8.4.4"
                        />
                        {errors[`interface_${iface.id}_secondaryDns`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`interface_${iface.id}_secondaryDns`]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You can add multiple network interfaces for this server. Each interface can be configured with different IP settings and types.
                  </p>
                </div>
              </div>
            )}
          </div>


          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <ChevronLeft size={16} className="mr-2" />
                  Previous
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="flex items-center space-x-3">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Next
                  <ChevronRight size={16} className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {device ? 'Update Device' : 'Create Device'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};