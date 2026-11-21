import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Route, Eye, BarChart3, Upload, FileText,
  LogOut, Sparkles, BookOpen, Headphones,
  Timer, Play, Pause, Volume2, Target, Flame,
  TrendingUp, CheckCircle, Lightbulb, X, Send, Minus, Plus,
  Turtle, Rabbit, Sun, Moon, User, RefreshCw, Key
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import logo from "@/assets/logo.png";
import robotImg from "@/assets/robot-mascot.png";
import dashboardBg from "@/assets/dashboard-bg.jpeg";
import { toast } from "sonner";
import WikiDiagramCard from "@/components/WikiDiagramCard";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

type Feature = "smart" | "path" | "focus" | "progress" | null;

interface LearningCard {
  title: string;
  explanation: string;
  icon: string;
  keywords: string[];
  diagram: string;
}

// ── Default Sample from Image 4 & 5 ─────────────────────────────────
const SAMPLE_CCA_CARDS: LearningCard[] = [
  {
    title: "Introduction to CCA-CHAPTER-4",
    diagram: "overview",
    icon: "📘",
    explanation:
      "CHAPTER-4 ANEKA: Cloud Application platform. Overview of the Chapter 1. Framework Overview 2. Anatomy of the Aneka Container 2.1. From the Ground Up. Aneka is an extensible cloud framework providing application execution runtime across distributed infrastructures.",
    keywords: ["cloud", "aneka", "services", "application", "resources"],
  },
  {
    title: "Core Concepts",
    diagram: "mindmap",
    icon: "💡",
    explanation:
      "❖ Ensures efficient use of infrastructure and elastic performance for applications. Runtime Management > Keeps the cloud infrastructure dynamically provisioned while monitoring service-level agreements and load balancing across nodes.",
    keywords: ["aneka", "services", "container", "management", "infrastructure"],
  },
  {
    title: "Key Definitions & Architecture",
    diagram: "definitions",
    icon: "🔑",
    explanation:
      "The Aneka Container forms the foundational building block representing the host environment for application service execution, dynamic fabric configuration, security policies, and storage resource virtualization.",
    keywords: ["container", "architecture", "virtualization", "storage", "runtime"],
  },
  {
    title: "Fabric Services & Middleware",
    diagram: "relationships",
    icon: "🔗",
    explanation:
      "Fabric Services provide hardware abstraction, security enforcement, resource discovery, node heartbeat telemetry, and billing services across private and hybrid cloud topologies.",
    keywords: ["fabric", "middleware", "security", "accounting", "nodes"],
  },
  {
    title: "Dynamic Elastic Scaling",
    diagram: "deep-dive",
    icon: "⚡",
    explanation:
      "Dynamic resource provisioning allows Aneka to auto-scale worker nodes based on real-time task queue depth, ensuring deterministic quality-of-service without paying for idle hardware compute capacity.",
    keywords: ["scaling", "elasticity", "sla", "performance", "compute"],
  },
  {
    title: "Chapter Summary & Review",
    diagram: "summary",
    icon: "🎯",
    explanation:
      "In summary, Aneka simplifies distributed enterprise cloud computing by abstracting multi-tenant execution into modular containers, combining high-throughput tasks with resilient fault tolerance.",
    keywords: ["summary", "hpc", "enterprise", "cloud", "fault-tolerance"],
  },
];

// ── Client-side NLP helpers ──────────────────────────────────────
function extractSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20);
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the","and","for","are","but","not","you","all","can","had","her","was","one","our",
    "out","has","have","been","some","them","than","this","that","with","from","will",
    "they","each","make","like","long","look","many","over","such","take","into","just",
    "also","what","when","which","their","there","about","would","these","other","could",
    "after","where","those","being","between","does","while","should","because","through",
    "during","before","more","most","very","much","only","then","first","well","even",
    "still","here","both","know","work","used","using","based","however","include",
  ]);
  const wordFreq: Record<string, number> = {};
  const words = text.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));
  words.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([w]) => w);
}

function chunkText(sentences: string[], chunkSize: number): string[][] {
  const chunks: string[][] = [];
  for (let i = 0; i < sentences.length; i += chunkSize) {
    chunks.push(sentences.slice(i, i + chunkSize));
  }
  return chunks;
}

function generateCardsFromText(fileName: string, fullText: string): LearningCard[] {
  const name = fileName.replace(/\.[^/.]+$/, "");
  const sentences = extractSentences(fullText);
  const keywords = extractKeywords(fullText);

  if (sentences.length < 2) {
    return [{
      title: `Overview of ${name}`,
      explanation: fullText.substring(0, 500) || "Could not extract enough text from this document. Try a text-based PDF.",
      icon: "📄",
      keywords: keywords.slice(0, 5),
      diagram: "overview",
    }];
  }

  const chunks = chunkText(sentences, Math.max(3, Math.ceil(sentences.length / 6)));
  const icons = ["📘", "💡", "🔑", "🔗", "⚡", "🎯"];
  const diagramTypes = ["overview", "mindmap", "definitions", "relationships", "deep-dive", "summary"];
  const cardTitles = [
    `Introduction to ${name}`,
    "Core Concepts",
    "Key Definitions & Terms",
    "Concept Relationships",
    "Deep Dive Analysis",
    "Summary & Review",
  ];

  return chunks.slice(0, 6).map((chunk, i) => {
    const chunkText = chunk.join(" ");
    const chunkKeywords = extractKeywords(chunkText).slice(0, 5);
    return {
      title: cardTitles[i] || `Section ${i + 1}`,
      explanation: chunkText.length > 400 ? chunkText.substring(0, 400) + "..." : chunkText,
      icon: icons[i] || "📝",
      keywords: chunkKeywords.length > 0 ? chunkKeywords : keywords.slice(i * 3, i * 3 + 4),
      diagram: diagramTypes[i] || "summary",
    };
  });
}

