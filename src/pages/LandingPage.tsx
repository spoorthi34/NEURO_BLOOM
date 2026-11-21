import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import TopicIntroSplash from "@/components/TopicIntroSplash";

const LandingPage = () => {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Intro sequence: topics coming & going, then 'Hope you understood', then opens landing page */}
      <AnimatePresence>
        {showIntro && (
          <TopicIntroSplash onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      <Navbar />
      <HeroSection onReplayIntro={() => setShowIntro(true)} />
      <FeaturesSection />
      <HowItWorksSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
