// components/application/FormField.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function FormField({
  label,
  icon,
  children,
  required,
  error,
  helperText,
}) {
  const [isFocused, setIsFocused] = useState(false);
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
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Label */}
      <motion.label
        className="flex items-center gap-2 text-sm font-semibold text-gray-900"
        animate={
          !shouldReduceMotion && isFocused
            ? {
                x: [0, 2, 0],
              }
            : {}
        }
        transition={{ duration: 0.3 }}
      >
        {icon && (
          <motion.span
            className="text-orange-500"
            animate={
              !shouldReduceMotion && isFocused
                ? {
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.span>
        )}
        <span>
          {label}
          {required && (
            <motion.span
              className="ml-1 text-red-500"
              animate={
                !shouldReduceMotion
                  ? {
                      scale: [1, 1.2, 1],
                    }
                  : {}
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              *
            </motion.span>
          )}
        </span>
      </motion.label>

      {/* Input wrapper with focus effect */}
      <motion.div
        className="relative"
        animate={
          !shouldReduceMotion && isFocused
            ? {
                scale: 1.01,
              }
            : {}
        }
        transition={{ duration: 0.2 }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {/* Glow effect on focus - desktop only */}
        {!shouldReduceMotion && isFocused && (
          <motion.div
            className="absolute -inset-1 rounded-xl bg-gradient-to-r from-orange-500 to-purple-500 blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Children (actual input) */}
        <div className="relative">{children}</div>

        {/* Focus indicator line - desktop only */}
        {!shouldReduceMotion && isFocused && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            exit={{ width: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>

      {/* Helper text */}
      {helperText && !error && (
        <motion.p
          className="text-xs text-gray-600 flex items-center gap-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.span
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
            ℹ️
          </motion.span>
          {helperText}
        </motion.p>
      )}

      {/* Error message */}
      {error && (
        <motion.div
          className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3"
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    rotate: [0, 10, -10, 0],
                  }
            }
            transition={{
              duration: 0.5,
              repeat: 3,
            }}
          >
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
          </motion.div>
          <p className="text-xs text-red-700 font-medium">{error}</p>
        </motion.div>
      )}
    </motion.div>
  );
}