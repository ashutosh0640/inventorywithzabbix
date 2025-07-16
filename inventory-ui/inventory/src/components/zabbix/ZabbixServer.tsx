import React, { useState, useEffect } from 'react';
import { 
  Server, Plus, Search, Filter, MoreVertical, CheckCircle, AlertCircle, 
  XCircle, Clock, AlertTriangle, Edit, Trash, Copy, Settings, Eye, EyeOff,
  X, Save, Upload, Download, Share, Tag, Monitor, Users, Key, Globe,
  TestTube, RefreshCw, Wifi, WifiOff, Activity, Database, Shield
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ZabbixServer } from '../../types';
import { apiService } from '../../services/api';

interface ZabbixServerFormData {
  name: string;
  apiUrl: string;
  username: string;
  password: string;
  token?: string;
  projectId?: string;
}

export function ZabbixServers() {
  const { state } = useApp();
  const [servers, setServers] = useState<ZabbixServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDemo, setIsDemo] = useState(false);
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMassActionModal, setShowMassActionModal] = useState(false);
  const [showConnectionTestModal, setShowConnectionTestModal] = useState(false);
  const [editingServer, setEditingServer] = useState<ZabbixServer | null>(null);
  const [testingServer, setTestingServer] = useState<ZabbixServer | null>(null);
  const [massAction, setMassAction] = useState<'enable' | 'disable' | 'delete' | 'update' | 'test' | 'sync'>('enable');
  const [showPassword, setShowPassword] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<any>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [formData, setFormData] = useState<ZabbixServerFormData>({
    name: '',
    apiUrl: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getZabbixServers();
      setServers(data);
      setIsDemo(false);
    } catch (error) {
      console.warn('API not available, using demo data:', error);
      setIsDemo(true);
      // Mock data for demonstration
      setServers([
        {
          id: '1',
          name: 'Production Zabbix',
          url: 'https://zabbix-prod.example.com',
          username: 'admin',
          password: '***',
          version: '6.4.8',
          status: 'online',
          projectId: '1',
          lastSync: '2024-01-20T15:25:00Z'
        },
        {
          id: '2',
          name: 'Staging Zabbix',
          url: 'https://zabbix-staging.example.com',
          username: 'admin',
          password: '***',
          version: '6.4.8',
          status: 'online',
          projectId: '1',
          lastSync: '2024-01-20T14:30:00Z'
        },
        {
          id: '3',
          name: 'Development Zabbix',
          url: 'https://zabbix-dev.example.com',
          username: 'admin',
          password: '***',
          version: '6.4.7',
          status: 'maintenance',
          projectId: '2',
          lastSync: '2024-01-19T16:45:00Z'
        },
        {
          id: '4',
          name: 'Testing Zabbix',
          url: 'https://zabbix-test.example.com',
          username: 'admin',
          password: '***',
          version: '6.4.6',
          status: 'offline',
          projectId: '2',
          lastSync: '2024-01-18T10:20:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateServer = async () => {
    try {
      const newServer = await apiService.createZabbixServer({
        ...formData
      });
      
      setServers(prev => [...prev, newServer]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create Zabbix server:', error);
      // For demo mode, simulate creation
      if (isDemo) {
        const newServer: ZabbixServer = {
          id: Date.now().toString(),
          name: formData.name,
          url: formData.apiUrl,
          username: formData.username,
          password: formData.password,
          version: '6.4.8',
          status: 'offline',
          projectId: state.currentProject?.id || '1',
          lastSync: new Date().toISOString()
        };
        setServers(prev => [...prev, newServer]);
        setShowCreateModal(false);
        resetForm();
      }
    }
  };

  const handleUpdateServer = async () => {
    if (!editingServer) return;

    try {
      const updatedServer = await apiService.updateZabbixServer(
        editingServer.id, 
        formData
      );
      
      setServers(prev => prev.map(server => 
        server.id === editingServer.id ? { ...server, ...updatedServer } : server
      ));
      setShowEditModal(false);
      setEditingServer(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update Zabbix server:', error);
      // For demo mode, simulate update
      if (isDemo) {
        setServers(prev => prev.map(server => 
          server.id === editingServer.id ? { 
            ...server, 
            name: formData.name,
            url: formData.apiUrl,
            username: formData.username,
            password: formData.password
          } : server
        ));
        setShowEditModal(false);
        setEditingServer(null);
        resetForm();
      }
    }
  };

  const handleDeleteServer = async (serverId: string) => {
    if (!confirm('Are you sure you want to delete this Zabbix server? This action cannot be undone.')) return;

    try {
      await apiService.deleteZabbixServer(serverId);
      setServers(prev => prev.filter(server => server.id !== serverId));
    } catch (error) {
      console.error('Failed to delete Zabbix server:', error);
      // For demo mode, simulate deletion
      if (isDemo) {
        setServers(prev => prev.filter(server => server.id !== serverId));
      }
    }
  };

  const handleTestConnection = async (server: ZabbixServer) => {
    setTestingServer(server);
    setTestingConnection(true);
    setConnectionTestResult(null);
    setShowConnectionTestModal(true);

    try {
      const result = await apiService.testZabbixConnection(server.id);
      setConnectionTestResult(result);
    } catch (error) {
      console.error('Failed to test connection:', error);
      // For demo mode, simulate test result
      if (isDemo) {
        setTimeout(() => {
          setConnectionTestResult({
            success: Math.random() > 0.3, // 70% success rate for demo
            version: server.version,
            responseTime: Math.floor(Math.random() * 500) + 100,
            message: Math.random() > 0.3 ? 'Connection successful' : 'Connection failed: Authentication error',
            timestamp: new Date().toISOString()
          });
        }, 2000);
      }
    } finally {
      setTestingConnection(false);
    }
  };

  const handleMassAction = async () => {
    if (selectedServers.length === 0) return;

    try {
      switch (massAction) {
        case 'delete':
          if (!confirm(`Are you sure you want to delete ${selectedServers.length} Zabbix servers?`)) return;
          for (const serverId of selectedServers) {
            await apiService.deleteZabbixServer(serverId);
          }
          setServers(prev => prev.filter(server => !selectedServers.includes(server.id)));
          break;
        case 'test':
          // Test connections for all selected servers
          for (const serverId of selectedServers) {
            const server = servers.find(s => s.id === serverId);
            if (server) {
              await apiService.testZabbixConnection(serverId);
            }
          }
          break;
        case 'sync':
          // Sync all selected servers
          setServers(prev => prev.map(server => 
            selectedServers.includes(server.id) ? { ...server, lastSync: new Date().toISOString() } : server
          ));
          break;
        case 'update':
          // Mass update with form data
          setServers(prev => prev.map(server => 
            selectedServers.includes(server.id) ? { ...server, ...formData } : server
          ));
          break;
      }
      
      setSelectedServers([]);
      setShowMassActionModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to perform mass action:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      apiUrl: '',
      username: '',
      password: ''
    });
    setShowPassword(false);
  };

  const openEditModal = (server: ZabbixServer) => {
    setEditingServer(server);
    setFormData({
      name: server.name,
      apiUrl: server.url,
      username: server.username,
      password: server.password
    });
    setShowEditModal(true);
  };

  const toggleServerSelection = (serverId: string) => {
    setSelectedServers(prev => 
      prev.includes(serverId) 
        ? prev.filter(id => id !== serverId)
        : [...prev, serverId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedServers(prev => 
      prev.length === filteredServers.length ? [] : filteredServers.map(server => server.id)
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'offline':
        return <XCircle className="text-red-500" size={16} />;
      case 'maintenance':
        return <Clock className="text-yellow-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastSync = (lastSync: string) => {
    const date = new Date(lastSync);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const filteredServers = servers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         server.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || server.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800 text-sm">
              API server not available - showing demo data. Connect your backend at http://localhost:8080 for live data.
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Zabbix Servers</h2>
          <p className="text-gray-600 mt-1">Manage and monitor your Zabbix server connections</p>
        </div>
        <div className="flex gap-2">
          {selectedServers.length > 0 && (
            <button
              onClick={() => setShowMassActionModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Settings size={20} />
              Mass Actions ({selectedServers.length})
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Server
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { 
            label: 'Total Servers', 
            value: servers.length, 
            color: 'bg-blue-100 text-blue-800',
            icon: Server 
          },
          { 
            label: 'Online', 
            value: servers.filter(s => s.status === 'online').length, 
            color: 'bg-green-100 text-green-800',
            icon: Wifi 
          },
          { 
            label: 'Offline', 
            value: servers.filter(s => s.status === 'offline').length, 
            color: 'bg-red-100 text-red-800',
            icon: WifiOff 
          },
          { 
            label: 'Maintenance', 
            value: servers.filter(s => s.status === 'maintenance').length, 
            color: 'bg-yellow-100 text-yellow-800',
            icon: Settings 
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search servers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Servers Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedServers.length === filteredServers.length && filteredServers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Server
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Sync
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServers.map((server) => (
                <tr key={server.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedServers.includes(server.id)}
                      onChange={() => toggleServerSelection(server.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Server className="text-gray-400 mr-3" size={16} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{server.name}</div>
                        <div className="text-xs text-gray-500">ID: {server.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(server.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(server.status)}`}>
                        {server.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-900 truncate max-w-xs">{server.url}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                      <Database size={12} className="mr-1" />
                      {server.version}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <RefreshCw size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{formatLastSync(server.lastSync)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTestConnection(server)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Test connection"
                      >
                        <TestTube size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(server)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit server"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteServer(server.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete server"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredServers.length === 0 && (
        <div className="text-center py-12">
          <Server className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Zabbix servers found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Add your first Zabbix server to start monitoring'
            }
          </p>
        </div>
      )}

      {/* Create Server Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Zabbix Server</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Server Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Production Zabbix"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API URL</label>
                  <input
                    type="url"
                    value={formData.apiUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiUrl: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://zabbix.example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="admin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Token (Optional)</label>
                <input
                  type="text"
                  value={formData.token || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, token: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="API token for authentication"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use username/password authentication</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateServer}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save size={16} />
                Create Server
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Server Modal */}
      {showEditModal && editingServer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Zabbix Server: {editingServer.name}</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Server Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API URL</label>
                  <input
                    type="url"
                    value={formData.apiUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiUrl: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Token (Optional)</label>
                <input
                  type="text"
                  value={formData.token || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, token: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="API token for authentication"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateServer}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save size={16} />
                Update Server
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mass Action Modal */}
      {showMassActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Mass Actions ({selectedServers.length} servers)</h3>
              <button onClick={() => setShowMassActionModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <select
                  value={massAction}
                  onChange={(e) => setMassAction(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="test">Test Connections</option>
                  <option value="sync">Sync Servers</option>
                  <option value="delete">Delete Servers</option>
                  <option value="update">Update Properties</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowMassActionModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMassAction}
                className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 ${
                  massAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Settings size={16} />
                Apply Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Test Modal */}
      {showConnectionTestModal && testingServer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Connection Test: {testingServer.name}</h3>
              <button onClick={() => setShowConnectionTestModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {testingConnection ? (
                <div className="text-center py-8">
                  <RefreshCw className="mx-auto h-8 w-8 text-blue-600 animate-spin mb-4" />
                  <p className="text-gray-600">Testing connection to {testingServer.url}...</p>
                </div>
              ) : connectionTestResult ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    connectionTestResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {connectionTestResult.success ? (
                        <CheckCircle className="text-green-600" size={20} />
                      ) : (
                        <XCircle className="text-red-600" size={20} />
                      )}
                      <span className={`font-medium ${
                        connectionTestResult.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {connectionTestResult.success ? 'Connection Successful' : 'Connection Failed'}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      connectionTestResult.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {connectionTestResult.message}
                    </p>
                  </div>
                  
                  {connectionTestResult.success && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Version:</span>
                        <span className="ml-2 font-medium">{connectionTestResult.version}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Response Time:</span>
                        <span className="ml-2 font-medium">{connectionTestResult.responseTime}ms</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowConnectionTestModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              {!testingConnection && (
                <button
                  onClick={() => handleTestConnection(testingServer)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <TestTube size={16} />
                  Test Again
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}