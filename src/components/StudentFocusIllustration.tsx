import React from "react";
import { motion } from "framer-motion";
import { Brain, Headphones, Sparkles, BookOpen, Target, Zap } from "lucide-react";

export const StudentFocusIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center select-none">
      {/* Background Calm Focus Aura Glow */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-4 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-400 to-rose-400 blur-3xl pointer-events-none"
      />

      {/* Floating Focus Badge 1: Top Left */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-2 left-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-white/10 px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2"
      >
        <div className="w-7 h-7 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-500">
          <Brain size={16} />
        </div>
        <div>
          <p className="text-[10px] text-slate-500 font-medium">Cognitive Mode</p>
          <p className="text-xs font-bold text-slate-800 dark:text-white">ADHD Deep Focus</p>
        </div>
      </motion.div>

      {/* Floating Focus Badge 2: Top Right */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-8 -right-2 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-white/10 px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2"
      >
        <div className="w-7 h-7 rounded-lg bg-teal-500/15 flex items-center justify-center text-teal-500">
          <Headphones size={16} />
        </div>
        <div>
          <p className="text-[10px] text-slate-500 font-medium">Sensory Audio</p>
          <p className="text-xs font-bold text-slate-800 dark:text-white">Calm Binaural 432Hz</p>
        </div>
      </motion.div>

      {/* Floating Focus Badge 3: Bottom Left */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-6 -left-2 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-white/10 px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2"
      >
        <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-500">
          <BookOpen size={16} />
        </div>
        <div>
          <p className="text-[10px] text-slate-500 font-medium">Dyslexia Support</p>
          <p className="text-xs font-bold text-slate-800 dark:text-white">Lexend Geometry Active</p>
        </div>
      </motion.div>

      {/* Main SVG: High-Detail Modern Illustration of a Student Concentrating */}
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl relative z-10"
      >
        <defs>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>
          <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="hpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id="deskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Desk Surface */}
        <path
          d="M60 410 L440 410 C450 410 460 418 460 428 L440 440 L60 440 C45 440 40 428 40 428 C40 418 50 410 60 410 Z"
          fill="url(#deskGrad)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
        />

        {/* Student Torso / Hoodie */}
        <path
          d="M170 330 C170 290 190 270 250 270 C310 270 330 290 330 330 L360 410 L140 410 Z"
          fill="url(#hoodieGrad)"
        />

        {/* Hoodie Strings & Collar */}
        <path
          d="M230 270 Q250 295 270 270"
          stroke="#1e3a8a"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M238 285 L235 320"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M262 285 L265 320"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Neck */}
        <rect x="235" y="240" width="30" height="35" rx="10" fill="url(#skinGrad)" />

        {/* Head Silhouette (Tilted down in calm, deep concentration) */}
        <circle cx="250" cy="200" r="50" fill="url(#skinGrad)" />

        {/* Hair */}
        <path
          d="M198 190 C198 140 230 135 250 135 C285 135 305 155 305 190 C305 200 295 205 285 180 C270 170 240 170 215 185 C205 195 198 195 198 190 Z"
          fill="url(#hairGrad)"
        />
        <path
          d="M200 185 C190 195 192 215 195 225 C198 215 205 200 210 195 Z"
          fill="url(#hairGrad)"
        />

        {/* Eyes (Gentle, closed/focused downward reading gaze) */}
        <path
          d="M262 205 Q272 212 280 205"
          stroke="#334155"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Soft Eyebrow */}
        <path
          d="M260 195 Q272 192 282 196"
          stroke="#1e293b"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Nose profile */}
        <path
          d="M285 205 L288 216 L283 218"
          stroke="#fdba74"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Peaceful smile */}
        <path
          d="M268 226 Q276 232 282 227"
          stroke="#f43f5e"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Noise-Canceling Over-Ear Headphones (ADHD Sensory Regulation) */}
        {/* Headband */}
        <path
          d="M195 185 C195 135 305 135 305 185"
          stroke="url(#hpGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M210 145 C230 135 270 135 290 145"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left Earcup */}
        <rect
          x="185"
          y="175"
          width="20"
          height="45"
          rx="10"
          fill="url(#hpGrad)"
          stroke="#ffffff"
          strokeWidth="2"
        />
        {/* Right Earcup */}
        <rect
          x="295"
          y="175"
          width="20"
          height="45"
          rx="10"
          fill="url(#hpGrad)"
          stroke="#ffffff"
          strokeWidth="2"
        />
        {/* Audio Pulse Rings radiating from earcup */}
        <circle cx="318" cy="197" r="14" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="318" cy="197" r="22" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />

        {/* Laptop / Learning Tablet on Desk */}
        {/* Screen Back */}
        <path
          d="M210 320 L310 320 L325 395 L195 395 Z"
          fill="#0f172a"
          stroke="#38bdf8"
          strokeWidth="2"
        />
        {/* Glowing Screen Content */}
        <path
          d="M216 326 L304 326 L318 390 L202 390 Z"
          fill="url(#screenGrad)"
          opacity="0.95"
          filter="url(#glow)"
        />
        {/* Screen Knowledge Elements: Micro-Cards */}
        <rect x="225" y="338" width="32" height="20" rx="3" fill="#ffffff" opacity="0.9" />
        <rect x="263" y="338" width="32" height="20" rx="3" fill="#ffffff" opacity="0.9" />
        <rect x="225" y="364" width="70" height="16" rx="3" fill="#ffffff" opacity="0.8" />

        {/* Student Hands Resting on Desk/Keyboard */}
        <ellipse cx="215" cy="405" rx="18" ry="10" fill="url(#skinGrad)" />
        <ellipse cx="285" cy="405" rx="18" ry="10" fill="url(#skinGrad)" />

        {/* Warm Cup of Study Tea/Coffee */}
        <rect x="110" y="385" width="24" height="30" rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M134 392 C140 392 144 397 144 402 C144 407 140 412 134 412" stroke="#cbd5e1" strokeWidth="2" fill="none" />
        {/* Gentle Steam Rising */}
        <path d="M118 375 Q122 368 118 360" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M126 375 Q130 368 126 360" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Floating Sparkles of Inspiration */}
        <g fill="#fde047">
          <path d="M150 200 L153 208 L161 211 L153 214 L150 222 L147 214 L139 211 L147 208 Z" opacity="0.8" />
          <path d="M370 250 L372 256 L378 258 L372 260 L370 266 L368 260 L362 258 L368 256 Z" opacity="0.8" />
          <path d="M330 110 L332 116 L338 118 L332 120 L330 126 L328 120 L322 118 L328 116 Z" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
};

export default StudentFocusIllustration;
