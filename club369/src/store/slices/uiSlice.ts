import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    isLoading: boolean;
    globalError: string | null;
    sidebarOpen: boolean;
}

const initialState: UiState = {
    isLoading: false,
    globalError: null,
    sidebarOpen: false,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setGlobalError: (state, action: PayloadAction<string | null>) => {
            state.globalError = action.payload;
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
    },
});

export const { setLoading, setGlobalError, toggleSidebar, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
