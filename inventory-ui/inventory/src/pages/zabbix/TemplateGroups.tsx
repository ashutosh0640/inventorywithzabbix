import { useState } from 'react';
import { useAppSelector } from '../../slice/hooks';
import {
  Database, Plus, Search, Filter, Edit, Trash, Settings,
  X, Save, Share, Group
} from 'lucide-react';
import FallbackSelectServer from './FallbackSelectServer';
import type {
  ZabbixTemplateGroup,
  TemplateGroupGetParams,
  TemplateGroupCreateParams,
  TemplateGroupDeleteParams,
  TemplateGroupUpdateParams
} from '../../types/ZabbixTemplateGroups';
import {
  useGetZabbixTemplateGroups,
  useCreateZabbixTemplateGroup,
  useDeleteZabbixTemplateGroup,
  useUpdateZabbixTemplateGroup,
} from '../../features/zabbixQuery/zabbixTemplateGroupQuery';
import { AlertMessage } from '../../components/ui/AlertMessage';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModel'

type AlertType = 'success' | 'error' | 'warning' | 'info';

const TemplateGroups: React.FC = () => {

  const selectedServer = useAppSelector(state => state.zabbixserver.selectedServer);

  if (!selectedServer) {
    return <FallbackSelectServer />;
  }

  const getParams = {
    "output": "extend",
    "selectTemplates": "extend",
    "sortfield": "name",
    "sortorder": "ASC"
  } as TemplateGroupGetParams;
  const [deleteParam, setDeleteParam] = useState<TemplateGroupDeleteParams>([]);
  const [updateParam, setUpdateParam] = useState<TemplateGroupUpdateParams>({ groupid: '', name: '' });

  const { data: zabbixTemplateGroups, isLoading: templateGroupLoading } = useGetZabbixTemplateGroups(getParams);
  const { mutate: createTemplateGroup } = useCreateZabbixTemplateGroup();
  const { mutate: deleteTemplateGroup } = useDeleteZabbixTemplateGroup();
  const { mutate: updateTemplateGroup } = useUpdateZabbixTemplateGroup();

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<AlertType | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMassActionModal, setShowMassActionModal] = useState(false);
  const [showPropagateModal, setShowPropagateModal] = useState(false);
  const [massAction, setMassAction] = useState<'enable' | 'disable' | 'delete' | 'update' | 'clone' | 'merge'>('enable');
  const [formData, setFormData] = useState<TemplateGroupCreateParams>({
    name: ''
  });

  console.log("Getting zabbix template groups: ", zabbixTemplateGroups)

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (groupId: string) => {
    setDeleteParam((prev) => [...prev, groupId]);
    console.log("Open model to delete host group with ID:", deleteParam);
    setIsModalOpen(true);
  }

  const handleModelClose = () => {
    setDeleteParam([]);
    setIsModalOpen(false);
  }

  const handleDelete = () => {
    if (deleteParam.length > 0) {
      deleteTemplateGroup(deleteParam, {
        onSuccess: () => {
          setIsModalOpen(false);
          setAlertType('success');
          setAlertMessage('Template group deleted successfully.');
        },
        onError: (error) => {
          console.error('Failed to delete template group:', error);
          setAlertType('error');
          setAlertMessage('Failed to delete template group.');
        }
      });
      setTimeout(() => {
        setAlertType(null);
        setAlertMessage(null);
      }, 3000);
    }
  };

  const handleCreateGroup = async () => {
    try {
      setLoading(true);
      createTemplateGroup(formData, {
        onSuccess: (response) => {
          setLoading(false);
          setShowCreateModal(false);
          resetForm();
          setAlertType('success');
          setAlertMessage(`Host Group created successfully.`,);
        },
        onError: (error) => {
          setLoading(false);
          setAlertType('error');
          setAlertMessage('Failed to create host group.');
        }
      });
    } catch (error) {
      console.error('Failed to create host group:', error);
      // For demo mode, simulate creation

    }
  };


  const handleUpdateGroup = async () => {
    if (!updateParam.groupid || !updateParam.name) {
      console.warn("Group ID and Name are required!");
      return;
    }

    try {
      updateTemplateGroup(updateParam, {
        onSuccess: (response) => {
          console.log("Updated host group:", response);
          setShowEditModal(false);
          resetForm();
          setAlertType('success');
          setAlertMessage(`Host Group updated successfully.`);
        },
        onError: (error) => {
          console.error('Failed to update host group:', error);
          setAlertType('error');
          setAlertMessage('Failed to update host group.');
        }
      });
    } catch (error) {
      console.error('Failed to update host group:', error);
      // For demo mode, simulate update

    }
  };

  const handleDeleteGroup = (groupId: string) => {
    openModal(groupId);
  };

  const handleMassAction = () => {

    try {
      switch (massAction) {
        case 'delete':

          break;
        case 'update':

          break;
        case 'clone':

          break;
        case 'merge':
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

    try {
      setShowPropagateModal(false);
      setSelectedGroups([]);
      resetForm();
    } catch (error) {
      console.error('Failed to propagate settings:', error);
      // For demo mode, simulate propagation

    }
  };

  const resetForm = () => {
    setFormData({
      name: ''
    });
  };

  const openEditModal = (group: ZabbixTemplateGroup) => {
    setUpdateParam({ groupid: group.groupid, name: group.name });
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
    if (!filteredGroups) return;

    setSelectedGroups(prev =>
      prev.length === filteredGroups.length
        ? []
        : filteredGroups.map(group => group.groupid)
    );
  };

  const getGroupSizeCategory = (templateCount: number) => {
    if (templateCount === 0) return 'empty';
    if (templateCount <= 5) return 'small';
    if (templateCount <= 15) return 'medium';
    return 'large';
  };

  const getGroupSizeColor = (templateCount: number) => {
    const category = getGroupSizeCategory(templateCount);
    switch (category) {
      case 'empty': return 'bg-gray-100 text-gray-800';
      case 'small': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-green-100 text-green-800';
      case 'large': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGroups = zabbixTemplateGroups?.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (!selectedServer) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No server selected</h3>
          <p className="text-gray-600">Please select a Zabbix server to manage template groups</p>
        </div>
      </div>
    );
  }

  if (templateGroupLoading) {
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
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Template Groups</h2>
            <p className="text-gray-600 mt-1">Organize and manage template collections</p>
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
              Add Template Group
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-2 mb-2">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search template groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-1/2 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <option value="empty">Empty (0 templates)</option>
                <option value="small">Small (1-5 templates)</option>
                <option value="medium">Medium (6-15 templates)</option>
                <option value="large">Large (16+ templates)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Template Groups Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={selectedGroups.length === filteredGroups?.length && filteredGroups.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group Name
                  </th>
                  <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Templates
                  </th>
                  <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGroups?.map((group) => (
                  <tr key={group.groupid} className="hover:bg-gray-50">
                    <td className="px-4 py-1 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group.groupid)}
                        onChange={() => toggleGroupSelection(group.groupid)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-1 whitespace-nowrap">
                      <div className="flex items-center">
                        <Group className="text-gray-400 mr-3" size={16} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{group.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-1 whitespace-nowrap flex">
                      <span className={` h-fit inline-flex p-1 text-xs font-semibold rounded-full ${getGroupSizeColor(group.templates?.length || 0)}`}>
                        {group?.templates?.length}
                      </span>
                      <span className="ml-2 text-xs h-fit text-blue-900 block max-w-fit whitespace-normal break-words">
                        {group.templates?.map(t => t.name).join(', ')}
                      </span>
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
                          onClick={() => handleDeleteGroup(group.groupid)}
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

        {filteredGroups?.length === 0 && (
          <div className="text-center py-12">
            <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No template groups found</h3>
            <p className="text-gray-600">
              {searchTerm || sizeFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Add your first template group to organize your templates'
              }
            </p>
          </div>
        )}

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create New Template Group</h3>
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
                      placeholder="Templates/Custom"
                    />
                  </div>
                </div>

                {/* Add template to template group */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Templates</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.templates.map((template) => (
                      <span key={template} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {template}
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, templates: prev.templates.filter(t => t !== template) }))}
                          className="ml-1 text-blue-600 hover:text-blue-800"
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
                </div> */}

                {/* <div>
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
                      <span key={permission} className={`inline-flex items-center px-2 py-1 text-xs rounded ${permission === 'Read-write' ? 'bg-green-100 text-green-800' :
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
                </div> */}

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
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit Template Group</h3>
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
                      value={updateParam.name}
                      onChange={(e) => setUpdateParam(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* <div className="space-y-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Templates</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.templates.map((template) => (
                      <span key={template} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {template}
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, templates: prev.templates.filter(t => t !== template) }))}
                          className="ml-1 text-blue-600 hover:text-blue-800"
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
                </div> */}

              {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.permissions.map((permission) => (
                      <span key={permission} className={`inline-flex items-center px-2 py-1 text-xs rounded ${permission === 'Read-write' ? 'bg-green-100 text-green-800' :
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
              </div> */}

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
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.permissions.map((permission) => (
                          <span key={permission} className={`inline-flex items-center px-2 py-1 text-xs rounded ${permission === 'Read-write' ? 'bg-green-100 text-green-800' :
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
                    </div> */}
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
                  className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 ${massAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
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
                  Propagate permissions and settings to all selected template groups and their subgroups.
                </p>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permissions to Propagate</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.permissions.map((permission) => (
                      <span key={permission} className={`inline-flex items-center px-2 py-1 text-xs rounded ${permission === 'Read-write' ? 'bg-green-100 text-green-800' :
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
                </div> */}
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

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={handleModelClose}
        onConfirm={handleDelete}
      />

      {alertMessage && (
        <AlertMessage
          message={alertMessage}
          type={alertType}
        />
      )}
    </>
  );
}

export default TemplateGroups;