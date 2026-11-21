import { motion } from "framer-motion";

const AboutSection = () => (
  <section id="about" className="py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
          About <span className="gradient-text">Dr.Bloom</span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
          Dr.Bloom is an AI-powered learning platform built for neurodivergent minds. We believe every
          student deserves to learn in a way that works for them — whether they have ADHD, Dyslexia, or
          simply prefer structured, calm learning environments.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Our mission is to make education accessible, personalized, and empowering. By leveraging
          advanced AI, we transform complex study materials into focused, bite-sized learning experiences
          that help students thrive.
        </p>
      </motion.div>
    </div>
  </section>
);

export default AboutSection;
