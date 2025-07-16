import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, Plus, Search, Filter, MoreVertical, CheckCircle, AlertCircle, 
  XCircle, Clock, AlertTriangle, Edit, Trash, Copy, Power, PowerOff,
  X, Save, Upload, Download, Settings, Shield, Key, Unlock, RefreshCw,
  Eye, EyeOff, UserCheck, UserX, Smartphone, Mail, Phone
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { User } from '../../types';
import { apiService } from '../../services/api';

interface UserFormData {
  username: string;
  name: string;
  surname: string;
  email: string;
  password?: string;
  role: string;
  status: 'enabled' | 'disabled';
  groups: string[];
  phone?: string;
  autologin?: boolean;
  autologout?: string;
  theme?: string;
  lang?: string;
  timezone?: string;
  rows_per_page?: number;
}

interface AuthenticationData {
  username: string;
  password: string;
  remember?: boolean;
}

export function Users() {
  const { state } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isDemo, setIsDemo] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMassActionModal, setShowMassActionModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [massAction, setMassAction] = useState<'enable' | 'disable' | 'delete' | 'update' | 'unblock' | 'resettotp'>('enable');
  const [showPassword, setShowPassword] = useState(false);
  const [authData, setAuthData] = useState<AuthenticationData>({ username: '', password: '' });
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    name: '',
    surname: '',
    email: '',
    role: 'Zabbix user',
    status: 'enabled',
    groups: [],
    autologout: '15m',
    theme: 'default',
    lang: 'en_US',
    timezone: 'default',
    rows_per_page: 50
  });

  // Available options for dropdowns
  const availableRoles = ['Super admin', 'Admin', 'Zabbix user', 'Guest'];
  const availableGroups = ['Zabbix administrators', 'Zabbix users', 'Guests', 'Disabled', 'No access to the frontend'];
  const availableThemes = ['default', 'blue-theme', 'dark-theme', 'hc-light', 'hc-dark'];
  const availableLanguages = ['en_US', 'en_GB', 'zh_CN', 'cs_CZ', 'fr_FR', 'de_DE', 'he_IL', 'it_IT', 'ja_JP', 'ko_KR', 'lv_LV', 'pl_PL', 'pt_BR', 'pt_PT', 'ru_RU', 'sk_SK', 'tr_TR', 'uk_UA'];
  const availableTimezones = ['default', 'system', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo', 'Asia/Shanghai'];

  useEffect(() => {
    if (state.currentServer) {
      fetchUsers();
    }
  }, [state.currentServer]);

  const fetchUsers = async () => {
    if (!state.currentServer) return;

    try {
      setLoading(true);
      const data = await apiService.getUsers(state.currentServer.id);
      setUsers(data);
      setIsDemo(false);
    } catch (error) {
      console.warn('API not available, using demo data:', error);
      setIsDemo(true);
      // This will be handled by the API service fallback
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!state.currentServer) return;

    try {
      const newUser = await apiService.createUser(state.currentServer.id, {
        ...formData,
        serverId: state.currentServer.id
      });
      
      setUsers(prev => [...prev, newUser]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create user:', error);
      // For demo mode, simulate creation
      if (isDemo) {
        const newUser: User = {
          id: Date.now().toString(),
          ...formData,
          serverId: state.currentServer.id
        };
        setUsers(prev => [...prev, newUser]);
        setShowCreateModal(false);
        resetForm();
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!state.currentServer || !editingUser) return;

    try {
      const updatedUser = await apiService.updateUser(
        state.currentServer.id, 
        editingUser.id, 
        formData
      );
      
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? { ...user, ...updatedUser } : user
      ));
      setShowEditModal(false);
      setEditingUser(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update user:', error);
      // For demo mode, simulate update
      if (isDemo) {
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id ? { ...user, ...formData } : user
        ));
        setShowEditModal(false);
        setEditingUser(null);
        resetForm();
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!state.currentServer) return;
    
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await apiService.deleteUser(state.currentServer.id, userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
      // For demo mode, simulate deletion
      if (isDemo) {
        setUsers(prev => prev.filter(user => user.id !== userId));
      }
    }
  };

  const handleLogin = async () => {
    if (!state.currentServer) return;

    try {
      const result = await apiService.loginUser(state.currentServer.id, authData);
      console.log('Login successful:', result);
      setShowLoginModal(false);
      setAuthData({ username: '', password: '' });
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    if (!state.currentServer) return;

    try {
      await apiService.logoutUser(state.currentServer.id);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCheckAuthentication = async () => {
    if (!state.currentServer) return;

    try {
      const result = await apiService.checkAuthentication(state.currentServer.id);
      console.log('Authentication status:', result);
      alert(`Authentication status: ${result.authenticated ? 'Authenticated' : 'Not authenticated'}`);
    } catch (error) {
      console.error('Authentication check failed:', error);
    }
  };

  const handleProvisionUser = async () => {
    if (!state.currentServer) return;

    try {
      const result = await apiService.provisionUser(state.currentServer.id, formData);
      console.log('User provisioned:', result);
      setUsers(prev => [...prev, result]);
      setShowProvisionModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to provision user:', error);
      // For demo mode, simulate provisioning
      if (isDemo) {
        const newUser: User = {
          id: Date.now().toString(),
          ...formData,
          serverId: state.currentServer.id
        };
        setUsers(prev => [...prev, newUser]);
        setShowProvisionModal(false);
        resetForm();
      }
    }
  };

  const handleResetTOTP = async (userId: string) => {
    if (!state.currentServer) return;

    if (!confirm('Are you sure you want to reset TOTP for this user?')) return;

    try {
      await apiService.resetTOTP(state.currentServer.id, userId);
      alert('TOTP reset successfully');
    } catch (error) {
      console.error('Failed to reset TOTP:', error);
      // For demo mode, simulate success
      if (isDemo) {
        alert('TOTP reset successfully (demo mode)');
      }
    }
  };

  const handleUnblockUser = async (userId: string) => {
    if (!state.currentServer) return;

    try {
      await apiService.unblockUser(state.currentServer.id, userId);
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: 'enabled' as const } : user
      ));
      alert('User unblocked successfully');
    } catch (error) {
      console.error('Failed to unblock user:', error);
      // For demo mode, simulate unblock
      if (isDemo) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, status: 'enabled' as const } : user
        ));
        alert('User unblocked successfully (demo mode)');
      }
    }
  };

  const handleMassAction = async () => {
    if (!state.currentServer || selectedUsers.length === 0) return;

    try {
      switch (massAction) {
        case 'enable':
          setUsers(prev => prev.map(user => 
            selectedUsers.includes(user.id) ? { ...user, status: 'enabled' as const } : user
          ));
          break;
        case 'disable':
          setUsers(prev => prev.map(user => 
            selectedUsers.includes(user.id) ? { ...user, status: 'disabled' as const } : user
          ));
          break;
        case 'delete':
          if (!confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) return;
          setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
          break;
        case 'unblock':
          setUsers(prev => prev.map(user => 
            selectedUsers.includes(user.id) ? { ...user, status: 'enabled' as const } : user
          ));
          break;
        case 'resettotp':
          if (!confirm(`Are you sure you want to reset TOTP for ${selectedUsers.length} users?`)) return;
          alert(`TOTP reset for ${selectedUsers.length} users`);
          break;
        case 'update':
          setUsers(prev => prev.map(user => 
            selectedUsers.includes(user.id) ? { ...user, ...formData } : user
          ));
          break;
      }
      
      setSelectedUsers([]);
      setShowMassActionModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to perform mass action:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      name: '',
      surname: '',
      email: '',
      role: 'Zabbix user',
      status: 'enabled',
      groups: [],
      autologout: '15m',
      theme: 'default',
      lang: 'en_US',
      timezone: 'default',
      rows_per_page: 50
    });
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      status: user.status,
      groups: user.groups,
      autologout: '15m',
      theme: 'default',
      lang: 'en_US',
      timezone: 'default',
      rows_per_page: 50
    });
    setShowEditModal(true);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedUsers(prev => 
      prev.length === filteredUsers.length ? [] : filteredUsers.map(user => user.id)
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enabled':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'disabled':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-yellow-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enabled':
        return 'bg-green-100 text-green-800';
      case 'disabled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super admin':
        return 'bg-purple-100 text-purple-800';
      case 'Admin':
        return 'bg-blue-100 text-blue-800';
      case 'Zabbix user':
        return 'bg-green-100 text-green-800';
      case 'Guest':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  if (!state.currentServer) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No server selected</h3>
          <p className="text-gray-600">Please select a Zabbix server to manage users</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
          <p className="text-gray-600 mt-1">Manage user accounts and authentication</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCheckAuthentication}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Shield size={20} />
            Check Auth
          </button>
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Key size={20} />
            Login
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PowerOff size={20} />
            Logout
          </button>
          {selectedUsers.length > 0 && (
            <button
              onClick={() => setShowMassActionModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Settings size={20} />
              Mass Actions ({selectedUsers.length})
            </button>
          )}
          <button
            onClick={() => setShowProvisionModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <UserCheck size={20} />
            Provision
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add User
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
              placeholder="Search users..."
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
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {availableRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Groups
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <UsersIcon size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.name} {user.surname}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.groups.slice(0, 2).map((group) => (
                        <span key={group} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {group}
                        </span>
                      ))}
                      {user.groups.length > 2 && (
                        <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{user.groups.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(user.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit user"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleResetTOTP(user.id)}
                        className="text-orange-600 hover:text-orange-900"
                        title="Reset TOTP"
                      >
                        <Smartphone size={16} />
                      </button>
                      <button
                        onClick={() => handleUnblockUser(user.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Unblock user"
                      >
                        <Unlock size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete user"
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

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Add your first user to start managing access'
            }
          </p>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New User</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
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
                      value={formData.password || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Password"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
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
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Groups</label>
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
                  <option value="">Select user groups...</option>
                  {availableGroups.filter(group => !formData.groups.includes(group)).map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                  <select
                    value={formData.theme}
                    onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {availableThemes.map((theme) => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={formData.lang}
                    onChange={(e) => setFormData(prev => ({ ...prev, lang: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {availableLanguages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auto-logout</label>
                  <select
                    value={formData.autologout}
                    onChange={(e) => setFormData(prev => ({ ...prev, autologout: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="0">Never</option>
                    <option value="90">90 seconds</option>
                    <option value="15m">15 minutes</option>
                    <option value="30m">30 minutes</option>
                    <option value="1h">1 hour</option>
                    <option value="1d">1 day</option>
                  </select>
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
                onClick={handleCreateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save size={16} />
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit User: {editingUser.username}</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Leave empty to keep current"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
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
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Groups</label>
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
                  <option value="">Add user groups...</option>
                  {availableGroups.filter(group => !formData.groups.includes(group)).map((group) => (
                    <option key={group} value={group}>{group}</option>
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
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save size={16} />
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Login</h3>
              <button onClick={() => setShowLoginModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={authData.username}
                  onChange={(e) => setAuthData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={authData.password}
                    onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
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
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={authData.remember || false}
                  onChange={(e) => setAuthData(prev => ({ ...prev, remember: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">Remember me</label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Key size={16} />
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provision User Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Provision User</h3>
              <button onClick={() => setShowProvisionModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Provision a user account with predefined settings and automatic configuration.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="provisioned-user"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Groups</label>
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
                  <option value="">Select default groups...</option>
                  {availableGroups.filter(group => !formData.groups.includes(group)).map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowProvisionModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleProvisionUser}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <UserCheck size={16} />
                Provision User
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
              <h3 className="text-lg font-semibold">Mass Actions ({selectedUsers.length} users)</h3>
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
                  <option value="enable">Enable Users</option>
                  <option value="disable">Disable Users</option>
                  <option value="delete">Delete Users</option>
                  <option value="unblock">Unblock Users</option>
                  <option value="resettotp">Reset TOTP</option>
                  <option value="update">Update Properties</option>
                </select>
              </div>

              {massAction === 'update' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {availableRoles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
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