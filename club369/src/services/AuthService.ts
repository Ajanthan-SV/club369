import axios from 'axios';
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
    },

    getUploadSignature: async (): Promise<any> => {
        return await api.get('/profile/upload-signature/');
    },

    saveProfilePic: async (secure_url: string, public_id: string): Promise<any> => {
        return await api.post('/profile/save-picture/', { secure_url, public_id });
    },

    uploadToCloudinary: async (file: File, signatureData: any): Promise<any> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', signatureData.api_key);
        formData.append('timestamp', signatureData.timestamp);
        formData.append('signature', signatureData.signature);
        formData.append('folder', signatureData.folder);
        formData.append('transformation', signatureData.transformation);

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/image/upload`,
            formData
        );
        return response.data;
    }
};

