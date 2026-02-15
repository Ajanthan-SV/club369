import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
});

const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // try to get a new token
        const refreshResult = await baseQuery({ url: '/auth/refresh/', method: 'POST' }, api, extraOptions);

        if (refreshResult.data) {
            // retry the original query with new access token
            result = await baseQuery(args, api, extraOptions);
        } else {
            // refresh failed - perform central logout
            const { performLogout } = await import('../actions/authActions');
            await api.dispatch(performLogout() as any);
        }
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Profile', 'Dashboard'],
    endpoints: () => ({}),
});
