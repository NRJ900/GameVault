import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Download, Loader2, CheckCircle } from "lucide-react";

interface LaunchScreenProps {
  onComplete: () => void;
}

type LaunchState = "checking" | "downloading" | "starting" | "complete";

const statusMessages = {
  checking: [
    "Syncing cloud saves...",
    "Connecting to GameVault servers...",
    "Verifying library integrity...",
  ],
  downloading: [
    "Downloading patch v2.4.1...",
    "Updating game metadata...",
    "Installing latest drivers...",
  ],
  starting: [
    "Launching GameVault...",
    "Loading your collection...",
    "Preparing dashboard...",
  ],
};

export function LaunchScreen({ onComplete }: LaunchScreenProps) {
  const [launchState, setLaunchState] = useState<LaunchState>("checking");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(statusMessages.checking[0]);
  useEffect(() => {
    // Phase 1: Check for updates (1-2 seconds)
    const checkTimer = setTimeout(() => {
      // Simulate random chance of update
      const updateAvailable = Math.random() > 0.5;

      if (updateAvailable) {
        setLaunchState("downloading");
        setMessage(statusMessages.downloading[0]);
      } else {
        setLaunchState("starting");
        setMessage(statusMessages.starting[0]);
      }
    }, 1500);

    return () => clearTimeout(checkTimer);
  }, []);

  useEffect(() => {
    // Progress bar animation
    let interval: NodeJS.Timeout;

    if (launchState === "downloading") {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setLaunchState("starting");
              setMessage(statusMessages.starting[0]);
              setProgress(0);
            }, 300);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    } else if (launchState === "starting") {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setLaunchState("complete");
              setTimeout(onComplete, 500);
            }, 300);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [launchState, onComplete]);

  // Update messages periodically
  useEffect(() => {
    const messageInterval = setInterval(() => {
      if (launchState !== "complete") {
        const messages = statusMessages[launchState as keyof typeof statusMessages];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setMessage(randomMessage);
      }
    }, 2000);

    return () => clearInterval(messageInterval);
  }, [launchState]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--gaming-purple)] rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--gaming-cyan)] rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="relative">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(139, 92, 246, 0.5)",
                    "0 0 40px rgba(139, 92, 246, 0.8)",
                    "0 0 20px rgba(139, 92, 246, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)] flex items-center justify-center"
              >
                <svg
                  className="w-20 h-20 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                  />
                </svg>
              </motion.div>

              {/* Orbiting particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0"
                >
                  <div
                    className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)]"
                    style={{
                      top: "50%",
                      left: `${50 + (i + 1) * 15}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* App Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-2"
          >
            <h1 className="text-4xl bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] bg-clip-text text-transparent">
              GameVault
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground mb-12 text-center"
          >
            Your Ultimate Game Library Manager
          </motion.p>

          {/* Status Section */}
          <div className="w-96">
            {/* Status Icon & Message */}
            <motion.div
              key={launchState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              {launchState === "checking" && (
                <Loader2 className="w-5 h-5 text-[var(--gaming-accent)] animate-spin" />
              )}
              {launchState === "downloading" && (
                <Download className="w-5 h-5 text-[var(--gaming-cyan)] animate-pulse" />
              )}
              {launchState === "starting" && (
                <CheckCircle className="w-5 h-5 text-[var(--gaming-green)]" />
              )}
              <motion.span
                key={message}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-foreground"
              >
                {message}
              </motion.span>
            </motion.div>

            {/* Progress Bar */}
            {(launchState === "downloading" || launchState === "starting") && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                className="mb-4"
              >
                <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`h-full ${launchState === "downloading"
                      ? "bg-gradient-to-r from-[var(--gaming-cyan)] to-[var(--gaming-purple)]"
                      : "bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-green)]"
                      }`}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{progress}%</span>
                  {launchState === "downloading" && (
                    <span>{((progress / 100) * 45).toFixed(1)} MB / 45 MB</span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Loading Dots */}
            {launchState === "checking" && (
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 rounded-full bg-[var(--gaming-accent)]"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Version */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-xs text-muted-foreground"
          >
            Version 1.0.0
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
