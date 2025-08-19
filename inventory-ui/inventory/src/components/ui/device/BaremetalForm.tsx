import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { type BareMetalReqDTO, type InterfacesDTO, type ManagementType, type ServerVendor } from '../../../types/requestDto';
import type { User, Location, BareMetal, Rack, RackSlot } from '../../../types/responseDto';
import { Input } from '../Input'
import { Select } from '../Select'
import { useRackSlots } from '../../../features/inventoryQuery/rackQuery';
import { X, Server, Network, ChevronRight, ChevronLeft, Plus, Trash2, Users } from 'lucide-react';

interface BaremetalFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (equipment: BareMetalReqDTO) => void;
    server?: BareMetal | null;
    availableLocations?: Location[];
    availableUsers?: User[];
}

interface SelectOption {
    value: string;
    label: string;
}

const serverVendors: SelectOption[] = [
    { value: '', label: 'Select Manufacturer' },
    { value: 'HP', label: 'Hewlett Packard Enterprise' },
    { value: 'Dell', label: 'Dell Technologies' },
    { value: 'Supermicro', label: 'Supermicro' },
    { value: 'IBM', label: 'IBM' },
    { value: 'Huawei', label: 'Huawei' },
    { value: 'Intel', label: 'Intel' },
    { value: 'Oracle', label: 'Oracle' },
    { value: 'Lenovo', label: 'Lenovo' },
    { value: 'Cisco', label: 'Cisco Systems' },
];

const managementTypeOptions: SelectOption[] = [
    { value: '', label: 'Select Management Type' },
    { value: 'ILO', label: 'ILO' },
    { value: 'IDRAC', label: 'IDRAC' },
    { value: 'KVM', label: 'KVM' },
    { value: 'IPMI', label: 'IPMI' },
    { value: 'RMM', label: 'RMM' },
    { value: 'CIMC', label: 'CIMC' },
    { value: 'BMC_GENERIC', label: 'BMC_GENERIC' },
    { value: 'OTHER', label: 'OTHER' }
];


