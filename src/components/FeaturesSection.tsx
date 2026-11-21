import { motion } from "framer-motion";
import { Brain, Eye, Focus, Headphones } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Content Simplification",
    description: "Upload complex documents (PDF, PPT, Word) and let AI transform them into bite-sized, easy micro-learning cards.",
    color: "text-rose-500",
  },
  {
    icon: Eye,
    title: "Dyslexia Reading Mode",
    description: "Dyslexia-friendly Lexend font, adjustable letter spacing, line height, and b/d letter differentiation.",
    color: "text-orange-500",
  },
  {
    icon: Focus,
    title: "ADHD Focus Spotlight",
    description: "Distraction-free environment that spotlights one concept at a time and dims surrounding clutter.",
    color: "text-rose-500",
  },
  {
    icon: Headphones,
    title: "Audio Narration & Speed",
    description: "Listen to your study material with dual-speed text-to-speech, Turtle-to-Rabbit speed controls, and Play All.",
    color: "text-orange-500",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Where Every Mind Learns Clearly — Tailored for neurodivergent learners with ADHD and Dyslexia.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-6 text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <f.icon className={f.color} size={28} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
