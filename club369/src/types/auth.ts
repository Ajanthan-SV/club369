export type Role = 'user' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    mobile?: string;
    profile_picture?: string;
    status: string;
    membership_status?: 'ACTIVE' | 'EXPIRED' | 'NONE';
    membership_end_date?: string;
    created_at?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
