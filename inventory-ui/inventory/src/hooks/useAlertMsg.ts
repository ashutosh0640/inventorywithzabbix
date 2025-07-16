import { useState, useCallback } from 'react';

export type AlertMsgType = 'success' | 'error';

export interface AlertMsgState {
  show: boolean;
  type: AlertMsgType;
  title: string;
  message: string;
}

export const useAlertMsg = () => {
  const [alertMsg, setAlertMsg] = useState<AlertMsgState>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  const showAlertMsg = useCallback((
    type: AlertMsgType,
    title: string,
    message: string,
    duration: number = 2000
  ) => {
    setAlertMsg({
      show: true,
      type,
      title,
      message
    });

    // Auto-hide after specified duration
    setTimeout(() => {
      setAlertMsg(prev => ({ ...prev, show: false }));
    }, duration);
  }, []);

  const hideAlertMsg = useCallback(() => {
    setAlertMsg(prev => ({ ...prev, show: false }));
  }, []);

  return {
    alertMsg,
    showAlertMsg,
    hideAlertMsg
  };
};