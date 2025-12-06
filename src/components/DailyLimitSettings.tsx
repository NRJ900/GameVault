import { motion, AnimatePresence } from "motion/react";
import { X, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { useState } from "react";

interface DailyLimitSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentLimit: number;
  isEnabled: boolean;
  onSave: (limit: number, enabled: boolean) => void;
}

export function DailyLimitSettings({
  isOpen,
  onClose,
  currentLimit,
  isEnabled,
  onSave,
}: DailyLimitSettingsProps) {
  const [limit, setLimit] = useState(currentLimit);
  const [enabled, setEnabled] = useState(isEnabled);

  const handleSave = () => {
    onSave(limit, enabled);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-2xl bg-card/95 backdrop-blur-xl border border-white/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3>Daily Limit Settings</h3>
                    <p className="text-sm text-muted-foreground">Manage your playtime goals</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Enable/Disable */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/10">
                  <div>
                    <Label>Enable Daily Limit</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get notified when you reach your limit
                    </p>
                  </div>
                  <Switch checked={enabled} onCheckedChange={setEnabled} />
                </div>

                {/* Slider */}
                {enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <Label>Daily Limit (hours)</Label>
                        <span className="text-2xl bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] bg-clip-text text-transparent">
                          {limit}h
                        </span>
                      </div>
                      <Slider
                        value={[limit]}
                        onValueChange={(value) => setLimit(value[0])}
                        min={1}
                        max={16}
                        step={0.5}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1h</span>
                        <span>16h</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)]/10 to-[var(--gaming-cyan)]/10 border border-white/10">
                      <p className="text-sm">
                        <span className="text-[var(--gaming-accent)]">💡 Recommended:</span> Health
                        experts suggest taking regular breaks during gaming sessions. A {limit}-hour
                        daily limit promotes healthy gaming habits.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0 rounded-xl"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
