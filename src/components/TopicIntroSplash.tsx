import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import learnerImg from "@/assets/learner-3d.png";

interface TopicIntroSplashProps {
  onComplete: () => void;
}

// 3 direct, clean wordings before the final 'Hope you understood'
const WORDS = [
  "Learning Adapted to Your Mind",
  "Calm Focus & Visual Clarity",
  "Concepts Simplified Step by Step",
];

const FINAL_WORD = "Hope you understood";

export const TopicIntroSplash: React.FC<TopicIntroSplashProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (step < WORDS.length) {
      // Each wording shows cleanly and advances directly to the next
      timer = setTimeout(() => {
        setStep((prev) => prev + 1);
      }, 1400);
    } else if (step === WORDS.length) {
      // Final wording: 'Hope you understood' shows, then automatically opens landing page
      timer = setTimeout(() => {
        onComplete();
      }, 1600);
    }

    return () => clearTimeout(timer);
  }, [step, onComplete]);

  const isFinal = step === WORDS.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0f24] via-[#0f1f4b] to-[#1e3a8a] text-white overflow-hidden select-none px-6"
    >
      {/* Background Ambient Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 blur-3xl pointer-events-none"
      />

      {/* Floating 3D Boy */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 mb-8"
      >
        <img
          src={learnerImg}
          alt="Dr. Bloom Learner"
          className="w-44 sm:w-56 md:w-64 object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
          style={{
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 65%, transparent 98%)",
            maskImage: "radial-gradient(circle at 50% 50%, black 65%, transparent 98%)",
          }}
        />
      </motion.div>

      {/* DIRECT WORDINGS COMING ONE BY ONE -> 'HOPE YOU UNDERSTOOD' -> AUTO OPEN */}
      <div className="relative z-10 min-h-[90px] flex items-center justify-center text-center max-w-xl w-full">
        <AnimatePresence mode="wait">
          {!isFinal ? (
            <motion.h2
              key={`word-${step}`}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight drop-shadow-lg"
            >
              {WORDS[step]}
            </motion.h2>
          ) : (
            <motion.div
              key="final-word"
              initial={{ opacity: 0, scale: 0.88, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="flex flex-col items-center"
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 drop-shadow-xl">
                {FINAL_WORD}
              </h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                transition={{ duration: 0.8 }}
                className="h-1 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full mt-3"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle Skip button top right */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 z-20 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white backdrop-blur-md transition-all"
      >
        Skip ✕
      </button>
    </motion.div>
  );
};

export default TopicIntroSplash;
