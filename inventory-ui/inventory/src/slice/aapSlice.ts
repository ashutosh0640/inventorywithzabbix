import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction as PayLoadAction } from '@reduxjs/toolkit';
import type { Project } from '../types/responseDto';
import type { ZabbixServerResDTO } from '../types/zabbix';
import { useZabbixServerByProjectIdAndUser } from '../features/zabbixQuery/zabbixServerQuery';


interface AppState {
    selectedProject: Project | null;
    isProjectSelected: boolean;
    zabbixServer: ZabbixServerResDTO | null;
}


const getZabbixServer = (id: number): ZabbixServerResDTO | null => {
    const zabbix = useZabbixServerByProjectIdAndUser(id).data;
    return zabbix ? zabbix : null;
}

const initialState: AppState = {
    selectedProject: null,
    isProjectSelected: false,
    zabbixServer: null,
}


const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setProject: (state, action: PayLoadAction<Project | null>) => {
            state.selectedProject = action.payload;
            state.isProjectSelected = !!action.payload;
            if (action.payload) {
                const zabbix = getZabbixServer(action.payload.id);
                state.zabbixServer = zabbix;
            }
            else {
                state.zabbixServer = null;
            }
        },
        clearProject: (state) => {
            state.selectedProject = null;
            state.isProjectSelected = false;
            state.zabbixServer = null;
        }
    },
});

export const { setProject, clearProject } = appSlice.actions;
export default appSlice.reducer;