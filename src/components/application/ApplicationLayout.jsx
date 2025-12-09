// components/application/ApplicationLayout.jsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/student/navbar"; // adjust path if needed
import StepMeter from "./StepMeter";
import { CheckCircle2 } from "lucide-react";

const STEPS = [
  { id: 1, name: "Education Details", path: "/student/application/education" },
  { id: 2, name: "KYC Verification", path: "/student/application/kyc" },
  { id: 3, name: "Academic Records", path: "/student/application/academic" },
  { id: 4, name: "Work Experience", path: "/student/application/work-experience" },
  { id: 5, name: "Admission Letters", path: "/student/application/admission" },
  { id: 6, name: "Co-Borrower Details", path: "/student/application/co-borrower" },
];

const NBFC_PARTNERS = [
  {
    name: "HDFC CredEdu",
    tag: "Fast approval for top universities",
    rate: "From 9.5% p.a.",
  },
  {
    name: "Axis EduPrime",
    tag: "No processing fee* for select profiles",
    rate: "From 10.2% p.a.",
  },
  {
    name: "Bajaj FinServe",
    tag: "Flexible EMIs & partial disbursals",
    rate: "From 11.0% p.a.",
  },
];

export default function ApplicationLayout({ children }) {
  const pathname = usePathname();
  const [userName] = useState("Student");

  const detectedIndex =
    STEPS.findIndex((step) => pathname.startsWith(step.path)) + 1;
  const activeStep = detectedIndex || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-slate-50">
      {/* Shared student navbar (orange theme from dashboard) */}
      <div className="border-b border-orange-500/20 bg-white/5 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-3">
          <Navbar
            onMenuClick={() => {}}
            onProfileClick={() => {}}
            userName={userName}
          />
        </div>
      </div>

      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-3 pb-10 pt-5 md:flex-row">
        {/* Left rail: step info + mini summary */}
        <aside className="order-2 mt-4 w-full space-y-4 md:order-1 md:mt-0 md:w-64">
          <StepMeter steps={STEPS} activeStep={activeStep} />

          <motion.div
            className="rounded-xl border border-purple-500/20 bg-purple-950/60 p-4 text-xs text-purple-100 shadow-[0_0_30px_rgba(76,29,149,0.55)]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-purple-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Smart Checklist</span>
            </div>
            <p className="text-[11px] leading-relaxed text-purple-100/80">
              Complete all 6 steps once. You can revisit and update details
              anytime before final submission.
            </p>
          </motion.div>
        </aside>

        {/* Right: main application surface */}
        <section className="order-1 flex-1 space-y-4 md:order-2">
          {/* Main card (child content) */}
          <motion.div
            className="rounded-2xl border border-purple-500/40 bg-gradient-to-br from-purple-950/70 via-slate-950/70 to-slate-950/90 p-6 shadow-[0_0_60px_rgba(147,51,234,0.45)]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>

          {/* NBFC strip */}
          <motion.div
            className="rounded-2xl border border-purple-500/30 bg-purple-950/70 p-4 shadow-[0_0_40px_rgba(126,34,206,0.55)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.3 }}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-300">
                  Partner NBFCs
                </p>
                <p className="text-xs text-purple-50">
                  Indicative education loan partners mapped to your profile.
                </p>
              </div>
              <p className="hidden text-[10px] text-purple-200/70 md:block">
                Final offers depend on your documents, co-borrower strength and
                NBFC policies.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {NBFC_PARTNERS.map((nbfc, idx) => (
                <motion.div
                  key={nbfc.name}
                  className="flex flex-col justify-between rounded-xl border border-purple-400/40 bg-purple-900/70 px-4 py-3 text-xs text-purple-50 transition-all duration-200 hover:-translate-y-1 hover:border-purple-200 hover:bg-purple-800/80"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx + 0.1 }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold">
                      {nbfc.name}
                    </span>
                    <span className="rounded-full border border-purple-400/40 bg-purple-900/80 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-purple-200">
                      NBFC
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-300">{nbfc.tag}</p>
                  <p className="mt-2 text-[11px] text-purple-100/80">
                    {nbfc.rate}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
