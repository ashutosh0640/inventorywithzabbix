import React, { useState, useEffect } from 'react';
import { X, Server, Loader2 } from 'lucide-react';
import type { ZabbixServerResDTO, ZabbixServerReqDTO } from '../../../types/zabbix';

interface ZabbixServerFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ZabbixServerReqDTO) => void;
    server?: ZabbixServerResDTO | null;
    isLoading: boolean;
    title: string;
}

export const ZabbixServerForm: React.FC<ZabbixServerFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    server,
    isLoading,
    title,
}) => {
    const [formData, setFormData] = useState<ZabbixServerReqDTO>({
        name: '',
        url: '',
        username: '',
        password: '',
        token: '',
        projectId: 0,
    });

    useEffect(() => {
        if (server) {
            setFormData({
                name: server.name,
                url: server.url,
                username: server.username,
                password: '',
                token: '',
                projectId: server.project.id,
            });
        }
    }, [server, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-50 rounded-lg">
                            <Server className="w-6 h-6 text-primary-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Server Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            disabled={isLoading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="Enter server name"
                        />
                    </div>

                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                            Server URL
                        </label>
                        <input
                            type="url"
                            id="url"
                            name="url"
                            value={formData.url}
                            onChange={handleInputChange}
                            required
                            disabled={isLoading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="https://zabbix.example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            disabled={isLoading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="Enter username"
                        />
                    </div>

                    {/* <div>
                        <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                            Project
                        </label>
                        <input
                            type="text"
                            id="project"
                            name="project"
                            value={formData.projectId.toString()}
                            onChange={handleInputChange}
                            required
                            disabled={isLoading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="Enter project name"
                        />
                    </div> */}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>{isLoading ? 'Saving...' : server ? 'Update Server' : 'Create Server'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};