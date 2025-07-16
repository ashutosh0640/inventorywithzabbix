import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import type { AlertMsgState } from '../../hooks/useAlertMsg';

interface AllertMsgProps {
  message: AlertMsgState;
  onClose?: () => void;
}

const AlertMsg: React.FC<AllertMsgProps> = ({ message, onClose }) => {
  if (!message.show) return null;

  const isSuccess = message.type === 'success';
  
  const styles = {
    success: {
      bg: 'bg-green-500',
      border: 'border-green-400',
      iconBg: 'bg-green-400',
      textSecondary: 'text-green-100'
    },
    error: {
      bg: 'bg-red-500',
      border: 'border-red-400',
      iconBg: 'bg-red-400',
      textSecondary: 'text-red-100'
    }
  };

  const currentStyles = styles[message.type];
  const Icon = isSuccess ? CheckCircle : AlertCircle;

  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right-full duration-300">
      <div className={`${currentStyles.bg} text-white px-6 py-4 rounded-xl shadow-lg ${currentStyles.border} flex items-center space-x-3 min-w-[300px] max-w-[400px]`}>
        <div className={`p-1 ${currentStyles.iconBg} rounded-full flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{message.title}</p>
          <p className={`text-sm ${currentStyles.textSecondary} break-words`}>{message.message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors duration-150"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertMsg;