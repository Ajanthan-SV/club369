import { baseApi } from './baseApi';
import { MembershipDetails, Voucher, Transaction } from '../../types/membership';

export const membershipApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMembershipDetails: builder.query<MembershipDetails, void>({
            query: () => '/membership/details/',
            providesTags: ['Dashboard'],
        }),
        getVouchers: builder.query<Voucher[], void>({
            query: () => '/vouchers/',
        }),
        getTransactions: builder.query<Transaction[], void>({
            query: () => '/membership/transactions/',
        }),
        claimVoucher: builder.mutation<void, string>({
            query: (voucherId) => ({
                url: `/vouchers/claim/${voucherId}/`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useGetMembershipDetailsQuery,
    useGetVouchersQuery,
    useGetTransactionsQuery,
    useClaimVoucherMutation,
} = membershipApi;
