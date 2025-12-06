import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Gauge, Thermometer, X } from "lucide-react";
import { Button } from "./ui/button";

interface PerformanceMonitorProps {
  isVisible: boolean;
  onClose: () => void;
  gameName?: string;
}

export function PerformanceMonitor({ isVisible, onClose, gameName }: PerformanceMonitorProps) {
  const [fps, setFps] = useState(0);
  const [cpu, setCpu] = useState(0);
  const [gpu, setGpu] = useState(0);
  const [temp, setTemp] = useState(0);
  const [ram, setRam] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    // Simulate performance metrics
    const interval = setInterval(() => {
      setFps(Math.floor(55 + Math.random() * 65)); // 55-120 FPS
      setCpu(Math.floor(35 + Math.random() * 30)); // 35-65%
      setGpu(Math.floor(60 + Math.random() * 35)); // 60-95%
      setTemp(Math.floor(55 + Math.random() * 20)); // 55-75°C
      setRam(Math.floor(8 + Math.random() * 8)); // 8-16 GB
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const getFpsColor = (fps: number) => {
    if (fps >= 90) return "var(--gaming-green)";
    if (fps >= 60) return "var(--gaming-cyan)";
    return "var(--destructive)";
  };

  const getTempColor = (temp: number) => {
    if (temp >= 70) return "var(--destructive)";
    if (temp >= 60) return "var(--gaming-cyan)";
    return "var(--gaming-green)";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed top-20 right-4 z-50 w-64 bg-card/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[var(--gaming-accent)]" />
            <h3 className="text-sm">Performance</h3>
          </div>
          <Button variant="ghost" size="icon" className="w-6 h-6" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {gameName && (
          <p className="text-xs text-muted-foreground mb-3 truncate">{gameName}</p>
        )}

        <div className="space-y-3">
          {/* FPS */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">FPS</span>
            <motion.span
              key={fps}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-sm font-mono"
              style={{ color: getFpsColor(fps) }}
            >
              {fps}
            </motion.span>
          </div>

          {/* CPU */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">CPU</span>
              </div>
              <span className="text-xs font-mono">{cpu}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${cpu}%` }}
                className="h-full bg-[var(--gaming-cyan)]"
              />
            </div>
          </div>

          {/* GPU */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">GPU</span>
              <span className="text-xs font-mono">{gpu}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${gpu}%` }}
                className="h-full bg-[var(--gaming-purple)]"
              />
            </div>
          </div>

          {/* Temperature */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Temp</span>
            </div>
            <motion.span
              key={temp}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-xs font-mono"
              style={{ color: getTempColor(temp) }}
            >
              {temp}°C
            </motion.span>
          </div>

          {/* RAM */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">RAM</span>
            <span className="text-xs font-mono">{ram.toFixed(1)} GB</span>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs text-muted-foreground">
            {fps >= 90 ? "🎮 Optimal performance" : fps >= 60 ? "✓ Good performance" : "⚠️ Consider lowering settings"}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
