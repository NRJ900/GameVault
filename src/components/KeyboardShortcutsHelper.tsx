
import { motion, AnimatePresence } from "motion/react";
import { Command, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const shortcuts = [
  { keys: ["Ctrl/⌘", "1"], description: "Go to Dashboard" },
  { keys: ["Ctrl/⌘", "2"], description: "Go to My Stack" },
  { keys: ["Ctrl/⌘", "3"], description: "Go to Achievements" },
  { keys: ["Ctrl/⌘", "4"], description: "Go to Favorites" },
  { keys: ["Ctrl/⌘", "5"], description: "Go to Continue Playing" },
  { keys: ["Ctrl/⌘", "F"], description: "Focus Search" },
  { keys: ["Ctrl/⌘", "L"], description: "Launch Last Played" },
  { keys: ["Ctrl/⌘", "K"], description: "Command Palette" },
  { keys: ["Esc"], description: "Close / Go Back" },
  { keys: ["Right Click"], description: "Game Quick Actions" },
];

interface KeyboardShortcutsHelperProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsHelper({ isOpen, onClose }: KeyboardShortcutsHelperProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-card/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)] flex items-center justify-center">
                <Command className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2>Keyboard Shortcuts</h2>
                <p className="text-sm text-muted-foreground">Quick navigation and actions</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Shortcuts List */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm">{shortcut.description}</span>
                  <div className="flex items-center gap-2">
                    {shortcut.keys.map((key, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="px-3 py-1 bg-background/50 border-white/20 font-mono"
                        >
                          {key}
                        </Badge>
                        {i < shortcut.keys.length - 1 && (
                          <span className="text-muted-foreground text-xs">+</span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-white/5 text-center text-sm text-muted-foreground">
            Press <kbd className="px-2 py-1 bg-white/10 rounded">?</kbd> anytime to show this menu
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Floating shortcut hint button
export function ShortcutsButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-24 right-8 z-40 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg hover:bg-white/20 transition-colors"
      title="Keyboard Shortcuts (Press ?)"
    >
      <Command className="w-5 h-5" />
    </motion.button>
  );
}
