import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();

  // Smooth spring animations for parallax
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Multiple parallax layers with different speeds
  const y1 = useTransform(smoothProgress, [0, 1], [0, -200]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, -400]);
  const y3 = useTransform(smoothProgress, [0, 1], [0, -600]);
  const y4 = useTransform(smoothProgress, [0, 1], [0, 200]);

  // Rotation and scale effects
  const rotate = useTransform(smoothProgress, [0, 1], [0, 360]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.2, 0.8]);
  const opacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [1, 0.8, 0.6, 0.3]);

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
    <div className="relative min-h-screen text-white selection:bg-primary selection:text-white flex flex-col overflow-hidden">
      <Navbar />

      {/* Enhanced Parallax Background with Multiple Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Layer 1 - Slowest */}
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[120px]"
        />

        {/* Layer 2 - Medium */}
        <motion.div
          style={{ y: y2, rotate }}
          className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[100px]"
        />

        {/* Layer 3 - Fastest */}
        <motion.div
          style={{ y: y3 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[150px]"
        />

        {/* Reverse parallax layer */}
        <motion.div
          style={{ y: y4 }}
          className="absolute bottom-[30%] left-[20%] w-[30vw] h-[30vw] bg-primary/3 rounded-full blur-[80px]"
        />

        {/* Floating particles with mouse parallax */}
        {[...Array(20)].map((_, i) => (
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
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 flex-grow">
        {/* 1. HERO SECTION with Enhanced Parallax */}
        <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 relative overflow-hidden">
          {/* Background elements with mouse parallax */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              x: mousePosition.x * 2,
              y: mousePosition.y * 2,
            }}
          >
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center z-10 w-full"
          >
            <motion.span
              className="text-primary text-xs md:text-sm lg:text-base font-bold mb-4 md:mb-8 tracking-[0.4em] uppercase"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Welcoming Today • Inspiring Tomorrow
            </motion.span>

            <motion.h1
              className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.9] mb-8 uppercase"
              style={{
                x: mousePosition.x * -1,
                y: mousePosition.y * -1,
              }}
            >
              <motion.span
                className="block text-white"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                WELCOME TO
              </motion.span>
              <motion.span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white animate-gradient bg-[length:200%_auto]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                CLUB369
              </motion.span>
            </motion.h1>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-md justify-center mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Link to="/payment" className="group relative w-full sm:w-auto overflow-hidden rounded-lg bg-white px-8 md:px-10 py-4 text-black transition-all hover:bg-gray-200 text-center uppercase font-bold text-lg hover:scale-105">
                Join The Club
              </Link>
              <Link to="/manifesto" className="w-full sm:w-auto px-8 md:px-10 py-4 border border-white/20 rounded-lg text-white font-bold text-lg uppercase tracking-wide hover:bg-white/5 transition-all text-center hover:scale-105">
                Read Manifesto
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator with animation */}
          <motion.div
            className="absolute bottom-10"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-2 bg-white rounded-full mt-2"
                animate={{
                  y: [0, 16, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </div>
          </motion.div>
        </section>

        {/* 2. ABOUT US with Parallax */}
        <section id="about" className="py-24 md:py-32 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <motion.h2
                className="text-5xl md:text-7xl font-bold tracking-tight uppercase"
                whileInView={{ scale: [0.9, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                ABOUT <span className="text-primary">US</span>
              </motion.h2>
              <div className="space-y-6 text-gray-400 text-lg md:text-xl leading-relaxed">
                {[
                  "CLUB369 is a dynamic business community designed to help individuals learn, earn, trade, and launch their own startups.",
                  "We provide expert guidance in business strategy and digital marketing, empowering members to grow with confidence.",
                  "Members also gain exclusive access to CLUB369 ventures, tools, and networking opportunities, creating a strong ecosystem for sustainable success."
                ].map((text, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {text}
                  </motion.p>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video md:aspect-square"
            >
              <motion.img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop"
                alt="About US"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          </div>
        </section>

        {/* 3. WHY 369? with Rotating Effect */}
        <section id="why369" className="py-24 md:py-32 border-t border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-4 uppercase"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              WHY 369?
            </motion.h2>
            <motion.p
              className="text-primary text-xl font-light italic uppercase tracking-widest"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              An exclusive community of only 369 members
            </motion.p>
          </div>
          <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-6 text-gray-400 text-lg leading-relaxed"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {[
                "The 369 Manifestation Method is a powerful practice rooted in clarity, intention, and aligned action.",
                "By focusing your thoughts, writing your affirmations, and reinforcing belief at key moments of the day, you begin to align your energy with your goals.",
                "369 is more than a method—it's a mindset that trains your focus, discipline, and confidence to turn intention into reality..!"
              ].map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  {text}
                </motion.p>
              ))}
            </motion.div>
            <motion.div
              className="bg-white/5 border border-white/10 p-12 rounded-full aspect-square flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              whileHover={{ rotate: 360, scale: 1.1 }}
            >
              <motion.span
                className="text-8xl font-bold text-primary shadow-primary"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(139, 92, 246, 0.5)",
                    "0 0 40px rgba(139, 92, 246, 0.8)",
                    "0 0 20px rgba(139, 92, 246, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                369
              </motion.span>
            </motion.div>
          </div>
        </section>

        {/* 4. OUR VISION with Scale Effect */}
        <section id="vision" className="py-24 md:py-32 border-t border-white/5 relative">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-12 uppercase"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              OUR VISION
            </motion.h2>
            <motion.div
              className="bg-white/5 p-12 rounded-3xl border border-white/10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, borderColor: "rgba(139, 92, 246, 0.3)" }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-2xl md:text-4xl font-light italic text-gray-300">
                "We aim to create sustainable business ventures individually for CLUB369 members, empowering them to achieve financial independence and growth."
              </p>
            </motion.div>
          </div>
        </section>

        {/* 5. BUSINESS EMPOWERMENT & NETWORKING with Stagger Effect */}
        <section id="networking" className="py-24 md:py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-16 uppercase text-center md:text-left"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              BUSINESS EMPOWERMENT & NETWORKING
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: "Business Empowerment", desc: "Transforming ideas into scalable ventures" },
                { title: "Networking", desc: "Connecting you with like-minded entrepreneurs, industry experts, and business leaders through exclusive events and sessions." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="p-10 bg-white/5 border border-white/10 rounded-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  whileHover={{ y: -10, borderColor: "rgba(139, 92, 246, 0.5)" }}
                >
                  <h3 className="text-2xl font-bold text-primary mb-4 uppercase">{item.title}</h3>
                  <p className="text-gray-400 italic">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. TRADING POTENTIAL with 3D Card Effect */}
        <section id="trading" className="py-24 md:py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-16 uppercase"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              TRADING POTENTIAL
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "DAILY SIGNALS", desc: "Steady and disciplined profit potential with expert signals." },
                { title: "TRADING KNOWLEDGE", desc: "Learn from foundational concepts to advanced strategies." },
                { title: "LIMITED USER BASE", desc: "Focused mentorship and personalized support for every member." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/50 transition-colors"
                  initial={{ opacity: 0, rotateY: -90 }}
                  whileInView={{ opacity: 1, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <h3 className="text-xl font-bold mb-4 uppercase">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. BUSINESS EXPANSION */}
        <section id="expansion" className="py-24 md:py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-16 uppercase text-center md:text-right"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              BUSINESS EXPANSION
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Digital Marketing", desc: "Targeted strategies to scale your existing business." },
                { title: "Business Strategy", desc: "Ideas to transform underperforming businesses." },
                { title: "Business Startup", desc: "Collaboration to turn ideas into successful ventures." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="p-8 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <h3 className="text-xl font-bold text-primary mb-4 uppercase">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. CLUB OPPORTUNITIES with Fade-In Effect */}
        <section id="opportunities" className="py-24 md:py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-16 uppercase text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              CLUB OPPORTUNITIES
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { title: "Club Access", desc: "Complimentary access to all current and future ventures." },
                { title: "Club Meetups", desc: "Regular sessions with industry experts to share knowledge." },
                { title: "Medical Insurance", desc: "Coverage of up to ₹2 lakh for our members." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="space-y-4"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  whileHover={{ y: -10 }}
                >
                  <h3 className="text-2xl font-bold text-primary uppercase">{item.title}</h3>
                  <p className="text-gray-400 italic">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. ENTERTAINMENT & REWARDS with Bounce Effect */}
        <section id="rewards" className="py-24 md:py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold uppercase">ENTERTAINMENT & REWARDS</h2>
              <p className="text-gray-400 text-xl leading-relaxed">By recognizing excellence, CLUB369 fosters a
                culture of achievement, growth, and exclusive
                opportunities for its members
                High-achieving club members will enjoy exclusive
                rewards, including domestic and international
                travel, luxury resort accommodations, and
                branded luxury gifts.</p>
            </motion.div>
            <motion.div
              className="bg-primary/10 border border-primary/20 p-16 rounded-3xl text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="text-6xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                🏆
              </motion.span>
              <p className="text-2xl font-bold mt-6 uppercase">Elite Rewards</p>
            </motion.div>
          </div>
        </section>

        {/* 10. OUR VENTURES */}
        <section id="ventures" className="py-24 md:py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-16 uppercase text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              OUR VENTURES
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { title: "Major Companies", desc: "Access to top franchise ventures investing with us." },
                { title: "City-wide Launch", desc: "Launching across all major tier cities for accessibility." },
                { title: "Jobs", desc: "Employment opportunities within our growing ventures." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="p-8 border border-white/10 rounded-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ borderColor: "rgba(139, 92, 246, 0.5)", y: -5 }}
                >
                  <h3 className="text-xl font-bold mb-4 uppercase">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. USER EXPERIENCE */}
        <section id="ux" className="py-24 md:py-32 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-12 uppercase"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              USER EXPERIENCE
            </motion.h2>
            <motion.p
              className="text-2xl text-gray-400 font-light leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              CLUB369 is designed with members in
              mind, offering a seamless and intuitive
              experience across all platforms. From easy
              access to resources, live classes, and
              venture opportunities, to personalized
              guidance and real-time updates, every
              interaction is crafted to maximize learning,
              growth, and engagement
            </motion.p>
          </div>
        </section>

        {/* 12. JOURNEY with Progressive Animation */}
        <section id="journey" className="py-24 md:py-32 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-16 uppercase text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              OUR JOURNEY
            </motion.h2>
            <div className="space-y-12">
              {[
                { title: "Learning & Exploration", desc: "Begin your journey with CLUB369 by gaining foundational knowledge through live classes, digital resources, and expert guidance. Explore business strategies, trading insights, and digital marketing skills to build a strong base." },
                { title: "Collaboration & Application", desc: "Apply your knowledge by collaborating with fellow members and engaging in practical business opportunities. Participate in club ventures, trading, and projects to gain hands-on experience and real world insights" },
                { title: "Growth & Leadership", desc: "Reach the pinnacle by leading initiatives, mentoring new members, and expanding your own business ventures. CLUB369 empowers you to transform your skills into success, creating sustainable growth and recognition.." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="p-8 border-l-4 border-primary bg-white/5"
                  style={{ marginLeft: `${i * 2}rem` }}
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  whileHover={{ x: 10, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                >
                  <h3 className="text-xl font-bold uppercase mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 13. FUTURE DEVELOPMENTS */}
        <section id="future" className="py-24 md:py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-16 uppercase text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              FUTURE DEVELOPMENTS
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: "Global Expansion", desc: "We are constantly evolving, with plans to expand ventures, enhance learning programs, and introduce new opportunities for CLUB369 members." },
                { title: "AI Tools", desc: "Incorporating AI-driven insights and analytics to guide members in business and trading decisions. CLUB369 plans to convert manual business strategies into AI-driven systems, enabling members to analyse efficiently with minimal manual intervention" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="p-12 bg-white/5 border border-white/10 rounded-3xl"
                  initial={{ opacity: 0, rotateX: -90 }}
                  whileInView={{ opacity: 1, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  whileHover={{ scale: 1.02, borderColor: "rgba(139, 92, 246, 0.5)" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <h3 className="text-2xl font-bold text-primary mb-6 uppercase">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 14. OUR PROJECTS with Grid Animation */}
        <section id="projects" className="py-24 md:py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-16 uppercase text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              OUR PROJECTS
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['Franchise Ventures', 'Digital Agency', 'E-commerce Hub', 'Trading Academy'].map((p, i) => (
                <motion.div
                  key={i}
                  className="p-6 bg-white/5 border border-white/10 rounded-xl text-center uppercase text-sm font-bold tracking-widest text-gray-500"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                >
                  {p}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 15. CONTACT SUMMARY with Final CTA */}
        <motion.section
          id="contact-summary"
          className="py-24 md:py-32 bg-primary text-black relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-10"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage: "radial-gradient(circle, black 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.h2
              className="text-5xl md:text-7xl font-bold mb-8 uppercase tracking-tighter"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Start Your Journey Today
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl mb-12 opacity-80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.8 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join the exclusive community of 369 members and transform your entrepreneurial dreams into reality.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/contact"
                className="inline-block bg-black text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform text-lg shadow-2xl"
              >
                Get In Touch
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;