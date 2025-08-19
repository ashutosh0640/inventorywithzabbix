import React, { useState, useEffect } from 'react';
import { type VirtualPlatformReqDTO, type InterfacesDTO } from '../../../types/requestDto';
import type { User, VirtualPlatform, BareMetal } from '../../../types/responseDto';
import { virtualizationOptions, cpuCoresOptions, dataUnit, storageTypeOptions } from '../../../types/selecteOption'
import { Input } from '../Input';
import { Select } from '../Select';
import { X, Server, Network, ChevronRight, ChevronLeft, Plus, Users, AppWindowMac } from 'lucide-react';

interface VirtualizationFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (equipment: VirtualPlatformReqDTO) => void;
    server: BareMetal | null;
    virtual?: VirtualPlatform | null;
    availableUsers?: User[];
}

interface InterfaceProps {
    id: string;
    ip: string;
    gateway: string;
    primaryDns: string;
    secondaryDns: string;
}


export const VirtualizationForm: React.FC<VirtualizationFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    server,
    virtual,
    availableUsers = [],
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    //const [selectedBaremetal, setSelectedBaremetal] = useState<BareMetal | null>(null);
    const [formData, setFormData] = useState<VirtualPlatformReqDTO>({
        hostType: '',
        type: '',
        version: '',
        interfaces: [],
        cpuModel: '',
        cpuCores: 0,
        ramSize: 0,
        ramSizeUnit: '',
        storageSize: 0,
        storageSizeUnit: '',
        storeageType: '',
        serverId: 0,
        usersId: []
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
        { number: 1, title: 'Basic Information', icon: <Server size={16} /> },
        { number: 2, title: 'Interface Information', icon: <Network size={16} /> }
    ];

    // Reset form when modal opens/closes or server changes
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1);
            if (virtual) {
                // Edit mode - populate form with existing server data
                setFormData({
                    hostType: virtual.hostType,
                    type: virtual.type,
                    version: virtual.version,
                    interfaces: virtual.interfaces,
                    cpuModel: virtual.cpuModel,
                    cpuCores: virtual.cpuCores,
                    ramSize: virtual.ramSize,
                    ramSizeUnit: virtual.ramSizeUnit,
                    storageSize: virtual.storageSize,
                    storageSizeUnit: virtual.storageSizeUnit,
                    storeageType: virtual.storageType,
                    serverId: virtual.server.id,
                    usersId: virtual.user?.map(u => u.id),
                });
            } else {
                // Add mode - reset form
                setFormData({
                    hostType: 'VIRTUALIZATION',
                    type: '',
                    version: '',
                    interfaces: [],
                    cpuModel: '',
                    cpuCores: 0,
                    ramSize: 0,
                    ramSizeUnit: '',
                    storageSize: 0,
                    storageSizeUnit: '',
                    storeageType: '',
                    serverId: server?.id || 0,
                    usersId: server?.user?.map(u=>u.id)
                });
            }
            setErrors({});
        }

    }, [isOpen, virtual]);

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.type.trim()) {
                newErrors.type = 'Virtualization type is required';
            }
            if (!formData.version.trim()) {
                newErrors.version = 'Version is required';
            }
            if (!formData.cpuModel.trim()) {
                newErrors.cpuModel = 'CPU model is required';
            }
            if (!formData.cpuCores) {
                newErrors.cpuCores = 'CPU core is required';
            }
            if (!formData.ramSize || formData.ramSize < 1) {
                newErrors.ramSize = 'Ram size is required and should not zero';
            }
            if (!formData.ramSizeUnit) {
                newErrors.ramSizeUnit = 'Ram size Unit is required';
            }
            if (!formData.storageSize || formData.storageSize < 1) {
                newErrors.storageSize = 'Storage size is required and should not zero';
            }
            if (!formData.storageSizeUnit) {
                newErrors.storageSizeUnit = 'Storage size Unit is required';
            }
            if (!formData.storeageType) {
                newErrors.storeageType = 'Storage type is required';
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


    const handleStorageSize = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = parseInt(e.target.value);
        console.log("storage size: ", input)
        if (input) {
            setFormData(prev => ({ ...prev, storageSize: input }))
        } else {
            setFormData(prev => ({ ...prev, storageSize: 0 }))
        }
    }

    const handleRamSize = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = parseInt(e.target.value);
        if (input) {
            setFormData(prev => ({ ...prev, ramSize: input }))
        } else {
            setFormData(prev => ({ ...prev, ramSize: 0 }))
        }
    }

    const handleClose = () => {
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

        const submitData: VirtualPlatformReqDTO = {
            ...formData,
            interfaces: interfaceList.map(i=>{
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
        console.log("handle user toggle...",userId)
        setFormData(prev => {
            const current = prev.usersId ?? [];
            const isSelected = current.includes(userId);
            console.log("form data: ", prev)
            return {
                ...prev,
                userIds: isSelected ?
                    current.filter(id => id != userId)
                    : [...current, userId]
            };
        })
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[95vh] overflow-hidden ">
                {/* Header */}
                <div className="flex items-center justify-between p-2 border-gray-500 bg-gradient-to-r from-blue-200 to-indigo-300">
                    <div className=" flex items-center">
                        <AppWindowMac size={20} className="text-blue-600 mr-3" />
                        <div>
                            <h2 className="text-md font-semibold text-gray-900">
                                {virtual ? 'Edit virtual platform' : 'Add New virtual platform'}
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
                                            label="Host type *"
                                            id="type"
                                            name="type"
                                            type="text"
                                            value="VIRTUALIZATION"
                                            fullWidth
                                            disabled
                                        />
                                    </div>

                                    <div>
                                        <Select
                                            label='Select virtualization type *'
                                            value={formData.type}
                                            options={virtualizationOptions}
                                            error={errors.type}
                                            fullWidth={true}
                                            required
                                            onChange={(e) => setFormData(prev => ({ ...prev, type: e }))}
                                        />
                                    </div>

                                    <div>
                                        <Input
                                            label="Version *"
                                            id="version"
                                            name="version"
                                            type="text"
                                            error={errors.version}
                                            value={formData.version}
                                            onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                                            required
                                            fullWidth
                                            placeholder="Enter virtualization version (e.g., Vmware ESXi 6.5.0)"
                                        />
                                    </div>

                                    <div>
                                        <Input
                                            label="CPU Model *"
                                            id="cpuModel"
                                            name="cpuModel"
                                            type="text"
                                            error={errors.cpuModel}
                                            value={formData.cpuModel}
                                            onChange={(e) => setFormData(prev => ({ ...prev, cpuModel: e.target.value }))}
                                            required
                                            fullWidth
                                            placeholder="Enter cpu model (e.g.  Intel(R) Xeon(R) Bronze 3104 CPU @ 1.70GHz)"
                                        />
                                    </div>

                                    <div>
                                        <Select
                                            label='Select CPU Core *'
                                            value={formData.cpuCores}
                                            options={cpuCoresOptions}
                                            error={errors.cpuCores}
                                            fullWidth={true}
                                            required
                                            onChange={(e) => setFormData(prev => ({ ...prev, cpuCores: parseInt(e) }))}
                                        />
                                    </div>

                                    <div>
                                        <Input
                                            label="RAM Size *"
                                            id="ramSize"
                                            name="ramSize"
                                            type="text"
                                            error={errors.ramSize}
                                            value={formData.ramSize}
                                            onChange={(e) => handleRamSize(e)}
                                            required
                                            fullWidth={false}
                                            placeholder="Enter RAM size (e.g.  16 GB)"
                                        />
                                    </div>

                                    <div>
                                        <Select
                                            label='Select RAM Unit *'
                                            value={formData.ramSizeUnit}
                                            options={dataUnit}
                                            error={errors.ramSizeUnit}
                                            fullWidth={false}
                                            required
                                            onChange={(e) => setFormData(prev => ({ ...prev, ramSizeUnit: e }))}
                                        />
                                    </div>




                                    <div>
                                        <Input
                                            label="Storage Size *"
                                            id="storageSize"
                                            name="storageSize"
                                            type="text"
                                            error={errors.storageSize}
                                            value={formData.storageSize}
                                            onChange={(e) => handleStorageSize(e)}
                                            required
                                            fullWidth={false}
                                            placeholder="Enter Storage size (e.g. 4 TB)"
                                        />
                                    </div>

                                    <div>
                                        <Select
                                            label='Select Storage Unit *'
                                            value={formData.storageSizeUnit}
                                            options={dataUnit}
                                            error={errors.storageSizeUnit}
                                            fullWidth={false}
                                            required
                                            onChange={(e) => setFormData(prev => ({ ...prev, storageSizeUnit: e }))}
                                        />
                                    </div>


                                    <div>
                                        <Select
                                            label='Select Storage type *'
                                            value={formData.storeageType}
                                            options={storageTypeOptions}
                                            error={errors.storeageType}
                                            fullWidth={false}
                                            required
                                            onChange={(e) => setFormData(prev => ({ ...prev, storeageType: e }))}
                                        />
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
                                                    checked={!!formData.usersId?.includes(user.id)}
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
                                        Selected: {formData.usersId?.length} user{formData.usersId?.length !== 1 ? 's' : ''}
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
                                    {virtual ? 'Update virtual platform' : 'Create virtual platform'}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};