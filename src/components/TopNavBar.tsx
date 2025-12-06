import { Search, Bell, Star, User, Sun, Moon, ShoppingBag } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { useTheme } from "./theme-provider";
import { Notification } from "./Messages";
import { WindowControls } from "./WindowControls";

interface TopNavBarProps {
  onSettingsClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  points?: number;
  onStoreClick?: () => void;
  notifications?: Notification[];
  onMessagesClick?: () => void;
}

export function TopNavBar({
  onSettingsClick,
  searchQuery,
  onSearchChange,
  points = 0,
  onStoreClick,
  notifications = [],
  onMessagesClick,
}: TopNavBarProps) {
  const { theme, setTheme } = useTheme();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-white/10" style={{ WebkitAppRegion: "drag" } as any}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)] flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)]">
            GameVault
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8 relative group" style={{ WebkitAppRegion: "no-drag" } as any}>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-[var(--gaming-accent)] transition-colors" />
          </div>
          <Input
            placeholder="Search your library..."
            className="pl-10 bg-secondary/50 border-white/5 focus:bg-background focus:border-[var(--gaming-accent)] transition-all duration-300"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3" style={{ WebkitAppRegion: "no-drag" } as any}>

          {/* Points Display */}
          <div className="hidden md:flex items-center gap-1 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-yellow-500">{points}</span>
          </div>

          {/* Store Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onStoreClick}
            className="rounded-xl hover:bg-white/10 text-[var(--gaming-accent)]"
            title="Open Store"
          >
            <ShoppingBag className="w-5 h-5" />
          </Button>

          <div className="w-px h-8 bg-border mx-2" />

          {/* Messages Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMessagesClick}
            className="rounded-xl hover:bg-white/10 relative"
            title="Messages"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl hover:bg-white/10"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="w-10 h-10 cursor-pointer ring-2 ring-transparent hover:ring-[var(--gaming-accent)] transition-all">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=GameVault" />
                  <AvatarFallback>GV</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-white/10">
              <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile & Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onMessagesClick} className="cursor-pointer">
                <Bell className="w-4 h-4 mr-2" />
                Messages
                {unreadCount > 0 && (
                  <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Window Controls */}
          <WindowControls />
        </div>
      </div>
    </div>
  );
}
