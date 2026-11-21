import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import LearnerHeroVisual from "@/components/LearnerHeroVisual";

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    const el = document.querySelector("#features");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-[94vh] flex flex-col justify-between overflow-hidden bg-[#2563eb]">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1d4ed8] via-[#2563eb] to-[#1e40af] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[450px] bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[400px] bg-rose-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Area: Text on Left + Concentrating Student on Right */}
      <div className="container mx-auto px-6 relative z-10 pt-28 pb-12 flex-1 flex items-center">
        <div className="grid lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Column: Heading, Subtitle & Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
              Where Every Mind Learns Clearly
            </div>

            {/* Main Title matching Image 3: large, bold, italicized */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold italic text-white leading-[1.06] tracking-tight mb-6">
              Learning,<br />
              Adapted<br />
              to Your Mind
            </h1>

            {/* Subtitle matching Image 3 */}
            <p className="text-base sm:text-xl text-blue-100 font-normal leading-relaxed mb-10 max-w-xl">
              An AI learning space that turns complex knowledge into calm, focused understanding.
            </p>

            {/* Buttons matching Image 3 */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-white hover:bg-slate-100 active:scale-95 text-[#2563eb] font-bold text-base px-7 py-3.5 rounded-2xl shadow-xl shadow-blue-900/30 transition-all flex items-center gap-2 group"
              >
                <span>Get Started</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToFeatures}
                className="bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/30 backdrop-blur-md font-semibold text-base px-7 py-3.5 rounded-2xl transition-all flex items-center gap-2"
              >
                <Compass size={20} />
                <span>Explore</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: 3D Student Learner with Animated Words & Understanding Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <LearnerHeroVisual />
          </motion.div>
        </div>
      </div>

      {/* ANIMATED MOVING WAVES AT THE BOTTOM */}
      <div className="relative z-10 w-full overflow-hidden leading-none pointer-events-none">
        {/* Layer 1: Slower Back Wave */}
        <div className="relative w-full h-16 sm:h-24">
          <svg
            className="absolute bottom-0 w-[200%] h-full animate-wave-slow opacity-30"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60 C320 120 420 0 720 50 C1020 100 1140 10 1440 60 C1760 120 1860 0 2160 50 C2460 100 2580 10 2880 60 L2880 120 L0 120 Z"
              fill="hsl(var(--background))"
            />
          </svg>

          {/* Layer 2: Medium Middle Wave */}
          <svg
            className="absolute bottom-0 w-[200%] h-full animate-wave-medium opacity-50"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0 70 C360 20 520 100 860 60 C1200 20 1320 80 1440 70 C1800 20 1960 100 2300 60 C2640 20 2760 80 2880 70 L2880 120 L0 120 Z"
              fill="hsl(var(--background))"
            />
          </svg>

          {/* Layer 3: Foreground Wave Moving in Opposite Phase */}
          <svg
            className="absolute bottom-0 w-[200%] h-full animate-wave-fast"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0 80 C280 40 480 110 760 70 C1040 30 1280 95 1440 80 C1720 40 1920 110 2200 70 C2480 30 2720 95 2880 80 L2880 120 L0 120 Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
