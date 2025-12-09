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
    <div className="space-y-2">
      {/* Label */}
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        {icon && <span className="text-purple-600">{icon}</span>}
        {label}
        {required && (
          <span className="text-red-500 text-base" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* Input wrapper with focus effect */}
      <div
        className="relative"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {/* Glow effect on focus - desktop only */}
        {!shouldReduceMotion && isFocused && (
          <motion.div
            className="absolute inset-0 bg-purple-100 rounded-lg blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Children (actual input) */}
        <div className="relative">{children}</div>

        {/* Focus indicator line - desktop only */}
        {!shouldReduceMotion && isFocused && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Helper text */}
      {helperText && !error && (
        <p className="text-xs text-gray-600 flex items-center gap-1.5">
          <span>ℹ️</span>
          {helperText}
        </p>
      )}

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600 font-medium flex items-center gap-1.5"
        >
          <AlertCircle size={14} />
          {error}
        </motion.p>
      )}
    </div>
  );
}
