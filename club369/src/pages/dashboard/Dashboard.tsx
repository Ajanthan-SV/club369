import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useMembership } from '../../hooks/useMembership';
import Profile from '../shared/Profile';
import RenewButton from '../../components/membership/RenewButton';
import VoucherCard from '../../components/vouchers/VoucherCard';
import { getFullUrl } from '../../utils/url';
import { formatDate } from '../../utils/date';

// --- Sub-components for Dashboard Views ---

interface VouchersProps {
    user: any;
    membershipStatus: string;
    vouchers: any[];
    onClaim: (id: string) => void;
}

const Vouchers: React.FC<VouchersProps> = ({ user, membershipStatus, vouchers, onClaim }) => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">My Rewards</h2>
                    <p className="text-gray-500 text-sm">Exclusive benefits curated for your membership tier.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vouchers.map(v => (
                    <VoucherCard
                        key={v.id}
                        {...v}
                        membershipStatus={membershipStatus}
                        onClaim={onClaim}
                    />
                ))}
            </div>
        </div >
    );
};


const Overview: React.FC<{ user: any, details: any, transactions: any[], daysRemaining: number, progressPercent: number }> = ({ user, details, transactions, daysRemaining, progressPercent }) => (
    <div className="space-y-12">
        {/* Main Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 1. Subscription & Autopay Status */}
            <motion.div
                className="lg:col-span-2 bg-gradient-to-br from-[#161118] to-[#0f0a12] border border-white/10 p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between h-full group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Status</div>
                        <div className="flex items-center gap-3">
                            <h4 className="text-2xl font-bold">Member Account</h4>
                            <span className={`px-2 py-0.5 ${details?.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} text-[10px] font-bold border rounded-full uppercase`}>
                                {details?.status || 'INACTIVE'}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Next Billing</div>
                        <div className="text-xl font-bold">
                            {details ? new Date(details.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                        <span className="text-gray-400">Cycle Progress</span>
                        <span className="text-primary">{daysRemaining} Days Left</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 mb-6">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary via-purple-500 to-blue-500"
                        />
                    </div>

                    <RenewButton
                        status={details?.status || 'none'}
                        expiryDate={details?.expiryDate || ''}
                        amount={4999}
                        email={user?.email || ''}
                        name={user?.name || ''}
                        mobile={user?.mobile || ''}
                    />
                </div>
            </motion.div>

            {/* 2. Contact Section */}
            <a
                href="mailto:support@club369.com"
                className="bg-[#161118] border border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center gap-6 group hover:border-primary/30 transition-all cursor-pointer"
            >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-3xl">mail</span>
                </div>
                <div className="text-center">
                    <h5 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">Contact Admin</h5>
                    <p className="text-lg font-bold text-white">support@club369.com</p>
                </div>
                <div className="text-[10px] uppercase font-bold text-primary tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to Email
                </div>
            </a>
        </div>

        {/* 3. Obsidian Vault Preview */}
        <section>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <span className="material-symbols-outlined text-primary">diamond</span>
                    Ecosystem Vault
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: 'Trading Signals', desc: 'Real-time market insights', icon: 'monitoring', color: 'bg-blue-500/10 text-blue-500' },
                    { title: 'Business Strategy', desc: 'Scale your ventures', icon: 'business_center', color: 'bg-emerald-500/10 text-emerald-500' },
                    { title: 'Member Meetups', desc: 'Global networking events', icon: 'groups', color: 'bg-purple-500/10 text-purple-500' },
                    { title: 'Alpha Library', desc: 'Curated investment docs', icon: 'menu_book', color: 'bg-orange-500/10 text-orange-500' }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5, borderColor: 'rgba(175,37,244,0.3)' }}
                        className="p-6 bg-[#161118] border border-white/5 rounded-2xl  transition-all"
                    >
                        <span className={`material-symbols-outlined p-3 rounded-xl ${item.color} mb-4`}>{item.icon}</span>
                        <h4 className="font-bold text-white mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    </div>
);


const TransactionLedger: React.FC<{ transactions: any[] }> = ({ transactions }) => (
    <div className="space-y-8">
        <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight text-left">Payment History</h3>
            <p className="text-gray-500 text-sm text-left">Comprehensive record of your subscription payments.</p>
        </div>

        <div className="bg-[#161118] border border-white/10 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                            <th className="p-5">Billing Date</th>
                            <th className="p-5">Reference</th>
                            <th className="p-5">Amount</th>
                            <th className="p-5 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {transactions.map((txn) => (
                            <tr key={txn.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors text-white">
                                <td className="p-5 text-gray-400">{formatDate(txn.date)}</td>
                                <td className="p-5 font-mono text-xs">{txn.id}</td>
                                <td className="p-5 font-bold">₹ {txn.amount.toLocaleString()}</td>
                                <td className="p-5 text-right">
                                    <span className={`px-2 py-0.5 ${txn.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'} text-[10px] font-bold rounded-md uppercase`}>
                                        {txn.status === 'success' ? 'PAID' : txn.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// --- Main Dashboard Component ---

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { details, vouchers, transactions, isLoading, isRenewalAllowed, claimVoucher } = useMembership();
    const location = useLocation();

    const handleLogout = async () => {
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            await logout();
            navigate('/login');
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="min-h-[60vh] flex items-center justify-center text-white/50 animate-pulse font-bold tracking-widest uppercase text-xs">
                    Initializing Dashboard...
                </div>
            </DashboardLayout>
        );
    }

    const today = new Date();
    const expiry = details ? new Date(details.expiryDate) : today;
    const daysRemaining = Math.max(0, Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const totalCycleDays = 30;
    const progressPercent = details ? Math.min(100, ((totalCycleDays - daysRemaining) / totalCycleDays) * 100) : 0;

    const navItems = [
        { label: 'Overview', path: '/dashboard', icon: 'grid_view' },
        { label: 'Profile', path: '/dashboard/profile', icon: 'account_circle' },
        { label: 'Vouchers', path: '/dashboard/vouchers', icon: 'confirmation_number' },
        { label: 'Payments', path: '/dashboard/payments', icon: 'payments' },
    ];

    return (
        <DashboardLayout>
            {/* Header: Dynamic Welcome */}
            <motion.header
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-primary/20 overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                        {user?.profile_picture ? (
                            <img src={getFullUrl(user.profile_picture) || ''} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-symbols-outlined text-2xl text-primary/40">person</span>
                        )}
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black tracking-tight text-white">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">{user?.name || 'Member'}.</span>
                        </h2>
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Member ID: {user?.id ? String(user.id).slice(0, 8) : 'N/A'}
                        </p>
                    </div>
                </div>

                <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Logout
                </motion.button>
            </motion.header>

            {/* Sub-Navigation */}
            <nav className="flex gap-1 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${location.pathname === item.path
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white border border-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    <Routes location={location}>
                        <Route index element={
                            <Overview
                                user={user}
                                details={details}
                                transactions={transactions}
                                daysRemaining={daysRemaining}
                                progressPercent={progressPercent}
                            />
                        } />
                        <Route path="profile" element={<Profile />} />
                        <Route path="vouchers" element={<Vouchers user={user} membershipStatus={details?.status || 'NONE'} vouchers={vouchers} onClaim={claimVoucher} />} />
                        <Route path="payments" element={
                            <TransactionLedger
                                transactions={transactions}
                            />
                        } />
                    </Routes>
                </motion.div>
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default Dashboard;