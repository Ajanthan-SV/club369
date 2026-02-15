import { MembershipDetails, Voucher, Transaction } from '../types/membership';
import api from '../utils/api';

export const MembershipService = {
    getMembershipDetails: async (): Promise<MembershipDetails> => {
        return await api.get<MembershipDetails>('/membership/details/');
    },

    getVouchers: async (): Promise<Voucher[]> => {
        return await api.get<Voucher[]>('/vouchers/');
    },

    getTransactions: async (): Promise<Transaction[]> => {
        return await api.get<Transaction[]>('/membership/transactions/');
    },

    claimVoucher: async (voucherId: string): Promise<Voucher> => {
        return await api.post<Voucher>(`/vouchers/claim/${voucherId}/`);
    }
};

