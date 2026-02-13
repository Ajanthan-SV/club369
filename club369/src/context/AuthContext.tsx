import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { AuthService } from '../services/AuthService';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: AuthService.getCurrentUser(),
        isAuthenticated: !!AuthService.getCurrentUser(),
        isLoading: false,
    });

    const login = async (email: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const user = await AuthService.login(email, password);
            localStorage.setItem('user', JSON.stringify(user));
            setState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            console.error("Login failed:", error);
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    const logout = async () => {
        await AuthService.logout();
        setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    };

    const register = async (data: any) => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const user = await AuthService.register(data);
            localStorage.setItem('user', JSON.stringify(user));
            setState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout, register }}>
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
