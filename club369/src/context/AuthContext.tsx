import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { AuthService } from '../services/AuthService';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: any) => Promise<void>;
    updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: AuthService.getCurrentUser(),
        isAuthenticated: !!AuthService.getCurrentUser(),
        isLoading: !!AuthService.getCurrentUser(), // Set to true if we need to refresh
    });

    const refreshUser = async () => {
        try {
            const user = await AuthService.getMe();
            setState(prev => ({
                ...prev,
                user,
                isAuthenticated: true,
                isLoading: false,
            }));
        } catch (error) {
            console.error("Failed to refresh user:", error);
            if ((error as any).status === 401) {
                logout();
            } else {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        }
    };

    const login = async (email: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            await AuthService.login(email, password);
            await refreshUser();
        } catch (error) {
            console.error("Login failed:", error);
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AuthService.logout();
        } finally {
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    };

    const register = async (data: any) => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            await AuthService.register(data);
            await refreshUser();
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    const updateProfile = async (data: any) => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const updatedUser = await AuthService.updateProfile(data);
            setState(prev => ({
                ...prev,
                user: updatedUser,
                isLoading: false,
            }));
        } catch (error) {
            console.error("Failed to update profile:", error);
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    useEffect(() => {
        console.log('AuthContext State:', { isAuthenticated: state.isAuthenticated, isLoading: state.isLoading, userRole: state.user?.role });
        if (state.isAuthenticated) {
            refreshUser();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, login, logout, register, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
