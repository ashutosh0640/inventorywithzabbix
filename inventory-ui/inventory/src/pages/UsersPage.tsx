import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Users, Plus, Edit, Trash2, Search, X, UserPlus, ShieldCheck, ShieldAlert } from 'lucide-react';
import { FiAlertTriangle } from "react-icons/fi";
import type { User, Role } from '../types/responseDto';
import { usersAPI } from '../service/inventoryapi';
import type { UserReqDTO } from '../types/requestDto';

const UsersPage: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]); // Assuming roles are fetched from a context or API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newUser, setNewUser] = useState<UserReqDTO>({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    roleId: 4,
    isActive: true,
    isBlocked: false,
    profilePicture: "/src/assets/images/profileImg.jpg"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (value: string) => {
    setNewUser(prev => ({
      ...prev,
      role: value as 'admin' | 'user',
    }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await usersAPI.create(newUser);
      await fetchUsers();
      setNewUser({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        roleId: 4,
        isActive: true,
        isBlocked: false,
        profilePicture: "/src/assets/images/profileImg.jpg"
      });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to add user');
      console.error('Error adding user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (id: number) => {
    try {
      setIsLoading(true);
      await usersAPI.delete(id);
      await fetchUsers();
      setError(null);
    } catch (err) {
      setError('Failed to remove user');
      console.error('Error removing user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = searchTerm
    ? users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : users;

  if (isLoading && users.length === 0) {
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
            placeholder="Search users..."
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
          leftIcon={showAddForm ? <X size={16} /> : <UserPlus size={16} />}
        >
          {showAddForm ? 'Cancel' : 'Add User'}
        </Button>
      </div>

      {showAddForm && (
        <Card title="Add New User">
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Username"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <select
                name="roleId"
                value={newUser.roleId} 
                onChange={(e) => setNewUser({ ...newUser, roleId: parseInt(e.target.value) })}
                required
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={newUser.roleId} value={role.id}>
                    {role.roleName}
                  </option>
                ))}
              </select>
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
                Add User
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="h-full">
            <div className="flex items-start mb-4">
              <div className={`p-3 rounded-full ${user.role.roleName === 'admin'
                ? 'bg-red-100 text-red-600'
                : 'bg-blue-100 text-blue-600'
                } mr-4`}>
                {user.role.roleName === 'admin' ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{user.username}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${user.role.roleName === 'admin'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                    }`}>
                    {user.role.roleName}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                  {user.lastActive && (
                    <> • Last login: {new Date(user.lastActive).toLocaleDateString()}</>
                  )}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h4>
              <div className="flex flex-wrap gap-2">
                {user.role.permissions.map(perm => (
                  <span
                    key={perm.id}
                    className={`text-xs px-2 py-1 rounded-full ${perm.name === 'admin'
                      ? 'bg-red-100 text-red-800'
                      : perm.name === 'write'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800'
                      }`}
                  >
                    {perm.description}
                  </span>
                ))}
              </div>
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
                onClick={() => handleRemoveUser(user.id)}
                disabled={user.username === 'admin'} // Prevent removing the main admin
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new user.'}
          </p>
          <div className="mt-6">
            <Button
              onClick={() => setShowAddForm(true)}
              leftIcon={<UserPlus size={16} />}
            >
              Add User
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;