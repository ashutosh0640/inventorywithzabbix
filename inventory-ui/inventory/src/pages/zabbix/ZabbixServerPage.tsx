import React, { useState } from 'react';
import { useAppDispatch } from '../../slice/hooks';
import { useAppSelector } from '../../slice/hooks';
import { useZabbixServersByUser, useDeleteZabbixServer, useUpdateZabbixServer } from '../../features/zabbixQuery/zabbixServerQuery';
import { ZabbixServerCard } from '../../components/zabbix/server/ZabbixServerCard';
import { ZabbixServerForm } from '../../components/zabbix/server/ZabbixServerForm';
//import { ConfirmDialog } from '../components/ConfirmDialog';
import { AlertMessage } from '../../components/ui/AlertMessage';
import { SearchBar } from '../../components/ui/SearchBar';
import { Database } from 'lucide-react';
import type { ZabbixServerResDTO, ZabbixServerReqDTO } from '../../types/zabbix';

type AlertType = 'success' | 'error' | 'warning' | 'info';


const ZabbixServerPage: React.FC = () => {

    const dispatch = useAppDispatch();

    const [alertType, setAlertType] = useState<AlertType | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const { data: zabbixServers = [], isLoading: isZabbixServerLoading } = useZabbixServersByUser();
    const { mutate: deleteZabbixServer } = useDeleteZabbixServer();
    const { mutate: updateZabbixServer } = useUpdateZabbixServer();

    const selectedServer = useAppSelector(state => state.zabbixserver.selectedServer);

    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingServer, setEditingServer] = useState<ZabbixServerResDTO | null>(null);
    // const [confirmDialog, setConfirmDialog] = useState<{
    //     isOpen: boolean;
    //     title: string;
    //     message: string;
    //     onConfirm: () => void;
    //     type?: 'danger' | 'warning' | 'info';
    // }>({
    //     isOpen: false,
    //     title: '',
    //     message: '',
    //     onConfirm: () => { },
    // });

    const filteredServers = zabbixServers.filter(z =>
        z.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        z.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        z.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusCounts = () => {
        const counts = zabbixServers.reduce((acc, server) => {
            acc[server.status] = (acc[server.status] || 0) + 1;
            return acc;
        }, {} as Record<ZabbixServerResDTO['status'], number>);

        return {
            total: zabbixServers.length,
            connected: counts.CONNECTED || 0,
            offline: counts.OFFLINE || 0,
            error: counts.error || 0,
            pending: counts.pending || 0,
        };
    };

    const handleSelectServer = async (data: ZabbixServerResDTO) => {
        console.log("Selecting Zabbix server: ", data);
        dispatch({ type: 'zabbixserver/addServer', payload: data });
        setAlertType('success');
        setAlertMessage(`Selected Zabbix server: ${data.name}`);
        //const selectedServer = useAppSelector(state => state.zabbixServer.selectedServer);
        console.log("Selected Zabbix server: ", selectedServer);
    };



    const handleEditServer = (server: ZabbixServerResDTO) => {
        setEditingServer(server);
        setIsEditModalOpen(true);
    };

    const handleDeleteServer = (server: ZabbixServerResDTO) => {
        deleteZabbixServer(server.id, {
            onSuccess: () => {
                setAlertType('success');
                setAlertMessage(`Deleted Zabbix server: ${server.name}`);
            },
            onError: (error) => {
                setAlertType('error');
                setAlertMessage(`Failed to delete Zabbix server: ${error.message}`);
            }
        });
    }

    const handleFormClose = () => {
        setEditingServer(null);
        setIsEditModalOpen(false);
    }

    const handleFormSubmit = (data: ZabbixServerReqDTO) => {
        if (editingServer) {
            updateZabbixServer({ id: editingServer.id, dto: data }, {
                onSuccess: (updatedServer) => {
                    setEditingServer(null);
                    setIsEditModalOpen(false);
                    setAlertType('success');
                    setAlertMessage(`Updated Zabbix server: ${updatedServer.name}`);
                },
                onError: (error) => {
                    setAlertType('error');
                    setAlertMessage(`Failed to update Zabbix server: ${error.message}`);
                }
            });
        }
    }

    const statusCounts = getStatusCounts();
    console.log("zabbix server list: ",zabbixServers);

    return (
        <div className="min-h-screen transition-all duration-300">
            <div className="w-full">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div>
                                <h1 className="text-3xl font-bold theme-text-primary">Zabbix Servers</h1>
                                <p className="theme-text-secondary">Manage and monitor your Zabbix server connections</p>
                            </div>
                        </div>
                        {/* <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                disabled={isLoading}
                                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4" />
                                <span>New Server</span>
                            </button>
                            {alerts.length > 0 && (
                                <button
                                    onClick={clearAllAlerts}
                                    className="btn-secondary text-sm"
                                >
                                    Clear Alerts ({alerts.length})
                                </button>
                            )}
                        </div> */}
                    </div>
                </div>

                {/* Alerts Section */}
                {/* {alerts.length > 0 && (
                    <div className="mb-6 space-y-3">
                        {alerts.map((alert) => (
                            <Alert
                                key={alert.id}
                                type={alert.type}
                                title={alert.title}
                                message={alert.message}
                                onClose={() => removeAlert(alert.id)}
                            />
                        ))}
                    </div>
                )} */}

                {/* Loading Overlay */}
                {/* {isLoading && (
                    <div className="mb-6">
                        <div className="theme-card rounded-lg p-4">
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current theme-text-accent mr-3"></div>
                                <span className="theme-text-primary text-sm font-medium">Processing server operation...</span>
                            </div>
                        </div>
                    </div>
                )} */}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className=" bg-white rounded-xl p-6">
                        <div>
                            <div>
                                <p className="text-sm font-medium theme-text-secondary">Total Servers</p>
                                <p className="text-2xl font-bold theme-text-primary">{statusCounts.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium theme-text-secondary">Connected</p>
                                <p className="text-2xl font-bold text-green-600">{statusCounts.connected}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium theme-text-secondary">Offline</p>
                                <p className="text-2xl font-bold text-red-600">{statusCounts.offline}</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg">
                                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium theme-text-secondary">Error</p>
                                <p className="text-2xl font-bold text-gray-600">{statusCounts.error}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium theme-text-secondary">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-lg">
                                <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="max-w-md">
                        <SearchBar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                        />
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-sm theme-text-secondary">
                        Showing {filteredServers.length} of {zabbixServers.length} Zabbix servers
                    </p>
                </div>

                {/* Server List */}
                {filteredServers.length === 0 ? (
                    <div className="theme-card rounded-xl p-12 text-center border-2 border-green-500">
                        <Database className="w-12 h-12 theme-text-secondary mx-auto mb-4" />
                        <h3 className="text-lg font-medium theme-text-primary mb-2">No Zabbix servers found</h3>
                        <p className="theme-text-secondary">Try adjusting your search criteria or create a new server.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" >
                        {filteredServers.map((server) => (
                            <ZabbixServerCard
                                key={server.id}
                                server={server}
                                isSelected={selectedServer?.id === server.id}
                                onSelect={handleSelectServer}
                                onDelete={handleDeleteServer}
                                onEdit={handleEditServer}
                                isLoading={isZabbixServerLoading}
                            />
                        ))}
                    </div>
                )}

                {alertMessage && (
                    <AlertMessage
                        message={alertMessage}
                        type={alertType}
                    />
                )}

                {/* Modals */}
                {/* <ZabbixServerForm
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateServer}
                    isLoading={isLoading}
                    title="Create New Zabbix Server"
                /> */}

                <ZabbixServerForm
                    isOpen={isEditModalOpen}
                    onClose={handleFormClose}
                    onSubmit={handleFormSubmit}
                    server={editingServer}
                    isLoading={editingServer == null ? false : true}
                    title="Edit Zabbix Server"
                />

                {/* <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    title={confirmDialog.title}
                    message={confirmDialog.message}
                    onConfirm={confirmDialog.onConfirm}
                    onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                    isLoading={isLoading}
                    type={confirmDialog.type}
                /> */}
            </div>
        </div>
    );
};

export default ZabbixServerPage;