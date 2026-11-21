import { motion } from "framer-motion";
import { Upload, Cpu, Sparkles, BookOpen } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload Material", desc: "Upload PDF, PPT, or Word documents" },
  { icon: Cpu, title: "AI Analysis", desc: "Our AI extracts and processes content" },
  { icon: Sparkles, title: "Simplification", desc: "Complex concepts become micro-learning cards" },
  { icon: BookOpen, title: "Learn & Track", desc: "Study at your pace with progress tracking" },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
          How It <span className="gradient-text">Works</span>
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-card p-6 text-center relative"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-primary font-display font-bold">
              {i + 1}
            </div>
            <s.icon className="text-secondary mx-auto mb-3" size={32} />
            <h3 className="font-display font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
