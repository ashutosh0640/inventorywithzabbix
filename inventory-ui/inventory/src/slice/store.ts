import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
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

// Typed hooks for use throughout your app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;