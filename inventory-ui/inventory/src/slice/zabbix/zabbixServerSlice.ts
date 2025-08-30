import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ZabbixServerResDTO } from '../../types/zabbix';

interface ZabbixState {
  selectedServer: ZabbixServerResDTO | null;
  isSelected: boolean;
}

const initialState: ZabbixState = {
  selectedServer: null,
  isSelected: false,
};
  

const zabbixSlice = createSlice({
  name: 'zabbixserver',
  initialState,
  reducers: {
    addServer: (state, action: PayloadAction<ZabbixServerResDTO>) => {
      console.log('Zabbix server added:', action.payload);
      state.selectedServer = action.payload;
      state.isSelected = true;
    }
  },
});

export const {
  addServer,
} = zabbixSlice.actions;

export default zabbixSlice.reducer;