import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, ExternalLink, Loader2 } from "lucide-react";
import { fetchFirstWikiDiagram, type WikiDiagram } from "@/lib/wikipedia";

interface WikiDiagramCardProps {
  /** Topics to try, in priority order (keywords, card title, etc.) */
  topics: string[];
  compact?: boolean;
}

/**
 * Auto-fetches an illustrative diagram from Wikipedia for the given topics.
 * Renders nothing (except a small note) when no diagram is available.
 */
const WikiDiagramCard = ({ topics, compact = false }: WikiDiagramCardProps) => {
  const [diagram, setDiagram] = useState<WikiDiagram | null>(null);
  const [loading, setLoading] = useState(true);

  const topicKey = topics.join("|");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchFirstWikiDiagram(topics).then((d) => {
      if (cancelled) return;
      setDiagram(d);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicKey]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground py-3">
        <Loader2 size={12} className="animate-spin" /> Fetching diagram from Wikipedia…
      </div>
    );
  }

  if (!diagram) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
        <ImageIcon size={12} /> No Wikipedia diagram found for this concept.
      </div>
    );
  }

  return (
    <motion.figure
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 rounded-2xl overflow-hidden bg-white/90 border border-white/10"
    >
      <img
        src={diagram.imageUrl}
        alt={`Wikipedia diagram illustrating ${diagram.title}`}
        loading="lazy"
        className={`w-full object-contain bg-white ${compact ? "max-h-40" : "max-h-64"} p-2`}
      />
      <figcaption className="bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground flex items-center justify-between gap-2">
        <span className="truncate">{diagram.title} · Wikipedia</span>
        <a
          href={diagram.pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-primary flex items-center gap-1 shrink-0"
        >
          Source <ExternalLink size={10} />
        </a>
      </figcaption>
    </motion.figure>
  );
};

export default WikiDiagramCard;
