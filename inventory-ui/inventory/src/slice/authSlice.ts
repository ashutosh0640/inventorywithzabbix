import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Login } from '../types/responseDto';

const SESSION_KEY = 'loginDetails';

interface AuthState {
    loginDetails: Login | null;
    isAuthenticated: boolean;
}

const getSessionLogin = (): Login | null => {
    try {
        const stored = sessionStorage.getItem(SESSION_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const initialState: AuthState = {
    loginDetails: getSessionLogin(),
    isAuthenticated: !!getSessionLogin(),
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoginDetails: (state, action: PayloadAction<Login>) => {
            state.loginDetails = action.payload;
            state.isAuthenticated = true;
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.loginDetails = null;
            state.isAuthenticated = false;
            sessionStorage.removeItem(SESSION_KEY);
        },
    },
});
export const { setLoginDetails, logout } = authSlice.actions;
export default authSlice.reducer;