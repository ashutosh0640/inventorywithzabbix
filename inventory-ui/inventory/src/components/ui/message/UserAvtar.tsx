import type { User } from "../../../types/responseDto";

export const UserAvatar: React.FC<{ user: User; className?: string }> = ({ user, className = 'w-10 h-10' }) => {

    if (!user) return null;
    return (
        <div className={`relative flex-shrink-0 ${className}`}>
            <img className="rounded-full w-full h-full object-cover" src={user.profilePictureUrl} alt={user.username} />
            {user.isActive && (
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
            )}
        </div>
    );
};
