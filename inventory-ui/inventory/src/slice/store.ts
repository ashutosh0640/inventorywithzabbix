import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import appReducer from './aapSlice';
import zabbixServerReducer from './zabbix/zabbixServerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    zabbixServer: zabbixServerReducer,
  },
});

// Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
