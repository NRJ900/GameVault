import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Command as CommandIcon } from "lucide-react";
import { Input } from "./ui/input";


import { Game } from "../types";

interface Command {
  id: string;
  label: string;
  action: () => void;
  group: string;
  icon?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  onNavigate: (view: string) => void;
  onGameClick: (game: Game) => void;
  onLaunchLast?: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  games,
  onNavigate,
  onGameClick,
  onLaunchLast,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  const commands: Command[] = [
    { id: "dashboard", label: "Go to Dashboard", action: () => onNavigate("dashboard"), group: "Navigation" },
    { id: "my-stack", label: "Go to My Stack", action: () => onNavigate("my-stack"), group: "Navigation" },
    { id: "most-played", label: "Go to Most Played", action: () => onNavigate("most-played"), group: "Navigation" },
    { id: "favorites", label: "Go to Favorites", action: () => onNavigate("favorites"), group: "Navigation" },
    { id: "continue", label: "Go to Continue Playing", action: () => onNavigate("continue-playing"), group: "Navigation" },
    { id: "settings", label: "Go to Settings", action: () => onNavigate("settings"), group: "Navigation" },
    { id: "about", label: "Go to Profile", action: () => onNavigate("about"), group: "Navigation" },
    { id: "launch-last", label: "Launch Last Played Game", action: () => onLaunchLast?.(), group: "Actions" },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (action: () => void) => {
    action();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-32"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-card/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Search Input */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands or games..."
                className="pl-12 pr-12 h-12 rounded-xl"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
                <CommandIcon className="w-4 h-4" />
                <span>K</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[500px] overflow-y-auto p-2">
            {/* Commands */}
            {filteredCommands.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground px-3 py-2">Commands</p>
                <div className="space-y-1">
                  {filteredCommands.map((cmd) => (
                    <motion.button
                      key={cmd.id}
                      whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                      onClick={() => handleSelect(cmd.action)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
                    >
                      <CommandIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{cmd.label}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{cmd.group}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Games */}
            {filteredGames.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground px-3 py-2">Games</p>
                <div className="space-y-1">
                  {filteredGames.map((game) => (
                    <motion.button
                      key={game.id}
                      whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                      onClick={() => handleSelect(() => onGameClick(game))}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
                    >
                      <div className="w-10 h-12 rounded-md overflow-hidden flex-shrink-0">
                        <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm">{game.title}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {filteredCommands.length === 0 && filteredGames.length === 0 && query && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No results found for "{query}"</p>
              </div>
            )}

            {/* Empty State */}
            {!query && (
              <div className="text-center py-8 text-muted-foreground">
                <CommandIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Type to search commands or games</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
