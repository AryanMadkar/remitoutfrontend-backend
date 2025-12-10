// components/application/ApplicationLayout.jsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/student/navbar";
import StepMeter from "./StepMeter";
import { CheckCircle2, Sparkles, TrendingUp } from "lucide-react";

const STEPS = [
  { id: 1, name: "Education Details", path: "/student/application/education" },
  { id: 2, name: "KYC Verification", path: "/student/application/kyc" },
  { id: 3, name: "Academic Records", path: "/student/application/academic" },
  {
    id: 4,
    name: "Work Experience",
    path: "/student/application/work-experience",
  },
  { id: 5, name: "Admission Letters", path: "/student/application/admission" },
  {
    id: 6,
    name: "Co-Borrower Details",
    path: "/student/application/co-borrower",
  },
];

const NBFC_PARTNERS = [
  {
    name: "HDFC CredEdu",
    tag: "Fast approval for top universities",
    rate: "From 9.5% p.a.",
    color: "from-orange-500 to-orange-600",
  },
  {
    name: "Axis EduPrime",
    tag: "No processing fee* for select profiles",
    rate: "From 10.2% p.a.",
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Bajaj FinServe",
    tag: "Flexible EMIs & partial disbursals",
    rate: "From 11.0% p.a.",
    color: "from-orange-600 to-purple-500",
  },
];

export default function ApplicationLayout({ children }) {
  const pathname = usePathname();
  const [userName] = useState("Student");
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const detectedIndex =
    STEPS.findIndex((step) => pathname.startsWith(step.path)) + 1;
  const activeStep = detectedIndex || 1;

  // Reduce animation complexity on mobile or if user prefers reduced motion
  const shouldReduceMotion = isMobile || prefersReducedMotion;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0.05 : 0.1,
        delayChildren: shouldReduceMotion ? 0.1 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 10 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: shouldReduceMotion ? "tween" : "spring",
        stiffness: shouldReduceMotion ? undefined : 100,
        damping: shouldReduceMotion ? undefined : 15,
        duration: shouldReduceMotion ? 0.3 : 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-purple-50/30">
      {/* Animated background elements - only on desktop */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            className="fixed top-20 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-orange-200/20 to-purple-900/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="fixed bottom-20 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-200/20 to-orange-200/20 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}

      <motion.main
        className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-12 pt-8 sm:px-6 lg:flex-row lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left sidebar */}
        <motion.aside
          className="order-2 w-full space-y-6 lg:order-1 lg:w-80"
          variants={itemVariants}
        >
          <StepMeter steps={STEPS} activeStep={activeStep} />

          {/* Smart Checklist Card */}
          <motion.div
            className="group relative overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/50 p-6 shadow-lg"
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(147, 51, 234, 0.15)",
                  }
            }
            transition={{ duration: 0.3 }}
          >
            {/* Animated gradient background - desktop only */}
            {!shouldReduceMotion && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-purple-400/10 to-orange-400/10"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            )}

            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <motion.div
                  className="rounded-full bg-gradient-to-br from-orange-500 to-purple-500 p-2"
                  whileHover={shouldReduceMotion ? {} : { rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </motion.div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                  Smart Checklist
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">
                Complete all 6 steps once. You can revisit and update details
                anytime before final submission.
              </p>

              {/* Progress percentage */}
              <motion.div
                className="mt-4 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(activeStep / STEPS.length) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className="text-xs font-semibold text-purple-600">
                  {Math.round((activeStep / STEPS.length) * 100)}%
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Card - Desktop only */}
          {!isMobile && (
            <motion.div
              className="rounded-2xl border border-orange-200 bg-gradient-to-br from-white to-orange-50/50 p-6 shadow-lg"
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(249, 115, 22, 0.15)",
              }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-orange-500 to-orange-600 p-2">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                  Application Stats
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-lg font-bold text-orange-600">
                    {Math.round((activeStep / STEPS.length) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Steps Completed</span>
                  <span className="text-lg font-bold text-purple-600">
                    {activeStep - 1}/{STEPS.length}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.aside>

        {/* Main content area */}
        <motion.section
          className="order-1 flex-1 space-y-6 lg:order-2"
          variants={itemVariants}
        >
          {/* Main form card */}
          <motion.div
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-xl"
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
                  }
            }
            transition={{ duration: 0.3 }}
          >
            {/* Shimmer effect - desktop only */}
            {!shouldReduceMotion && (
              <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                animate={{
                  translateX: ["100%", "100%", "-100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: "easeInOut",
                }}
              />
            )}

            <div className="relative">{children}</div>
          </motion.div>

          {/* NBFC Partners Section */}
          <motion.div
            className="rounded-2xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/30 p-6 shadow-lg"
            variants={itemVariants}
          >
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="rounded-full bg-gradient-to-br from-purple-500 to-orange-500 p-2"
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          rotate: [0, 360],
                        }
                  }
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Sparkles className="h-5 w-5 text-white" />
                </motion.div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                  Partner NBFCs
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Indicative education loan partners mapped to your profile.
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Final offers depend on your documents, co-borrower strength and
                NBFC policies.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {NBFC_PARTNERS.map((nbfc, idx) => (
                <motion.div
                  key={nbfc.name}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-md cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: shouldReduceMotion ? idx * 0.05 : idx * 0.15,
                    duration: 0.5,
                  }}
                  whileHover={
                    shouldReduceMotion
                      ? { scale: 1.02 }
                      : {
                          scale: 1.05,
                          y: -5,
                          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                        }
                  }
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Gradient overlay on hover - desktop only */}
                  {!shouldReduceMotion && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${nbfc.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                  )}

                  <div className="relative space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base font-bold text-gray-900">
                        {nbfc.name}
                      </h4>
                      <motion.span
                        className="rounded-full bg-gradient-to-r from-purple-500 to-orange-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                      >
                        NBFC
                      </motion.span>
                    </div>

                    <p className="text-sm text-emerald-600 font-medium">
                      {nbfc.tag}
                    </p>

                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {nbfc.rate}
                      </p>
                    </div>
                  </div>

                  {/* Animated corner accent - desktop only */}
                  {!shouldReduceMotion && (
                    <motion.div
                      className={`absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-gradient-to-br ${nbfc.color} opacity-20 blur-2xl`}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>
      </motion.main>
    </div>
  );
}
