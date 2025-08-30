import React, { useEffect, useMemo, useRef, useState } from 'react';
import { type User, type Group, type Message } from '../types/responseDto';
import { useAppSelector } from '../slice/hooks';

interface MessageUser {
    "senderId": number;
    "receiverId": number;
    "content": string;
}

interface MessageGroup {
    "senderId": number;
    "groupId": number;
    "content": string;
}

const MessagePage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [messages, setMessages] = useState<MessageUser[] | MessageGroup[]>([]);
    const [selectedChat, setSelectedChat] = useState<{ type: 'user' | 'group'; id: number } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);
    const [isManageGroupModalOpen, setManageGroupModalOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const loginDetails = useAppSelector((state) => state.auth.loginDetails);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedChat]);

    const handleSendMessage = (content: string) => {
        if (!selectedChat || content.trim() === '') return;

        const newMessage: MessageUser | MessageGroup = {
            senderId: loginDetails?.id || 0,
            content: content.trim(),
            ...(selectedChat.type === 'user'
                ? { receiverId: selectedChat.id }
                : { groupId: selectedChat.id }),
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const handleCreateGroup = (name: string, memberIds: number[]) => {
        const newGroup: Group = {
            id: Date.now(),
            name,
            members: memberIds,
            admins: [CURRENT_USER_ID],
        };
        setGroups(prev => [...prev, newGroup]);

        const systemMessage: Message = {
            id: Date.now() + 1,
            senderId: loginDetails?.id || 0,
            senderUsername: 'You',
            groupId: newGroup.id,
            groupName: newGroup.name,
            content: `You created the group '${name}'`,
            messageType: 'SYSTEM',
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, systemMessage]);
        setSelectedChat({ type: 'group', id: newGroup.id });
    };

    const handleUpdateGroup = (updatedGroup: Group) => {
        setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
    };

    const handleDeleteGroup = (groupId: number) => {
        setGroups(prev => prev.filter(g => g.id !== groupId));
        if (selectedChat?.id === groupId) {
            setSelectedChat(null);
        }
    };

    const conversations = useMemo(() => {
        const allConversations: { type: 'user' | 'group'; id: number; lastMessage: MessageDTO | undefined }[] = [];

        users.filter(u => u.id !== CURRENT_USER_ID).forEach(user => {
            const lastMessage = messages
                .filter(m => (m.senderId === user.id && m.receiverId === CURRENT_USER_ID) || (m.senderId === CURRENT_USER_ID && m.receiverId === user.id))
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            if (lastMessage) {
                allConversations.push({ type: 'user', id: user.id, lastMessage });
            }
        });

        groups.filter(g => g.members.includes(CURRENT_USER_ID)).forEach(group => {
            const lastMessage = messages
                .filter(m => m.groupId === group.id)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            allConversations.push({ type: 'group', id: group.id, lastMessage });
        });

        return allConversations.sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        });
    }, [users, groups, messages]);

    const filteredConversations = conversations.filter(conv => {
        const name = conv.type === 'user' ? findUserById(conv.id)?.username : groups.find(g => g.id === conv.id)?.name;
        return name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const currentChatMessages = messages.filter(m => {
        if (!selectedChat) return false;
        return selectedChat.type === 'user'
            ? (m.senderId === selectedChat.id && m.receiverId === CURRENT_USER_ID) || (m.senderId === CURRENT_USER_ID && m.receiverId === selectedChat.id)
            : m.groupId === selectedChat.id;
    });

    const selectedChatInfo = useMemo(() => {
        if (!selectedChat) return null;
        if (selectedChat.type === 'user') {
            const user = findUserById(selectedChat.id);
            return { name: user?.username, avatar: <UserAvatar userId={selectedChat.id} className="w-10 h-10" />, onlineStatus: user?.isOnline ? 'Online' : 'Offline' };
        } else {
            const group = groups.find(g => g.id === selectedChat.id);
            if (!group) return null;
            return { name: group.name, avatar: <GroupAvatar group={group} className="w-10 h-10" />, onlineStatus: `${group.members.length} members` };
        }
    }, [selectedChat, users, groups]);

    const currentGroup = selectedChat?.type === 'group' ? groups.find(g => g.id === selectedChat.id) : null;

    return (
        <div className="h-screen w-full flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            {isCreateGroupModalOpen && <CreateGroupModal onClose={() => setCreateGroupModalOpen(false)} onCreateGroup={handleCreateGroup} />}
            {isManageGroupModalOpen && currentGroup && <ManageGroupModal group={currentGroup} onClose={() => setManageGroupModalOpen(false)} onUpdateGroup={handleUpdateGroup} onDeleteGroup={handleDeleteGroup} />}

            {/* Sidebar */}
            <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="p-4 border-b dark:border-gray-700">
                    <h1 className="text-2xl font-bold">Chats</h1>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map(conv => {
                        const info = conv.type === 'user' ? findUserById(conv.id) : groups.find(g => g.id === conv.id);
                        if (!info) return null;
                        const isActive = selectedChat?.type === conv.type && selectedChat?.id === conv.id;
                        return (
                            <div key={`${conv.type}-${conv.id}`} onClick={() => setSelectedChat({ type: conv.type, id: conv.id })} className={`flex items-center gap-3 p-3 cursor-pointer border-l-4 ${isActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                {conv.type === 'user' ? <UserAvatar userId={conv.id} /> : <GroupAvatar group={info as Group} />}
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-semibold truncate">{info.name || (info as User).username}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {conv.lastMessage?.content}
                                    </p>
                                </div>
                                <div className="text-xs text-gray-400 self-start">
                                    {conv.lastMessage && new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="p-4 border-t dark:border-gray-700">
                    <button onClick={() => setCreateGroupModalOpen(true)} className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        <Plus size={20} /> Create Group
                    </button>
                </div>
            </aside>

            {/* Chat Window */}
            <main className="flex-1 flex flex-col h-full">
                {selectedChat && selectedChatInfo ? (
                    <>
                        <header className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <div className="flex items-center gap-3">
                                {selectedChatInfo.avatar}
                                <div>
                                    <p className="font-bold">{selectedChatInfo.name}</p>
                                    <p className="text-xs text-gray-500">{selectedChatInfo.onlineStatus}</p>
                                </div>
                            </div>
                            {selectedChat.type === 'group' && (
                                <button onClick={() => setManageGroupModalOpen(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <MoreVertical size={20} />
                                </button>
                            )}
                        </header>
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-100/50 dark:bg-gray-900/50">
                            {currentChatMessages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
                            <div ref={messagesEndRef} />
                        </div>
                        <footer className="p-4 bg-white dark:bg-gray-800">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                                handleSendMessage(input.value);
                                input.value = '';
                            }}>
                                <input
                                    name="message"
                                    type="text"
                                    placeholder="Type a message..."
                                    autoComplete="off"
                                    className="w-full p-3 border rounded-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </form>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                        <Users size={64} />
                        <h2 className="mt-4 text-xl font-semibold">Welcome to the Chat</h2>
                        <p>Select a conversation or create a new group to start messaging.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MessagePage;