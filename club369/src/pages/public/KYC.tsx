import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { motion } from 'framer-motion';

const KYC: React.FC = () => {
    const navigate = useNavigate();
    const [idType, setIdType] = useState('aadhaar');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call to insert into user_kyc
        setTimeout(() => {
            setIsLoading(false);
            navigate('/status-pending');
        }, 2000);
    };

    return (
        <div className="min-h-screen font-display text-white selection:bg-primary selection:text-white flex flex-col">
            <Navbar />

            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden pt-28 md:pt-32">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]"></div>
                </div>

                <div className="w-full max-w-4xl z-10 grid lg:grid-cols-2 gap-0 md:gap-8 bg-[#161118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

                    {/* Left Info Panel */}
                    <div className="p-6 md:p-10 bg-gradient-to-br from-primary/10 to-[#161118] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-4">Identity Verification</h1>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                To maintain the integrity and exclusivity of CLUB369, we strictly verify every applicant. Your data is encrypted and stored on a secure private ledger.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="material-symbols-outlined text-primary">lock</span>
                                    <span>256-bit Bank Grade Encryption</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="material-symbols-outlined text-primary">visibility_off</span>
                                    <span>Private & Confidential</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 md:mt-10">
                            <div className="h-1 w-full bg-white/10 rounded-full mb-2 overflow-hidden">
                                <div className="h-full w-1/3 bg-primary"></div>
                            </div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Step 1 of 3</p>
                        </div>
                    </div>

                    {/* Right Form Panel */}
                    <div className="p-6 md:p-10">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Government ID Type</label>
                                <select
                                    value={idType}
                                    onChange={(e) => setIdType(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                >
                                    <option value="aadhaar">Aadhaar Card</option>
                                    <option value="pan">PAN Card</option>
                                    <option value="passport">Passport</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">ID Number (Masked)</label>
                                <input
                                    type="text"
                                    placeholder="XXXX XXXX 1234"
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Front Side</label>
                                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/10 rounded-lg hover:border-primary/50 cursor-pointer transition-colors bg-white/5">
                                        <span className="material-symbols-outlined text-gray-400">upload_file</span>
                                        <span className="text-[10px] text-gray-500 mt-2">Click to Upload</span>
                                        <input type="file" className="hidden" required />
                                    </label>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Back Side</label>
                                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/10 rounded-lg hover:border-primary/50 cursor-pointer transition-colors bg-white/5">
                                        <span className="material-symbols-outlined text-gray-400">upload_file</span>
                                        <span className="text-[10px] text-gray-500 mt-2">Click to Upload</span>
                                        <input type="file" className="hidden" required />
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-4 w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
                            >
                                {isLoading ? 'Verifying...' : 'Submit Verification'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default KYC;