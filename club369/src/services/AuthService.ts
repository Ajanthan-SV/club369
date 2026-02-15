import { User } from '../types/auth';
import api from '../utils/api';

export const AuthService = {
    login: async (email: string, password: string): Promise<User> => {
        const user = await api.post<any, User>('/auth/login/', { email, password });
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    },

    logout: async (): Promise<void> => {
        try {
            await api.post('/auth/logout/');
        } finally {
            localStorage.removeItem('user');
        }
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    register: async (data: any): Promise<User> => {
        const user = await api.post<any, User>('/auth/register/', data);
        return user;
    },

    getMe: async (): Promise<User> => {
        const user = await api.get<User>('/auth/me/');
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
        const user = await api.patch<any, User>('/auth/me/', data);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    }
};

