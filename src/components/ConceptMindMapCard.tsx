import React, { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Lightbulb, HelpCircle, CheckCircle, Sparkles, Volume2 } from "lucide-react";

interface ConceptMindMapProps {
  title: string;
  explanation: string;
  keywords: string[];
  diagramType?: string;
}

export const ConceptMindMapCard: React.FC<ConceptMindMapProps> = ({
  title,
  explanation,
  keywords,
  diagramType = "mindmap",
}) => {
  const [activeTab, setActiveTab] = useState<"mindmap" | "analogy" | "quiz">("mindmap");
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // Generate dynamic mindmap nodes from keywords and title
  const coreNodes = keywords.slice(0, 4);

  // Dynamic everyday analogy based on title and explanation
  const getAnalogy = (concept: string, text: string) => {
    const c = concept.toLowerCase();
    if (c.includes("container") || c.includes("aneka")) {
      return {
        metaphor: "The Shipping Container Port 🚢",
        story: "Think of an Aneka Container like a standardized steel shipping container. Whether you put computers, gaming servers, or big data inside, the port cranes (Runtime Management) can pick it up and run it on any ship (cloud server) without caring about what's inside.",
      };
    }
    if (c.includes("fabric") || c.includes("service")) {
      return {
        metaphor: "The Airport Air Traffic Controller ✈️",
        story: "Fabric Services are like the air traffic control tower at an airport. It doesn't fly the planes itself, but it makes sure no two planes collide, checks tickets (security & authentication), and directs baggage to the right gates (storage & billing).",
      };
    }
    if (c.includes("scaling") || c.includes("elastic")) {
      return {
        metaphor: "The Accordion Highway 🚗",
        story: "Imagine a highway that automatically adds extra lanes the moment traffic gets busy, and shrinks back to two lanes at night when nobody is driving so you don't pay for empty roads.",
      };
    }
    return {
      metaphor: "The Orchestra Conductor 🎼",
      story: `Imagine ${concept} as a skilled conductor leading an orchestra. Different instruments play at different tempos, but the system keeps every section harmonious and prevents cognitive overload.`,
    };
  };

  const analogy = getAnalogy(title, explanation);

  // Dynamic quick-recall quiz
  const quiz = {
    question: `What is the primary function of ${title}?`,
    options: [
      `Coordinates and streamlines ${keywords[0] || "core execution"} across the system`,
      `Deletes idle storage nodes to save hard drive space permanently`,
      `Translates high-level code into physical hardware wiring directly`,
    ],
    correctIndex: 0,
    explanationTip: `Exactly! ${title} focuses on elastic orchestration and managing ${keywords.slice(0, 2).join(" & ")}.`,
  };

  return (
    <div className="mt-3 rounded-2xl bg-slate-900/90 dark:bg-slate-950/80 border border-white/10 p-4 text-xs">
      {/* Sub-tab navigation */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-2.5 mb-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab("mindmap");
          }}
          className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === "mindmap"
              ? "bg-[#e11d48] text-white shadow-sm shadow-rose-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <GitBranch size={13} />
          <span>Interactive Mind Map</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab("analogy");
          }}
          className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === "analogy"
              ? "bg-[#e11d48] text-white shadow-sm shadow-rose-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Lightbulb size={13} />
          <span>Simple Analogy (ELI10)</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab("quiz");
          }}
          className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === "quiz"
              ? "bg-[#e11d48] text-white shadow-sm shadow-rose-500/20"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <HelpCircle size={13} />
          <span>Quick Recall Quiz</span>
        </button>
      </div>

      {/* Tab 1: Interactive SVG Mind Map */}
      {activeTab === "mindmap" && (
        <div className="relative py-2 select-none">
          <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
            <span>Visual Concept Graph:</span>
            <span className="text-[10px] text-teal-400 font-mono">Spatial ADHD Architecture</span>
          </div>

          <svg viewBox="0 0 460 220" className="w-full h-44 drop-shadow-md">
            {/* Connecting Lines */}
            <path d="M 230 110 L 90 50" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
            <path d="M 230 110 L 370 50" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
            <path d="M 230 110 L 90 170" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
            <path d="M 230 110 L 370 170" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />

            {/* Central Node: Main Concept */}
            <g transform="translate(230, 110)">
              <circle r="42" fill="#1e293b" stroke="#e11d48" strokeWidth="3" />
              <text textAnchor="middle" y="-4" fill="#ffffff" fontWeight="bold" fontSize="10">
                {title.length > 18 ? title.substring(0, 16) + "…" : title}
              </text>
              <text textAnchor="middle" y="12" fill="#fb7185" fontSize="8" fontWeight="600">
                Core Concept
              </text>
            </g>

            {/* Sub-node 1 (Top Left) */}
            <g transform="translate(90, 50)">
              <rect x="-45" y="-18" width="90" height="36" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <text textAnchor="middle" y="4" fill="#38bdf8" fontWeight="bold" fontSize="9">
                #{coreNodes[0] || "Architecture"}
              </text>
            </g>

            {/* Sub-node 2 (Top Right) */}
            <g transform="translate(370, 50)">
              <rect x="-45" y="-18" width="90" height="36" rx="10" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
              <text textAnchor="middle" y="4" fill="#f43f5e" fontWeight="bold" fontSize="9">
                #{coreNodes[1] || "Runtime"}
              </text>
            </g>

            {/* Sub-node 3 (Bottom Left) */}
            <g transform="translate(90, 170)">
              <rect x="-45" y="-18" width="90" height="36" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
              <text textAnchor="middle" y="4" fill="#f59e0b" fontWeight="bold" fontSize="9">
                #{coreNodes[2] || "Execution"}
              </text>
            </g>

            {/* Sub-node 4 (Bottom Right) */}
            <g transform="translate(370, 170)">
              <rect x="-45" y="-18" width="90" height="36" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <text textAnchor="middle" y="4" fill="#10b981" fontWeight="bold" fontSize="9">
                #{coreNodes[3] || "Scaling"}
              </text>
            </g>
          </svg>
        </div>
      )}

      {/* Tab 2: Everyday Analogy */}
      {activeTab === "analogy" && (
        <div className="py-2 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Sparkles size={14} />
            <span>{analogy.metaphor}</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-950/60 p-3 rounded-xl border border-white/5">
            {analogy.story}
          </p>
        </div>
      )}

      {/* Tab 3: Quick Recall Quiz */}
      {activeTab === "quiz" && (
        <div className="py-2 space-y-2.5">
          <p className="font-semibold text-slate-200 text-[11px]">{quiz.question}</p>
          <div className="space-y-1.5">
            {quiz.options.map((option, idx) => {
              const isSelected = selectedQuizOption === idx;
              const isCorrect = idx === quiz.correctIndex;

              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQuizOption(idx);
                    setQuizAnswered(true);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all text-[11px] flex items-center justify-between ${
                    quizAnswered && isCorrect
                      ? "bg-teal-500/20 border-teal-500 text-teal-300 font-semibold"
                      : quizAnswered && isSelected && !isCorrect
                      ? "bg-rose-500/20 border-rose-500 text-rose-300"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <span>{option}</span>
                  {quizAnswered && isCorrect && <CheckCircle size={14} className="text-teal-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {quizAnswered && (
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[11px]">
              ✨ {quiz.explanationTip}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConceptMindMapCard;
