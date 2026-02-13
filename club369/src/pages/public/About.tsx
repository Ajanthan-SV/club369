import React, { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const About: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { scrollYProgress } = useScroll();

    // Smooth spring animations for parallax
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Multiple parallax layers with different speeds
    const y1 = useTransform(smoothProgress, [0, 1], [0, -300]);
    const y2 = useTransform(smoothProgress, [0, 1], [0, -500]);
    const y3 = useTransform(smoothProgress, [0, 1], [0, 150]);
    const rotate = useTransform(smoothProgress, [0, 1], [0, 360]);
    const scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.1, 0.9]);
    const opacity = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.8, 0.5]);

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
        <div className="min-h-screen font-display text-white selection:bg-primary selection:text-white overflow-hidden flex flex-col">
            <Navbar />

            {/* Enhanced Parallax Background with Multiple Layers */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Layer 1 - Slow moving */}
                <motion.div
                    style={{ y: y1, opacity }}
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"
                />

                {/* Layer 2 - Medium speed with rotation */}
                <motion.div
                    style={{ y: y2, rotate }}
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]"
                />

                {/* Layer 3 - Reverse parallax */}
                <motion.div
                    style={{ y: y3, scale }}
                    className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]"
                />

                {/* Grain texture overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                {/* Floating particles with mouse parallax */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            x: mousePosition.x * (i % 3 + 1),
                            y: mousePosition.y * (i % 3 + 1),
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.2, 0.6, 0.2],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
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

            <main className="relative z-10 pt-32 pb-20 px-6 max-w-5xl mx-auto flex-grow">

                {/* Hero Section with Advanced Parallax */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24 relative"
                >
                    {/* Background glow with mouse tracking */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"
                        style={{
                            x: mousePosition.x * 3,
                            y: mousePosition.y * 3,
                        }}
                    />

                    <motion.span
                        className="text-primary text-xs font-bold tracking-[0.4em] uppercase mb-4 block relative z-10"
                        animate={{
                            y: [0, -5, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        The Philosophy
                    </motion.span>

                    <motion.h1
                        className="text-5xl md:text-7xl font-bold mb-8 tracking-tight relative z-10"
                        style={{
                            x: mousePosition.x * -0.5,
                            y: mousePosition.y * -0.5,
                        }}
                    >
                        <motion.span
                            className="inline-block"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            UNITING{' '}
                        </motion.span>
                        <motion.span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white inline-block"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            TODAY
                        </motion.span>
                        .
                        <br />
                        <motion.span
                            className="inline-block"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            INSPIRING{' '}
                        </motion.span>
                        <motion.span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary inline-block"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            TOMORROW
                        </motion.span>
                        .
                    </motion.h1>
                </motion.div>

                <div className="grid gap-20">
                    {/* Vision Section with 3D Parallax */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col md:flex-row gap-10 items-center"
                    >
                        <motion.div
                            className="md:w-1/2"
                            whileInView={{ x: [0, 10, 0] }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <motion.h2
                                className="text-3xl font-bold mb-4 text-white border-l-4 border-primary pl-4 uppercase"
                                whileHover={{ x: 10, borderColor: "rgba(139, 92, 246, 1)" }}
                                transition={{ duration: 0.3 }}
                            >
                                Our Vision
                            </motion.h2>
                            <motion.p
                                className="text-gray-400 text-lg leading-relaxed italic"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                            >
                                "We aim to create sustainable business ventures individually for CLUB369 members, empowering them to achieve financial independence and growth."
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="md:w-1/2 h-[300px] bg-white/[0.03] rounded-2xl border border-white/10 relative overflow-hidden group"
                            initial={{ opacity: 0, rotateY: -45, scale: 0.8 }}
                            whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            whileHover={{ scale: 1.05, rotateY: 5 }}
                            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                whileHover={{ scale: 1.1 }}
                            />
                            <motion.img
                                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                                className="w-full h-full object-cover opacity-60"
                                alt="Vision"
                                whileHover={{ scale: 1.1, opacity: 0.8 }}
                                transition={{ duration: 0.5 }}
                            />

                            {/* Animated shine effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.8 }}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Mission Section with Reverse Parallax */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col md:flex-row-reverse gap-10 items-center"
                    >
                        <motion.div
                            className="md:w-1/2"
                            whileInView={{ x: [0, -10, 0] }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <motion.h2
                                className="text-3xl font-bold mb-4 text-white border-r-4 border-primary pr-4 text-right uppercase"
                                whileHover={{ x: -10, borderColor: "rgba(139, 92, 246, 1)" }}
                                transition={{ duration: 0.3 }}
                            >
                                Our Mission
                            </motion.h2>
                            <motion.p
                                className="text-gray-400 text-lg leading-relaxed text-right"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                            >
                                To provide expert guidance in business strategy and digital marketing, empowering members to grow with confidence.
                            </motion.p>
                            <motion.p
                                className="text-gray-400 text-lg leading-relaxed text-right mt-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                            >
                                Members also gain exclusive access to CLUB369 ventures, tools, and networking opportunities, creating a strong ecosystem for sustainable success.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="md:w-1/2 h-[300px] bg-white/[0.03] rounded-2xl border border-white/10 relative overflow-hidden group"
                            initial={{ opacity: 0, rotateY: 45, scale: 0.8 }}
                            whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            whileHover={{ scale: 1.05, rotateY: -5 }}
                            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                whileHover={{ scale: 1.1 }}
                            />
                            <motion.img
                                src="https://images.unsplash.com/photo-1519681393798-3828fb40905f?q=80&w=2070&auto=format&fit=crop"
                                className="w-full h-full object-cover opacity-60"
                                alt="Mission"
                                whileHover={{ scale: 1.1, opacity: 0.8 }}
                                transition={{ duration: 0.5 }}
                            />

                            {/* Animated shine effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-transparent"
                                initial={{ x: "100%" }}
                                whileHover={{ x: "-100%" }}
                                transition={{ duration: 0.8 }}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Strategic Partnerships with Advanced Effects */}
                    <motion.div
                        className="mt-10 p-10 backdrop-blur-md border border-white/10 rounded-3xl relative overflow-hidden"
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        whileHover={{ scale: 1.02, borderColor: "rgba(139, 92, 246, 0.5)" }}
                    >
                        {/* Animated background gradient */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-900/5 opacity-0"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        />

                        {/* Floating orbs in background */}
                        <motion.div
                            className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
                            animate={{
                                y: [0, -20, 0],
                                x: [0, 20, 0],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                        <motion.div
                            className="absolute bottom-0 left-0 w-40 h-40 bg-purple-900/10 rounded-full blur-3xl"
                            animate={{
                                y: [0, 20, 0],
                                x: [0, -20, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />

                        <motion.h2
                            className="text-3xl font-bold mb-8 text-center uppercase relative z-10"
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            Strategic Partnerships
                        </motion.h2>

                        <div className="space-y-6 max-w-3xl mx-auto text-center relative z-10">
                            <motion.p
                                className="text-gray-400 text-lg leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                            >
                                We don't work alone. Our success is built on a foundation of strong, strategic partnerships with global leaders in finance, technology, and marketing.
                            </motion.p>
                            <motion.p
                                className="text-gray-400 text-lg leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                            >
                                These partnerships allow us to provide our members with unprecedented access to resources and opportunities that are simply not available elsewhere.
                            </motion.p>
                        </div>

                        {/* Decorative corner elements */}
                        <motion.div
                            className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl"
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 }}
                        />
                        <motion.div
                            className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/30 rounded-br-3xl"
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 }}
                        />
                    </motion.div>

                    {/* Additional Decorative Section */}
                    <motion.div
                        className="grid md:grid-cols-3 gap-8 mt-10"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        {[
                            { title: "Innovation", desc: "Pioneering new approaches to business growth", icon: "💡" },
                            { title: "Excellence", desc: "Commitment to the highest standards", icon: "⭐" },
                            { title: "Community", desc: "Building lasting relationships", icon: "🤝" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="p-8 bg-white/[0.03] border border-white/10 rounded-2xl text-center"
                                initial={{ opacity: 0, y: 50, rotateX: -45 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.6 }}
                                whileHover={{
                                    y: -10,
                                    scale: 1.05,
                                    borderColor: "rgba(139, 92, 246, 0.5)",
                                    backgroundColor: "rgba(255, 255, 255, 0.05)"
                                }}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <motion.div
                                    className="text-5xl mb-4"
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 5, -5, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                    }}
                                >
                                    {item.icon}
                                </motion.div>
                                <h3 className="text-xl font-bold mb-3 text-primary uppercase">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;