// ── File Extraction ──────────────────────────────────────────────
async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n\n";
  }
  return fullText.trim();
}

async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") {
    try {
      return await extractTextFromPDF(file);
    } catch (err) {
      console.error("PDF extraction error:", err);
      toast.error("Could not parse PDF. Trying as text...");
    }
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text || `Content from: ${file.name}`);
    };
    reader.onerror = () => resolve(`Content from: ${file.name}`);
    reader.readAsText(file);
  });
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "Student", email: "student@bloom.edu" });

  // Light / Dark mode toggle (defaults to dark matching Image 2, toggleable to light matching Image 5)
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Navigation & Active Feature: defaults to null so the 4 Core Feature Cards (Image 2) appear first!
  const [activeFeature, setActiveFeature] = useState<Feature>(null);
  const [uploadedFileName, setUploadedFileName] = useState("CCA-CHAPTER-4.pdf");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // Cards & Text
  const [learningCards, setLearningCards] = useState<LearningCard[]>(SAMPLE_CCA_CARDS);
  const [extractedWordsCount, setExtractedWordsCount] = useState(2374);
  const [extractedKeywordsCount, setExtractedKeywordsCount] = useState(30);
  const [extractedText, setExtractedText] = useState(
    SAMPLE_CCA_CARDS.map(c => `${c.title}. ${c.explanation}`).join("\n\n")
  );

  // Accessibility Settings (matching Images 4 & 5!)
  const [fontSizePx, setFontSizePx] = useState(16); // 16px default
  const [letterSpacingPx, setLetterSpacingPx] = useState(0); // 0px default
  const [lineHeightRatio, setLineHeightRatio] = useState(1.6); // 1.6 default
  const [focusMode, setFocusMode] = useState(false);
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [highlightBD, setHighlightBD] = useState(false);

  // Audio Playback
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // Timer
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  // Chatbot Drawer
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content: "Hello! I am Dr.Bloom AI 🤖 I have analyzed your document 'CCA-CHAPTER-4.pdf'. How can I assist your study session today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("drbloom_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  // Timer interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((s) => {
          if (s === 0) {
            if (timerMinutes === 0) {
              setTimerActive(false);
              if (!isBreak) {
                toast.success("Focus block complete! Time for a 5-minute break 🎉");
                setTimerMinutes(5);
                setIsBreak(true);
              } else {
                toast.success("Break finished! Ready for next learning sprint 📚");
                setTimerMinutes(25);
                setIsBreak(false);
              }
              return 0;
            }
            setTimerMinutes((m) => m - 1);
            return 59;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerMinutes, isBreak]);

  // Handle TTS
  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsPlayingAll(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackSpeed;
      utterance.onend = () => setIsPlayingAll(false);
      utterance.onerror = () => setIsPlayingAll(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAll(true);
    } else {
      toast.error("Text-to-speech not supported in this browser");
    }
  };

  const handlePlayAll = () => {
    if (isPlayingAll) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      setIsPlayingAll(false);
    } else {
      const fullNarration = learningCards
        .map((c, i) => `Card ${i + 1}: ${c.title}. ${c.explanation}`)
        .join(". Next topic: ");
      handleSpeak(fullNarration);
    }
  };

  // File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsProcessing(true);
    setProcessingStep(0);
    setLearningCards([]);

    const stepInterval = setInterval(() => {
      setProcessingStep((p) => Math.min(p + 1, 4));
    }, 900);

    try {
      const text = await extractTextFromFile(file);
      setExtractedText(text);
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      setExtractedWordsCount(wordCount);

      setTimeout(() => {
        clearInterval(stepInterval);
        setIsProcessing(false);

        if (text.trim().length < 20) {
          toast.error("Could not extract enough text. Loaded fallback overview.");
          setLearningCards([
            {
              title: `Overview of ${file.name}`,
              explanation: "The uploaded file could not be parsed as text. Please upload a text-based PDF or TXT file.",
              diagram: "overview",
              icon: "⚠️",
              keywords: ["document", "upload"],
            },
          ]);
        } else {
          const cards = generateCardsFromText(file.name, text);
          setLearningCards(cards);
          setExtractedKeywordsCount(extractKeywords(text).length);
          toast.success(`Extracted ${wordCount} words and generated ${cards.length} concept cards! 🎉`);
        }
      }, 4000);
    } catch (err) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      toast.error("Error reading file.");
    }
  };

  const handleLoadSample = () => {
    setUploadedFileName("CCA-CHAPTER-4.pdf");
    setLearningCards(SAMPLE_CCA_CARDS);
    setExtractedWordsCount(2374);
    setExtractedKeywordsCount(30);
    setExtractedText(SAMPLE_CCA_CARDS.map(c => `${c.title}. ${c.explanation}`).join("\n\n"));
    toast.success("Loaded CCA-CHAPTER-4.pdf sample concept cards!");
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const query = chatInput;
    setChatMessages((prev) => [...prev, { role: "user", content: query }]);
    setChatInput("");

    setTimeout(() => {
      let reply = "";
      const q = query.toLowerCase();

      if (q.includes("aneka") || q.includes("container") || q.includes("cca")) {
        reply =
          "According to Chapter 4, Aneka is a cloud application development platform that deploys customizable container environments across private or public infrastructure. It features runtime management, fabric services, and elastic scaling to meet strict SLAs.";
      } else if (q.includes("quiz") || q.includes("test")) {
        reply =
          "Here is a quick quiz for you:\n\n1. What is the primary role of the Aneka Container?\n2. Which services handle node heartbeat monitoring and billing?\n3. How does dynamic resource scaling reduce compute cost?";
      } else if (q.includes("explain") || q.includes("summary")) {
        reply =
          "In simple words: Imagine having computers of all different shapes and sizes. Aneka acts like an orchestra conductor, bundling them into identical virtual containers so any application runs smoothly without crashing.";
      } else {
        reply =
          `Based on ${uploadedFileName}: The document covers ${learningCards.length} core concepts including ${learningCards.map(c => c.title).slice(0, 3).join(", ")}. Feel free to ask me to explain any term or test your memory!`;
      }

      setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    }, 600);
  };

  const renderDyslexiaText = (text: string) => {
    if (!highlightBD) return text;
    // Highlight 'b' and 'd' with subtle colors to avoid mirroring
    const parts = text.split(/([bdBD])/g);
    return parts.map((part, i) => {
      if (part.toLowerCase() === "b") {
        return (
          <span key={i} className="text-sky-600 dark:text-sky-400 font-bold underline decoration-sky-400">
            {part}
          </span>
        );
      }
      if (part.toLowerCase() === "d") {
        return (
          <span key={i} className="text-rose-600 dark:text-rose-400 font-bold underline decoration-rose-400">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const isLight = theme === "light";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 relative ${
        isLight
          ? "bg-[#f8fafc] text-slate-800"
          : "bg-[#0b0c16] text-slate-100"
      }`}
      style={
        !isLight
          ? {
              backgroundImage: `url(${dashboardBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }
          : undefined
      }
    >
      {/* Background Dim / Overlay */}
      {!isLight && <div className="absolute inset-0 bg-[#090a14]/75 pointer-events-none" />}

      {/* TOP NAVIGATION BAR matching Image 5 */}
      <header
        className={`sticky top-0 z-40 transition-colors border-b backdrop-blur-xl ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-sm"
            : "bg-[#0d0f1e]/90 border-white/10"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo and Back to Landing */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              title="Return to Landing Page"
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300"
              }`}
            >
              <span>← Landing Page</span>
            </button>
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="Dr.Bloom Logo" className="h-9 w-9 object-contain" />
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                Dr.Bloom
              </span>
            </Link>
          </div>

          {/* Navigation Links matching Image 5 */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* 4 Core Features Button */}
            <button
              onClick={() => setActiveFeature(null)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeFeature === null
                  ? "bg-[#e11d48] text-white shadow-md shadow-rose-500/30"
                  : isLight ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>4 Core Features</span>
            </button>

            {/* AI Assistant Active Pill matching Image 5 (Pink Pill!) */}
            <button
              onClick={() => setActiveFeature("smart")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                activeFeature === "smart"
                  ? "bg-[#e11d48] text-white shadow-md shadow-rose-500/30"
                  : isLight ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Brain size={16} />
              <span>Smart Assistant</span>
            </button>

            <button
              onClick={() => setActiveFeature("path")}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeFeature === "path"
                  ? "bg-[#e11d48] text-white shadow-md shadow-rose-500/30"
                  : isLight ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Route size={15} />
              <span>Learning Path</span>
            </button>

            <button
              onClick={() => setActiveFeature("focus")}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeFeature === "focus"
                  ? "bg-[#e11d48] text-white shadow-md shadow-rose-500/30"
                  : isLight ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Eye size={15} />
              <span>Focus & Accessibility</span>
            </button>

            <button
              onClick={() => setActiveFeature("progress")}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeFeature === "progress"
                  ? "bg-[#e11d48] text-white shadow-md shadow-rose-500/30"
                  : isLight ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <BarChart3 size={15} />
              <span>Progress Insights</span>
            </button>

            <button
              onClick={() => setProfileModalOpen(true)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-white"
              }`}
            >
              <User size={15} />
              <span>Profile</span>
            </button>
          </nav>

          {/* Right Controls: Dark/Light Toggle & Logout */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button matching Image 5 (Moon/Sun) */}
            <button
              onClick={() => setTheme(isLight ? "dark" : "light")}
              title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
              className={`p-2 rounded-xl transition-all ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  : "bg-white/10 hover:bg-white/15 text-amber-300"
              }`}
            >
              {isLight ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("drbloom_user");
                navigate("/");
              }}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-xl transition-colors ${
                isLight
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="container mx-auto px-4 py-6 relative z-10">
        <AnimatePresence mode="wait">
          {/* ============================================================== */}
          {/* 1. DASHBOARD OVERVIEW: 4 FEATURE CARDS matching Image 2       */}
          {/* ============================================================== */}
          {!activeFeature ? (
            <motion.div
              key="dashboard-home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto pt-6"
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-display font-extrabold mb-2">
                  Welcome back, <span className="text-[#e11d48]">{user.name}</span>
                </h1>
                <p className={`${isLight ? "text-slate-500" : "text-slate-400"} text-sm sm:text-base`}>
                  Choose your learning mode or continue where you left off.
                </p>
              </div>

              {/* 4 Feature Cards Grid matching Image 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {/* Card 1: Smart Learning Assistant */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => setActiveFeature("smart")}
                  className={`rounded-3xl p-8 cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                    isLight
                      ? "bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 hover:border-pink-300"
                      : "bg-[#131528]/80 border border-white/10 hover:border-white/25 shadow-2xl backdrop-blur-xl"
                  }`}
                >
                  <div className="w-20 h-20 rounded-3xl bg-pink-500/15 border border-pink-500/20 flex items-center justify-center mb-6">
                    <Brain className="text-[#f43f5e]" size={38} />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2 text-foreground">
                    Smart Learning Assistant
                  </h3>
                  <p className={`text-sm mb-6 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    Upload & get AI-powered micro-learning cards
                  </p>
                  <button className="bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold text-xs px-6 py-2 rounded-full shadow-md shadow-rose-500/20">
                    Explore
                  </button>
                </motion.div>

                {/* Card 2: Learning Path */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => setActiveFeature("path")}
                  className={`rounded-3xl p-8 cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                    isLight
                      ? "bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 hover:border-orange-300"
                      : "bg-[#131528]/80 border border-white/10 hover:border-white/25 shadow-2xl backdrop-blur-xl"
                  }`}
                >
                  <div className="w-20 h-20 rounded-3xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center mb-6">
                    <Route className="text-orange-500" size={38} />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2 text-foreground">
                    Learning Path
                  </h3>
                  <p className={`text-sm mb-6 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    Visual roadmap with progress tracking
                  </p>
                  <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-xs px-6 py-2 rounded-full shadow-md shadow-orange-500/20">
                    Explore
                  </button>
                </motion.div>

                {/* Card 3: Focus & Accessibility */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => setActiveFeature("focus")}
                  className={`rounded-3xl p-8 cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                    isLight
                      ? "bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 hover:border-pink-300"
                      : "bg-[#131528]/80 border border-white/10 hover:border-white/25 shadow-2xl backdrop-blur-xl"
                  }`}
                >
                  <div className="w-20 h-20 rounded-3xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center mb-6">
                    <Eye className="text-rose-400" size={38} />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2 text-foreground">
                    Focus & Accessibility
                  </h3>
                  <p className={`text-sm mb-6 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    Dyslexia mode, ADHD focus, audio narration
                  </p>
                  <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-xs px-6 py-2 rounded-full shadow-md shadow-rose-500/20">
                    Explore
                  </button>
                </motion.div>

                {/* Card 4: Progress Insights */}
                <motion.div
                  whileHover={{ y: -4 }}
                  onClick={() => setActiveFeature("progress")}
                  className={`rounded-3xl p-8 cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                    isLight
                      ? "bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 hover:border-amber-300"
                      : "bg-[#131528]/80 border border-white/10 hover:border-white/25 shadow-2xl backdrop-blur-xl"
                  }`}
                >
                  <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center mb-6">
                    <BarChart3 className="text-amber-400" size={38} />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2 text-foreground">
                    Progress Insights
                  </h3>
                  <p className={`text-sm mb-6 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    Track streaks, concepts & weekly progress
                  </p>
                  <button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold text-xs px-6 py-2 rounded-full shadow-md shadow-amber-500/20">
                    Explore
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ) : activeFeature === "smart" ? (
            /* ============================================================== */
            /* 2. SMART LEARNING ASSISTANT WORKSPACE (Images 4 & 5)           */
            /* ============================================================== */
            <motion.div
              key="smart-workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Back to 4 Features Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveFeature(null)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 flex items-center gap-1.5 transition-all"
                >
                  ← Back to 4 Core Features (Overview)
                </button>
              </div>

              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/15 flex items-center justify-center">
                    <Brain className="text-[#f43f5e]" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-extrabold text-foreground">
                      Smart Learning Assistant
                    </h2>
                    <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      AI extracted concept cards tailored to your cognitive comfort
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLoadSample}
                    className={`text-xs px-3.5 py-1.5 rounded-xl border font-medium transition-all flex items-center gap-1.5 ${
                      isLight
                        ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <RefreshCw size={13} />
                    <span>Reload CCA-CHAPTER-4</span>
                  </button>

                  <label
                    className={`text-xs px-3.5 py-1.5 rounded-xl border font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                      isLight
                        ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                        : "bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25"
                    }`}
                  >
                    <Upload size={13} />
                    <span>Upload New Doc</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.ppt,.pptx,.doc,.docx,.txt"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Processing Loader if uploading */}
              {isProcessing && (
                <div className={`p-6 rounded-2xl border ${isLight ? "bg-white border-slate-200 shadow-lg" : "bg-slate-900/90 border-white/10"}`}>
                  <p className="font-display font-bold text-base mb-4 flex items-center gap-2">
                    <Sparkles className="text-rose-500 animate-spin" size={18} />
                    Processing {uploadedFileName}... (Step {processingStep + 1} of 5)
                  </p>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 transition-all duration-500"
                      style={{ width: `${((processingStep + 1) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Top Stats Pill Bar matching Image 5 */}
              <div
                className={`rounded-2xl px-5 py-3 border flex flex-wrap items-center justify-between gap-4 text-xs ${
                  isLight
                    ? "bg-white/90 border-slate-200 shadow-sm text-slate-600"
                    : "bg-[#131528]/85 border-white/10 text-slate-300"
                }`}
              >
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-medium">
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <FileText size={15} className="text-rose-500" />
                    {uploadedFileName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BarChart3 size={15} className="text-orange-500" />
                    {extractedWordsCount} words extracted
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Brain size={15} className="text-rose-500" />
                    {learningCards.length} concept cards
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Key size={15} className="text-amber-500" />
                    {extractedKeywordsCount}+ keywords
                  </span>
                </div>
              </div>

              {/* Audio Narration Bar matching Image 5 */}
              <div
                className={`rounded-2xl px-5 py-3 border flex flex-wrap items-center justify-between gap-4 ${
                  isLight
                    ? "bg-white/90 border-slate-200 shadow-sm"
                    : "bg-[#131528]/85 border-white/10"
                }`}
              >
                {/* Play All Button with hot pink pill styling */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePlayAll}
                    className="bg-[#e11d48] hover:bg-[#be123c] active:scale-95 text-white font-semibold text-xs sm:text-sm px-6 py-2 rounded-full shadow-md shadow-rose-500/30 transition-all flex items-center gap-2"
                  >
                    {isPlayingAll ? <Pause size={15} /> : <Play size={15} className="fill-white" />}
                    <span>{isPlayingAll ? "Pause Audio" : "Play All"}</span>
                  </button>

                  {/* Speed Controls with Turtle & Rabbit Icons */}
                  <div className="flex items-center gap-2 text-xs">
                    <Turtle size={16} className={isLight ? "text-slate-400" : "text-slate-500"} />
                    <input
                      type="range"
                      min={0.5}
                      max={2.5}
                      step={0.25}
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                      className="w-20 sm:w-28 accent-[#e11d48]"
                    />
                    <Rabbit size={16} className={isLight ? "text-slate-400" : "text-slate-500"} />
                    <span className="font-mono font-semibold ml-1 text-foreground">
                      {playbackSpeed}x
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground hidden sm:block">
                  🎧 Multi-sensory speech helps ADHD & Dyslexic retention
                </div>
              </div>

              {/* Main Workspace Grid: Cards (Left) + Accessibility Sidebar (Right) */}
              <div className="grid lg:grid-cols-12 gap-6 items-start pt-2">
                {/* Left Area: Concept Cards (Images 4 & 5) */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display font-bold text-lg text-foreground">
                      {uploadedFileName.replace(/\.[^/.]+$/, "")}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      Showing {learningCards.length} micro-learning cards
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {learningCards.map((card, idx) => {
                      const isFocused = focusMode && idx === focusedCardIndex;
                      const isDimmed = focusMode && idx !== focusedCardIndex;

                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{
                            opacity: isDimmed ? 0.2 : 1,
                            scale: isFocused ? 1.02 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                          onClick={() => {
                            if (focusMode) setFocusedCardIndex(idx);
                            setExpandedCard(expandedCard === idx ? null : idx);
                          }}
                          className={`rounded-2xl p-5 cursor-pointer transition-all relative flex flex-col justify-between ${
                            isLight
                              ? `bg-white border ${
                                  isFocused
                                    ? "border-sky-500 ring-2 ring-sky-400/40 shadow-xl shadow-sky-500/10"
                                    : "border-slate-200/90 shadow-md hover:border-slate-300"
                                }`
                              : `bg-[#131528]/80 border ${
                                  isFocused
                                    ? "border-sky-500 ring-2 ring-sky-500/40 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                                    : "border-white/10 hover:border-white/20"
                                } backdrop-blur-md`
                          }`}
                        >
                          <div>
                            {/* Card Top: Icon & Badge */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-2xl">{card.icon}</span>
                              <span
                                className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                                  isLight
                                    ? "bg-pink-50 text-[#e11d48] border border-pink-200"
                                    : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                }`}
                              >
                                {card.diagram}
                              </span>
                            </div>

                            {/* Card Title */}
                            <h4
                              className={`font-display font-bold text-base mb-2 text-foreground ${
                                dyslexiaFont ? "font-body" : ""
                              }`}
                            >
                              {card.title}
                            </h4>

                            {/* Card Explanation with live font size, letter spacing, line height */}
                            <div
                              style={{
                                fontSize: `${fontSizePx}px`,
                                letterSpacing: `${letterSpacingPx}px`,
                                lineHeight: lineHeightRatio,
                              }}
                              className={`transition-all leading-relaxed ${
                                isLight ? "text-slate-600" : "text-slate-300"
                              } ${dyslexiaFont ? "font-body" : ""}`}
                            >
                              {renderDyslexiaText(card.explanation)}
                            </div>
                          </div>

                          {/* Card Bottom: Keyword tags & Read aloud */}
                          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10">
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {card.keywords.map((kw) => (
                                <span
                                  key={kw}
                                  className={`text-[10px] px-2 py-0.5 rounded-md ${
                                    isLight
                                      ? "bg-pink-50 text-[#e11d48] font-medium"
                                      : "bg-white/5 text-slate-300 border border-white/5"
                                  }`}
                                >
                                  #{kw}
                                </span>
                              ))}
                            </div>

                            {/* Expanded diagram preview */}
                            {expandedCard === idx && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-2 pt-2 border-t border-slate-100 dark:border-white/10"
                              >
                                <WikiDiagramCard topics={[...card.keywords, card.title]} />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSpeak(`${card.title}. ${card.explanation}`);
                                  }}
                                  className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 mt-2"
                                >
                                  <Volume2 size={13} /> Read Card Aloud
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Area: ACCESSIBILITY SETTINGS PANEL matching Images 4 & 5 */}
                <aside className="lg:col-span-4 sticky top-24">
                  <div
                    className={`rounded-3xl p-6 border shadow-xl transition-all ${
                      isLight
                        ? "bg-white border-slate-200/90 text-slate-800"
                        : "bg-[#131528]/90 border-white/10 text-white backdrop-blur-xl"
                    }`}
                  >
                    <div className="mb-6">
                      <h3 className="font-display font-bold text-lg text-foreground">
                        Accessibility Settings
                      </h3>
                      <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                        Customize your reading experience
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Control 1: Font Size */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <span className="text-base font-serif">T</span> Font Size
                          </label>
                          <span className="text-xs font-mono font-bold text-foreground">
                            {fontSizePx}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setFontSizePx((prev) => Math.max(12, prev - 1))}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all ${
                              isLight
                                ? "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                                : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                            }`}
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="range"
                            min={12}
                            max={26}
                            step={1}
                            value={fontSizePx}
                            onChange={(e) => setFontSizePx(Number(e.target.value))}
                            className="flex-1 accent-[#e11d48]"
                          />
                          <button
                            onClick={() => setFontSizePx((prev) => Math.min(26, prev + 1))}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all ${
                              isLight
                                ? "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                                : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                            }`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Control 2: Letter Spacing */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <span className="text-base font-serif">T</span> Letter Spacing
                          </label>
                          <span className="text-xs font-mono font-bold text-foreground">
                            {letterSpacingPx}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setLetterSpacingPx((prev) => Math.max(0, prev - 1))}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all ${
                              isLight
                                ? "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                                : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                            }`}
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="range"
                            min={0}
                            max={4}
                            step={1}
                            value={letterSpacingPx}
                            onChange={(e) => setLetterSpacingPx(Number(e.target.value))}
                            className="flex-1 accent-[#e11d48]"
                          />
                          <button
                            onClick={() => setLetterSpacingPx((prev) => Math.min(4, prev + 1))}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all ${
                              isLight
                                ? "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                                : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                            }`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Control 3: Line Height */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <span className="text-base font-serif">T</span> Line Height
                          </label>
                          <span className="text-xs font-mono font-bold text-foreground">
                            {lineHeightRatio.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setLineHeightRatio((prev) => Math.max(1.2, +(prev - 0.2).toFixed(1)))}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all ${
                              isLight
                                ? "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                                : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                            }`}
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="range"
                            min={1.2}
                            max={2.4}
                            step={0.2}
                            value={lineHeightRatio}
                            onChange={(e) => setLineHeightRatio(Number(e.target.value))}
                            className="flex-1 accent-[#e11d48]"
                          />
                          <button
                            onClick={() => setLineHeightRatio((prev) => Math.min(2.4, +(prev + 0.2).toFixed(1)))}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all ${
                              isLight
                                ? "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                                : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                            }`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Control 4: Focus Mode Toggle matching Images 4 & 5 */}
                      <div className="pt-4 border-t border-slate-100 dark:border-white/10">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <Eye size={16} className="text-[#e11d48]" />
                            <span>Focus Mode</span>
                          </label>

                          {/* Toggle Switch */}
                          <button
                            type="button"
                            role="switch"
                            aria-checked={focusMode}
                            onClick={() => setFocusMode(!focusMode)}
                            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                              focusMode
                                ? "bg-[#e11d48]"
                                : isLight ? "bg-slate-200" : "bg-slate-700"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                                focusMode ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>

                        <p className={`text-[11px] leading-relaxed ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                          Click a paragraph to spotlight it. Dims all other content.
                        </p>
                      </div>

                      {/* Additional Neurodivergent Adaptations */}
                      <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-3">
                        {/* Dyslexia font */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground">
                            Dyslexia-Friendly Font (Lexend)
                          </span>
                          <input
                            type="checkbox"
                            checked={dyslexiaFont}
                            onChange={(e) => setDyslexiaFont(e.target.checked)}
                            className="w-4 h-4 accent-[#e11d48] rounded"
                          />
                        </div>

                        {/* B/D Differentiation */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground">
                            B / D Letter Color Distinction
                          </span>
                          <input
                            type="checkbox"
                            checked={highlightBD}
                            onChange={(e) => setHighlightBD(e.target.checked)}
                            className="w-4 h-4 accent-[#e11d48] rounded"
                          />
                        </div>
                      </div>

                      {/* Focus Timer Widget */}
                      <div className="pt-4 border-t border-slate-100 dark:border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold flex items-center gap-1 text-foreground">
                            <Timer size={14} className="text-orange-500" />
                            {isBreak ? "Break Timer" : "ADHD Sprint Timer"}
                          </span>
                          <span className="text-xs font-mono font-bold text-foreground">
                            {String(timerMinutes).padStart(2, "0")}:{String(timerSeconds).padStart(2, "0")}
                          </span>
                        </div>
                        <button
                          onClick={() => setTimerActive(!timerActive)}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                            timerActive
                              ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                              : isLight
                              ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                              : "bg-white/10 hover:bg-white/15 text-white"
                          }`}
                        >
                          {timerActive ? "Pause Timer" : "Start 25m Focus Sprint"}
                        </button>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </motion.div>
          ) : activeFeature === "path" ? (
            /* ============================================================== */
            /* 3. PERSONALIZED LEARNING PATH                                  */
            /* ============================================================== */
            <motion.div
              key="path-workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <button
                onClick={() => setActiveFeature(null)}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 flex items-center gap-1.5 transition-all mb-2"
              >
                ← Back to 4 Core Features
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/15 flex items-center justify-center">
                  <Route className="text-orange-500" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-extrabold text-foreground">
                    Personalized Learning Path
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Adaptive visual roadmap aligned with your pace
                  </p>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border ${isLight ? "bg-white border-slate-200 shadow-md" : "bg-[#131528]/90 border-white/10"}`}>
                <h3 className="font-display font-bold text-base mb-6">Course Milestones: Distributed Computing</h3>
                <div className="space-y-6">
                  {[
                    { title: "Foundations of Cloud Frameworks", status: "completed", progress: 100 },
                    { title: "Aneka Container & Runtime Architecture", status: "in-progress", progress: 65 },
                    { title: "Fabric Services & Dynamic Elastic Scaling", status: "locked", progress: 0 },
                    { title: "High-Performance Workload Optimization", status: "locked", progress: 0 },
                  ].map((node, i) => (
                    <div key={node.title} className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                          node.status === "completed"
                            ? "bg-teal-500/20 text-teal-500 border border-teal-500/30"
                            : node.status === "in-progress"
                            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse"
                            : isLight ? "bg-slate-100 text-slate-400" : "bg-white/5 text-slate-500"
                        }`}
                      >
                        {node.status === "completed" ? <CheckCircle size={18} /> : i + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-display font-bold text-sm text-foreground">{node.title}</p>
                          <span className="text-xs font-mono text-muted-foreground">{node.progress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full transition-all duration-700"
                            style={{ width: `${node.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : activeFeature === "focus" ? (
            /* ============================================================== */
            /* 4. FOCUS & ACCESSIBILITY OVERVIEW                              */
            /* ============================================================== */
            <motion.div
              key="focus-overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <button
                onClick={() => setActiveFeature(null)}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 flex items-center gap-1.5 transition-all mb-2"
              >
                ← Back to 4 Core Features
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/15 flex items-center justify-center">
                  <Eye className="text-rose-500" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-extrabold text-foreground">
                    Focus & Accessibility Hub
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Tailored accommodations for ADHD and Dyslexic strengths
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div className={`p-6 rounded-3xl border text-center ${isLight ? "bg-white border-slate-200 shadow-md" : "bg-[#131528]/85 border-white/10"}`}>
                  <Eye className="mx-auto text-rose-500 mb-3" size={32} />
                  <h4 className="font-display font-bold text-base mb-1">Dyslexia Reading Mode</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    High-contrast Lexend font with letter-weighting prevents flipping b/d/p/q.
                  </p>
                  <button
                    onClick={() => {
                      setDyslexiaFont(!dyslexiaFont);
                      setActiveFeature("smart");
                    }}
                    className="w-full bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 py-2 rounded-xl text-xs font-bold"
                  >
                    {dyslexiaFont ? "Disable Font" : "Enable Lexend Font"}
                  </button>
                </div>

                <div className={`p-6 rounded-3xl border text-center ${isLight ? "bg-white border-slate-200 shadow-md" : "bg-[#131528]/85 border-white/10"}`}>
                  <Target className="mx-auto text-orange-500 mb-3" size={32} />
                  <h4 className="font-display font-bold text-base mb-1">ADHD Spotlight Mode</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Eliminate visual clutter by spotlighting only one card at a time.
                  </p>
                  <button
                    onClick={() => {
                      setFocusMode(true);
                      setActiveFeature("smart");
                    }}
                    className="w-full bg-orange-500/15 text-orange-500 hover:bg-orange-500/25 py-2 rounded-xl text-xs font-bold"
                  >
                    Launch Focus Spotlight
                  </button>
                </div>

                <div className={`p-6 rounded-3xl border text-center ${isLight ? "bg-white border-slate-200 shadow-md" : "bg-[#131528]/85 border-white/10"}`}>
                  <Headphones className="mx-auto text-teal-500 mb-3" size={32} />
                  <h4 className="font-display font-bold text-base mb-1">Audio Narration</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Dual-channel audio narration keeps attention locked onto key concepts.
                  </p>
                  <button
                    onClick={() => {
                      setActiveFeature("smart");
                      handlePlayAll();
                    }}
                    className="w-full bg-teal-500/15 text-teal-500 hover:bg-teal-500/25 py-2 rounded-xl text-xs font-bold"
                  >
                    Listen to Cards
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ============================================================== */
            /* 5. PROGRESS INSIGHTS                                           */
            /* ============================================================== */
            <motion.div
              key="progress-overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <button
                onClick={() => setActiveFeature(null)}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 flex items-center gap-1.5 transition-all mb-2"
              >
                ← Back to 4 Core Features
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 flex items-center justify-center">
                  <BarChart3 className="text-amber-500" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-extrabold text-foreground">
                    Learning Progress & Analytics
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Quantify retention and build positive momentum
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Concepts Mastered", value: "18", icon: CheckCircle, color: "text-teal-500" },
                  { label: "Current Study Streak", value: "7 Days 🔥", icon: Flame, color: "text-rose-500" },
                  { label: "Weekly Goal Accuracy", value: "88%", icon: TrendingUp, color: "text-amber-500" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`p-6 rounded-3xl border text-center ${
                      isLight ? "bg-white border-slate-200 shadow-md" : "bg-[#131528]/85 border-white/10"
                    }`}
                  >
                    <stat.icon className={`mx-auto mb-2 ${stat.color}`} size={28} />
                    <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FLOATING AI CHATBOT MASCOT BUTTON matching Image 5 */}
      <motion.button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-tr from-[#e11d48] to-[#f43f5e] p-1 shadow-2xl shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center overflow-hidden"
        animate={{ y: chatOpen ? 0 : [0, -5, 0] }}
        transition={{ repeat: chatOpen ? 0 : Infinity, duration: 2.2 }}
      >
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
          {chatOpen ? (
            <X size={24} className="text-[#e11d48]" />
          ) : (
            <img src={robotImg} alt="Dr.Bloom Mascot" className="w-12 h-12 object-contain" />
          )}
        </div>
      </motion.button>

      {/* SLIDING AI CHATBOT DRAWER */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 150, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 150, scale: 0.95 }}
            className={`fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-3xl border shadow-2xl overflow-hidden ${
              isLight
                ? "bg-white border-slate-200 text-slate-800"
                : "bg-[#131528] border-white/15 text-white backdrop-blur-xl"
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#e11d48] to-[#f43f5e] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={robotImg} alt="Dr.Bloom Robot" className="w-9 h-9 object-contain" />
                <div>
                  <h4 className="font-display font-bold text-sm">Dr.Bloom AI Tutor</h4>
                  <p className="text-[10px] text-white/80">Context: {uploadedFileName}</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-[#e11d48] text-white rounded-br-sm"
                        : isLight
                        ? "bg-slate-100 text-slate-800 rounded-bl-sm"
                        : "bg-white/10 text-slate-200 rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Row */}
            <div className="p-3 border-t border-slate-100 dark:border-white/10 flex items-center gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                placeholder="Ask Dr.Bloom anything..."
                className={`flex-1 text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                  isLight
                    ? "bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-400"
                    : "bg-slate-900 border-white/10 text-white focus:border-rose-400"
                }`}
              />
              <button
                onClick={handleChatSend}
                className="bg-[#e11d48] hover:bg-rose-700 text-white p-2.5 rounded-xl transition-all"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STUDENT PROFILE MODAL */}
      <AnimatePresence>
        {profileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`max-w-md w-full rounded-3xl p-6 border shadow-2xl relative ${
                isLight ? "bg-white border-slate-200" : "bg-[#131528] border-white/10 text-white"
              }`}
            >
              <button
                onClick={() => setProfileModalOpen(false)}
                className="absolute top-5 right-5 text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground">{user.name}</h3>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs mb-6">
                <div className={`p-3 rounded-xl border flex items-center justify-between ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/5"}`}>
                  <span>Learning Streak</span>
                  <span className="font-bold text-rose-500">7 Consecutive Days 🔥</span>
                </div>
                <div className={`p-3 rounded-xl border flex items-center justify-between ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/5"}`}>
                  <span>Primary Adaptation</span>
                  <span className="font-bold text-teal-500">ADHD Focus + Lexend Dyslexia</span>
                </div>
                <div className={`p-3 rounded-xl border flex items-center justify-between ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/5"}`}>
                  <span>Documents Analyzed</span>
                  <span className="font-bold text-foreground">14 Documents (34,120 words)</span>
                </div>
              </div>

              <button
                onClick={() => setProfileModalOpen(false)}
                className="w-full bg-[#e11d48] text-white py-2.5 rounded-xl font-semibold text-xs"
              >
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
