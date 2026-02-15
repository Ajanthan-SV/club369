import { baseApi } from './baseApi';
import { User } from '../../types/auth';
import { Transaction } from '../../types/membership';

export const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminUsers: builder.query<User[], void>({
            query: () => '/admin/users/',
        }),
        getAdminTransactions: builder.query<Transaction[], void>({
            query: () => '/admin/transactions/',
        }),
        getAdminCollections: builder.query<{ total_last_30_days: number }, void>({
            query: () => '/admin/collections/',
        }),
    }),
});

export const {
    useGetAdminUsersQuery,
    useGetAdminTransactionsQuery,
    useGetAdminCollectionsQuery,
} = adminApi;
