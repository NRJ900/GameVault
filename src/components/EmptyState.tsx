import { motion } from "motion/react";
import { Gamepad2, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  onAddGameClick?: () => void;
  onScanGameClick?: () => void;
}

export function EmptyState({ onAddGameClick, onScanGameClick }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[500px] p-8"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mb-6"
      >
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[var(--gaming-purple)]/20 to-[var(--gaming-cyan)]/20 border border-white/10 flex items-center justify-center">
          <Gamepad2 className="w-16 h-16 text-[var(--gaming-accent)]" />
        </div>
      </motion.div>

      <h2 className="mb-2">No Games Found</h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Your library is empty. Start by adding games or scanning your computer for installed games.
      </p>

      <div className="flex gap-3">
        <Button
          size="lg"
          className="bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0 rounded-xl"
          onClick={onAddGameClick}
          style={{ WebkitAppRegion: "no-drag" } as any}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Game Manually
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white/20 rounded-xl"
          onClick={onScanGameClick}
          style={{ WebkitAppRegion: "no-drag" } as any}
        >
          Scan for Games
        </Button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: `radial-gradient(circle, ${i === 0
                  ? "var(--gaming-purple)"
                  : i === 1
                    ? "var(--gaming-cyan)"
                    : "var(--gaming-green)"
                }20, transparent)`,
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
