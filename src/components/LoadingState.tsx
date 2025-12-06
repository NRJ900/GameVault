import { motion } from "motion/react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <div className="relative w-32 h-32">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: "var(--gaming-purple)",
            borderRightColor: "var(--gaming-cyan)",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner Ring */}
        <motion.div
          className="absolute inset-4 rounded-full border-4 border-transparent"
          style={{
            borderBottomColor: "var(--gaming-cyan)",
            borderLeftColor: "var(--gaming-green)",
          }}
          animate={{ rotate: -360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Center Dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)]" />
        </motion.div>
      </div>

      <motion.p
        className="mt-8 text-muted-foreground"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Loading your game library...
      </motion.p>
    </div>
  );
}
