import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { HardDrive, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import type { User, BareMetal, Rack } from '../types/responseDto';
import { baremetalsAPI, racksAPI, usersAPI } from '../service/inventoryapi';
import { FiAlertTriangle } from "react-icons/fi";
import type { BareMetalReqDTO } from '../types/requestDto';

const BaremetalPage: React.FC = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [servers, setServers] = useState<BareMetal[]>([]);
    const [racks, setRacks] = useState<Rack[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newServer, setNewServer] = useState<BareMetalReqDTO>({
        brandName: '',
        serverName: '',
        modelName: '',
        serialNumber: '',
        ipAddress: '',
        operatingSystem: '',
        rackId: 0,
        rackPosition: '',
        userIds: [1]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [userData, serversData, racksData, ] = await Promise.all([
                usersAPI.getAll(),
                baremetalsAPI.getAll(),
                racksAPI.getAll()
            ]);
            setUsers(userData);
            setServers(serversData);
            setRacks(racksData);
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
        setNewServer(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string) => (value: string) => {
        setNewServer(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddServer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            await baremetalsAPI.create(newServer);
            await fetchData();
            setNewServer({
                brandName: '',
                serverName: '',
                modelName: '',
                serialNumber: '',
                ipAddress: '',
                operatingSystem: '',
                rackId: 0,
                rackPosition: '',
                userIds: [1]
            });
            setShowAddForm(false);
            setError(null);
        } catch (err) {
            setError('Failed to add server');
            console.error('Error adding server:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveServer = async (id: number) => {
        try {
            setIsLoading(true);
            await baremetalsAPI.delete(id);
            await fetchData();
            setError(null);
        } catch (err) {
            setError('Failed to remove server');
            console.error('Error removing server:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredServers = searchTerm
        ? servers.filter(server =>
            server.serverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            server.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            server.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            server.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            server.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : servers;

    if (isLoading && servers.length === 0) {
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
                        placeholder="Search servers..."
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
                    {showAddForm ? 'Cancel' : 'Add Server'}
                </Button>
            </div>

            {showAddForm && (
                <Card title="Add New Server">
                    <form onSubmit={handleAddServer} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Brand Name"
                                name="brandName"
                                value={newServer.brandName}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                            <Input
                                label="Server Name"
                                name="serverName"
                                value={newServer.serverName}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                            <Input
                                label="Model Name"
                                name="modelName"
                                value={newServer.modelName}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                            <Input
                                label="Serial Number"
                                name="serialNumber"
                                value={newServer.serialNumber}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                            <Input
                                label="IP Address"
                                name="ipAddress"
                                value={newServer.ipAddress}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                            <Input
                                label="Operating System"
                                name="operatingSystem"
                                value={newServer.operatingSystem}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                            <select
                                name="rackId"
                                value={newServer.rackId} // assuming you're storing a single userId
                                onChange={(e) => setNewServer({ ...newServer, rackId: parseInt(e.target.value) })}
                                required
                            >
                                <option value="">Select a user</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.username}
                                    </option>
                                ))}
                            </select>

                            <Select
                                label="Users"
                                name='userIds'
                                options={users.map(user => ({
                                    value: user.id.toString(),
                                    label: user.username
                                }))}
                                value={newServer.userIds?.map(id => id.toString()) || []}
                                onChange={handleSelectChange('userIds')}
                                required
                                fullWidth
                            />
                            <Input
                                label="Position in Rack"
                                type="number"
                                name="rackPosition"
                                value={newServer.rackPosition}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />

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
                                Add Server
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServers.map((server) => (
                    <Card key={server.id} className="h-full">
                        <div className="flex items-start mb-4">
                            <div className={`p-3 rounded-full ${server.status === 'ACTIVE'
                                ? 'bg-green-100 text-green-600'
                                : server.status === 'MAINTENANCE'
                                    ? 'bg-amber-100 text-amber-600'
                                    : 'bg-red-100 text-red-600'
                                } mr-4`}>
                                <HardDrive size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">{server.serverName}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full ${server.status === 'ACTIVE'
                                        ? 'bg-green-100 text-green-800'
                                        : server.status === 'MAINTENANCE'
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {server.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {server.brandName} {server.modelName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    S/N: {server.serialNumber}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            <p>Server Name: {server.serverName} </p>
                            <p>Brand Name: {server.brandName}</p>
                            <p>Model Name: {server.modelName}GB</p>
                            <p>IP: {server.ipAddress}</p>
                            <p>OS: {server.os}</p>
                            <p>Location: {racks.find(r => r.id === server.rackId)?.rackName} (U{server.rackPosition})</p>
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
                                onClick={() => handleRemoveServer(server.id)}
                            >
                                Remove
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredServers.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <HardDrive className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No servers found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new server.'}
                    </p>
                    <div className="mt-6">
                        <Button
                            onClick={() => setShowAddForm(true)}
                            leftIcon={<Plus size={16} />}
                        >
                            Add Server
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BaremetalPage;