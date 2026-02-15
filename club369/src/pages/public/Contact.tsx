import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Contact: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth spring animations
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Parallax transformations
    const y1 = useTransform(smoothProgress, [0, 1], [0, -300]);
    const y2 = useTransform(smoothProgress, [0, 1], [0, 200]);
    const rotate = useTransform(smoothProgress, [0, 1], [0, 360]);
    const scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.1, 0.9]);

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

    return (
        <div ref={containerRef} className="min-h-screen font-display text-white selection:bg-primary selection:text-white flex flex-col overflow-hidden">
            <Navbar />

            {/* Enhanced Parallax Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Animated gradient orbs */}
                <motion.div
                    style={{ y: y1, scale }}
                    className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    style={{ y: y2, rotate }}
                    className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]"
                    animate={{
                        x: [0, -50, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Additional floating orbs */}
                <motion.div
                    className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[100px]"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Grain texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -80, 0],
                            x: [0, Math.random() * 40 - 20, 0],
                            opacity: [0.1, 0.5, 0.1],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}

                {/* Grid lines with mouse parallax */}
                <motion.div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                                         linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                        x: mousePosition.x * 0.5,
                        y: mousePosition.y * 0.5,
                    }}
                />
            </div>

            <main className="relative z-10 pt-32 pb-20 px-6 max-w-4xl mx-auto flex-grow w-full">

                {/* Hero Section with Parallax */}
                <div className="text-center mb-20 relative">
                    {/* Background glow with mouse tracking */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{
                            x: mousePosition.x * 3,
                            y: mousePosition.y * 3,
                        }}
                    />

                    <motion.span
                        initial={{ opacity: 0, y: -20 }}
                        animate={{
                            opacity: [0, 1, 0.7, 1, 0.7],
                            y: 0,
                        }}
                        className="text-primary text-xs font-bold tracking-[0.4em] uppercase mb-4 block relative z-10"
                        transition={{
                            opacity: {
                                duration: 3,
                                repeat: Infinity,
                                times: [0, 0.2, 0.5, 0.75, 1],
                            },
                            y: {
                                duration: 0.5,
                            },
                        }}
                    >
                        24/7 Global Concierge
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight relative z-10"
                        style={{
                            x: mousePosition.x * -0.5,
                            y: mousePosition.y * -0.5,
                        }}
                    >
                        <motion.span
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            GET IN{' '}
                        </motion.span>
                        <motion.span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            TOUCH
                        </motion.span>
                    </motion.h1>
                </div>

                {/* Contact Info - Centered */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-12 max-w-2xl mx-auto"
                >
                    {/* Headquarters */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ x: 10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.h2
                            className="text-2xl font-bold mb-6 text-white border-l-4 border-primary pl-4"
                            whileHover={{ borderColor: "rgba(139, 92, 246, 1)" }}
                        >
                            Headquarters
                        </motion.h2>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            CLUB369 operates globally with decentralized hubs. Our primary concierge center is available for verified members and prospective applicants.
                        </p>
                        <motion.div
                            className="flex items-start gap-4 text-gray-300"
                            whileHover={{ x: 5 }}
                        >
                            <motion.span
                                className="material-symbols-outlined text-primary mt-1"
                                animate={{
                                    y: [0, -5, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                            >
                                location_on
                            </motion.span>
                            <span>
                                One World Trade Center<br />
                                Suite 8500, New York<br />
                                NY 10007, USA
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Direct Lines */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-primary pl-4">Direct Lines</h2>
                        <div className="space-y-4">
                            {[
                                { icon: 'mail', label: 'Membership Inquiries', value: 'concierge@club369.com' },
                                { icon: 'call', label: 'Priority Support', value: '+1 (888) 369-CLUB' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-4 text-gray-300 group cursor-pointer"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ x: 10, scale: 1.02 }}
                                >
                                    <motion.div
                                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                    </motion.div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-bold">{item.label}</div>
                                        <div className="text-white group-hover:text-primary transition-colors">{item.value}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Waitlist Status */}
                    <motion.div
                        className="p-8 bg-gradient-to-br from-[#161118] to-black border border-white/10 rounded-2xl relative overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02, borderColor: "rgba(139, 92, 246, 0.5)" }}
                    >
                        {/* Animated background glow */}
                        <motion.div
                            className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                            }}
                        />

                        <h3 className="text-xl font-bold mb-2 relative z-10">Waitlist Status</h3>
                        <p className="text-gray-400 text-sm mb-4 relative z-10">Current verification time for new applicants.</p>
                        <div className="flex items-center gap-2 text-accent-green font-mono text-sm relative z-10">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-green"></span>
                            </span>
                            48 - 72 Hours
                        </div>
                    </motion.div>
                </motion.div>

            </main>

            <Footer />
        </div>
    );
};

export default Contact;