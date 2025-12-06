import { motion, AnimatePresence } from "motion/react";
import { X, Clock, Coffee, Zap, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

interface PlaytimeLimitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hoursPlayed: number;
}

const messages = [
  {
    title: "Hold up buddy, you've been playing for too long!",
    subtitle: "Time to take a break and stretch those legs 🚶",
    icon: Coffee,
  },
  {
    title: "Whoa there, gaming champion!",
    subtitle: "Even legends need rest. How about a quick break? ☕",
    icon: Zap,
  },
  {
    title: "Hey gamer, you've reached your daily limit!",
    subtitle: "Your eyes (and character) could use some rest 👀",
    icon: Moon,
  },
  {
    title: "Time check! You've hit your playtime goal!",
    subtitle: "Maybe grab a snack and come back refreshed? 🍕",
    icon: Clock,
  },
  {
    title: "Achievement Unlocked: Dedicated Gamer!",
    subtitle: "But seriously, take a breather. Your health > XP 💪",
    icon: Coffee,
  },
];

export function PlaytimeLimitDialog({ isOpen, onClose, hoursPlayed }: PlaytimeLimitDialogProps) {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    // Pick a random message when the dialog opens
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setCurrentMessage(messages[randomIndex]);
    }
  }, [isOpen]);

  const Icon = currentMessage.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-3xl bg-card/95 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Animated Background */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gaming-purple)] rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--gaming-cyan)] rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
              </div>

              {/* Content */}
              <div className="relative p-8 text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--gaming-purple)]/20 to-[var(--gaming-cyan)]/20 border border-white/10 flex items-center justify-center"
                >
                  <Icon className="w-12 h-12 text-[var(--gaming-accent)]" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-3"
                >
                  {currentMessage.title}
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground mb-6"
                >
                  {currentMessage.subtitle}
                </motion.p>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)]/10 to-[var(--gaming-cyan)]/10 border border-white/10 mb-6"
                >
                  <p className="text-sm text-muted-foreground mb-1">Total playtime today</p>
                  <p className="text-3xl bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] bg-clip-text text-transparent">
                    {hoursPlayed.toFixed(1)} hours
                  </p>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-3"
                >
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 rounded-xl border-white/20"
                  >
                    Just 5 more minutes...
                  </Button>
                  <Button
                    onClick={onClose}
                    className="flex-1 bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0 rounded-xl"
                  >
                    You're right, I'll rest
                  </Button>
                </motion.div>

                {/* Fun Tip */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-xs text-muted-foreground mt-4"
                >
                  💡 Pro tip: The 20-20-20 rule - Every 20 minutes, look at something 20 feet away for 20 seconds
                </motion.p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
