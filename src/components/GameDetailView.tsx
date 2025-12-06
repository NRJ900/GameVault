import { motion, AnimatePresence } from "motion/react";
import { X, Play, Clock, TrendingUp, Settings2, ExternalLink, Calendar, Star, Pin, BookMarked, Puzzle } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Game } from "../types";

interface GameDetailViewProps {
  game: Game | null;
  onClose: () => void;
  onLaunch: () => void;
  onSettings: () => void;
  onToggleFavorite: (gameId: string) => void;
  onTogglePin: (gameId: string) => void;
  onOpenNotes?: () => void;
  onOpenMods?: () => void;
}

const mockNews = [
  {
    id: 1,
    title: "New DLC Pack Released",
    date: "2 days ago",
    source: "Official",
  },
  {
    id: 2,
    title: "Patch 2.4.1 - Bug Fixes and Improvements",
    date: "1 week ago",
    source: "Steam",
  },
  {
    id: 3,
    title: "Community Event: Double XP Weekend",
    date: "2 weeks ago",
    source: "Community",
  },
];

export function GameDetailView({ game, onClose, onLaunch, onSettings, onToggleFavorite, onTogglePin, onOpenNotes, onOpenMods }: GameDetailViewProps) {
  if (!game) return null;

  const achievementProgress = game.achievements && game.totalAchievements
    ? (game.achievements / game.totalAchievements) * 100
    : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-card/95 backdrop-blur-xl border border-white/20 shadow-2xl"
        >
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onTogglePin(game.id)}
              className={`rounded-full backdrop-blur-sm ${game.isPinned
                ? "bg-[var(--gaming-cyan)] hover:bg-[var(--gaming-cyan)]/80 text-white"
                : "bg-black/50 hover:bg-black/70 text-white"
                }`}
            >
              <Pin className={`w-5 h-5 ${game.isPinned ? "fill-white" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite(game.id)}
              className={`rounded-full backdrop-blur-sm ${game.isFavorite
                ? "bg-[var(--gaming-accent)] hover:bg-[var(--gaming-accent)]/80 text-white"
                : "bg-black/50 hover:bg-black/70 text-white"
                }`}
            >
              <Star className={`w-5 h-5 ${game.isFavorite ? "fill-white" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Header with Cover Image */}
          <div className="relative h-80 overflow-hidden">
            {/* Blurred Background */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-60"
              style={{ backgroundImage: `url(${game.coverImage})` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-card" />

            {/* Content */}
            <div className="relative h-full flex items-end p-8">
              <div className="flex gap-6 w-full">
                {/* Cover Image */}
                <motion.img
                  layoutId={`game-cover-${game.id}`}
                  src={game.coverImage}
                  alt={game.title}
                  className="w-48 h-64 object-cover rounded-2xl shadow-2xl border-2 border-white/20"
                />

                {/* Game Info */}
                <div className="flex-1 flex flex-col justify-end">
                  <div className="flex gap-2 mb-3">
                    <Badge className="bg-[var(--gaming-purple)] text-white border-0">
                      {game.genre}
                    </Badge>
                    <Badge variant="outline" className="border-white/20">
                      {game.platform}
                    </Badge>
                  </div>

                  <h2 className="text-white drop-shadow-lg mb-2">{game.title}</h2>

                  <div className="flex items-center gap-6 text-white/80 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{game.hoursPlayed.toFixed(2)} hours played</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Last played {game.lastPlayed}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={onLaunch}
                      size="lg"
                      className="bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] hover:opacity-90 transition-opacity text-white border-0 rounded-xl shadow-lg"
                    >
                      <Play className="w-5 h-5 mr-2 fill-white" />
                      Launch Game
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={onSettings}
                      className="border-white/20 backdrop-blur-sm rounded-xl hover:bg-white/10"
                    >
                      <Settings2 className="w-5 h-5 mr-2" />
                      Game Settings
                    </Button>
                    {onOpenNotes && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          onOpenNotes();
                          onClose();
                        }}
                        className="border-white/20 backdrop-blur-sm rounded-xl hover:bg-white/10"
                      >
                        <BookMarked className="w-5 h-5 mr-2" />
                        Notes
                      </Button>
                    )}
                    {onOpenMods && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          onOpenMods();
                          onClose();
                        }}
                        className="border-white/20 backdrop-blur-sm rounded-xl hover:bg-white/10"
                      >
                        <Puzzle className="w-5 h-5 mr-2" />
                        Mods
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="p-8 overflow-y-auto max-h-96">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-muted/50 border border-white/10 rounded-xl">
                <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
                <TabsTrigger value="stats" className="rounded-lg">Stats & Achievements</TabsTrigger>
                <TabsTrigger value="news" className="rounded-lg">Recent News</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-6">
                <div>
                  <h3 className="mb-2">About This Game</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)]/10 to-transparent border border-white/10">
                    <div className="flex items-center gap-2 text-[var(--gaming-purple)] mb-1">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm">Playtime</span>
                    </div>
                    <p className="text-2xl">{game.hoursPlayed.toFixed(2)}h</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--gaming-cyan)]/10 to-transparent border border-white/10">
                    <div className="flex items-center gap-2 text-[var(--gaming-cyan)] mb-1">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-sm">Progress</span>
                    </div>
                    <p className="text-2xl">{Math.round(achievementProgress)}%</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--gaming-green)]/10 to-transparent border border-white/10">
                    <div className="flex items-center gap-2 text-[var(--gaming-green)] mb-1">
                      <ExternalLink className="w-5 h-5" />
                      <span className="text-sm">Status</span>
                    </div>
                    <p className="text-2xl">Active</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4 mt-6">
                {game.achievements && game.totalAchievements && (
                  <div className="p-6 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)]/5 to-[var(--gaming-cyan)]/5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <h4>Achievement Progress</h4>
                      <span className="text-sm text-muted-foreground">
                        {game.achievements} / {game.totalAchievements}
                      </span>
                    </div>
                    <Progress value={achievementProgress} className="h-3 rounded-full" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {achievementProgress.toFixed(0)}% Complete
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-white/10">
                    <p className="text-sm text-muted-foreground mb-1">Average Session</p>
                    <p className="text-xl">2.4 hours</p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10">
                    <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
                    <p className="text-xl">{Math.floor(game.hoursPlayed / 2.4)}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10">
                    <p className="text-sm text-muted-foreground mb-1">This Week</p>
                    <p className="text-xl">8.5 hours</p>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10">
                    <p className="text-sm text-muted-foreground mb-1">This Month</p>
                    <p className="text-xl">32 hours</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="news" className="space-y-3 mt-6">
                {mockNews.map((news) => (
                  <div
                    key={news.id}
                    className="p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="group-hover:text-[var(--gaming-accent)] transition-colors">
                          {news.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="outline" className="border-white/20 text-xs">
                            {news.source}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{news.date}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[var(--gaming-accent)] transition-colors" />
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
