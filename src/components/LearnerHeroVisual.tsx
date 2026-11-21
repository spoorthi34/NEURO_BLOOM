import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, CheckCircle2, RotateCcw, Headphones, BookOpen } from "lucide-react";
import learnerImg from "@/assets/learner-3d.png";

const PHRASES = [
  "Analyzing document...",
  "Breaking down complex topics...",
  "Adapting to your learning pace...",
  "Generating visual mind maps...",
  "Removing cognitive overload...",
];

const FINAL_PHRASE = "Hope you understood";

export const LearnerHeroVisual: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isFinal, setIsFinal] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stepIndex < PHRASES.length) {
      timer = setTimeout(() => {
        setStepIndex((prev) => prev + 1);
      }, 1600);
    } else {
      setIsFinal(true);
      // Stay on "Hope you understood" for 6 seconds, then loop seamlessly
      timer = setTimeout(() => {
        setIsFinal(false);
        setStepIndex(0);
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [stepIndex]);

  const handleRestart = () => {
    setIsFinal(false);
    setStepIndex(0);
  };

  return (
    <div className="relative w-full max-w-[460px] aspect-square flex flex-col items-center justify-center select-none">
      {/* Dynamic Ambient Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-4 rounded-full bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 blur-3xl pointer-events-none"
      />

      {/* Floating Badge Top-Left: Cognitive Mode */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-2 -left-2 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-white/10 px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-2"
      >
        <div className="w-6 h-6 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-500">
          <Brain size={14} />
        </div>
        <div>
          <p className="text-[9px] text-slate-400 font-medium leading-none">Focus Mode</p>
          <p className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">ADHD Active</p>
        </div>
      </motion.div>

      {/* Floating Badge Top-Right: Sensory Audio */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        className="absolute top-4 -right-2 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-white/10 px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-2"
      >
        <div className="w-6 h-6 rounded-lg bg-teal-500/15 flex items-center justify-center text-teal-500">
          <Headphones size={14} />
        </div>
        <div>
          <p className="text-[9px] text-slate-400 font-medium leading-none">Audio</p>
          <p className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">432Hz Calm</p>
        </div>
      </motion.div>

      {/* DYNAMIC SPEECH / THOUGHT BUBBLE: Words Coming & Going -> 'Hope you understood' */}
      <div className="absolute top-12 z-30 w-full flex justify-center px-4">
        <AnimatePresence mode="wait">
          {!isFinal ? (
            <motion.div
              key={`step-${stepIndex}`}
              initial={{ opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.92 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-sky-300/50 dark:border-sky-500/30 px-4 py-2.5 rounded-2xl shadow-2xl shadow-blue-900/40 flex items-center gap-2.5 max-w-[320px]"
            >
              <div className="w-6 h-6 rounded-full bg-sky-500/15 flex items-center justify-center text-sky-500 shrink-0 animate-pulse">
                <Sparkles size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold uppercase tracking-wider">
                  Dr. Bloom AI
                </p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {PHRASES[stepIndex]}
                </p>
              </div>
              {/* Animated Progress Indicator */}
              <div className="flex gap-1 shrink-0">
                {PHRASES.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === stepIndex
                        ? "w-4 bg-sky-500"
                        : idx < stepIndex
                        ? "w-1.5 bg-sky-300"
                        : "w-1.5 bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="final-understood"
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white p-[1.5px] rounded-2xl shadow-2xl shadow-emerald-900/50"
            >
              <div className="bg-slate-950/90 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 flex items-center gap-1.5">
                    {FINAL_PHRASE} ✨
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Concepts clarified & retained
                  </p>
                </div>
                <button
                  onClick={handleRestart}
                  title="Replay sequence"
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 ml-1"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3D FLOATING STUDENT LEARNER (Uploaded 3D character with headphones & glowing tablet) */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full flex items-center justify-center pt-8"
      >
        <div className="relative rounded-3xl overflow-hidden drop-shadow-2xl">
          <img
            src={learnerImg}
            alt="3D Student Focusing with Dr. Bloom AI"
            className="w-full max-w-[320px] sm:max-w-[360px] object-contain transition-transform hover:scale-105 duration-500"
            style={{
              WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 65%, transparent 98%)",
              maskImage: "radial-gradient(circle at 50% 50%, black 65%, transparent 98%)",
            }}
          />
        </div>
      </motion.div>

      {/* Floating Badge Bottom-Right: Dyslexia Support */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute -bottom-2 right-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-white/10 px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-2"
      >
        <div className="w-6 h-6 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-500">
          <BookOpen size={14} />
        </div>
        <div>
          <p className="text-[9px] text-slate-400 font-medium leading-none">Dyslexia</p>
          <p className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">Lexend Active</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LearnerHeroVisual;
