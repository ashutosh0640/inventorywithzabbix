import React, { useState, useEffect } from 'react';
import type { Project } from '../../../types/responseDto';
import type { ZabbixServerRequestDTO } from '../../../types/zabbix';
import { Input } from '../Input';
import { X, Server,  } from 'lucide-react';

interface ZabbixServerFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (equipment: ZabbixServerRequestDTO) => void;
    project: Project | null;
}

export const ZabbixServerForm: React.FC<ZabbixServerFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    project
}) => {
    const [formData, setFormData] = useState<ZabbixServerRequestDTO>({
        name: '',
        url: '',
        username: '',
        password: '',
        token: '',
        projectId: project?.id || 0
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when modal opens/closes or server changes
    useEffect(() => {
        console.log("project: ", project)
        if (isOpen) {
            setFormData({
                name: '',
                url: '',
                username: '',
                password: '',
                token: '',
                projectId: project?.id || 0
            });
            setErrors({});
        }

    }, [isOpen]);

    const validateStep = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Zabbix server name is required';
        }
        if (!formData.url.trim()) {
            newErrors.url = 'Zabbix URL is required';
        }
        if (!formData.token.trim()) {
            newErrors.token = 'Token is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        onClose();
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep()) {
            return;
        }

        onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden  ">
                {/* Header */}
                <div className="flex items-center justify-between p-2 border-gray-500 bg-gradient-to-r from-blue-200 to-indigo-300" >
                    <div className=" flex items-center">
                        <Server size={20} className="text-blue-600 mr-3" />
                        <h2 className="text-md font-semibold text-gray-900">
                            Add New Zabbix Server
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-900 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>


                {/* Form Content */}
                <form onSubmit={handleSubmit} className=" overflow-y-auto h-fit">
                    <div className="p-4">
                        <div>
                            <div className="flex items-center mb-4">
                                <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div>
                                    <Input
                                        label="Zabbix server name *"
                                        id="name"
                                        name="name"
                                        type="text"
                                        error={errors.name}
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                        fullWidth
                                        placeholder='Enter zabbix server name'
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Zabbix server URL *"
                                        id="url"
                                        name="url"
                                        type="text"
                                        error={errors.url}
                                        value={formData.url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                                        required
                                        fullWidth
                                        placeholder="Enter zabbix server url"
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Zabbix server token *"
                                        id="token"
                                        name="token"
                                        type="text"
                                        error={errors.token}
                                        value={formData.token}
                                        onChange={(e) => setFormData(prev => ({ ...prev, token: e.target.value }))}
                                        required
                                        fullWidth
                                        placeholder="Enter zabbix server url"
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Username (Optional) "
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                        fullWidth
                                        placeholder='Enter zabbix server username'
                                    />
                                </div>

                                <div>
                                    <Input
                                        label="Password (Optional) "
                                        id="password"
                                        name="password"
                                        type="text"
                                        value={formData.password}
                                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                        fullWidth
                                        placeholder="Enter zabbix server password"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Create Zabbix Server
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};