import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Square } from "lucide-react";
import { Button } from "./ui/button";

interface LivePlaytimeTrackerProps {
  isPlaying: boolean;
  currentGame?: string;
  onStop?: () => void;
}

export function LivePlaytimeTracker({ isPlaying, currentGame, onStop }: LivePlaytimeTrackerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      setSeconds(0);
    }
  }, [isPlaying]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isPlaying) return null;

  return (
    <AnimatePresence>
      <motion.div
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#0f0f13]/90 backdrop-blur-xl border border-white/10 shadow-2xl cursor-move w-48 group hover:border-[var(--gaming-accent)]/50 transition-colors"
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[var(--gaming-green)] shadow-[0_0_8px_var(--gaming-green)]"
          />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gaming-green)]">Now Playing</span>
        </div>

        {/* Game Info */}
        <div className="text-center w-full">
          <h3 className="text-sm font-bold text-white leading-tight mb-1 line-clamp-2">
            {currentGame || "Unknown Game"}
          </h3>
          <div className="flex items-center justify-center gap-2 text-[var(--gaming-accent)] bg-[var(--gaming-accent)]/10 py-1 px-2 rounded-md border border-[var(--gaming-accent)]/20">
            <Clock className="w-3 h-3" />
            <span className="text-sm font-mono font-bold tabular-nums tracking-wider">
              {formatTime(seconds)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2"
          onClick={(e) => {
            e.stopPropagation(); // Prevent drag start
            onStop?.();
          }}
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag on button click
        >
          <Square className="w-3 h-3 fill-current" />
          Stop Session
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
