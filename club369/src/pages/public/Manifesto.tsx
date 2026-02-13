import React, { useRef, useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Manifesto: React.FC = () => {
    const containerRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

    // Enhanced floating background numbers with multiple transformations
    const yNum1 = useTransform(smoothProgress, [0, 1], [0, 800]);
    const yNum2 = useTransform(smoothProgress, [0, 1], [0, -600]);
    const yNum3 = useTransform(smoothProgress, [0, 1], [100, 500]);
    const rotateNum = useTransform(smoothProgress, [0, 1], [0, 180]);
    const scaleNum = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.2, 0.8]);
    const opacityNum = useTransform(smoothProgress, [0, 0.5, 1], [0.02, 0.04, 0.01]);

    // Timeline Line Drawing
    const timelineRef = useRef(null);
    const { scrollYProgress: timelineProgress } = useScroll({
        target: timelineRef,
        offset: ["start center", "end center"]
    });
    const lineHeight = useTransform(timelineProgress, [0, 1], ["0%", "100%"]);

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
        <div ref={containerRef} className="relative min-h-screen font-display text-white selection:bg-primary selection:text-white overflow-hidden flex flex-col">
            <Navbar />

            {/* Enhanced Parallax Numerology Background */}
            <motion.div
                style={{
                    y: yNum1,
                    rotate: rotateNum,
                    scale: scaleNum,
                    opacity: opacityNum,
                    x: mousePosition.x * 2,
                }}
                className="fixed top-20 right-[10%] text-[20vw] font-bold text-white pointer-events-none select-none z-0"
            >
                3
            </motion.div>

            <motion.div
                style={{
                    y: yNum2,
                    rotate: useTransform(rotateNum, (val) => -val),
                    scale: scaleNum,
                    opacity: opacityNum,
                    x: mousePosition.x * -2,
                }}
                className="fixed bottom-20 left-[5%] text-[20vw] font-bold text-white pointer-events-none select-none z-0"
            >
                6
            </motion.div>

            <motion.div
                style={{
                    y: useTransform(yNum3, (val) => val + mousePosition.y),
                    x: mousePosition.x * 1,
                    scale: useTransform(scaleNum, (val) => val * 1.1),
                    opacity: useTransform(opacityNum, (val) => val * 1.5),
                }}
                className="fixed top-[40%] left-[50%] -translate-x-1/2 text-[30vw] font-bold text-primary pointer-events-none select-none z-0"
            >
                9
            </motion.div>

            {/* Animated grain texture */}
            <motion.div
                className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0 mix-blend-overlay"
                animate={{
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Floating particles */}
            {[...Array(25)].map((_, i) => (
                <motion.div
                    key={i}
                    className="fixed w-1 h-1 bg-primary/30 rounded-full pointer-events-none z-0"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 50 - 25, 0],
                        opacity: [0.1, 0.5, 0.1],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 5 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Radial gradient orbs */}
            <motion.div
                className="fixed top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 150, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none z-0"
                animate={{
                    x: [0, -100, 0],
                    y: [0, -150, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex-grow">
                {/* Hero Section with Advanced Parallax */}
                <div className="text-center mb-24 md:mb-32 relative">
                    {/* Background glow with mouse tracking */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{
                            x: mousePosition.x * 4,
                            y: mousePosition.y * 4,
                        }}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.2 }}
                        className="relative z-10"
                    >
                        <motion.span
                            className="text-primary text-xs md:text-sm font-bold tracking-[0.5em] uppercase mb-4 md:mb-6 block"
                            animate={{
                                opacity: [0.5, 1, 0.5],
                                textShadow: [
                                    "0 0 10px rgba(139, 92, 246, 0.5)",
                                    "0 0 20px rgba(139, 92, 246, 1)",
                                    "0 0 10px rgba(139, 92, 246, 0.5)",
                                ],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            Private Membership
                        </motion.span>

                        <motion.h1
                            className="text-4xl md:text-6xl lg:text-9xl font-bold mb-6 md:mb-8 leading-none tracking-tighter"
                            style={{
                                x: mousePosition.x * -1,
                                y: mousePosition.y * -1,
                            }}
                        >
                            <motion.span
                                className="inline-block"
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                THE{' '}
                            </motion.span>
                            <motion.span
                                className="text-stroke-1 text-transparent font-outline-2 inline-block"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                CODE
                            </motion.span>
                            <br />
                            <motion.span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white animate-gradient bg-[length:200%_auto] inline-block"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                            >
                                TO ASCEND
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            className="text-base md:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed px-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            style={{
                                x: mousePosition.x * 0.5,
                                y: mousePosition.y * 0.5,
                            }}
                        >
                            Where sustainability meets extreme wealth, and ancient numerology unlocks future potential.
                        </motion.p>
                    </motion.div>
                </div>

                {/* 369 Method Grid - Enhanced 3D Tilt Cards */}
                <section id="method" className="mb-32 md:mb-48">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-12 md:mb-16 text-center tracking-tight uppercase"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        The 369 Manifestation Method
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 perspective-1000 max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -50, rotateY: -15 }}
                            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            {[
                                "The 369 Manifestation Method is a powerful practice rooted in clarity, intention, and aligned action. By focusing your thoughts, writing your affirmations, and reinforcing belief at key moments of the day, you begin to align your energy with your goals.",
                                "369 is more than a method—it's a mindset that trains your focus, discipline, and confidence to turn intention into reality..!"
                            ].map((text, i) => (
                                <motion.p
                                    key={i}
                                    className="text-gray-400 text-lg md:text-xl leading-relaxed"
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                >
                                    {text}
                                </motion.p>
                            ))}
                        </motion.div>

                        <motion.div
                            className="border border-white/5 p-8 md:p-10 rounded-3xl relative overflow-hidden group hover:border-primary/50 transition-all duration-500 shadow-2xl flex flex-col items-center justify-center"
                            initial={{ opacity: 0, x: 50, rotateY: 15 }}
                            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            whileHover={{
                                scale: 1.05,
                                rotateY: 5,
                                rotateX: -5,
                            }}
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            {/* Animated background gradient */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-900/10"
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />

                            {/* Rotating ring effect */}
                            <motion.div
                                className="absolute inset-0 border-2 border-primary/20 rounded-3xl"
                                animate={{
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />

                            <motion.div
                                className="text-8xl font-bold text-primary/10 mb-4 relative z-10"
                                animate={{
                                    textShadow: [
                                        "0 0 20px rgba(139, 92, 246, 0.3)",
                                        "0 0 40px rgba(139, 92, 246, 0.6)",
                                        "0 0 20px rgba(139, 92, 246, 0.3)",
                                    ],
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                }}
                            >
                                369
                            </motion.div>
                            <p className="text-primary text-xl font-light italic relative z-10">An exclusive community of only 369 members</p>
                        </motion.div>
                    </div>
                </section>

                {/* Enhanced Scroll-Draw Timeline */}
                <section id="timeline" ref={timelineRef} className="relative py-10 md:py-20">
                    {/* The Static Line Base */}
                    <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-white/5 md:-translate-x-1/2"></div>

                    {/* The Animated Line Overlay with Glow */}
                    <motion.div
                        style={{ height: lineHeight }}
                        className="absolute left-[19px] md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-primary via-purple-400 to-primary shadow-[0_0_20px_#af25f4] md:-translate-x-1/2 origin-top"
                    >
                        {/* Animated glow ball at the end of the line */}
                        <motion.div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-[0_0_20px_rgba(139,92,246,1)]"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                        />
                    </motion.div>

                    <div className="space-y-20 md:space-y-40">
                        {[
                            { phase: 'Phase 1', title: 'THE BEGINNING', desc: 'CLUB369 started as a vision to create a community where individuals could learn, earn, and grow together, building a foundation for sustainable success.' },
                            { phase: 'Phase 2', title: 'GROWTH & EXPANSION', desc: 'As we grew, we expanded our offerings to include expert business strategy, digital marketing, and exclusive networking opportunities for all members.' },
                            { phase: 'Phase 3', title: 'TODAY & BEYOND', desc: 'Today, CLUB369 is a thriving ecosystem with members launching their own ventures and achieving financial independence through our guidance and community support.' }
                        ].map((item, i) => (
                            <div
                                key={i}
                                className={`flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100, filter: "blur(10px)", scale: 0.9 }}
                                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)", scale: 1 }}
                                    viewport={{ margin: "-20%" }}
                                    transition={{ duration: 0.8, type: "spring" }}
                                    className={`md:w-1/2 flex ${i % 2 === 0 ? 'md:justify-end' : 'md:justify-start'} pl-12 md:pl-0 w-full`}
                                >
                                    <motion.div
                                        className="border border-white/10 p-6 md:p-10 rounded-2xl max-w-lg w-full hover:border-primary/40 transition-colors shadow-2xl relative group"
                                        whileHover={{
                                            scale: 1.05,
                                            y: -10,
                                            rotateY: i % 2 === 0 ? 5 : -5,
                                        }}
                                        style={{ transformStyle: "preserve-3d" }}
                                    >
                                        {/* Animated background gradient */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                                        />

                                        {/* Floating orb inside card */}
                                        <motion.div
                                            className="absolute top-5 right-5 w-20 h-20 bg-primary/20 rounded-full blur-2xl"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.3, 0.6, 0.3],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                delay: i * 0.5,
                                            }}
                                        />

                                        <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3 block relative z-10">{item.phase}</span>
                                        <h3 className="text-2xl md:text-3xl font-bold mb-4 relative z-10 uppercase">{item.title}</h3>
                                        <p className="text-gray-400 text-lg relative z-10">{item.desc}</p>

                                        {/* Corner decorations */}
                                        <motion.div
                                            className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl"
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.5 }}
                                        />
                                        <motion.div
                                            className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-2xl"
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.5 }}
                                        />
                                    </motion.div>
                                </motion.div>

                                {/* Enhanced Timeline Dot */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    whileInView={{ scale: 1, rotate: 0 }}
                                    viewport={{ margin: "-20%" }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                    }}
                                    className="absolute left-[11px] md:left-1/2 w-5 h-5 bg-background-dark border-4 border-white rounded-full md:-translate-x-1/2 z-20 shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                                >
                                    <motion.div
                                        className="w-full h-full bg-primary rounded-full"
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [0.6, 1, 0.6],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.3,
                                        }}
                                    />
                                </motion.div>

                                <div className="hidden md:block md:w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Enhanced CTA Section */}
                <div className="mt-24 md:mt-48 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] border border-white/10 relative overflow-hidden group"
                        whileHover={{ scale: 1.02 }}
                    >
                        {/* Animated grain texture */}
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

                        {/* Multiple floating orbs */}
                        <motion.div
                            className="absolute -top-[100px] -left-[100px] w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-colors duration-700"
                            animate={{
                                x: [0, 50, 0],
                                y: [0, 30, 0],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                        <motion.div
                            className="absolute -bottom-[100px] -right-[100px] w-[300px] h-[300px] bg-purple-900/20 blur-[100px] rounded-full"
                            animate={{
                                x: [0, -50, 0],
                                y: [0, -30, 0],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />

                        {/* Animated rings */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-primary/20 rounded-full"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                            }}
                        />
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-primary/20 rounded-full"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: 2,
                            }}
                        />

                        <div className="relative z-10">
                            <motion.span
                                className="material-symbols-outlined text-5xl md:text-6xl text-primary mb-6 md:mb-8 drop-shadow-[0_0_15px_rgba(175,37,244,0.5)]"
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 2, repeat: Infinity },
                                }}
                            >
                                verified
                            </motion.span>

                            <motion.h2
                                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 tracking-tight"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                Ready to Ascend?
                            </motion.h2>

                            <motion.p
                                className="text-gray-400 mb-8 md:mb-10 text-lg max-w-2xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                            >
                                Membership is by application only. The queue is open for those who seek.
                            </motion.p>

                            <motion.button
                                className="bg-white text-black hover:bg-primary hover:text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold tracking-wide shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(175,37,244,0.6)] transition-all duration-300 text-base md:text-lg"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Begin Application
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default Manifesto;