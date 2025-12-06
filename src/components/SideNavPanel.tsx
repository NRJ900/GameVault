import { Home, Clock, Trophy, Star, Settings, ChevronLeft, ChevronRight, ExternalLink, Layers, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { toast } from "sonner";

import { Game } from "../types";

interface SideNavPanelProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
  recentGames?: Game[];
  onGameClick?: (game: Game) => void;
  onGameContextMenu?: (e: React.MouseEvent, game: Game) => void;
  onMouseEnter?: () => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "my-stack", label: "My Stack", icon: Layers },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "favorites", label: "Favorites", icon: Star },
  { id: "continue-playing", label: "Continue Playing", icon: PlayCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

const launchers = [
  {
    id: "steam",
    name: "Steam",
    color: "#1b2838",
    detected: true,
  },
  {
    id: "epic",
    name: "Epic Games",
    color: "#2a2a2a",
    detected: true,
  },
  {
    id: "gog",
    name: "GOG Galaxy",
    color: "#86328a",
    detected: false,
  },
];

export function SideNavPanel({ isCollapsed, onToggle, activeView, onViewChange, recentGames = [], onGameClick, onGameContextMenu, onMouseEnter }: SideNavPanelProps) {
  return (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative h-full bg-sidebar/50 backdrop-blur-xl border-r border-white/10 flex flex-col"
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        onMouseEnter={onMouseEnter}
        className="absolute -right-4 top-6 z-10 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm border border-white/10 hover:bg-[var(--gaming-accent)] hover:text-white transition-colors shadow-lg"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>

      {/* Navigation Items */}
      <nav className="flex-1 pt-8 px-3 flex flex-col overflow-y-auto">
        <div className="space-y-2 flex-shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                onMouseEnter={onMouseEnter}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${isActive
                  ? "bg-[var(--gaming-accent)] text-white shadow-lg"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : ""}`} />

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Glow effect on hover for active item */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: "radial-gradient(circle at center, var(--gaming-glow), transparent)",
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Recently Played Games Subsection */}
        <AnimatePresence>
          {!isCollapsed && recentGames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/10 flex-shrink-0"
            >
              <p className="text-xs text-muted-foreground mb-3 px-1">Recently Played</p>
              <div className="space-y-2">
                {recentGames.slice(0, 2).map((game) => (
                  <motion.button
                    key={game.id}
                    onClick={() => onGameClick?.(game)}
                    onContextMenu={(e) => onGameContextMenu?.(e, game)}
                    whileHover={{ x: 4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-all hover:bg-sidebar-accent group"
                  >
                    {/* Game Thumbnail */}
                    <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <img
                        src={game.coverImage}
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <PlayCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Game Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm truncate group-hover:text-[var(--gaming-accent)] transition-colors">
                        {game.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground truncate">{game.lastPlayed}</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Launchers Section */}
        <div className="mt-auto pt-4 border-t border-white/10 flex-shrink-0">
          {!isCollapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground mb-3 px-4"
            >
              Launchers
            </motion.p>
          )}
          <div className="space-y-2">
            {launchers.map((launcher) => (
              <motion.button
                key={launcher.id}
                onClick={async () => {
                  let protocol = "";
                  if (launcher.id === "steam") protocol = "steam://";
                  else if (launcher.id === "epic") protocol = "com.epicgames.launcher://";
                  else if (launcher.id === "gog") protocol = "goggalaxy://";

                  if (protocol) {
                    const success = await window.ipcRenderer.launchExternal(protocol);
                    if (success) {
                      toast.success(`Opening ${launcher.name}...`);
                    } else {
                      toast.error(`Failed to open ${launcher.name}`);
                    }
                  } else {
                    toast.error(`${launcher.name} protocol not supported yet`);
                  }
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                disabled={!launcher.detected}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${launcher.detected
                  ? "hover:bg-sidebar-accent text-sidebar-foreground"
                  : "opacity-40 cursor-not-allowed text-sidebar-foreground"
                  }`}
              >
                <div
                  className="w-5 h-5 rounded-md flex-shrink-0"
                  style={{ backgroundColor: launcher.color }}
                />

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm whitespace-nowrap overflow-hidden flex-1 text-left"
                    >
                      {launcher.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {launcher.detected && !isCollapsed && (
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>
    </motion.div>
  );
}
