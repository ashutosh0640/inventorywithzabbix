import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Filter, MoreVertical, CheckCircle, AlertCircle, 
  XCircle, Clock, AlertTriangle, Edit, Trash, Copy, Settings,
  X, Save, Upload, Download, Share, Tag, Monitor, Server
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { HostGroup } from '../../types';
import { apiService } from '../../services/api';

interface HostGroupFormData {
  name: string;
  description?: string;
  hosts: string[];
  subgroups: string[];
  permissions: string[];
}

export function HostGroups() {
  const { state } = useApp();
  const [hostGroups, setHostGroups] = useState<HostGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [isDemo, setIsDemo] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMassActionModal, setShowMassActionModal] = useState(false);
  const [showPropagateModal, setShowPropagateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<HostGroup | null>(null);
  const [massAction, setMassAction] = useState<'enable' | 'disable' | 'delete' | 'update' | 'clone' | 'merge'>('enable');
  const [formData, setFormData] = useState<HostGroupFormData>({
    name: '',
    hosts: [],
    subgroups: [],
    permissions: []
  });

  // Available options for dropdowns
  const availableHosts = ['web-server-01', 'db-server-01', 'mail-server-01', 'cache-server-01', 'load-balancer-01', 'storage-server-01', 'backup-server-01'];
  const availablePermissions = ['Read', 'Read-write', 'Deny'];
  const availableSubgroups = ['Linux servers', 'Windows servers', 'Network devices', 'Virtual machines', 'Containers'];

  useEffect(() => {
    if (state.currentServer) {
      fetchHostGroups();
    }
  }, [state.currentServer]);

  const fetchHostGroups = async () => {
    if (!state.currentServer) return;

    try {
      setLoading(true);
      const data = await apiService.getHostGroups(state.currentServer.id);
      setHostGroups(data);
      setIsDemo(false);
    } catch (error) {
      console.warn('API not available, using demo data:', error);
      setIsDemo(true);
      // Mock data for demonstration
      setHostGroups([
        {
          id: '1',
          name: 'Linux servers',
          description: 'All Linux-based servers',
          hosts: 15,
          subgroups: ['Web servers', 'Database servers'],
          permissions: ['Read-write'],
          serverId: state.currentServer.id
        },
        {
          id: '2',
          name: 'Web servers',
          description: 'Web application servers',
          hosts: 8,
          subgroups: [],
          permissions: ['Read'],
          serverId: state.currentServer.id
        },
        {
          id: '3',
          name: 'Database servers',
          description: 'Database management systems',
          hosts: 4,
          subgroups: [],
          permissions: ['Read-write'],
          serverId: state.currentServer.id
        },
        {
          id: '4',
          name: 'Mail servers',
          description: 'Email and messaging servers',
          hosts: 2,
          subgroups: [],
          permissions: ['Read'],
          serverId: state.currentServer.id
        },
        {
          id: '5',
          name: 'Network devices',
          description: 'Switches, routers, and network equipment',
          hosts: 12,
          subgroups: [],
          permissions: ['Read-write'],
          serverId: state.currentServer.id
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!state.currentServer) return;

    try {
      const newGroup = await apiService.createHostGroup(state.currentServer.id, {
        ...formData,
        serverId: state.currentServer.id
      });
      
      setHostGroups(prev => [...prev, newGroup]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create host group:', error);
      // For demo mode, simulate creation
      if (isDemo) {
        const newGroup: HostGroup = {
          id: Date.now().toString(),
          ...formData,
          hosts: formData.hosts.length,
          serverId: state.currentServer.id
        };
        setHostGroups(prev => [...prev, newGroup]);
        setShowCreateModal(false);
        resetForm();
      }
    }
  };

  const handleUpdateGroup = async () => {
    if (!state.currentServer || !editingGroup) return;

    try {
      const updatedGroup = await apiService.updateHostGroup(
        state.currentServer.id, 
        editingGroup.id, 
        formData
      );
      
      setHostGroups(prev => prev.map(group => 
        group.id === editingGroup.id ? { ...group, ...updatedGroup } : group
      ));
      setShowEditModal(false);
      setEditingGroup(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update host group:', error);
      // For demo mode, simulate update
      if (isDemo) {
        setHostGroups(prev => prev.map(group => 
          group.id === editingGroup.id ? { ...group, ...formData, hosts: formData.hosts.length } : group
        ));
        setShowEditModal(false);
        setEditingGroup(null);
        resetForm();
      }
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!state.currentServer) return;
    
    if (!confirm('Are you sure you want to delete this host group? This action cannot be undone.')) return;

    try {
      await apiService.deleteHostGroup(state.currentServer.id, groupId);
      setHostGroups(prev => prev.filter(group => group.id !== groupId));
    } catch (error) {
      console.error('Failed to delete host group:', error);
      // For demo mode, simulate deletion
      if (isDemo) {
        setHostGroups(prev => prev.filter(group => group.id !== groupId));
      }
    }
  };

  const handleMassAction = async () => {
    if (!state.currentServer || selectedGroups.length === 0) return;

    try {
      switch (massAction) {
        case 'delete':
          if (!confirm(`Are you sure you want to delete ${selectedGroups.length} host groups?`)) return;
          await apiService.massRemoveHostGroups(state.currentServer.id, selectedGroups);
          setHostGroups(prev => prev.filter(group => !selectedGroups.includes(group.id)));
          break;
        case 'update':
          await apiService.massUpdateHostGroups(state.currentServer.id, selectedGroups, formData);
          setHostGroups(prev => prev.map(group => 
            selectedGroups.includes(group.id) ? { ...group, ...formData, hosts: formData.hosts.length } : group
          ));
          break;
        case 'clone':
          const clonedGroups = hostGroups
            .filter(group => selectedGroups.includes(group.id))
            .map(group => ({
              ...group,
              id: `${group.id}-clone-${Date.now()}`,
              name: `${group.name}-clone`
            }));
          setHostGroups(prev => [...prev, ...clonedGroups]);
          break;
        case 'merge':
          // Merge selected groups into one
          const selectedGroupsData = hostGroups.filter(group => selectedGroups.includes(group.id));
          const mergedHosts = [...new Set(selectedGroupsData.flatMap(g => g.hosts || []))];
          const mergedGroup: HostGroup = {
            id: Date.now().toString(),
            name: formData.name || 'Merged Group',
            description: formData.description || 'Merged from multiple groups',
            hosts: Array.isArray(mergedHosts[0]) ? mergedHosts.length : mergedHosts.reduce((sum, count) => sum + (typeof count === 'number' ? count : 0), 0),
            subgroups: formData.subgroups,
            permissions: formData.permissions,
            serverId: state.currentServer.id
          };
          setHostGroups(prev => [...prev.filter(group => !selectedGroups.includes(group.id)), mergedGroup]);
          break;
      }
      
      setSelectedGroups([]);
      setShowMassActionModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to perform mass action:', error);
    }
  };

  const handlePropagateSettings = async () => {
    if (!state.currentServer || selectedGroups.length === 0) return;

    try {
      await apiService.propagateHostGroupSettings(state.currentServer.id, selectedGroups, formData);
      // Update UI to reflect propagated settings
      setHostGroups(prev => prev.map(group => 
        selectedGroups.includes(group.id) ? { ...group, permissions: formData.permissions } : group
      ));
      setShowPropagateModal(false);
      setSelectedGroups([]);
      resetForm();
    } catch (error) {
      console.error('Failed to propagate settings:', error);
      // For demo mode, simulate propagation
      if (isDemo) {
        setHostGroups(prev => prev.map(group => 
          selectedGroups.includes(group.id) ? { ...group, permissions: formData.permissions } : group
        ));
        setShowPropagateModal(false);
        setSelectedGroups([]);
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      hosts: [],
      subgroups: [],
      permissions: []
    });
  };

  const openEditModal = (group: HostGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      hosts: Array.isArray(group.hosts) ? group.hosts : [],
      subgroups: group.subgroups || [],
      permissions: group.permissions || []
    });
    setShowEditModal(true);
  };

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedGroups(prev => 
      prev.length === filteredGroups.length ? [] : filteredGroups.map(group => group.id)
    );
  };

  const getGroupSizeCategory = (hostCount: number) => {
    if (hostCount === 0) return 'empty';
    if (hostCount <= 5) return 'small';
    if (hostCount <= 15) return 'medium';
    return 'large';
  };

  const getGroupSizeColor = (hostCount: number) => {
    const category = getGroupSizeCategory(hostCount);
    switch (category) {
      case 'empty': return 'bg-gray-100 text-gray-800';
      case 'small': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-green-100 text-green-800';
      case 'large': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGroups = hostGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSize = sizeFilter === 'all' || getGroupSizeCategory(group.hosts) === sizeFilter;
    return matchesSearch && matchesSize;
  });

  if (!state.currentServer) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No server selected</h3>
          <p className="text-gray-600">Please select a Zabbix server to manage host groups</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Host Groups</h2>
          <p className="text-gray-600 mt-1">Organize and manage host collections</p>
        </div>
        <div className="flex gap-2">
          {selectedGroups.length > 0 && (
            <>
              <button
                onClick={() => setShowPropagateModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Share size={20} />
                Propagate ({selectedGroups.length})
              </button>
              <button
                onClick={() => setShowMassActionModal(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Settings size={20} />
                Mass Actions ({selectedGroups.length})
              </button>
            </>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Group
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
              placeholder="Search host groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Sizes</option>
              <option value="empty">Empty (0 hosts)</option>
              <option value="small">Small (1-5 hosts)</option>
              <option value="medium">Medium (6-15 hosts)</option>
              <option value="large">Large (16+ hosts)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Host Groups Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedGroups.length === filteredGroups.length && filteredGroups.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hosts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subgroups
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGroups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id)}
                      onChange={() => toggleGroupSelection(group.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="text-gray-400 mr-3" size={16} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{group.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {group.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGroupSizeColor(group.hosts)}`}>
                      {group.hosts} hosts
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {group.subgroups && group.subgroups.length > 0 ? (
                        <>
                          {group.subgroups.slice(0, 2).map((subgroup) => (
                            <span key={subgroup} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {subgroup}
                            </span>
                          ))}
                          {group.subgroups.length > 2 && (
                            <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              +{group.subgroups.length - 2} more
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">None</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {group.permissions && group.permissions.length > 0 ? (
                        group.permissions.map((permission) => (
                          <span key={permission} className={`inline-flex px-2 py-1 text-xs rounded ${
                            permission === 'Read-write' ? 'bg-green-100 text-green-800' :
                            permission === 'Read' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {permission}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">None</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(group)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit group"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete group"
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

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No host groups found</h3>
          <p className="text-gray-600">
            {searchTerm || sizeFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Add your first host group to organize your hosts'
            }
          </p>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Host Group</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Production servers"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Group description"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hosts</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.hosts.map((host) => (
                    <span key={host} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {host}
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, hosts: prev.hosts.filter(h => h !== host) }))}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value && !formData.hosts.includes(e.target.value)) {
                      setFormData(prev => ({ ...prev, hosts: [...prev.hosts, e.target.value] }));
                    }
                    e.target.value = '';
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select hosts...</option>
                  {availableHosts.filter(host => !formData.hosts.includes(host)).map((host) => (
                    <option key={host} value={host}>{host}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subgroups</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.subgroups.map((subgroup) => (
                    <span key={subgroup} className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      {subgroup}
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, subgroups: prev.subgroups.filter(s => s !== subgroup) }))}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value && !formData.subgroups.includes(e.target.value)) {
                      setFormData(prev => ({ ...prev, subgroups: [...prev.subgroups, e.target.value] }));
                    }
                    e.target.value = '';
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select subgroups...</option>
                  {availableSubgroups.filter(subgroup => !formData.subgroups.includes(subgroup)).map((subgroup) => (
                    <option key={subgroup} value={subgroup}>{subgroup}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.permissions.map((permission) => (
                    <span key={permission} className={`inline-flex items-center px-2 py-1 text-xs rounded ${
                      permission === 'Read-write' ? 'bg-green-100 text-green-800' :
                      permission === 'Read' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {permission}
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission) }))}
                        className="ml-1 hover:opacity-75"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value && !formData.permissions.includes(e.target.value)) {
                      setFormData(prev => ({ ...prev, permissions: [...prev.permissions, e.target.value] }));
                    }
                    e.target.value = '';
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select permissions...</option>
                  {availablePermissions.filter(permission => !formData.permissions.includes(permission)).map((permission) => (
                    <option key={permission} value={permission}>{permission}</option>
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
                onClick={handleCreateGroup}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save size={16} />
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {showEditModal && editingGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Host Group: {editingGroup.name}</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hosts</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.hosts.map((host) => (
                    <span key={host} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {host}
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, hosts: prev.hosts.filter(h => h !== host) }))}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value && !formData.hosts.includes(e.target.value)) {
                      setFormData(prev => ({ ...prev, hosts: [...prev.hosts, e.target.value] }));
                    }
                    e.target.value = '';
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Add hosts...</option>
                  {availableHosts.filter(host => !formData.hosts.includes(host)).map((host) => (
                    <option key={host} value={host}>{host}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subgroups</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.subgroups.map((subgroup) => (
                    <span key={subgroup} className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      {subgroup}
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, subgroups: prev.subgroups.filter(s => s !== subgroup) }))}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value && !formData.subgroups.includes(e.target.value)) {
                      setFormData(prev => ({ ...prev, subgroups: [...prev.subgroups, e.target.value] }));
                    }
                    e.target.value = '';
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Add subgroups...</option>
                  {availableSubgroups.filter(subgroup => !formData.subgroups.includes(subgroup)).map((subgroup) => (
                    <option key={subgroup} value={subgroup}>{subgroup}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.permissions.map((permission) => (
                    <span key={permission} className={`inline-flex items-center px-2 py-1 text-xs rounded ${
                      permission === 'Read-write' ? 'bg-green-100 text-green-800' :
                      permission === 'Read' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {permission}
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission) }))}
                        className="ml-1 hover:opacity-75"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value && !formData.permissions.includes(e.target.value)) {
                      setFormData(prev => ({ ...prev, permissions: [...prev.permissions, e.target.value] }));
                    }
                    e.target.value = '';
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Add permissions...</option>
                  {availablePermissions.filter(permission => !formData.permissions.includes(permission)).map((permission) => (
                    <option key={permission} value={permission}>{permission}</option>
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
                onClick={handleUpdateGroup}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save size={16} />
                Update Group
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
              <h3 className="text-lg font-semibold">Mass Actions ({selectedGroups.length} groups)</h3>
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
                  <option value="delete">Delete Groups</option>
                  <option value="update">Update Properties</option>
                  <option value="clone">Clone Groups</option>
                  <option value="merge">Merge Groups</option>
                </select>
              </div>

              {(massAction === 'update' || massAction === 'merge') && (
                <div className="space-y-3">
                  {massAction === 'merge' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Merged Group Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Merged Group"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.permissions.map((permission) => (
                        <span key={permission} className={`inline-flex items-center px-2 py-1 text-xs rounded ${
                          permission === 'Read-write' ? 'bg-green-100 text-green-800' :
                          permission === 'Read' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {permission}
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission) }))}
                            className="ml-1 hover:opacity-75"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <select
                      onChange={(e) => {
                        if (e.target.value && !formData.permissions.includes(e.target.value)) {
                          setFormData(prev => ({ ...prev, permissions: [...prev.permissions, e.target.value] }));
                        }
                        e.target.value = '';
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Add permissions...</option>
                      {availablePermissions.filter(permission => !formData.permissions.includes(permission)).map((permission) => (
                        <option key={permission} value={permission}>{permission}</option>
                      ))}
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

      {/* Propagate Settings Modal */}
      {showPropagateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Propagate Settings ({selectedGroups.length} groups)</h3>
              <button onClick={() => setShowPropagateModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Propagate permissions and settings to all selected host groups and their subgroups.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permissions to Propagate</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.permissions.map((permission) => (
                    <span key={permission} className={`inline-flex items-center px-2 py-1 text-xs rounded ${
                      permission === 'Read-write' ? 'bg-green-100 text-green-800' :
                      permission === 'Read' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {permission}
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission) }))}
                        className="ml-1 hover:opacity-75"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value && !formData.permissions.includes(e.target.value)) {
                      setFormData(prev => ({ ...prev, permissions: [...prev.permissions, e.target.value] }));
                    }
                    e.target.value = '';
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select permissions...</option>
                  {availablePermissions.filter(permission => !formData.permissions.includes(permission)).map((permission) => (
                    <option key={permission} value={permission}>{permission}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowPropagateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePropagateSettings}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Share size={16} />
                Propagate Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}