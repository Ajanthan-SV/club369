import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register, isLoading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await register({ ...formData, profilePicture: profilePic });
            navigate('/payment');
        } catch (err) {
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center font-display selection:bg-primary selection:text-white perspective-1000 py-12">

            {/* Enhanced Background with Multiple Layers */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Main central glow */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Secondary floating orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[100px]"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-900/10 rounded-full blur-[90px]"
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

                {/* Grain texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                {/* Floating particles */}
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/30 rounded-full"
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
                        backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                        x: mousePosition.x * 0.5,
                        y: mousePosition.y * 0.5,
                    }}
                />
            </div>

            {/* Register Card with 3D Effects */}
            <div className="relative z-10 w-full max-w-lg px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                    className="bg-[#161118]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
                    style={{
                        transformStyle: "preserve-3d",
                        x: mousePosition.x * 2,
                        y: mousePosition.y * 2,
                    }}
                    whileHover={{ scale: 1.01 }}
                >
                    {/* Header with Logo */}
                    <div className="text-center mb-8 flex flex-col items-center relative z-10">
                        <motion.div
                            className="mb-4 filter drop-shadow-[0_0_10px_rgba(175,37,244,0.5)]"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <img src={logoUrl} alt="Logo" className="h-16 w-auto" />
                        </motion.div>

                        <h1 className="text-2xl font-bold tracking-[0.2em] text-white mb-2">JOIN CLUB369</h1>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] font-bold uppercase tracking-widest"
                            >
                                {error}
                            </motion.div>
                        )}
                    </div>

                    {/* Profile Picture Upload */}
                    <div className="flex justify-center mb-8 relative z-10">
                        <motion.div
                            className="relative group cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-white/5 group-hover:border-primary/50 transition-colors">
                                {profilePic ? (
                                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined text-3xl text-white/20 group-hover:text-primary/50">add_a_photo</span>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 shadow-lg">
                                <span className="material-symbols-outlined text-white text-xs">edit</span>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </motion.div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 99999 99999"
                                className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Create Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:border-primary focus:outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="text-xs text-gray-500">
                            Note : Please upload your profile picture to register without any Errors. Dont Miss it.
                        </div>

                        <motion.button
                            type="submit"
                            disabled={authLoading}
                            className="mt-4 w-full bg-white text-black hover:bg-primary hover:text-white font-bold tracking-widest uppercase rounded-xl py-4 transition-all shadow-lg flex items-center justify-center gap-2 relative overflow-hidden"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {authLoading ? 'Creating Account...' : 'Initialize Membership'}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center flex flex-col gap-3 relative z-10">
                        <Link to="/login" className="text-xs text-gray-500 hover:text-white transition-colors">
                            Already a member? <span className="text-primary font-bold">Secure Login</span>
                        </Link>
                        <Link to="/" className="text-[10px] text-gray-600 hover:text-white transition-colors uppercase tracking-widest">
                            Back to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
