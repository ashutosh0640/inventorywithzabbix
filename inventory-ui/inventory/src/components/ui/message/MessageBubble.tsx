import { type Message} from '../../../types/responseDto';
import { UserAvatar } from './UserAvtar';



export const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isCurrentUser = message.senderId === CURRENT_USER_ID;

    if (message.messageType === 'SYSTEM') {
        return (
            <div className="text-center my-2">
                <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">{message.content}</span>
            </div>
        );
    }

    return (
        <div className={`flex items-end gap-2 my-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            {!isCurrentUser && <UserAvatar userId={message.senderId} className="w-8 h-8" />}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${isCurrentUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                {!isCurrentUser && message.groupId && (
                    <p className="text-xs font-bold text-blue-400">{message.senderUsername}</p>
                )}
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-right mt-1 opacity-70">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
        </div>
    );
};