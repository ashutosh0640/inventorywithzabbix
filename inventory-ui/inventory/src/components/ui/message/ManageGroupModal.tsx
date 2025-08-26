import React, { useState } from 'react';
import { X, UserMinus, UserPlus, Crown, LogOut, Trash2 } from 'lucide-react';
import { type Group, type User } from '../../../types/responseDto';
import { useAppSelector } from '../../../slice/store';
import { UserAvatar } from './UserAvtar';


export const ManageGroupModal: React.FC<{
    group: Group;
    onClose: () => void;
    onUpdateGroup: (updatedGroup: Group) => void;
    onDeleteGroup: (groupId: number) => void;
}> = ({ group, onClose, onUpdateGroup, onDeleteGroup }) => {
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);
    const CURRENT_USER_ID = loginDetails?.id || -1;
    const [users, setUsers] = useState<User[]>([]);
    const currentUserIsAdmin = group.admins.includes(CURRENT_USER_ID);

    const handleAddUser = (userId: number) => {
        if (!group.members.includes(userId)) {
            const updatedGroup = { ...group, members: [...group.members, userId] };
            onUpdateGroup(updatedGroup);
        }
    };

    const handleRemoveUser = (userId: number) => {
        if (userId === CURRENT_USER_ID) { // User leaves the group
            const updatedGroup = { ...group, members: group.members.filter(id => id !== userId), admins: group.admins.filter(id => id !== userId) };
            onUpdateGroup(updatedGroup);
            onClose();
            return;
        }
        if (currentUserIsAdmin) {
            const updatedGroup = { ...group, members: group.members.filter(id => id !== userId), admins: group.admins.filter(id => id !== userId) };
            onUpdateGroup(updatedGroup);
        }
    };

    const handleToggleAdmin = (userId: number) => {
        if (currentUserIsAdmin) {
            const updatedAdmins = group.admins.includes(userId)
                ? group.admins.filter(id => id !== userId)
                : [...group.admins, userId];
            const updatedGroup = { ...group, admins: updatedAdmins };
            onUpdateGroup(updatedGroup);
        }
    };
    
    const handleDeleteGroup = () => {
        if(currentUserIsAdmin) {
            onDeleteGroup(group.id);
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Manage '{group.name}'</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                    <h3 className="font-semibold mb-2">Members ({group.members.length})</h3>
                    <div className="space-y-2">
                        {group.members.map(userId => {
                            const user = findUserById(userId);
                            if (!user) return null;
                            const isAdmin = group.admins.includes(userId);
                            return (
                                <div key={userId} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <div className="flex items-center gap-3">
                                        <UserAvatar userId={userId} />
                                        <span>{user.username} {userId === loginDetails?.id && '(You)'}</span>
                                        {isAdmin && <Crown size={16} className="text-yellow-500" />}
                                    </div>
                                    {currentUserIsAdmin && userId !== CURRENT_USER_ID && (
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleToggleAdmin(userId)} title={isAdmin ? 'Remove Admin' : 'Make Admin'} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                                <Crown size={18} className={isAdmin ? 'text-yellow-500' : 'text-gray-400'} />
                                            </button>
                                            <button onClick={() => handleRemoveUser(userId)} title="Remove User" className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900">
                                                <UserMinus size={18} className="text-red-500" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {currentUserIsAdmin && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Add Users</h3>
                            <div className="space-y-2">
                                {users.filter(u => !group.members.includes(u.id)).map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar userId={user.id} />
                                            <span>{user.username}</span>
                                        </div>
                                        <button onClick={() => handleAddUser(user.id)} className="p-1.5 rounded-full hover:bg-green-100 dark:hover:bg-green-900">
                                            <UserPlus size={18} className="text-green-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                 <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-2">
                    {currentUserIsAdmin ? (
                        <button onClick={handleDeleteGroup} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                            <Trash2 size={16} /> Delete Group
                        </button>
                    ) : (
                        <button onClick={() => handleRemoveUser(CURRENT_USER_ID)} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                            <LogOut size={16} /> Leave Group
                        </button>
                    )}
                    <button onClick={onClose} className="bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};