// components/application/StepMeter.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function StepMeter({ steps, activeStep }) {
  return (
    <motion.div
      className="rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-950/70 via-purple-900/40 to-slate-900/70 px-4 py-3 shadow-[0_0_40px_rgba(88,28,135,0.35)]"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.16em] text-purple-200">
        <span>Application Progress</span>
        <span>
          Step {activeStep} / {steps.length}
        </span>
      </div>

      <div className="relative flex items-center gap-2">
        {/* Background line */}
        <div className="absolute left-4 right-4 h-[2px] bg-purple-900/70" />

        {/* Active progress line */}
        <motion.div
          className="absolute left-4 h-[2px] bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-300"
          initial={{ width: 0 }}
          animate={{
            width: `${((activeStep - 1) / (steps.length - 1 || 1)) * 100}%`,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Steps */}
        <div className="relative z-10 flex w-full justify-between">
          {steps.map((step) => {
            const isCompleted = step.id < activeStep;
            const isActive = step.id === activeStep;

            return (
              <Link
                key={step.id}
                href={isCompleted ? step.path : "#"}
                scroll={false}
                className="group flex flex-col items-center gap-1"
              >
                <motion.div
                  className={[
                    "flex h-8 w-8 items-center justify-center border text-xs font-bold",
                    "transition-all duration-200",
                    isCompleted
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                      : isActive
                      ? "border-purple-300 bg-purple-500/30 text-white shadow-[0_0_20px_rgba(192,132,252,0.6)]"
                      : "border-purple-800 bg-purple-950/60 text-purple-400 group-hover:border-purple-400 group-hover:text-purple-100",
                  ].join(" ")}
                  whileHover={isCompleted ? { scale: 1.05 } : {}}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </motion.div>
                <span className="hidden w-24 text-center text-[10px] font-medium text-purple-100 md:block">
                  {step.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
