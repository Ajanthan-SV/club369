import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const KYCPending: React.FC = () => {
  return (
    <div className="min-h-screen font-display text-white selection:bg-primary selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-md w-full bg-[#161118] border border-white/10 rounded-2xl p-10 text-center shadow-2xl mt-20"
        >
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <span className="material-symbols-outlined text-4xl text-yellow-500">hourglass_top</span>
            <div className="absolute inset-0 border border-yellow-500/30 rounded-full animate-ping opacity-50"></div>
          </div>

          <h1 className="text-2xl font-bold mb-4 text-white">Verification Under Review</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Your documents have been securely received and are currently being reviewed by our compliance team. This process typically takes 24-48 hours.
          </p>

          <div className="bg-white/5 rounded-lg p-4 border border-white/5 text-left mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary text-sm">diamond</span>
              <span className="text-sm font-bold text-white">CLUB369 Premium</span>
            </div>
            <p className="text-xs text-gray-500">
              You will receive an email notification once your status changes. Please check back later.
            </p>
          </div>

          <Link to="/" className="text-sm text-gray-500 hover:text-white transition-colors">
            Back to Home
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default KYCPending;