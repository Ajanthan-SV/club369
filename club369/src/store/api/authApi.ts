import { baseApi } from './baseApi';
import { User } from '../../types/auth';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<User, any>({
            query: (credentials) => ({
                url: '/auth/login/',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'],
        }),
        register: builder.mutation<User, any>({
            query: (data) => ({
                url: '/auth/register/',
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout/',
                method: 'POST',
            }),
            invalidatesTags: ['User', 'Profile', 'Dashboard'],
        }),
        getMe: builder.query<User, void>({
            query: () => '/auth/me/',
            providesTags: ['User'],
        }),
        updateMe: builder.mutation<User, Partial<User>>({
            query: (data) => ({
                url: '/auth/me/',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetMeQuery,
    useUpdateMeMutation,
} = authApi;
