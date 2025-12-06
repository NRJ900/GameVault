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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[var(--gaming-accent)]/20 backdrop-blur-sm border border-[var(--gaming-accent)]/30"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[var(--gaming-green)]"
          />
          <Clock className="w-4 h-4 text-[var(--gaming-accent)]" />
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Now Playing</span>
          <span className="text-sm">{currentGame || "Game Session"}</span>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <span className="text-sm font-mono text-[var(--gaming-accent)]">{formatTime(seconds)}</span>

          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-destructive hover:text-destructive"
            onClick={onStop}
          >
            <Square className="w-3 h-3" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
