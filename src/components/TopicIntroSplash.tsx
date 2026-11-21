import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2, Volume2, FastForward } from "lucide-react";
import learnerImg from "@/assets/learner-3d.png";

interface TopicIntroSplashProps {
  onComplete: () => void;
}

const TOPICS = [
  {
    topic: "Cognitive Adaptation",
    detail: "AI that dynamically adjusts to your brain's natural learning speed",
    badge: "Neural Learning",
    icon: "🧠",
    color: "from-sky-500 to-blue-600",
  },
  {
    topic: "ADHD Focus & Sensory Calm",
    detail: "Binaural audio rhythms & spotlight mode that eliminate cognitive clutter",
    badge: "Attention Flow",
    icon: "🎧",
    color: "from-amber-500 to-orange-600",
  },
  {
    topic: "Dyslexia Visual Mind Maps",
    detail: "Lexend font, letter weighting & interactive node graphs instead of text walls",
    badge: "Visual Clarity",
    icon: "🗺️",
    color: "from-teal-500 to-emerald-600",
  },
  {
    topic: "Socratic Analogies & Recall",
    detail: "Translating dense technical concepts into relatable everyday stories",
    badge: "Concept Mastery",
    icon: "💡",
    color: "from-purple-500 to-indigo-600",
  },
];

export const TopicIntroSplash: React.FC<TopicIntroSplashProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (currentStep < TOPICS.length) {
      // Each topic comes and goes every 2.4 seconds
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 2400);
    } else {
      // Final stage: 'Hope you understood'
      setIsFinished(true);
      // Auto-enter landing page after 3.2 seconds
      timer = setTimeout(() => {
        onComplete();
      }, 3400);
    }

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-gradient-to-b from-[#0a0f24] via-[#0f1f4b] to-[#1e3a8a] text-white overflow-hidden select-none"
    >
      {/* Top Header Bar with Progress & Skip */}
      <div className="relative z-20 px-6 pt-6 flex items-center justify-between">
        {/* Progress Dots */}
        <div className="flex items-center gap-2">
          {TOPICS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentStep
                  ? "w-8 bg-sky-400 shadow-lg shadow-sky-400/50"
                  : idx < currentStep
                  ? "w-2 bg-sky-300/60"
                  : "w-2 bg-white/20"
              }`}
            />
          ))}
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              isFinished ? "w-8 bg-emerald-400 shadow-lg shadow-emerald-400/50" : "w-2 bg-white/20"
            }`}
          />
        </div>

        {/* Skip to Landing Page */}
        <button
          onClick={onComplete}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all active:scale-95"
        >
          <span>Skip to Home</span>
          <FastForward size={14} />
        </button>
      </div>

      {/* Centerpiece: Floating 3D Boy + Dynamic Topic Cards Coming & Going */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-w-4xl mx-auto w-full">
        {/* Ambient Radial Glow behind the boy */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-sky-500/40 via-indigo-500/30 to-purple-500/40 blur-3xl pointer-events-none"
        />

        {/* 3D Boy Floating */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-6"
        >
          <img
            src={learnerImg}
            alt="Dr. Bloom Learner"
            className="w-48 sm:w-60 md:w-64 object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
            style={{
              WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 65%, transparent 98%)",
              maskImage: "radial-gradient(circle at 50% 50%, black 65%, transparent 98%)",
            }}
          />
        </motion.div>

        {/* TOPICS COMING AND GOING -> THEN 'HOPE YOU UNDERSTOOD' */}
        <div className="w-full max-w-xl min-h-[140px] flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {!isFinished && currentStep < TOPICS.length ? (
              <motion.div
                key={`topic-${currentStep}`}
                initial={{ opacity: 0, y: 25, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.92 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                {/* Topic Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 border border-white/20 text-sky-200 mb-3 backdrop-blur-md">
                  <span className="text-sm">{TOPICS[currentStep].icon}</span>
                  {TOPICS[currentStep].badge}
                </span>

                {/* Topic Title */}
                <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-2">
                  {TOPICS[currentStep].topic}
                </h2>

                {/* Topic Explanation */}
                <p className="text-sm sm:text-base text-blue-100/90 max-w-md leading-relaxed">
                  {TOPICS[currentStep].detail}
                </p>
              </motion.div>
            ) : (
              /* FINAL CLIMAX: 'HOPE YOU UNDERSTOOD' */
              <motion.div
                key="final-climax"
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="flex flex-col items-center"
              >
                {/* Glowing Success Icon */}
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mb-3 shadow-xl shadow-emerald-500/20 animate-bounce">
                  <CheckCircle2 size={32} />
                </div>

                {/* The Headline Requested: 'Hope you understood' */}
                <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 mb-2">
                  Hope you understood ✨
                </h1>

                <p className="text-sm sm:text-base text-blue-100 mb-6">
                  Now entering your tailored learning space...
                </p>

                {/* Open Landing Page Button */}
                <button
                  onClick={onComplete}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base shadow-2xl shadow-emerald-500/40 transition-all transform hover:scale-105 active:scale-95"
                >
                  <span>Open Landing Page</span>
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Wave Footer */}
      <div className="relative z-10 w-full overflow-hidden leading-none pointer-events-none opacity-40">
        <svg
          className="w-full h-16 sm:h-20 animate-wave-slow"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60 C320 120 420 0 720 50 C1020 100 1140 10 1440 60 L1440 120 L0 120 Z"
            fill="rgba(255, 255, 255, 0.15)"
          />
        </svg>
      </div>
    </motion.div>
  );
};

export default TopicIntroSplash;
