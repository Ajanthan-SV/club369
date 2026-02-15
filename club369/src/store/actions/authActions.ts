import { AppDispatch } from '../store';
import { logout as logoutAction } from '../slices/authSlice';
import { authApi } from '../api/authApi';
import { baseApi } from '../api/baseApi';
import { AuthService } from '../../services/AuthService';

/**
 * Centralized logout function that:
 * 1. Calls the backend logout API
 * 2. Clears the Redux auth state
 * 3. Clears all cached API data
 * 4. Clears localStorage user data
 */
export const performLogout = () => async (dispatch: AppDispatch) => {
    try {
        // 1. Backend Logout (Clears cookies)
        // Since LogoutView is now AllowAny, this always succeeds in clearing browser cookies
        await dispatch(authApi.endpoints.logout.initiate()).unwrap();
    } catch (error) {
        console.error('Logout API failed:', error);
    } finally {
        // 2. Clear Redux Auth State
        dispatch(logoutAction());

        // 3. Reset API Cache (Clear all RTK Query data)
        dispatch(baseApi.util.resetApiState());

        // 4. Clear LocalStorage via AuthService
        AuthService.logout().catch(() => { });

        // 5. Hard redirect to login to ensure clean state
        window.location.hash = '/login';
    }
};
