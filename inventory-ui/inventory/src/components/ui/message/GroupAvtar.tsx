import { Users } from 'lucide-react';
import { type Group } from '../../../types/responseDto';

export const GroupAvatar: React.FC<{ group: Group; className?: string }> = ({ group, className = 'w-10 h-10' }) => {
    return (
        <div className={`relative flex-shrink-0 ${className}`}>
            <img className="rounded-full w-full h-full object-cover" src={group.avatar} alt={group.name} />
            <div className="absolute -bottom-1 -right-1 bg-gray-700 rounded-full p-0.5">
                <Users className="w-3 h-3 text-white" />
            </div>
        </div>
    );
};
