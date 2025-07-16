import React, { useState, useEffect } from 'react';
import { 
  Monitor, Plus, Search, Filter, MoreVertical, CheckCircle, AlertCircle, 
  XCircle, Clock, AlertTriangle, Edit, Trash, Copy, Power, PowerOff,
  X, Save, Upload, Download, Settings, Users, Tag
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Host } from '../../types';
import { apiService } from '../../services/api';

interface HostFormData {
  name: string;
  ip: string;
  groups: string[];
  templates: string[];
  status: 'enabled' | 'disabled' | 'monitored' | 'not_monitored';
  description?: string;
  port?: string;
  proxy?: string;
}

export function Hosts() {
  const { state } = useApp();
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDemo, setIsDemo] = useState(false);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMassActionModal, setShowMassActionModal] = useState(false);
  const [editingHost, setEditingHost] = useState<Host | null>(null);
  const [massAction, setMassAction] = useState<'enable' | 'disable' | 'delete' | 'update' | 'clone'>('enable');
  const [formData, setFormData] = useState<HostFormData>({
    name: '',
    ip: '',
    groups: [],
    templates: [],
    status: 'enabled'
  });

  // Available options for dropdowns
  const availableGroups = ['Web servers', 'Database servers', 'Linux servers', 'Windows servers', 'Mail servers', 'Cache servers', 'Load balancers'];
  const availableTemplates = ['Template OS Linux', 'Template OS Windows', 'Template App Apache', 'Template DB MySQL', 'Template App Nginx', 'Template App Redis'];

  useEffect(() => {
    if (state.currentServer) {
      fetchHosts();
    }
  }, [state.currentServer]);

  const fetchHosts = async () => {
    if (!state.currentServer) return;

    try {
      setLoading(true);
      const data = await apiService.getHosts(state.currentServer.id);
      setHosts(data);
      setIsDemo(false);
    } catch (error) {
      console.warn('API not available, using demo data:', error);
      setIsDemo(true);
      // This will be handled by the API service fallback
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHost = async () => {
    if (!state.currentServer) return;

    try {
      const newHost = await apiService.createHost(state.currentServer.id, {
        ...formData,
        serverId: state.currentServer.id
      });
      
      // Add to local state if API call succeeds
      setHosts(prev => [...prev, newHost]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create host:', error);
      // For demo mode, simulate creation
      if (isDemo) {
        const newHost: Host = {
          id: Date.now().toString(),
          ...formData,
          problems: 0,
          serverId: state.currentServer.id
        };
        setHosts(prev => [...prev, newHost]);
        setShowCreateModal(false);
        resetForm();
      }
    }
  };

  const handleUpdateHost = async () => {
    if (!state.currentServer || !editingHost) return;

    try {
      const updatedHost = await apiService.updateHost(
        state.currentServer.id, 
        editingHost.id, 
        formData
      );
      
      setHosts(prev => prev.map(host => 
        host.id === editingHost.id ? { ...host, ...updatedHost } : host
      ));
      setShowEditModal(false);
      setEditingHost(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update host:', error);
      // For demo mode, simulate update
      if (isDemo) {
        setHosts(prev => prev.map(host => 
          host.id === editingHost.id ? { ...host, ...formData } : host
        ));
        setShowEditModal(false);
        setEditingHost(null);
        resetForm();
      }
    }
  };

  const handleDeleteHost = async (hostId: string) => {
    if (!state.currentServer) return;
    
    if (!confirm('Are you sure you want to delete this host?')) return;

    try {
      await apiService.deleteHost(state.currentServer.id, hostId);
      setHosts(prev => prev.filter(host => host.id !== hostId));
    } catch (error) {
      console.error('Failed to delete host:', error);
      // For demo mode, simulate deletion
      if (isDemo) {
        setHosts(prev => prev.filter(host => host.id !== hostId));
      }
    }
  };

  const handleMassAction = async () => {
    if (!state.currentServer || selectedHosts.length === 0) return;

    try {
      switch (massAction) {
        case 'enable':
          // API call for mass enable
          setHosts(prev => prev.map(host => 
            selectedHosts.includes(host.id) ? { ...host, status: 'enabled' as const } : host
          ));
          break;
        case 'disable':
          // API call for mass disable
          setHosts(prev => prev.map(host => 
            selectedHosts.includes(host.id) ? { ...host, status: 'disabled' as const } : host
          ));
          break;
        case 'delete':
          if (!confirm(`Are you sure you want to delete ${selectedHosts.length} hosts?`)) return;
          setHosts(prev => prev.filter(host => !selectedHosts.includes(host.id)));
          break;
        case 'update':
          // Mass update with form data
          setHosts(prev => prev.map(host => 
            selectedHosts.includes(host.id) ? { ...host, ...formData } : host
          ));
          break;
        case 'clone':
          // Clone selected hosts
          const clonedHosts = hosts
            .filter(host => selectedHosts.includes(host.id))
            .map(host => ({
              ...host,
              id: `${host.id}-clone-${Date.now()}`,
              name: `${host.name}-clone`
            }));
          setHosts(prev => [...prev, ...clonedHosts]);
          break;
      }
      
      setSelectedHosts([]);
      setShowMassActionModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to perform mass action:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      ip: '',
      groups: [],
      templates: [],
      status: 'enabled'
    });
  };

  const openEditModal = (host: Host) => {
    setEditingHost(host);
    setFormData({
      name: host.name,
      ip: host.ip,
      groups: host.groups,
      templates: host.templates,
      status: host.status
    });
    setShowEditModal(true);
  };

  const toggleHostSelection = (hostId: string) => {
    setSelectedHosts(prev => 
      prev.includes(hostId) 
        ? prev.filter(id => id !== hostId)
        : [...prev, hostId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedHosts(prev => 
      prev.length === filteredHosts.length ? [] : filteredHosts.map(host => host.id)
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'monitored':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'not_monitored':
        return <XCircle className="text-red-500" size={16} />;
      case 'enabled':
        return <CheckCircle className="text-blue-500" size={16} />;
      case 'disabled':
        return <XCircle className="text-gray-500" size={16} />;
      default:
        return <Clock className="text-yellow-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'monitored':
        return 'bg-green-100 text-green-800';
      case 'not_monitored':
        return 'bg-red-100 text-red-800';
      case 'enabled':
        return 'bg-blue-100 text-blue-800';
      case 'disabled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredHosts = hosts.filter(host => {
    const matchesSearch = host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         host.ip.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || host.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!state.currentServer) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Monitor className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No server selected</h3>
          <p className="text-gray-600">Please select a Zabbix server to manage hosts</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <h2 className="text-2xl font-bold text-gray-900">Hosts</h2>
          <p className="text-gray-600 mt-1">Manage monitored hosts and their configurations</p>
        </div>
        <div className="flex gap-2">
          {selectedHosts.length > 0 && (
            <button
              onClick={() => setShowMassActionModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Settings size={20} />
              Mass Actions ({selectedHosts.length})
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Host
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search hosts..."
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
              <option value="monitored">Monitored</option>
              <option value="not_monitored">Not Monitored</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hosts Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedHosts.length === filteredHosts.length && filteredHosts.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Host
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Groups
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Templates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Problems
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHosts.map((host) => (
                <tr key={host.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedHosts.includes(host.id)}
                      onChange={() => toggleHostSelection(host.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Monitor className="text-gray-400 mr-3" size={16} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{host.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(host.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(host.status)}`}>
                        {host.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {host.ip}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {host.groups.slice(0, 2).map((group) => (
                        <span key={group} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {group}
                        </span>
                      ))}
                      {host.groups.length > 2 && (
                        <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{host.groups.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {host.templates.slice(0, 2).map((template) => (
                        <span key={template} className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          {template}
                        </span>
                      ))}
                      {host.templates.length > 2 && (
                        <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{host.templates.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {host.problems > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                        <AlertCircle size={12} className="mr-1" />
                        {host.problems}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                        <CheckCircle size={12} className="mr-1" />
                        0
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(host)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit host"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteHost(host.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete host"
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

      {filteredHosts.length === 0 && (
        <div className="text-center py-12">
          <Monitor className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hosts found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Add your first host to start monitoring'
            }
          </p>
        </div>
      )}

      {/* Create Host Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Host</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Host Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="web-server-01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                  <input
                    type="text"
                    value={formData.ip}
                    onChange={(e) => setFormData(prev => ({ ...prev, ip: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="192.168.1.10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                  <option value="monitored">Monitored</option>
                  <option value="not_monitored">Not Monitored</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Host Groups</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.groups.map((group) => (
                    <span key={group} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {group}
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, groups: prev.groups.filter(g => g !== group) }))}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value && !formData.groups.includes(e.target.value)) {
                      setFormData(prev => ({ ...prev, groups: [...prev.groups, e.target.value] }));
                    }
                    e.target.value = '';
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select host groups...</option>
                  {availableGroups.filter(group => !formData.groups.includes(group)).map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Templates</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.templates.map((template) => (
                    <span key={template} className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      {template}
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, templates: prev.templates.filter(t => t !== template) }))}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value && !formData.templates.includes(e.target.value)) {
                      setFormData(prev => ({ ...prev, templates: [...prev.templates, e.target.value] }));
                    }
                    e.target.value = '';
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select templates...</option>
                  {availableTemplates.filter(template => !formData.templates.includes(template)).map((template) => (
                    <option key={template} value={template}>{template}</option>
                  ))}
                </select>
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
                onClick={handleCreateHost}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save size={16} />
                Create Host
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Host Modal */}
      {showEditModal && editingHost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Host: {editingHost.name}</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Host Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                  <input
                    type="text"
                    value={formData.ip}
                    onChange={(e) => setFormData(prev => ({ ...prev, ip: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                  <option value="monitored">Monitored</option>
                  <option value="not_monitored">Not Monitored</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Host Groups</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.groups.map((group) => (
                    <span key={group} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {group}
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, groups: prev.groups.filter(g => g !== group) }))}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value && !formData.groups.includes(e.target.value)) {
                      setFormData(prev => ({ ...prev, groups: [...prev.groups, e.target.value] }));
                    }
                    e.target.value = '';
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Add host groups...</option>
                  {availableGroups.filter(group => !formData.groups.includes(group)).map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Templates</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.templates.map((template) => (
                    <span key={template} className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      {template}
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, templates: prev.templates.filter(t => t !== template) }))}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value && !formData.templates.includes(e.target.value)) {
                      setFormData(prev => ({ ...prev, templates: [...prev.templates, e.target.value] }));
                    }
                    e.target.value = '';
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Add templates...</option>
                  {availableTemplates.filter(template => !formData.templates.includes(template)).map((template) => (
                    <option key={template} value={template}>{template}</option>
                  ))}
                </select>
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
                onClick={handleUpdateHost}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save size={16} />
                Update Host
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
              <h3 className="text-lg font-semibold">Mass Actions ({selectedHosts.length} hosts)</h3>
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
                  <option value="enable">Enable Hosts</option>
                  <option value="disable">Disable Hosts</option>
                  <option value="delete">Delete Hosts</option>
                  <option value="update">Update Properties</option>
                  <option value="clone">Clone Hosts</option>
                </select>
              </div>

              {massAction === 'update' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="enabled">Enabled</option>
                      <option value="disabled">Disabled</option>
                      <option value="monitored">Monitored</option>
                      <option value="not_monitored">Not Monitored</option>
                    </select>
                  </div>
                </div>
              )}
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
    </div>
  );
}