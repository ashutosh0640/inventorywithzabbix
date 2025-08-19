import React from 'react';

interface StatusIndicatorProps {
    status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
    size?: number;
}

const statusColors: Record<StatusIndicatorProps['status'], string> = {
    ONLINE: 'green',
    OFFLINE: 'red',
    MAINTENANCE: 'grey',
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
    status,
    size = 20,
}) => {
    const color = statusColors[status];

    return (
        <div className="flex items-center justify-center">
            <div
                className={
                    'rounded-full animate-pulse'
                }
                style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    boxShadow: `0 0 8px 2px ${color}`,
                }}
            ></div>
        </div>
    );
};
