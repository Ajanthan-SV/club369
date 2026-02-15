import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { PaymentService } from "../../services/PaymentService";
import { useAuth } from "../../context/AuthContext";

const Checkout: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Redirect active members to dashboard
  useEffect(() => {
    if (user?.membership_status === "ACTIVE") {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // 3D Card Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      await PaymentService.handlePayment({
        prefill: {
          name: user?.name || "New Member",
          email: user?.email || "member@club369.com",
          contact: user?.mobile || "9999999999"
        },
        onSuccess: (verifyRes) => {
          if (verifyRes) {
            alert("Payment Verified & Membership Activated!");
            navigate('/dashboard');
          }
          setIsLoading(false);
        },
        onDismiss: () => {
          setIsLoading(false);
        },
        onError: (error: any) => {
          console.error("Payment Error:", error);
          const errorMsg = error.message || "Could not connect to payment gateway.";
          alert(errorMsg);
          setIsLoading(false);
        }
      });
    } catch (error: any) {
      console.error("Payment Initiation Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-display text-white flex flex-col selection:bg-primary selection:text-white overflow-hidden perspective-1000 relative">
      <Navbar />

      {/* Enhanced Background with Parallax */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Main gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"
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
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]"
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

        {/* Additional accent orbs */}
        <motion.div
          className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[90px]"
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
            backgroundSize: "50px 50px",
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
          }}
        />

        {/* Rotating rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-primary/10 rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
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
      </div>

      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[90vh] p-6 pt-32 flex-grow relative z-10">
        {/* Left: Summary with Animations */}
        <div className="flex flex-col gap-6">
          <motion.h1
            className="text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              x: mousePosition.x * -0.5,
              y: mousePosition.y * -0.5,
            }}
          >
            Initialize your
            <br />{" "}
            <motion.span
              className="text-primary"
              animate={{
                textShadow: [
                  "0 0 10px rgba(139, 92, 246, 0.3)",
                  "0 0 20px rgba(139, 92, 246, 0.6)",
                  "0 0 10px rgba(139, 92, 246, 0.3)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              Access
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-gray-400 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Activate your membership via our secure gateway. Secure your access
            to the ecosystem for the next 30 days.
          </motion.p>

          <motion.div
            className="bg-[#161118] border border-white/10 rounded-xl p-6 space-y-5 relative overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.02, borderColor: "rgba(139, 92, 246, 0.3)" }}
          >
            {/* Floating orb inside */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />

            {/* Header Section */}
            <div className="space-y-3 relative z-10 border-b border-white/5 pb-4">
              <motion.div
                className="flex justify-between items-center text-sm text-gray-500"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <span>Subscription Plan</span>
                <span className="text-white font-bold">
                  Membership Plan (Monthly)
                </span>
              </motion.div>

              <motion.div
                className="flex justify-between items-center text-sm text-gray-500"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span>Billing Cycle</span>
                <span className="text-white">Every 30 Days</span>
              </motion.div>
            </div>

            {/* Membership Goals / Opportunities Section */}
            <div className="space-y-4 relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
                Membership Benefits
              </p>

              {[
                {
                  icon: "hub",
                  title: "Club Access",
                  desc: "Complimentary access to all ventures.",
                },
                {
                  icon: "groups",
                  title: "Club Meetups",
                  desc: "Regular industry expert sessions.",
                },
                {
                  icon: "health_and_safety",
                  title: "Medical Coverage",
                  desc: "Insured coverage up to ₹2 Lakh.",
                },
              ].map((goal, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5">
                    {goal.icon}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white uppercase tracking-tight">
                      {goal.title}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-tight">
                      {goal.desc}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="h-px bg-white/10 my-2 relative z-10"></div>

            {/* Footer Section */}
            <motion.div
              className="flex justify-between items-center text-xl font-bold relative z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              <span className="text-sm text-gray-400 font-medium">
                Monthly Charge
              </span>
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 10px rgba(139, 92, 246, 0.3)",
                    "0 0 20px rgba(139, 92, 246, 0.6)",
                    "0 0 10px rgba(139, 92, 246, 0.3)",
                  ],
                  color: ["#ffffff", "#af25f4", "#ffffff"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                ₹ 4,999
              </motion.span>
            </motion.div>
          </motion.div>
        </div>

        {/* Right: Payment Card with Enhanced 3D */}
        <div className="flex justify-center perspective-1000">
          <motion.div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
          >
            {/* Animated glow border */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur opacity-30"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />

            <div className="relative bg-[#161118] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col gap-8">
              {/* Floating orbs inside card */}
              <motion.div
                className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
                animate={{
                  x: [0, 20, 0],
                  y: [0, 30, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-40 h-40 bg-purple-900/10 rounded-full blur-3xl"
                animate={{
                  x: [0, -20, 0],
                  y: [0, -30, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Scan line effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"
                animate={{
                  y: ["-100%", "100%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <motion.div
                className="flex justify-between items-center relative z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.span
                  className="material-symbols-outlined text-4xl text-white"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                >
                  diamond
                </motion.span>
                <div className="flex flex-col items-end">
                  <motion.span
                    className="text-xs font-bold bg-primary/20 text-primary px-3 py-1 rounded-full uppercase mb-1"
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(139, 92, 246, 0)",
                        "0 0 15px rgba(139, 92, 246, 0.4)",
                        "0 0 0px rgba(139, 92, 246, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    Subscription
                  </motion.span>
                  <span className="text-[10px] text-gray-500 uppercase">
                    Secure Gateway
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="space-y-1 relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <div className="text-gray-500 text-xs uppercase font-bold">
                  Recurring Amount
                </div>
                <motion.div
                  className="text-4xl font-bold text-white"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(255, 255, 255, 0.2)",
                      "0 0 20px rgba(255, 255, 255, 0.4)",
                      "0 0 10px rgba(255, 255, 255, 0.2)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  ₹ 4,999
                  <span className="text-lg text-gray-500 font-normal">/mo</span>
                </motion.div>
              </motion.div>

              <motion.button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-200 text-black font-bold text-lg py-4 px-6 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 relative z-10 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={{
                  scale: 1.02,
                  y: -3,
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />

                {/* Loading spinner */}
                {isLoading && (
                  <motion.span
                    className="material-symbols-outlined"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    progress_activity
                  </motion.span>
                )}

                <span className="relative z-10">
                  {isLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      <span>Authorize Payment</span>
                      <motion.span
                        className="material-symbols-outlined text-sm inline-block ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        arrow_forward
                      </motion.span>
                    </>
                  )}
                </span>
              </motion.button>

              <motion.div
                className="flex justify-center items-center gap-2 text-gray-600 text-xs relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <motion.span
                  className="material-symbols-outlined text-sm"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  lock
                </motion.span>
                256-bit Encrypted Transaction
              </motion.div>

              {/* Corner decorations */}
              <motion.div
                className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-3xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-3xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Floating "369" decoration */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-9xl font-bold text-primary/5 pointer-events-none select-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -20, 0],
          }}
          transition={{
            opacity: { delay: 1.6, duration: 0.6 },
            scale: { delay: 1.6, duration: 0.6 },
            y: {
              duration: 4,
              repeat: Infinity,
              delay: 2,
            },
          }}
        >
          369
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;