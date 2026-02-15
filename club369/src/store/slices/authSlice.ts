import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Role } from '../../types/auth';

interface AuthState {
    user: User | null;
    role: Role | null;
}

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    role: (JSON.parse(localStorage.getItem('user') || 'null')?.role as Role) || null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User | null }>
        ) => {
            state.user = action.payload.user;
            state.role = action.payload.user?.role || null;
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            // Note: localStorage removal of user is handled by existing logic in AuthService
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
