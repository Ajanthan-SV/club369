import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const logoUrl = "/images/cloud369.png";

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      // Backend/Service automatically sets role. App.tsx ProtectedRoute handles the rest.
      navigate('/admin');
    } catch (err) {
      setError("Unauthorized access. Please use an admin account.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center font-display selection:bg-emerald-500 selection:text-white perspective-1000">

      {/* Enhanced Background - Admin Theme (Emerald/Gold) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Main central glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px] mix-blend-screen"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-700/10 rounded-full blur-[100px]"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-teal-900/10 rounded-full blur-[90px]"
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Additional accent orb */}
        <motion.div
          className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-yellow-900/5 rounded-full blur-[80px]"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Grain texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

        {/* Floating particles - emerald theme */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Animated grid lines */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
          }}
        />

        {/* Rotating rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-emerald-500/10 rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-emerald-500/10 rounded-full"
          animate={{
            rotate: -360,
            scale: [1, 0.9, 1],
          }}
          transition={{
            rotate: {
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        {/* Hexagonal pattern overlay */}
        <motion.div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%2310b981' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
            x: mousePosition.x * -0.3,
            y: mousePosition.y * -0.3,
          }}
        />
      </div>

      {/* Admin Login Card with 3D Effects */}
      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="bg-[#0f1210]/90 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden"
          style={{
            transformStyle: "preserve-3d",
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
          }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Top accent line with glow */}
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
            animate={{
              opacity: [0.5, 1, 0.5],
              boxShadow: [
                "0 0 10px rgba(16, 185, 129, 0.3)",
                "0 0 20px rgba(16, 185, 129, 0.6)",
                "0 0 10px rgba(16, 185, 129, 0.3)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          {/* Animated background gradients inside card */}
          <motion.div
            className="absolute top-0 right-0 w-60 h-60 bg-emerald-600/10 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-60 h-60 bg-teal-600/10 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Scan line effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none"
            animate={{
              y: ["-100%", "100%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Header with Logo */}
          <div className="text-center mb-10 flex flex-col items-center relative z-10">
            <motion.div
              className="mb-6 filter drop-shadow-[0_0_10px_rgba(16, 185, 129, 0.3)]"
              initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
              whileHover={{
                scale: 1.1,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.5 }
              }}
            >
              <motion.div
                className="h-16 w-32 bg-[#059669]"
                style={{
                  maskImage: `url(${logoUrl})`,
                  WebkitMaskImage: `url(${logoUrl})`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center'
                }}
                animate={{
                  filter: [
                    "drop-shadow(0 0 10px rgba(16, 185, 129, 0.3))",
                    "drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))",
                    "drop-shadow(0 0 10px rgba(16, 185, 129, 0.3))",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />

              <motion.h1
                className="text-2xl font-bold tracking-[0.2em] text-white mb-2 mt-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                CLUB369
              </motion.h1>

              <motion.p
                className="text-emerald-500 text-xs font-bold tracking-[0.3em] uppercase"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  opacity: {
                    duration: 3,
                    repeat: Infinity,
                  },
                  default: { delay: 0.7 }
                }}
              >
                Administration
              </motion.p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-[10px] font-bold uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}

            {/* Security badge */}
            <motion.div
              className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/20 rounded-full px-4 py-1.5 mt-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: "spring" }}
            >
              <motion.span
                className="material-symbols-outlined text-emerald-500 text-sm"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                verified_user
              </motion.span>
              <span className="text-[10px] text-emerald-400 font-bold tracking-wider">SECURE ACCESS</span>
              <motion.div
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </div>

          {/* Form with Staggered Animations */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5 relative z-10">
            {/* Admin ID Field */}
            <motion.div
              className="space-y-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Admin ID</label>
              <div className="relative group/input">
                <motion.div
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/input:text-emerald-500 transition-colors"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                </motion.div>
                <motion.input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@club369.com"
                  className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                  required
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </motion.div>

            {/* Secure Key Field */}
            <motion.div
              className="space-y-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Secure Key</label>
              <div className="relative group/input">
                <motion.div
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/input:text-emerald-500 transition-colors"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="material-symbols-outlined text-[20px]">vpn_key</span>
                </motion.div>
                <motion.input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                  required
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </motion.div>

            {/* DEMO HELPER */}
            <motion.div
              className="p-3 bg-emerald-900/10 rounded-lg border border-emerald-500/10 text-[10px] text-gray-400 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              whileHover={{ borderColor: "rgba(16, 185, 129, 0.3)" }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-transparent opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <p className="font-bold mb-1 text-emerald-500 relative z-10">ADMIN ACCESS:</p>
              <motion.span
                onClick={() => setEmail('admin@club369.com')}
                className="cursor-pointer hover:text-white transition-colors relative z-10 block"
                whileHover={{ x: 5, color: "#ffffff" }}
                whileTap={{ scale: 0.95 }}
              >
                • admin@club369.com
              </motion.span>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={authLoading}
              className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-widest uppercase rounded-xl py-4 transition-all shadow-lg flex items-center justify-center gap-2 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.02, y: -2, boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Shine effect on button */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />

              {/* Loading spinner */}
              {authLoading && (
                <motion.span
                  className="material-symbols-outlined"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  progress_activity
                </motion.span>
              )}

              <span className="relative z-10">
                {authLoading ? 'Verifying Credentials...' : 'Access Console'}
              </span>
            </motion.button>
          </form>

          {/* Footer Link */}
          <motion.div
            className="mt-8 text-center relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/login"
                className="text-xs text-gray-500 hover:text-white transition-colors inline-block"
              >
                Return to Member Login
              </Link>
            </motion.div>
          </motion.div>

          {/* Corner decorations with emerald theme */}
          <motion.div
            className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-emerald-500/20 rounded-tl-3xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-emerald-500/20 rounded-br-3xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          />

          {/* Security indicators in corners */}
          <motion.div
            className="absolute top-4 right-4"
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </motion.div>
          <motion.div
            className="absolute bottom-4 left-4"
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1,
            }}
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </motion.div>
        </motion.div>

        {/* Floating shield icon */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0, y: 50 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: 1,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { duration: 3, repeat: Infinity },
            scale: { delay: 0.5, duration: 0.6 },
            y: { duration: 3, repeat: Infinity, delay: 1 },
          }}
        >
          <div className="text-emerald-500/30 text-[100px]">
            <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>shield</span>
          </div>
        </motion.div>

        {/* Floating "ADMIN" text */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-emerald-500/10 text-6xl font-bold tracking-[0.3em] pointer-events-none select-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { delay: 1, duration: 0.6 },
            scale: { delay: 1, duration: 0.6 },
            y: {
              duration: 4,
              repeat: Infinity,
              delay: 1.5,
            },
          }}
        >
          ADMIN
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;