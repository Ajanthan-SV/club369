import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarLink: React.FC<{ to: string; icon: string; label: string; badge?: string }> = ({ to, icon, label, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
        ? 'bg-gradient-to-r from-primary/20 to-transparent border-l-4 border-primary text-white shadow-[inset_10px_0_20px_rgba(175,37,244,0.1)]'
        : 'text-[#b09cba] hover:bg-white/5 hover:text-white'
        }`}
    >
      <div className="flex items-center gap-4">
        <span className={`material-symbols-outlined transition-transform duration-300 ${isActive ? 'text-primary scale-110' : 'group-hover:text-primary group-hover:scale-110'}`}>
          {icon}
        </span>
        <span className={`text-sm font-medium tracking-wide ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
          {label}
        </span>
      </div>
      {badge && (
        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold group-hover:bg-primary group-hover:text-white transition-colors">
          {badge}
        </span>
      )}
    </Link>
  );
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const logoUrl = "/images/cloud369.png";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a070b] font-display text-white selection:bg-primary/30 relative">

      {/* Fixed Background Watermark */}
      <div className="fixed inset-0 z-0 flex items-center justify-center opacity-[0.09] pointer-events-none overflow-hidden">
        <img
          src={logoUrl}
          alt="logo"
          className="w-[120vw] h-[120vh] md:w-[70vw] md:h-[70vw] object-contain blur-[2px]"
        />
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Aesthetic Background Blurs */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[160px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] rounded-full bg-blue-500/15 blur-[160px] pointer-events-none opacity-60"></div>
        <div className="absolute top-[20%] right-[5%] w-[45%] h-[45%] rounded-full bg-purple-500/10 blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px] pointer-events-none opacity-30"></div>

        {/* Page Content Slot */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 z-10 custom-scrollbar relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;