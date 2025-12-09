// components/application/ApplicationProgress.jsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

export default function ApplicationProgress({ steps }) {
  const pathname = usePathname();
  const currentStep = pathname.split("/").pop() || "education";
  const currentIndex = steps.findIndex((step) => step.id === currentStep);
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

  const shouldReduceMotion = isMobile || prefersReducedMotion;

  return (
    <div className="py-8">
      <div className="relative flex items-center justify-between">
        {/* Background line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 via-gray-200 to-gray-200 -z-10 rounded-full" />

        {/* Active progress line */}
        <motion.div
          className="absolute top-6 left-0 h-1 -z-10 rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-purple-500 shadow-lg"
          initial={{ width: 0 }}
          animate={{
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
          }}
          transition={{
            duration: shouldReduceMotion ? 0.5 : 1,
            ease: "easeOut",
          }}
        />

        {/* Animated glow effect on active line - desktop only */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute top-6 left-0 h-1 -z-10 rounded-full bg-gradient-to-r from-orange-400 to-purple-400 blur-sm"
            initial={{ width: 0, opacity: 0.6 }}
            animate={{
              width: `${(currentIndex / (steps.length - 1)) * 100}%`,
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              width: { duration: 1, ease: "easeOut" },
              opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        )}

        {steps.map((step, index) => {
          const isCompleted = currentIndex > index;
          const isActive = currentIndex === index;

          return (
            <motion.div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: shouldReduceMotion ? index * 0.05 : index * 0.15,
                duration: 0.4,
              }}
            >
              {/* Step circle */}
              <motion.div
                className={`relative flex h-12 w-12 items-center justify-center rounded-full border-4 transition-all duration-300 ${
                  isCompleted
                    ? "border-emerald-400 bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg"
                    : isActive
                    ? "border-orange-400 bg-gradient-to-br from-orange-500 to-purple-500 shadow-xl"
                    : "border-gray-300 bg-white"
                }`}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: 1.15,
                        rotate: 360,
                      }
                }
                animate={
                  !shouldReduceMotion && isActive
                    ? {
                        boxShadow: [
                          "0 0 0 0 rgba(249, 115, 22, 0.7)",
                          "0 0 0 15px rgba(249, 115, 22, 0)",
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 0.6,
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  },
                }}
              >
                {/* Inner glow for active step - desktop only */}
                {!shouldReduceMotion && isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300 to-purple-300 blur-xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                  >
                    <Check className="h-6 w-6 text-white" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <motion.span
                    className={`relative z-10 text-sm font-bold ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                    animate={
                      !shouldReduceMotion && isActive
                        ? {
                            scale: [1, 1.1, 1],
                          }
                        : {}
                    }
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {index + 1}
                  </motion.span>
                )}

                {/* Completion ring animation - desktop only */}
                {!shouldReduceMotion && isCompleted && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-emerald-400"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{
                      scale: [1, 1.5],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeOut",
                    }}
                  />
                )}
              </motion.div>

              {/* Step title */}
              <motion.span
                className={`mt-3 text-center text-xs font-semibold transition-colors ${
                  currentIndex >= index ? "text-gray-900" : "text-gray-400"
                } ${isMobile ? "max-w-16" : "max-w-24"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: shouldReduceMotion
                    ? index * 0.05 + 0.2
                    : index * 0.15 + 0.3,
                  duration: 0.4,
                }}
              >
                {step.title}
              </motion.span>

              {/* Active step indicator - desktop only */}
              {!shouldReduceMotion && isActive && (
                <motion.div
                  className="mt-2 h-1 w-1 rounded-full bg-gradient-to-r from-orange-500 to-purple-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress percentage */}
      <motion.div
        className="mt-8 flex items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldReduceMotion ? 0.3 : 0.6 }}
      >
        <div className="flex-1 max-w-md">
          <div className="relative h-3 overflow-hidden rounded-full bg-gray-200">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / steps.length) * 100}%`,
              }}
              transition={{
                duration: shouldReduceMotion ? 0.5 : 1,
                ease: "easeOut",
              }}
            />
            {/* Shimmer effect - desktop only */}
            {!shouldReduceMotion && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 1,
                }}
              />
            )}
          </div>
        </div>
        <motion.div
          className="rounded-full bg-gradient-to-r from-orange-500 to-purple-500 px-4 py-2 shadow-lg"
          whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
        >
          <span className="text-sm font-bold text-white">
            {Math.round(((currentIndex + 1) / steps.length) * 100)}%
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}