import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Define the shape of our standardized response from the backend
interface StandardizedResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors?: any;
}

const instance = axios.create({
    baseURL: (import.meta.env.VITE_API_BASE_URL || '') + '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request Interceptor
instance.interceptors.request.use(config => {
    return config;
});

// Response Interceptor to unwrap successful data
instance.interceptors.response.use(
    (response: AxiosResponse<StandardizedResponse<any>>): any => {
        const { success, data, message } = response.data;

        if (success) {
            return data;
        } else {
            return Promise.reject(new Error(message || 'Request failed'));
        }
    },
    (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            return axios.post('/api/auth/refresh/', {}, { withCredentials: true })
                .then(() => {
                    // Successfully refreshed, retry the original request
                    return instance(originalRequest);
                })
                .catch((refreshError) => {
                    // Refresh token itself expired, logout the user
                    window.location.href = '/#/login';
                    return Promise.reject(refreshError);
                });
        }

        if (error.response?.data) {
            const { message, errors } = error.response.data as StandardizedResponse<any>;
            return Promise.reject({
                message: message || 'An unexpected error occurred',
                errors: errors,
                status: error.response.status
            });
        }
        return Promise.reject(error);
    }
);

// We cast the instance to a custom type where get/post/etc return Promise<T> instead of Promise<AxiosResponse<T>>
export interface ApiClient extends AxiosInstance {
    get<T = any, R = T, D = any>(url: string, config?: any): Promise<R>;
    post<T = any, R = T, D = any>(url: string, data?: D, config?: any): Promise<R>;
    put<T = any, R = T, D = any>(url: string, data?: D, config?: any): Promise<R>;
    patch<T = any, R = T, D = any>(url: string, data?: D, config?: any): Promise<R>;
    delete<T = any, R = T, D = any>(url: string, config?: any): Promise<R>;
}

const api = instance as ApiClient;
export default api;

