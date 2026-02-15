import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/AuthService';

/**
 * useHeartbeat hook
 * Periodically hits the 'me' endpoint to ensure:
 * 1. The session is still valid.
 * 2. Automatic token rotation/refresh happens even during idle in-page navigation.
 * 
 * @param intervalMs Frequency of the check (default 5 minutes)
 */
export const useHeartbeat = (intervalMs = 300000) => {
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) return;

        const checkSession = async () => {
            try {
                await AuthService.getMe();
            } catch (error: any) {
                // If we get a 401 and the interceptor didn't already handle it,
                // ensure we clear the state here.
                if (error.response?.status === 401) {
                    console.warn("Heartbeat detected expired session.");
                    // Note: The interceptor in api.ts will usually trigger performLogout first.
                }
            }
        };

        const timer = setInterval(checkSession, intervalMs);
        return () => clearInterval(timer);
    }, [isAuthenticated, logout, intervalMs]);
};
