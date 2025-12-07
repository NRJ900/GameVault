import { Home, Clock, Trophy, Star, Settings, ChevronLeft, ChevronRight, ExternalLink, Layers, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import SteamIcon from "../Public/steam-icon.png";
import EpicIcon from "../Public/Epic-Games.png";
import GogIcon from "../Public/gog-icon.jpg";

import VaultedIcon from "../Public/Vaulted.png";

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
  onRecentlyPlayedClick?: () => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "my-stack", label: "My Stack", icon: Layers },
  { id: "favorites", label: "Favorites", icon: Star },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "continue-playing", label: "Continue Playing", icon: PlayCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

const launchers = [
  {
    id: "steam",
    name: "Steam",
    color: "#1b2838",
    icon: (
      <img src={SteamIcon} alt="Steam" className="w-5 h-5 object-contain" />
    ),
    url: "https://store.steampowered.com",
    protocol: "steam://"
  },
  {
    id: "epic",
    name: "Epic Games",
    color: "#2a2a2a",
    icon: (
      <img src={EpicIcon} alt="Epic Games" className="w-5 h-5 object-contain" />
    ),
    url: "https://store.epicgames.com",
    protocol: "com.epicgames.launcher://"
  },
  {
    id: "gog",
    name: "GOG Galaxy",
    color: "#86328a",
    icon: (
      <img src={GogIcon} alt="GOG Galaxy" className="w-5 h-5 object-contain rounded-sm" />
    ),
    url: "https://www.gog.com",
    protocol: "goggalaxy://"
  },
];

export function SideNavPanel({ isCollapsed, onToggle, activeView, onViewChange, recentGames = [], onGameClick, onGameContextMenu, onMouseEnter, onRecentlyPlayedClick }: SideNavPanelProps) {
  const [installedLaunchers, setInstalledLaunchers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkLaunchers = async () => {
      const status: Record<string, boolean> = {};
      for (const launcher of launchers) {
        const isInstalled = await window.ipcRenderer.checkAppInstalled(launcher.id as any);
        status[launcher.id] = isInstalled;
      }
      setInstalledLaunchers(status);
    };
    checkLaunchers();
  }, []);
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

      {/* Logo / Brand */}
      <div className={`px-4 pb-2 pt-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)] flex items-center justify-center shadow-lg shadow-[var(--gaming-purple)]/20 flex-shrink-0 overflow-hidden">
          <img src={VaultedIcon} alt="Vaulted" className="w-full h-full object-cover" />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] whitespace-nowrap overflow-hidden"
            >
              VAULTED
            </motion.span>
          )}
        </AnimatePresence>
      </div>

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
              <Button
                variant="ghost"
                onClick={onRecentlyPlayedClick}
                className="w-full justify-start px-2 mb-3 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                Recently Played
              </Button>
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
            {launchers.map((launcher) => {
              const isInstalled = installedLaunchers[launcher.id];
              return (
                <motion.button
                  key={launcher.id}
                  onClick={async () => {
                    if (isInstalled) {
                      const success = await window.ipcRenderer.launchExternal(launcher.protocol);
                      if (success) {
                        toast.success(`Opening ${launcher.name}...`);
                      } else {
                        toast.error(`Failed to open ${launcher.name}`);
                      }
                    } else {
                      window.ipcRenderer.launchExternal(launcher.url);
                      toast.info(`Opening ${launcher.name} website`);
                    }
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group hover:bg-sidebar-accent text-sidebar-foreground"
                >
                  <div
                    className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: "transparent" }}
                  >
                    {launcher.icon}
                  </div>

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

                  {!isCollapsed && (
                    <ExternalLink className={`w-3 h-3 transition-opacity ${isInstalled ? "opacity-0 group-hover:opacity-50" : "opacity-50 text-muted-foreground"}`} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>
    </motion.div>
  );
}
