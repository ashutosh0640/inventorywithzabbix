import React, { useState, useEffect } from 'react';
import { 
  BookTemplate as Template, Plus, Search, Filter, MoreVertical, CheckCircle, AlertCircle, 
  XCircle, Clock, AlertTriangle, Edit, Trash, Copy, Settings,
  X, Save, Upload, Download, Share, Tag, Monitor, Server, Zap, Database, BarChart3
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Template as TemplateType } from '../../types';
import { apiService } from '../../services/api';

interface TemplateFormData {
  name: string;
  description: string;
  groups: string[];
  hosts: string[];
  macros: { name: string; value: string }[];
  items: number;
  triggers: number;
  graphs: number;
  discoveryRules: number;
  webScenarios: number;
}

export function Templates() {
  const { state } = useApp();
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [isDemo, setIsDemo] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMassActionModal, setShowMassActionModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateType | null>(null);
  const [massAction, setMassAction] = useState<'enable' | 'disable' | 'delete' | 'update' | 'clone' | 'export'>('enable');
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    description: '',
    groups: [],
    hosts: [],
    macros: [],
    items: 0,
    triggers: 0,
    graphs: 0,
    discoveryRules: 0,
    webScenarios: 0
  });

  // Available options for dropdowns
  const availableGroups = ['Templates/Operating systems', 'Templates/Applications', 'Templates/Databases', 'Templates/Network devices', 'Templates/Virtualization', 'Templates/Cloud'];
  const availableHosts = ['web-server-01', 'db-server-01', 'mail-server-01', 'cache-server-01', 'load-balancer-01', 'storage-server-01'];

  useEffect(() => {
    if (state.currentServer) {
      fetchTemplates();
    }
  }, [state.currentServer]);

  const fetchTemplates = async () => {
    if (!state.currentServer) return;

    try {
      setLoading(true);
      const data = await apiService.getTemplates(state.currentServer.id);
      setTemplates(data);
      setIsDemo(false);
    } catch (error) {
      console.warn('API not available, using demo data:', error);
      setIsDemo(true);
      // Mock data for demonstration
      setTemplates([
        {
          id: '1',
          name: 'Template OS Linux',
          description: 'Linux operating system monitoring template',
          groups: ['Templates/Operating systems'],
          items: 45,
          triggers: 12,
          graphs: 8,
          discoveryRules: 3,
          webScenarios: 0,
          hosts: ['web-server-01', 'db-server-01'],
          macros: [
            { name: '{$AGENT.TIMEOUT}', value: '3m' },
            { name: '{$LOAD_AVG_PER_CPU.MAX.WARN}', value: '1.5' }
          ],
          serverId: state.currentServer.id
        },
        {
          id: '2',
          name: 'Template App Apache',
          description: 'Apache web server monitoring template',
          groups: ['Templates/Applications'],
          items: 23,
          triggers: 8,
          graphs: 5,
          discoveryRules: 1,
          webScenarios: 2,
          hosts: ['web-server-01'],
          macros: [
            { name: '{$APACHE.STATUS.HOST}', value: 'localhost' },
            { name: '{$APACHE.STATUS.PORT}', value: '80' }
          ],
          serverId: state.currentServer.id
        },
        {
          id: '3',
          name: 'Template DB MySQL',
          description: 'MySQL database monitoring template',
          groups: ['Templates/Databases'],
          items: 34,
          triggers: 15,
          graphs: 12,
          discoveryRules: 2,
          webScenarios: 0,
          hosts: ['db-server-01'],
          macros: [
            { name: '{$MYSQL.HOST}', value: 'localhost' },
            { name: '{$MYSQL.PORT}', value: '3306' }
          ],
          serverId: state.currentServer.id
        },
        {
          id: '4',
          name: 'Template App Nginx',
          description: 'Nginx web server monitoring template',
          groups: ['Templates/Applications'],
          items: 18,
          triggers: 6,
          graphs: 4,
          discoveryRules: 1,
          webScenarios: 1,
          hosts: ['load-balancer-01'],
          macros: [
            { name: '{$NGINX.STUB_STATUS.HOST}', value: 'localhost' },
            { name: '{$NGINX.STUB_STATUS.PORT}', value: '80' }
          ],
          serverId: state.currentServer.id
        },
        {
          id: '5',
          name: 'Template App Redis',
          description: 'Redis cache monitoring template',
          groups: ['Templates/Applications'],
          items: 28,
          triggers: 10,
          graphs: 7,
          discoveryRules: 1,
          webScenarios: 0,
          hosts: ['cache-server-01'],
          macros: [
            { name: '{$REDIS.CONN.URI}', value: 'tcp://localhost:6379' },
            { name: '{$REDIS.PASSWORD}', value: '' }
          ],
          serverId: state.currentServer.id
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!state.currentServer) return;

    try {
      const newTemplate = await apiService.createTemplate(state.currentServer.id, {
        ...formData,
        serverId: state.currentServer.id
      });
      
      setTemplates(prev => [...prev, newTemplate]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create template:', error);
      // For demo mode, simulate creation
      if (isDemo) {
        const newTemplate: TemplateType = {
          id: Date.now().toString(),
          ...formData,
          serverId: state.currentServer.id
        };
        setTemplates(prev => [...prev, newTemplate]);
        setShowCreateModal(false);
        resetForm();
      }
    }
  };

  const handleUpdateTemplate = async () => {
    if (!state.currentServer || !editingTemplate) return;

    try {
      const updatedTemplate = await apiService.updateTemplate(
        state.currentServer.id, 
        editingTemplate.id, 
        formData
      );
      
      setTemplates(prev => prev.map(template => 
        template.id === editingTemplate.id ? { ...template, ...updatedTemplate } : template
      ));
      setShowEditModal(false);
      setEditingTemplate(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update template:', error);
      // For demo mode, simulate update
      if (isDemo) {
        setTemplates(prev => prev.map(template => 
          template.id === editingTemplate.id ? { ...template, ...formData } : template
        ));
        setShowEditModal(false);
        setEditingTemplate(null);
        resetForm();
      }
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!state.currentServer) return;
    
    if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) return;

    try {
      await apiService.deleteTemplate(state.currentServer.id, templateId);
      setTemplates(prev => prev.filter(template => template.id !== templateId));
    } catch (error) {
      console.error('Failed to delete template:', error);
      // For demo mode, simulate deletion
      if (isDemo) {
        setTemplates(prev => prev.filter(template => template.id !== templateId));
      }
    }
  };

  const handleMassAction = async () => {
    if (!state.currentServer || selectedTemplates.length === 0) return;

    try {
      switch (massAction) {
        case 'delete':
          if (!confirm(`Are you sure you want to delete ${selectedTemplates.length} templates?`)) return;
          await apiService.massRemoveTemplates(state.currentServer.id, selectedTemplates);
          setTemplates(prev => prev.filter(template => !selectedTemplates.includes(template.id)));
          break;
        case 'update':
          await apiService.massUpdateTemplates(state.currentServer.id, selectedTemplates, formData);
          setTemplates(prev => prev.map(template => 
            selectedTemplates.includes(template.id) ? { ...template, ...formData } : template
          ));
          break;
        case 'clone':
          const clonedTemplates = templates
            .filter(template => selectedTemplates.includes(template.id))
            .map(template => ({
              ...template,
              id: `${template.id}-clone-${Date.now()}`,
              name: `${template.name} - Copy`
            }));
          setTemplates(prev => [...prev, ...clonedTemplates]);
          break;
        case 'export':
          // Simulate export functionality
          const exportData = templates.filter(template => selectedTemplates.includes(template.id));
          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `templates-export-${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
          break;
      }
      
      setSelectedTemplates([]);
      setShowMassActionModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to perform mass action:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      groups: [],
      hosts: [],
      macros: [],
      items: 0,
      triggers: 0,
      graphs: 0,
      discoveryRules: 0,
      webScenarios: 0
    });
  };

  const openEditModal = (template: TemplateType) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      groups: template.groups,
      hosts: template.hosts || [],
      macros: template.macros || [],
      items: template.items,
      triggers: template.triggers,
      graphs: template.graphs || 0,
      discoveryRules: template.discoveryRules || 0,
      webScenarios: template.webScenarios || 0
    });
    setShowEditModal(true);
  };

  const toggleTemplateSelection = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedTemplates(prev => 
      prev.length === filteredTemplates.length ? [] : filteredTemplates.map(template => template.id)
    );
  };

  const getComplexityColor = (items: number, triggers: number) => {
    const complexity = items + triggers;
    if (complexity < 20) return 'bg-green-100 text-green-800';
    if (complexity < 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getComplexityLabel = (items: number, triggers: number) => {
    const complexity = items + triggers;
    if (complexity < 20) return 'Simple';
    if (complexity < 50) return 'Medium';
    return 'Complex';
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = groupFilter === 'all' || template.groups.some(group => group.includes(groupFilter));
    return matchesSearch && matchesGroup;
  });

  if (!state.currentServer) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Template className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No server selected</h3>
          <p className="text-gray-600">Please select a Zabbix server to manage templates</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Templates</h2>
          <p className="text-gray-600 mt-1">Manage monitoring templates and configurations</p>
        </div>
        <div className="flex gap-2">
          {selectedTemplates.length > 0 && (
            <button
              onClick={() => setShowMassActionModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Settings size={20} />
              Mass Actions ({selectedTemplates.length})
            </button>
          )}
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Upload size={20} />
            Import
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Template
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
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Groups</option>
              <option value="Operating systems">Operating Systems</option>
              <option value="Applications">Applications</option>
              <option value="Databases">Databases</option>
              <option value="Network devices">Network Devices</option>
              <option value="Virtualization">Virtualization</option>
              <option value="Cloud">Cloud</option>
            </select>
          </div>
        </div>
      </div>

      {/* Templates Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTemplates.length === filteredTemplates.length && filteredTemplates.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Groups
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Triggers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Graphs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Linked Hosts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complexity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedTemplates.includes(template.id)}
                      onChange={() => toggleTemplateSelection(template.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Template className="text-gray-400 mr-3" size={16} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{template.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {template.groups.slice(0, 2).map((group) => (
                        <span key={group} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {group.split('/').pop()}
                        </span>
                      ))}
                      {template.groups.length > 2 && (
                        <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{template.groups.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Database size={14} className="mr-1 text-gray-400" />
                      {template.items}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Zap size={14} className="mr-1 text-gray-400" />
                      {template.triggers}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <BarChart3 size={14} className="mr-1 text-gray-400" />
                      {template.graphs || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {template.hosts && template.hosts.length > 0 ? (
                        <>
                          {template.hosts.slice(0, 2).map((host) => (
                            <span key={host} className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                              {host}
                            </span>
                          ))}
                          {template.hosts.length > 2 && (
                            <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              +{template.hosts.length - 2} more
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">No hosts</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getComplexityColor(template.items, template.triggers)}`}>
                      {getComplexityLabel(template.items, template.triggers)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(template)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit template"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${template.name}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="Export template"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete template"
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

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Template className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">
            {searchTerm || groupFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Add your first template to start monitoring'
            }
          </p>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Template</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Template App Custom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Custom application monitoring template"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Groups</label>
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
                  <option value="">Select template groups...</option>
                  {availableGroups.filter(group => !formData.groups.includes(group)).map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Linked Hosts</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.hosts.map((host) => (
                    <span key={host} className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      {host}
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, hosts: prev.hosts.filter(h => h !== host) }))}
                        className="ml-1 text-green-600 hover:text-green-800"
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
                  <option value="">Link to hosts...</option>
                  {availableHosts.filter(host => !formData.hosts.includes(host)).map((host) => (
                    <option key={host} value={host}>{host}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Items Count</label>
                  <input
                    type="number"
                    value={formData.items}
                    onChange={(e) => setFormData(prev => ({ ...prev, items: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Triggers Count</label>
                  <input
                    type="number"
                    value={formData.triggers}
                    onChange={(e) => setFormData(prev => ({ ...prev, triggers: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graphs</label>
                  <input
                    type="number"
                    value={formData.graphs}
                    onChange={(e) => setFormData(prev => ({ ...prev, graphs: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discovery Rules</label>
                  <input
                    type="number"
                    value={formData.discoveryRules}
                    onChange={(e) => setFormData(prev => ({ ...prev, discoveryRules: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Web Scenarios</label>
                  <input
                    type="number"
                    value={formData.webScenarios}
                    onChange={(e) => setFormData(prev => ({ ...prev, webScenarios: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Macros</label>
                <div className="space-y-2">
                  {formData.macros.map((macro, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={macro.name}
                        onChange={(e) => {
                          const newMacros = [...formData.macros];
                          newMacros[index].name = e.target.value;
                          setFormData(prev => ({ ...prev, macros: newMacros }));
                        }}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Macro name (e.g., {$TIMEOUT})"
                      />
                      <input
                        type="text"
                        value={macro.value}
                        onChange={(e) => {
                          const newMacros = [...formData.macros];
                          newMacros[index].value = e.target.value;
                          setFormData(prev => ({ ...prev, macros: newMacros }));
                        }}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Macro value"
                      />
                      <button
                        onClick={() => {
                          const newMacros = formData.macros.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, macros: newMacros }));
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, macros: [...prev.macros, { name: '', value: '' }] }))}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add Macro
                  </button>
                </div>
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
                onClick={handleCreateTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save size={16} />
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditModal && editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Template: {editingTemplate.name}</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
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
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Groups</label>
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
                  <option value="">Add template groups...</option>
                  {availableGroups.filter(group => !formData.groups.includes(group)).map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Linked Hosts</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.hosts.map((host) => (
                    <span key={host} className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      {host}
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, hosts: prev.hosts.filter(h => h !== host) }))}
                        className="ml-1 text-green-600 hover:text-green-800"
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
                  <option value="">Link to hosts...</option>
                  {availableHosts.filter(host => !formData.hosts.includes(host)).map((host) => (
                    <option key={host} value={host}>{host}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Items Count</label>
                  <input
                    type="number"
                    value={formData.items}
                    onChange={(e) => setFormData(prev => ({ ...prev, items: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Triggers Count</label>
                  <input
                    type="number"
                    value={formData.triggers}
                    onChange={(e) => setFormData(prev => ({ ...prev, triggers: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graphs</label>
                  <input
                    type="number"
                    value={formData.graphs}
                    onChange={(e) => setFormData(prev => ({ ...prev, graphs: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discovery Rules</label>
                  <input
                    type="number"
                    value={formData.discoveryRules}
                    onChange={(e) => setFormData(prev => ({ ...prev, discoveryRules: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Web Scenarios</label>
                  <input
                    type="number"
                    value={formData.webScenarios}
                    onChange={(e) => setFormData(prev => ({ ...prev, webScenarios: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Macros</label>
                <div className="space-y-2">
                  {formData.macros.map((macro, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={macro.name}
                        onChange={(e) => {
                          const newMacros = [...formData.macros];
                          newMacros[index].name = e.target.value;
                          setFormData(prev => ({ ...prev, macros: newMacros }));
                        }}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Macro name"
                      />
                      <input
                        type="text"
                        value={macro.value}
                        onChange={(e) => {
                          const newMacros = [...formData.macros];
                          newMacros[index].value = e.target.value;
                          setFormData(prev => ({ ...prev, macros: newMacros }));
                        }}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Macro value"
                      />
                      <button
                        onClick={() => {
                          const newMacros = formData.macros.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, macros: newMacros }));
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, macros: [...prev.macros, { name: '', value: '' }] }))}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add Macro
                  </button>
                </div>
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
                onClick={handleUpdateTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save size={16} />
                Update Template
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
              <h3 className="text-lg font-semibold">Mass Actions ({selectedTemplates.length} templates)</h3>
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
                  <option value="delete">Delete Templates</option>
                  <option value="update">Update Properties</option>
                  <option value="clone">Clone Templates</option>
                  <option value="export">Export Templates</option>
                </select>
              </div>

              {massAction === 'update' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template Groups</label>
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
                      <option value="">Add template groups...</option>
                      {availableGroups.filter(group => !formData.groups.includes(group)).map((group) => (
                        <option key={group} value={group}>{group}</option>
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

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Import Templates</h3>
              <button onClick={() => setShowImportModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template File</label>
                <input
                  type="file"
                  accept=".json,.xml,.yaml"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Supported formats: JSON, XML, YAML</p>
                <p>Maximum file size: 10MB</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Simulate import
                  alert('Import functionality would be implemented here');
                  setShowImportModal(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Upload size={16} />
                Import Templates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}