export const BaremetalForm: React.FC<BaremetalFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    server,
    availableLocations,
    availableUsers = [],
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<RackSlot | null>(null);
    const { data: rackSlots } = useRackSlots(selectedRack?.id || null);
    const [formData, setFormData] = useState<Omit<BareMetalReqDTO, 'interfaces'>>({
        name: '',
        type: 'PHYSICAL_SERVER',
        management: '',
        manufacturer: '',
        modelName: '',
        serialNumber: '',
        rackId: 0,
        rackSlotNumber: 0,
        userIds: [],
    });

    const [interfaces, setInterfaces] = useState<InterfacesDTO[]>([
        {
            ip: '',
            gateway: '',
            primaryDns: '',
            secondaryDns: ''
        }
    ]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const steps = [
        { number: 1, title: 'Basic Information', icon: <Server size={16} /> },
        { number: 2, title: 'Interface Information', icon: <Network size={16} /> }
    ];
    useEffect(() => {
        console.log("Rack slots number: ", rackSlots)
    }, [rackSlots])

    // Reset form when modal opens/closes or server changes
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1);
            if (server) {
                // Edit mode - populate form with existing server data
                setFormData({
                    name: server.name,
                    type: 'PHYSICAL_SERVER',
                    management: server.management,
                    manufacturer: server.manufacturer,
                    modelName: server.modelName,
                    serialNumber: server.serialNumber,
                    rackId: server.rack.id,
                    rackSlotNumber: server.rackSlotNumber,
                    userIds: server.user?.map(u => u.id),
                });
                
                if(server.rack.location) {
                    setSelectedLocation(availableLocations?.find(l=> l == server.rack.location) ?? null)
                }
                
                // Reset interfaces for edit mode
                {
                    server.interfaces?.length > 0 ? (
                        setInterfaces(server?.interfaces.map(i => ({
                            ip: i.ip || '',
                            gateway: i.gateway || '',
                            primaryDns: i.primaryDns || '',
                            secondaryDns: i.secondaryDns || ''
                        })))

                    ) : (
                        setInterfaces([
                            {
                                ip: '',
                                gateway: '',
                                primaryDns: '',
                                secondaryDns: ''
                            }
                        ])
                    )
                }
            } else {
                // Add mode - reset form
                setFormData({
                    name: '',
                    type: 'PHYSICAL_SERVER',
                    management: '',
                    manufacturer: '',
                    modelName: '',
                    serialNumber: '',
                    rackId: 0,
                    rackSlotNumber: 1,
                    userIds: [],
                });
                setInterfaces([
                    {
                        ip: '',
                        gateway: '',
                        primaryDns: '8.8.8.8',
                        secondaryDns: '8.8.4.4',
                    }
                ]);
            }
            setErrors({});
        }

    }, [isOpen, server]);

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.name.trim()) {
                newErrors.name = 'Server name is required';
            }
            if (!formData.management.trim()) {
                newErrors.management = 'Management is required';
            }
            if (!formData.manufacturer.trim()) {
                newErrors.manufacturer = 'Manufacturer is required';
            }
            if (!formData.modelName.trim()) {
                newErrors.modelName = 'Model name is required';
            }
            if (!formData.serialNumber.trim()) {
                newErrors.serialNumber = 'Serial number is required';
            }
            if (!formData.management.trim()) {
                newErrors.management = 'Management is required';
            }
            if (!selectedLocation) {
                newErrors.selectedLocation = 'Location is required';
            }
            if (!formData.rackId) {
                newErrors.rackId = 'Rack is required';
            }
            if (!formData.rackSlotNumber) {
                newErrors.rackSlotNumber = 'Rack slot is required';
            }
            if (formData.rackSlotNumber < 0 || formData.rackSlotNumber > 84 || formData.rackSlotNumber % 2 != 0) {
                newErrors.rackSlotNumber = 'Slot position must be even number between 0 and 42';
            }
        }

        if (step === 2) {
            interfaces.forEach((iface, index) => {
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

    const handleClose = () => {
        console.log("form data: ", formData)
        console.log("selected location: ", selectedLocation)
        setSelectedLocation(null)
        setSelectedRack(null)
        setSelectedSlot(null)
        onClose();
    }

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

        const submitData: BareMetalReqDTO = {
            ...formData,
            interfaces: interfaces.map(({ ...iface }) => iface),
        };

        onSubmit(submitData);
        onClose();
    };

    const addInterface = () => {
        const newInterface: InterfacesDTO = {
            ip: '',
            gateway: '',
            primaryDns: '',
            secondaryDns: ''
        };
        setInterfaces([...interfaces, newInterface]);
    };

    const removeInterface = (ip: string) => {
        if (interfaces.length > 1) {
            setInterfaces(interfaces.filter(iface => iface.ip !== ip));
        }
    };

    const updateInterface = (ip: string, field: keyof InterfacesDTO, value: string) => {
        setInterfaces(prev => prev.map(iface =>
            iface.ip === ip ? { ...iface, [field]: value } : iface
        ));
    };


    const handleUserToggle = (userId: number) => {
        setFormData(prev => {
            const current = prev.userIds ?? [];
            const isSelected = current.includes(userId);
            return {
                ...prev,
                userIds: isSelected ?
                    current.filter(id => id != userId)
                    : [...current, userId]
            };
        })
    }

    const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const locationId = parseInt(e.target.value);
        if (locationId) {
            const loc = availableLocations?.find(l => l.id === locationId);
            if (loc) {
                setSelectedLocation(loc)

            }
        }
    };

    const handleRackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const rackId = parseInt(e.target.value);
        if (rackId && selectedLocation) {
            const rack = selectedLocation.rack?.find(r => r.id === rackId);
            if (rack) {
                setSelectedRack(rack);
                setFormData(prev => ({ ...prev, rackId: rack.id }))
                console.log("form data rack id: ", formData, "rack: ", rack)
            }
        }
    }

    const handleSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const slotId = parseInt(e.target.value);

        if (selectedRack && slotId) {
            console.log('handle slot change. rack slots: ', rackSlots, "slot id: ", slotId);
            const slot = rackSlots?.find(s => s.slotNumber === slotId);
            console.log('slot: ', slot)
            if (slot) {
                setSelectedSlot(slot);
                setFormData(prev => ({ ...prev, rackSlotNumber: slot.slotNumber }))
                console.log("form data slot number: ", formData, " slot: ", slot)
            }
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[95vh] overflow-hidden ">
                {/* Header */}
                <div className="flex items-center justify-between p-2 border-gray-500 bg-gradient-to-r from-blue-200 to-indigo-300">
                    <div className=" flex items-center">
                        <Server size={20} className="text-blue-600 mr-3" />
                        <div>
                            <h2 className="text-md font-semibold text-gray-900">
                                {server ? 'Edit Baremetal Server' : 'Add New Baremetal Server'}
                            </h2>
                            <p className="text-xs text-gray-600 mt-1">
                                Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-900 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className=" p-2 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.number}>
                                <div className="flex items-center">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${currentStep >= step.number
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {currentStep > step.number ? '✓' : step.number}
                                    </div>
                                    <div className="ml-3">
                                        <p className={`text-xs font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                                            }`}>
                                            {step.title}
                                        </p>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                                        }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className=" overflow-y-auto h-[75vh]">
                    <div className="p-4">
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div>
                                <div className="flex items-center mb-4">
                                    <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Input
                                            label="Server name *"
                                            id="name"
                                            name="name"
                                            type="text"
                                            error={errors.name}
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                            fullWidth
                                            placeholder="Enter server name (e.g., Web Server 01)"
                                        />
                                    </div>

                                    <div>
                                        <Input
                                            label="Devic type *"
                                            id="type"
                                            name="type"
                                            type="text"
                                            value="Physical server"
                                            fullWidth
                                            disabled
                                        />
                                    </div>

                                    <div>
                                        <Select
                                            label='Select manufacturer *'
                                            value={formData.manufacturer}
                                            options={serverVendors}
                                            error={errors.manufacturer}
                                            fullWidth={true}
                                            required
                                            onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e }))}
                                        />
                                    </div>

                                    <div>
                                        <Select
                                            label='Select management *'
                                            value={formData.management}
                                            options={managementTypeOptions}
                                            error={errors.management}
                                            fullWidth={true}
                                            required
                                            onChange={(e) => setFormData(prev => ({ ...prev, management: e }))}
                                        />
                                    </div>


                                    <div>
                                        <Input
                                            label="Model name *"
                                            id="modelName"
                                            name="modelName"
                                            type="text"
                                            error={errors.modelName}
                                            value={formData.modelName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, modelName: e.target.value }))}
                                            required
                                            fullWidth
                                            placeholder="Enter model name (e.g., PowerEdge R740)"
                                        />
                                    </div>



                                    <div>
                                        <Input
                                            label="Serial number *"
                                            id="serialNumber"
                                            name="serialNumber"
                                            type="text"
                                            error={errors.serialNumber}
                                            value={formData.serialNumber}
                                            onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                                            required
                                            fullWidth
                                            placeholder="Enter Serial number (e.g.  DYL92U5)"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="rackId" className="block text-xs max-w-fit font-medium text-gray-700 mb-2">
                                            Select Location *
                                        </label>
                                        <select
                                            id="locationselect"
                                            value={selectedLocation?.id}
                                            onChange={handleLocationChange}
                                            className={`w-full p-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.rackId ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value={0}>Select a Location</option>
                                            {availableLocations?.map(loc => (
                                                <option key={loc.id} value={loc.id}>
                                                    {loc.name} ( {loc.rack?.length} racks.)
                                                </option>
                                            ))}
                                        </select>
                                        {errors.selectedLocation && (
                                            <p className="mt-1 text-sm text-red-600">{errors.selectedLocation}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="rackId" className="block text-xs max-w-fit font-medium text-gray-700 mb-2">
                                            Select Rack *
                                        </label>
                                        <select
                                            id="rackId"
                                            value={selectedRack?.id}
                                            onChange={handleRackChange}
                                            className={`w-full p-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.rackId ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value={0}>Select a rack</option>
                                            {selectedLocation?.rack?.map(rack => (
                                                <option key={rack.id} value={rack.id}>
                                                    {rack.name} ( {rack.location.name} )
                                                </option>
                                            ))}
                                        </select>
                                        {errors.rackId && (
                                            <p className="mt-1 text-sm text-red-600">{errors.rackId}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="rackId" className="block text-xs max-w-fit font-medium text-gray-700 mb-2">
                                            Select slot *
                                        </label>
                                        <select
                                            id="rackId"
                                            value={selectedSlot?.slotNumber}
                                            onChange={handleSlotChange}
                                            className={`w-full p-2 text-xs border rounded-lg focus:outline-none
                                                focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                                ${errors.rackId ? 'border-red-300' : 'border-gray-300'}`}
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
                                    <label className="block my-2 text-xs max-w-fit font-medium text-gray-700 mb-2">
                                        <Users size={12} className="inline mr-1" />
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
                                                    checked={!!formData.userIds?.includes(user.id)}
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
                                        Selected: {formData.userIds?.length} user{formData.userIds?.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Interface Information */}
                        {currentStep === 2 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <Network size={20} className="text-blue-600 mr-2" />
                                        <h3 className="text-sm font-semibold text-gray-900">Interface Information</h3>
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
                                    {interfaces.map((iface, index) => (
                                        <div key={iface.ip} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-md font-medium text-gray-900">Interface {index + 1}</h4>
                                                {interfaces.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeInterface(iface.ip!)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Remove interface"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        IP Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={iface.ip}
                                                        onChange={(e) => updateInterface(iface.ip!, 'ip', e.target.value)}
                                                        className={`w-full p-2 text-xs border rounded-md focus:outline-none
                                                            focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                                            ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                                                        placeholder="192.168.1.100"
                                                    />
                                                    {errors[`interface_${index}_ip`] && (
                                                        <p className="mt-1 text-sm text-red-600">{errors[`interface_${index}_ip`]}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Gateway
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={iface.gateway}
                                                        onChange={(e) => updateInterface(iface.ip!, 'gateway', e.target.value)}
                                                        className={`w-full p-2 text-xs border rounded-md focus:outline-none
                                                            focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                                            ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                                                        placeholder="192.168.1.1"
                                                    />
                                                    {errors[`interface_${index}_gateway`] && (
                                                        <p className="mt-1 text-sm text-red-600">{errors[`interface_${index}_gateway`]}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Primary DNS
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={iface.primaryDns}
                                                        onChange={(e) => updateInterface(iface.ip!, 'primaryDns', e.target.value)}
                                                        className={`w-full p-2 text-xs border rounded-md focus:outline-none
                                                            focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                                            ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                                                        placeholder="8.8.8.8"
                                                    />
                                                    {errors[`interface_${index}_primaryDns`] && (
                                                        <p className="mt-1 text-sm text-red-600">{errors[`interface_${index}_primaryDns`]}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Secondary DNS
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={iface.secondaryDns}
                                                        onChange={(e) => updateInterface(iface.ip!, 'secondaryDns', e.target.value)}
                                                        className={`w-full p-2 text-xs border rounded-md focus:outline-none
                                                            focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                                            ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                                                        placeholder="8.8.4.4"
                                                    />
                                                    {errors[`interface_${index}_secondaryDns`] && (
                                                        <p className="mt-1 text-sm text-red-600">{errors[`interface_${index}_secondaryDns`]}</p>
                                                    )}
                                                </div>
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
                                onClick={handleClose}
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
                                    {server ? 'Update Server' : 'Create Server'}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};