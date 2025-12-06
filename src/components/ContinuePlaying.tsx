import { motion } from "motion/react";
import { ArrowLeft, PlayCircle, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

import { Game } from "../types";

interface ContinuePlayingProps {
  games: Game[];
  onBack: () => void;
  onGameClick: (game: Game) => void;
  onGameContextMenu?: (e: React.MouseEvent, game: Game) => void;
}

export function ContinuePlaying({ games, onBack, onGameClick, onGameContextMenu }: ContinuePlayingProps) {
  // Get the 4 most recently played games
  const recentGames = [...games]
    .sort((a, b) => {
      const timeMap: Record<string, number> = {
        "Today": 0,
        "2 hours ago": 1,
        "Yesterday": 2,
        "3 days ago": 3,
        "4 days ago": 4,
        "5 days ago": 5,
        "1 week ago": 6,
      };
      return (timeMap[a.lastPlayed] || 999) - (timeMap[b.lastPlayed] || 999);
    })
    .slice(0, 4);

  return (
    <div className="size-full overflow-y-auto">
      <div className="max-w-[1800px] mx-auto p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)] flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1>Continue Playing</h1>
                <p className="text-muted-foreground">Pick up where you left off</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Played Games */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card
                onClick={() => onGameClick(game)}
                onContextMenu={onGameContextMenu ? (e) => onGameContextMenu(e, game) : undefined}
                className="group relative overflow-hidden cursor-pointer bg-card/50 backdrop-blur-sm border-white/10 hover:border-[var(--gaming-accent)] transition-all duration-300"
              >
                <div className="flex gap-4 p-4">
                  {/* Game Cover */}
                  <div className="relative w-32 h-44 flex-shrink-0 rounded-xl overflow-hidden">
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <PlayCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="mb-2 group-hover:text-[var(--gaming-accent)] transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {game.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{game.hoursPlayed}h played</span>
                        </div>
                        <div className="flex items-center gap-1 text-[var(--gaming-accent)]">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{game.lastPlayed}</span>
                        </div>
                      </div>

                      {/* Progress */}
                      {game.achievements && game.totalAchievements && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>
                              {game.achievements} / {game.totalAchievements} achievements
                            </span>
                          </div>
                          <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] transition-all"
                              style={{
                                width: `${(game.achievements / game.totalAchievements) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Platform Badge */}
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">
                          {game.genre}
                        </div>
                        <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">
                          {game.platform}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "radial-gradient(circle at center, var(--gaming-glow), transparent 70%)",
                    }}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <Card className="p-6 bg-gradient-to-br from-[var(--gaming-purple)]/10 to-transparent border-white/10">
            <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
            <p className="text-3xl">
              {games.reduce((sum, game) => sum + Math.floor(game.hoursPlayed / 2.4), 0)}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[var(--gaming-cyan)]/10 to-transparent border-white/10">
            <p className="text-sm text-muted-foreground mb-1">Total Hours</p>
            <p className="text-3xl">
              {games.reduce((sum, game) => sum + game.hoursPlayed, 0)}h
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[var(--gaming-green)]/10 to-transparent border-white/10">
            <p className="text-sm text-muted-foreground mb-1">Active Games</p>
            <p className="text-3xl">{recentGames.length}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
