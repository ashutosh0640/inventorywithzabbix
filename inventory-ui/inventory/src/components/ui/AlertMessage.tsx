import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';


type AlertType = 'success' | 'error' | 'warning' | 'info';


interface AlertMessageProps {
  message: string | null;
  type: AlertType | null;
}


export const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  type
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Determine Tailwind CSS classes based on the alert type
  const getColors = useCallback(() => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 'info':
        return 'bg-blue-100 border-blue-400 text-blue-700';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-700';
    }
  }, [type]);

  // Determine the icon based on the alert type
  const getIcon = useCallback(() => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return null;
    }
  }, [type]);

  
  useEffect(() => {
    console.log("Alert message rendered...")
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        const dismissTimer = setTimeout(() => {
          setIsVisible(false);
        }, 3000); 
        return () => clearTimeout(dismissTimer);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, message, type]);

  
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`
        fixed top-4 right-6 z-50
        p-4 mb-3 rounded-lg shadow-lg flex items-center space-x-3
        border-l-4 transition-opacity duration-300 ease-out
        ${getColors()}
        ${isFadingOut ? 'opacity-0' : 'opacity-100'}
      `}
      role="alert"
    >
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-grow">
        <p className="font-medium text-sm">{message}</p>
      </div>
      {/* Optional: Add a close button if you want manual dismissal */}
      <button
        onClick={() => { setIsFadingOut(true); setTimeout(() => { setIsVisible(false); }, 300); }}
        className="ml-auto text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <X size={16} />
      </button>
    </div>
  );
};
