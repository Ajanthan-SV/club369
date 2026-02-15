import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Profile from '../shared/Profile';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { AdminService } from '../../services/AdminService';
import { User as Member } from '../../types/auth';
import { Transaction } from '../../types/membership';
import { getFullUrl } from '../../utils/url';
import { formatDate } from '../../utils/date';

// Redundant interfaces removed, using imports from services/types

interface AdminVoucher {
    id: string;
    title: string;
    code: string;
    description: string;
    limitPerUser: number;
    expiryDate: string;
    isSuspended: boolean;
    usageCount: number;
    usedBy: string[]; // List of user names
}

const Admin: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'EXPIRED' | 'NONE'>('ALL');
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [isPpHovered, setIsPpHovered] = useState(false);


    const [members, setMembers] = useState<Member[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [txnSearch, setTxnSearch] = useState('');
    const [sortRecent, setSortRecent] = useState(true);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // Voucher Management States
    const [vouchers, setVouchers] = useState<AdminVoucher[]>([]);
    const [showVoucherForm, setShowVoucherForm] = useState(false);
    const [newVoucher, setNewVoucher] = useState({ title: '', code: '', expiry: '', description: '' });
    const [expandedVoucherId, setExpandedVoucherId] = useState<string | null>(null);
    const [voucherSearch, setVoucherSearch] = useState('');
    const [voucherStatusFilter, setVoucherStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

    useEffect(() => {
        console.log('Admin Component Mounted');
        const fetchData = async () => {
            console.log('Admin: Fetching data...');
            try {
                const [membersRes, transactionsRes, vouchersRes] = await Promise.all([
                    AdminService.getUsers(),
                    AdminService.getTransactions(),
                    AdminService.getVouchers()
                ]);
                console.log('Admin: Data fetched', { members: membersRes, transactions: transactionsRes, vouchers: vouchersRes });
                setMembers(Array.isArray(membersRes) ? membersRes : []);
                setTransactions(Array.isArray(transactionsRes) ? transactionsRes : []);
                setVouchers(Array.isArray(vouchersRes) ? vouchersRes : []);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
                setMembers([]);
                setTransactions([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate stats
    const stats = {
        totalMembers: (members || []).length,
        activeMembers: (members || []).filter(m => m.membership_status === 'ACTIVE').length,
        expiredMembers: (members || []).filter(m => m.membership_status === 'EXPIRED').length,
        monthlyRevenue: (transactions || [])
            .filter(t => t.status === 'success' && new Date(t.date).getMonth() === new Date().getMonth())
            .reduce((sum, t) => sum + Number(t.amount || 0), 0),
    };

    // Filter and search logic
    const filteredMembers = members.filter(member => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.phone?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'ALL' || member.membership_status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    // Logout functionality
    const handleLogout = async () => {
        // Show confirmation dialog
        const confirmLogout = window.confirm('Are you sure you want to logout?');

        if (confirmLogout) {
            await logout();
            navigate('/login'); // Fixed redirect to /login
        }
    };

    const handleDeleteUser = async (memberId: string) => {
        if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
            try {
                await AdminService.deleteUser(memberId);
                setMembers(prev => prev.filter(m => m.id !== memberId));
                setShowMemberModal(false);
                setSelectedMember(null);
                alert('User deleted successfully.');
            } catch (error: any) {
                console.error("Failed to delete user", error);
                const errorMsg = error.message || "Failed to delete user";
                alert(errorMsg);
            }
        }
    };

    // Member actions
    const handleViewDetails = (member: Member) => {
        setSelectedMember(member);
        setShowMemberModal(true);
    };

    // const handleRetryPayment = (memberId: number) => {
    //     alert(`Retrying payment for member ID: ${memberId}`);
    //     // Implement actual retry logic here
    // };
    // const handleCancelMembership = (memberId: number) => {
    //     alert(`Cancelling membership for member ID: ${memberId}`);
    //     // Implement actual cancel logic here
    // };

    // Voucher actions
    const handleCreateVoucher = async () => {
        if (!newVoucher.title || !newVoucher.code || !newVoucher.expiry) {
            alert('Please fill all fields');
            return;
        }

        try {
            const voucherData = {
                title: newVoucher.title,
                code: newVoucher.code.toUpperCase(),
                expiryDate: newVoucher.expiry,
                description: newVoucher.description,
                max_usage_per_user: 1,
                valid_from: new Date().toISOString()
            };

            const createdVoucher = await AdminService.createVoucher(voucherData);
            setVouchers(prev => [createdVoucher, ...prev]);
            setShowVoucherForm(false);
            setNewVoucher({ title: '', code: '', expiry: '', description: '' });
        } catch (error) {
            console.error("Failed to create voucher", error);
            alert("Failed to create voucher");
        }
    };

    const toggleSuspendVoucher = async (id: string) => {
        try {
            const response = await AdminService.toggleVoucherStatus(id);
            setVouchers(prev => prev.map(v =>
                v.id === id ? { ...v, isSuspended: !response.is_active } : v
            ));
        } catch (error) {
            console.error("Failed to toggle voucher status", error);
            alert("Failed to toggle voucher status");
        }
    };

    const handleDeleteVoucher = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this voucher?')) {
            try {
                await AdminService.deleteVoucher(id);
                setVouchers(prev => prev.filter(v => v.id !== id));
            } catch (error) {
                console.error("Failed to delete voucher", error);
                alert("Failed to delete voucher");
            }
        }
    };

    // const handleSendReminder = (memberId: number) => {
    //     alert(`Sending reminder to member ID: ${memberId}`);
    //     // Implement reminder logic here
    // };

    // Export data
    const handleExportData = () => {
        const csvContent = [
            ['Name', 'Email', 'Status', 'Last Payment', 'Phone', 'Created At'],
            ...members.map(m => [m.name, m.email, m.status, formatDate(m.last_payment_date), m.mobile || '', formatDate(m.created_at)])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `members-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const handleResetTxnFilters = () => {
        setTxnSearch('');
        setDateRange({ start: '', end: '' });
    };
    const navItems = [
        { label: 'Overview', path: '/admin', icon: 'dashboard' },
        { label: 'Profile', path: '/admin/profile', icon: 'account_circle' },
        { label: 'Users', path: '/admin/users', icon: 'group' },
        { label: 'Transactions', path: '/admin/transactions', icon: 'account_balance' },
        { label: 'Vouchers', path: '/admin/vouchers', icon: 'confirmation_number' },
    ];

    const AdminSummary: React.FC = () => (
        <div className="bg-[#161118] border border-white/10 p-6 rounded-3xl flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-full border-2 border-primary/20 overflow-hidden bg-primary/10 flex items-center justify-center">
                {user?.profile_picture ? (
                    <img src={getFullUrl(user.profile_picture) || ''} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="material-symbols-outlined text-3xl text-primary/40">admin_panel_settings</span>
                )}
            </div>
            <div>
                <h3 className="text-xl font-bold text-white leading-tight">{user?.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-[8px] font-bold border border-primary/20 rounded-md uppercase">
                        Admin
                    </span>
                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                        System Controller
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a0a1a] p-3 sm:p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto flex flex-col gap-4 md:gap-6">
                    {/* Header */}

                    <motion.div
                        className="flex flex-col gap-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >

                        {/* Title and Logout Row */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-12 h-12 rounded-full border-2 border-primary/20 overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                                    {user?.profile_picture ? (
                                        <img src={getFullUrl(user.profile_picture) || ''} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-2xl text-primary/40">person</span>
                                    )}
                                </div>
                                <motion.div>
                                    <h2 className="text-3xl font-black tracking-tight text-white">
                                        Hi, Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">{user?.name || 'Member'}.</span>
                                    </h2>
                                </motion.div>
                            </div>

                            <div className="flex gap-2">
                                <motion.button
                                    onClick={handleExportData}
                                    className="px-4 py-2.5 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">download</span>
                                    <span>Export</span>
                                </motion.button>
                                <motion.button
                                    onClick={handleLogout}
                                    className="px-4 py-2.5 bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">logout</span>
                                    <span>Logout</span>
                                </motion.button>
                            </div>
                        </div>

                        {/* Sub-Navigation */}
                        <nav className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${(item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path))
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white border border-white/5'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <Routes>
                            <Route index element={
                                <div className="space-y-6">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                                        {[
                                            { title: 'Total Members', val: stats.totalMembers.toString(), icon: 'groups', color: 'text-blue-400', bg: 'from-blue-500/10' },
                                            { title: 'Active Members', val: stats.activeMembers.toString(), icon: 'check_circle', color: 'text-emerald-400', bg: 'from-emerald-500/10' },
                                            { title: 'Expired Members', val: stats.expiredMembers.toString(), icon: 'error', color: 'text-red-400', bg: 'from-red-500/10' },
                                            { title: 'Monthly Revenue', val: `₹${stats.monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'payments', color: 'text-primary', bg: 'from-purple-500/10' },
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-[#161118] border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                                                <div className="relative z-10 flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.title}</p>
                                                        <h4 className="text-2xl font-bold text-white">{stat.val}</h4>
                                                    </div>
                                                    <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-[#161118] border border-white/10 rounded-2xl overflow-hidden">
                                        <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                                            <h3 className="font-bold text-white uppercase tracking-tight text-sm flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-lg">history</span>
                                                Recent Transactions
                                            </h3>
                                            <Link to="/admin/transactions" className="text-[10px] font-bold text-primary hover:text-white uppercase tracking-widest transition-colors">View All Ledger</Link>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm text-gray-400">
                                                <thead className="text-[10px] uppercase font-bold text-gray-500 bg-white/5">
                                                    <tr>
                                                        <th className="px-6 py-4">Date</th>
                                                        <th className="px-6 py-4">User</th>
                                                        <th className="px-6 py-4">Amount</th>
                                                        <th className="px-6 py-4 text-right">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {(transactions || [])
                                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                                        .slice(0, 5)
                                                        .map(txn => (
                                                            <tr key={txn.id} className="hover:bg-white/5 transition-colors">
                                                                <td className="px-6 py-4 text-xs text-gray-500">{formatDate(txn.date)}</td>
                                                                <td className="px-6 py-4 font-bold text-white">
                                                                    <div className="flex flex-col">
                                                                        <span>{(txn as any).user_name || 'Unknown'}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 font-mono">₹{Number(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${txn.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                                        {txn.status.toUpperCase()}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            } />

                            <Route path="profile" element={<Profile />} />

                            <Route path="users" element={
                                <div className="bg-[#161118] border border-white/10 rounded-xl overflow-hidden">
                                    <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                                        <h3 className="font-bold text-white">Member Directory</h3>
                                        <div className="flex items-center gap-3">
                                            <select
                                                value={filterStatus}
                                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-400 outline-none focus:border-primary cursor-pointer transition-all pr-4"
                                            >
                                                <option value="ALL">All Status</option>
                                                <option value="ACTIVE">Active</option>
                                                <option value="EXPIRED">Expired</option>
                                                <option value="NONE">None</option>
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Quick search..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm text-gray-400">
                                            <thead className="text-[10px] uppercase font-bold text-gray-500 bg-white/5">
                                                <tr>
                                                    <th className="px-6 py-4">Profile</th>
                                                    <th className="px-6 py-4">Contact</th>
                                                    <th className="px-6 py-4">Last Payment</th>
                                                    <th className="px-6 py-4">Membership Status</th>
                                                    <th className="px-6 py-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {filteredMembers.map(member => (
                                                    <tr key={member.id} className="hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4 flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                                                                {member.name.charAt(0)}
                                                            </div>
                                                            <div className="font-bold text-white">{member.name}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {/* <div>{member.email}</div> */}
                                                            <div>{member.mobile}</div>
                                                            {/* <div className="text-[10px]">{member.mobile || 'N/A'}</div> */}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-white font-mono text-xs">{formatDate(member.last_payment_date)}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${member.membership_status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                                {member.membership_status.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button onClick={() => handleViewDetails(member)} className="text-primary hover:text-white font-bold text-[10px] uppercase underline decoration-primary/30">View File</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            } />

                            <Route path="transactions" element={
                                <div className="bg-[#161118] border border-white/10 rounded-xl overflow-hidden">
                                    <div className="p-4 border-b border-white/10 bg-white/5 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-white">Financial Ledger</h3>
                                            <button
                                                onClick={() => setSortRecent(!sortRecent)}
                                                className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white"
                                            >
                                                {sortRecent ? 'Recent First ↓' : 'Oldest First ↑'}
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-3 items-center">
                                            <div className="flex-1 min-w-[200px]">
                                                <input
                                                    type="text"
                                                    placeholder="Search user name..."
                                                    value={txnSearch}
                                                    onChange={(e) => setTxnSearch(e.target.value)}
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary"
                                                />
                                            </div>
                                            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-2">
                                                <div className="relative flex items-center">
                                                    {/* <span className="material-symbols-outlined text-[14px] text-primary/40 mr-1.5 pointer-events-none">calendar_month</span> */}
                                                    <input
                                                        type="date"
                                                        value={dateRange.start} mask="MM/DD/YYYY"
                                                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                                        className="bg-transparent py-1.5 text-[10px] text-gray-300 outline-none focus:text-primary transition-colors [color-scheme:dark] w-24"
                                                    />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-600 uppercase mx-1">to</span>
                                                <div className="relative flex items-center">
                                                    {/* <span className="material-symbols-outlined text-[14px] text-primary/40 mr-1.5 pointer-events-none">calendar_month</span> */}
                                                    <input
                                                        type="date"
                                                        value={dateRange.end}
                                                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                                        className="bg-transparent py-1.5 text-[10px] text-gray-300 outline-none focus:text-primary transition-colors [color-scheme:dark] w-24"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleResetTxnFilters}
                                                className="px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm text-gray-400">
                                            <thead className="text-[10px] uppercase font-bold text-gray-500 bg-white/5">
                                                <tr>
                                                    <th className="px-6 py-4">Date</th>
                                                    <th className="px-6 py-4">User</th>
                                                    <th className="px-6 py-4">Amount</th>
                                                    <th className="px-6 py-4">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {transactions
                                                    .filter(t => {
                                                        const userName = typeof t.user === 'string' ? t.user : (t.user as any)?.name || '';
                                                        const matchesUser = userName.toLowerCase().includes(txnSearch.toLowerCase());
                                                        const tDate = new Date(t.date).getTime();
                                                        const start = dateRange.start ? new Date(dateRange.start).getTime() : 0;
                                                        const end = dateRange.end ? new Date(dateRange.end).getTime() + (24 * 60 * 60 * 1000) : Infinity;
                                                        return matchesUser && tDate >= start && tDate <= end;
                                                    })
                                                    .sort((a, b) => {
                                                        const dateA = new Date(a.date).getTime();
                                                        const dateB = new Date(b.date).getTime();
                                                        return sortRecent ? dateB - dateA : dateA - dateB;
                                                    })
                                                    .map(txn => (
                                                        <tr key={txn.id} className="hover:bg-white/5 transition-colors">
                                                            <td className="px-6 py-4 text-xs">{formatDate(txn.date)}</td>
                                                            <td className="px-6 py-4 font-bold text-white">
                                                                <div className="flex flex-col">
                                                                    <span>{txn.user_name || 'Unknown'}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 font-mono">₹{Number(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${txn.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                                    {txn.status.toUpperCase()}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            } />

                            <Route path="vouchers" element={
                                <div className="space-y-6">
                                    <div className="bg-[#161118] border border-white/10 rounded-2xl p-6">
                                        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">confirmation_number</span>
                                                Voucher Management
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <div className="relative group min-w-[200px]">
                                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm group-focus-within:text-primary transition-colors">search</span>
                                                    <input
                                                        type="text"
                                                        placeholder="Search title/code..."
                                                        value={voucherSearch}
                                                        onChange={(e) => setVoucherSearch(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-primary/50 transition-all"
                                                    />
                                                </div>
                                                <select
                                                    value={voucherStatusFilter}
                                                    onChange={(e) => setVoucherStatusFilter(e.target.value as any)}
                                                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-400 outline-none focus:border-primary/50 cursor-pointer transition-all pr-4"
                                                >
                                                    <option value="all">All Status</option>
                                                    <option value="active">Active</option>
                                                    <option value="suspended">Suspended</option>
                                                    <option value="expired">Expired</option>
                                                </select>
                                                <button
                                                    onClick={() => setShowVoucherForm(!showVoucherForm)}
                                                    className="px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-primary/80 transition-all flex items-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-sm">{showVoucherForm ? 'close' : 'add'}</span>
                                                    {showVoucherForm ? 'Cancel' : 'New Voucher'}
                                                </button>
                                            </div>
                                        </div>

                                        {showVoucherForm && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mb-8 p-6 bg-white/5 border border-white/10 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4"
                                            >
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Voucher Title</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Voucher Title (e.g. Summer Discount)"
                                                        value={newVoucher.title}
                                                        onChange={(e) => setNewVoucher(prev => ({ ...prev, title: e.target.value }))}
                                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Description</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Voucher Description"
                                                        value={newVoucher.description}
                                                        onChange={(e) => setNewVoucher(prev => ({ ...prev, description: e.target.value }))}
                                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Voucher Code</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. SUMMER369"
                                                        value={newVoucher.code}
                                                        onChange={(e) => setNewVoucher(prev => ({ ...prev, code: e.target.value }))}
                                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary uppercase"
                                                    />
                                                </div>
                                                <div className="flex gap-2 items-end">
                                                    <div className="flex-1">
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Expiry Date</label>
                                                        <input
                                                            type="date"
                                                            value={newVoucher.expiry}
                                                            onChange={(e) => setNewVoucher(prev => ({ ...prev, expiry: e.target.value }))}
                                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={handleCreateVoucher}
                                                        className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-500 transition-all"
                                                    >
                                                        Create
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm text-gray-400">
                                                <thead className="text-[10px] uppercase font-bold text-gray-500 bg-white/5">
                                                    <tr>
                                                        <th className="px-6 py-4">Voucher (Title/Code)</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4">Expiry</th>
                                                        <th className="px-6 py-4">Usage</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {vouchers
                                                        .filter(v => {
                                                            const matchesSearch = v.title.toLowerCase().includes(voucherSearch.toLowerCase()) ||
                                                                v.code.toLowerCase().includes(voucherSearch.toLowerCase());
                                                            const isExpired = new Date(v.expiryDate) < new Date();
                                                            const status = v.isSuspended ? 'suspended' : (isExpired ? 'expired' : 'active');
                                                            const matchesStatus = voucherStatusFilter === 'all' || status === voucherStatusFilter;
                                                            return matchesSearch && matchesStatus;
                                                        })
                                                        .map(v => {
                                                            const isExpired = new Date(v.expiryDate) < new Date();
                                                            const status = v.isSuspended ? 'SUSPENDED' : (isExpired ? 'EXPIRED' : 'ACTIVE');
                                                            const isExpanded = expandedVoucherId === v.id;

                                                            return (
                                                                <React.Fragment key={v.id}>
                                                                    <tr className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setExpandedVoucherId(isExpanded ? null : v.id)}>
                                                                        <td className="flex items-center gap-2 px-6 py-4">
                                                                            <button className="text-gray-400 hover:text-white transition-colors">
                                                                                <span className="material-symbols-outlined text-sm">{isExpanded ? 'expand_less' : 'expand_more'}</span>
                                                                            </button>
                                                                            <div className="font-bold text-white uppercase tracking-wider">{v.title}</div>
                                                                            <div className="text-[10px] text-primary font-mono">{v.code}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' :
                                                                                status === 'SUSPENDED' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                                                                                }`}>
                                                                                {status}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-6 py-4 text-xs">{formatDate(v.expiryDate)}</td>
                                                                        <td className="px-6 py-4">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="font-bold text-white">{v.usageCount}</span>
                                                                                <span className="text-[10px] text-gray-600 uppercase">Claims</span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-4 text-right">
                                                                            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                                                <button
                                                                                    onClick={() => toggleSuspendVoucher(v.id)}
                                                                                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${v.isSuspended ? 'bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white' : 'bg-amber-600/10 text-amber-500 hover:bg-amber-600 hover:text-white'
                                                                                        }`}
                                                                                >
                                                                                    {v.isSuspended ? 'Resume' : 'Suspend'}
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteVoucher(v.id)}
                                                                                    className="px-3 py-1 rounded text-[10px] font-bold uppercase bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all"
                                                                                >
                                                                                    Delete
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <AnimatePresence>
                                                                        {isExpanded && (
                                                                            <tr>
                                                                                <td colSpan={5} className="px-6 py-0 bg-black/20">
                                                                                    <motion.div
                                                                                        initial={{ height: 0, opacity: 0 }}
                                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                                        exit={{ height: 0, opacity: 0 }}
                                                                                        className="overflow-hidden"
                                                                                    >
                                                                                        <div className="py-4 border-l-2 border-primary/30 ml-2 pl-6">
                                                                                            <h5 className="text-[10px] font-bold text-gray-500 uppercase mb-3 tracking-widest">Members who claimed this:</h5>
                                                                                            {v.usedBy.length > 0 ? (
                                                                                                <div className="flex flex-wrap gap-2">
                                                                                                    {v.usedBy.map((name, i) => (
                                                                                                        <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white">
                                                                                                            {name}
                                                                                                        </span>
                                                                                                    ))}
                                                                                                </div>
                                                                                            ) : (
                                                                                                <p className="text-xs text-gray-600 italic">No usage recorded yet.</p>
                                                                                            )}
                                                                                        </div>
                                                                                    </motion.div>
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </React.Fragment>
                                                            );
                                                        })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            } />
                        </Routes>
                    </AnimatePresence>
                </div>

                {/* Member Details Modal */}
                <AnimatePresence>
                    {showMemberModal && selectedMember && (
                        <motion.div
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMemberModal(false)}
                        >
                            <motion.div
                                className="bg-[#161118] border border-white/10 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-16 h-16 rounded-full border-2 border-primary/20 overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 cursor-pointer relative"
                                            onMouseEnter={() => setIsPpHovered(true)}
                                            onMouseLeave={() => setIsPpHovered(false)}
                                        >
                                            {selectedMember.profile_picture ? (
                                                <img src={getFullUrl(selectedMember.profile_picture) || ''} alt={selectedMember.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-3xl text-primary/40">person</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">
                                                {selectedMember.name}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                Member Details
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowMemberModal(false)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Email</p>
                                            <p className="text-sm text-white">{selectedMember.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Mobile Number</p>
                                            <p className="text-sm text-white">{selectedMember.mobile || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Joined</p>
                                            <p className="text-sm text-white">{formatDate(selectedMember.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Account Status</p>
                                            <span
                                                className={`inline-block px-2 py-1 rounded text-xs font-bold ${selectedMember.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
                                            >
                                                {selectedMember.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Last Payment</p>
                                            <p className="text-sm text-white">{formatDate(selectedMember.last_payment_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Next Billing</p>
                                            <p className="text-sm text-white">{formatDate(selectedMember.membership_end_date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        {/* <button
                                            onClick={() => handleSendReminder(selectedMember.id)}
                                            className="flex-1 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/80 transition-all"
                                        >
                                            Send Reminder
                                        </button> */}
                                        {selectedMember.membership_status !== 'ACTIVE' && (

                                            <>
                                                {selectedMember.mobile && (
                                                    <button
                                                        onClick={() => window.location.href = `tel:${selectedMember.mobile}`}
                                                        className="flex-1 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-blue-500 transition-all"
                                                    >
                                                        Call Member
                                                    </button>
                                                )}
                                                {selectedMember.status !== 'ACTIVE' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(selectedMember.id)}
                                                        className="flex-1 px-4 py-2 bg-red-600/10 border border-red-600/20 text-red-500 text-sm font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                        <span>Delete User</span>
                                                    </button>
                                                )}
                                                {/* <button
                                                    onClick={() => handleRetryPayment(selectedMember.id)}
                                                    className="flex-1 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-500 transition-all"
                                                >
                                                    Retry Payment
                                                </button>
                                                <button
                                                    onClick={() => handleCancelMembership(selectedMember.id)}
                                                    className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-500 transition-all"
                                                >
                                                    Cancel Membership
                                                </button> */}
                                            </>


                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Hover Zoom Popup (Fixed at overlay level to avoid clipping) */}
                            <AnimatePresence>
                                {isPpHovered && selectedMember.profile_picture && (
                                    <motion.div
                                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-2xl border-4 border-primary/50 shadow-[0_0_50px_rgba(168,85,247,0.4)] overflow-hidden z-[100] bg-[#161118] pointer-events-none"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                    >
                                        <img
                                            src={getFullUrl(selectedMember.profile_picture) || ''}
                                            alt={selectedMember.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout >
    );
};

export default Admin;