// Public marketing content for Bloom AI Learning, shared by the MCP tools.

export const features = [
  {
    title: "AI Content Simplification",
    description:
      "Upload complex documents and let AI transform them into easy-to-understand micro-learning cards.",
  },
  {
    title: "Dyslexia Reading Mode",
    description:
      "Dyslexia-friendly fonts, increased spacing, and adjustable text size for comfortable reading.",
  },
  {
    title: "ADHD Focus Mode",
    description:
      "Distraction-free environment that highlights one concept at a time for deep concentration.",
  },
  {
    title: "Audio Learning",
    description:
      "Listen to your study material with text-to-speech, adjustable speed, and play/pause controls.",
  },
] as const;

export const steps = [
  { step: 1, title: "Upload Material", description: "Upload PDF, PPT, or Word documents." },
  { step: 2, title: "AI Analysis", description: "Our AI extracts and processes content." },
  { step: 3, title: "Simplification", description: "Complex concepts become micro-learning cards." },
  { step: 4, title: "Learn & Track", description: "Study at your pace with progress tracking." },
] as const;

export const appInfo = {
  name: "Bloom AI Learning",
  tagline: "Learning, Adapted to Your Mind",
  summary:
    "An AI learning space that turns complex knowledge into calm, focused understanding, designed for neurodivergent learners with ADHD and dyslexia support.",
  audience: "Students and self-learners, especially those with ADHD or dyslexia.",
  pages: ["/", "/login", "/signup", "/dashboard"],
} as const;
