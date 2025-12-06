import { motion, useScroll, useTransform } from "motion/react";
import { Plus, LayoutGrid, List, Search } from "lucide-react";
import { GameTile } from "./GameTile";
import { GameListItem } from "./GameListItem";
import { SkeletonGameTile } from "./SkeletonGameTile";
import { SkeletonGameListItem } from "./SkeletonGameListItem";
import { EmptyState } from "./EmptyState";
import { AIRecommendations } from "./AIRecommendations";
import { MiniDashboard } from "./MiniDashboard";
import { Button } from "./ui/button";
import { useState } from "react";

import { Game } from "../types";

interface DashboardProps {
  games: Game[];
  onGameClick: (game: Game) => void;
  dailyLimit: number;
  dailyLimitEnabled: boolean;
  todayPlaytime: number;
  onConfigureLimit: () => void;
  onGameContextMenu?: (e: React.MouseEvent, game: Game) => void;
  onAddGameClick?: () => void;
  onScanGameClick?: () => void;
  onGameTitleClick?: (game: Game) => void;
  isLoading?: boolean;
}

export function Dashboard({ games, onGameClick, dailyLimit, dailyLimitEnabled, todayPlaytime, onConfigureLimit, onGameContextMenu, onAddGameClick, onScanGameClick, onGameTitleClick, isLoading }: DashboardProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  if (!isLoading && games.length === 0) {
    return (
      <EmptyState
        onAddGameClick={onAddGameClick}
        onScanGameClick={onScanGameClick}
      />
    );
  }

  // Get pinned games
  const pinnedGames = games.filter((game) => game.isPinned);

  // Get recently played games (last 4)
  const recentlyPlayed = [...games]
    .sort((a, b) => {
      // Primary sort: Timestamp (if available)
      if (a.lastPlayedTimestamp && b.lastPlayedTimestamp) {
        return b.lastPlayedTimestamp - a.lastPlayedTimestamp;
      }
      if (a.lastPlayedTimestamp) return -1;
      if (b.lastPlayedTimestamp) return 1;

      const timeMap: Record<string, number> = {
        "Just now": -1,
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
    <div className="size-full overflow-y-auto relative">
      {/* Parallax Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          style={{ y: y1, opacity: 0.1 }}
          className="absolute top-20 left-20 w-96 h-96 bg-[var(--gaming-purple)] rounded-full blur-[100px]"
        />
        <motion.div
          style={{ y: y2, opacity: 0.1 }}
          className="absolute bottom-40 right-20 w-[500px] h-[500px] bg-[var(--gaming-cyan)] rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-[1800px] mx-auto p-8 relative z-10">
        {/* Top Widgets Row */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2">
            <MiniDashboard
              dailyLimit={dailyLimit}
              dailyLimitEnabled={dailyLimitEnabled}
              todayPlaytime={todayPlaytime}
              onConfigureLimit={onConfigureLimit}
            />
          </div>
          <div>
            <AIRecommendations />
          </div>
        </div>

        {/* Pinned Games Section */}
        {(isLoading || pinnedGames.length > 0) && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2>Pinned Games</h2>
                <p className="text-muted-foreground">Your quick access favorites</p>
              </div>
            </div>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonGameTile key={i} />
                ))
                : pinnedGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <GameTile
                      game={game}
                      onClick={() => onGameClick(game)}
                      onContextMenu={onGameContextMenu ? (e) => onGameContextMenu(e, game) : undefined}
                      onTitleClick={onGameTitleClick ? (e) => {
                        e.stopPropagation();
                        console.log("Dashboard received title click (Pinned)");
                        onGameTitleClick(game);
                      } : undefined}
                    />
                  </motion.div>
                ))}
            </motion.div>
          </div>
        )}

        {/* Recently Played Section */}
        {(isLoading || recentlyPlayed.length > 0) && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2>Recently Played</h2>
                <p className="text-muted-foreground">Jump back into your recent games</p>
              </div>
            </div>
            <motion.div
              className="grid grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonGameTile key={i} />
                ))
                : recentlyPlayed.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <GameTile
                      game={game}
                      onClick={() => onGameClick(game)}
                      onContextMenu={onGameContextMenu ? (e) => onGameContextMenu(e, game) : undefined}
                      onTitleClick={onGameTitleClick ? (e) => {
                        e.stopPropagation();
                        console.log("Dashboard received title click (Recent)");
                        onGameTitleClick(game);
                      } : undefined}
                    />
                  </motion.div>
                ))}
            </motion.div>
          </div>
        )}

        {/* My Games Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2>My Games</h2>
            <p className="text-muted-foreground">
              {games.length} games in your library
            </p>
          </div>
          <div className="flex items-center gap-4">
            {onScanGameClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={onScanGameClick}
                className="gap-2"
                style={{ WebkitAppRegion: "no-drag" } as any}
              >
                <Search className="w-4 h-4" />
                Scan Library
              </Button>
            )}
            <div className="flex items-center gap-2 bg-card/50 p-1 rounded-lg border border-border">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Games Grid/List */}
        <motion.div
          className={viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-24"
            : "flex flex-col gap-3 pb-24"
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
              viewMode === "grid" ? <SkeletonGameTile key={i} /> : <SkeletonGameListItem key={i} />
            ))
            : games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                {viewMode === "grid" ? (
                  <GameTile
                    game={game}
                    onClick={() => onGameClick(game)}
                    onContextMenu={onGameContextMenu ? (e) => onGameContextMenu(e, game) : undefined}
                    onTitleClick={onGameTitleClick ? (e) => {
                      e.stopPropagation();
                      console.log("Dashboard received title click");
                      onGameTitleClick(game);
                    } : undefined}
                  />
                ) : (
                  <GameListItem
                    game={game}
                    onClick={() => onGameClick(game)}
                    onContextMenu={onGameContextMenu ? (e) => onGameContextMenu(e, game) : undefined}
                    onTitleClick={onGameTitleClick ? (e) => {
                      e.stopPropagation();
                      console.log("Dashboard received title click (List)");
                      onGameTitleClick(game);
                    } : undefined}
                  />
                )}
              </motion.div>
            ))}
        </motion.div>
      </div>

      {/* Floating Add Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="lg"
          onClick={onAddGameClick}
          className="rounded-full w-16 h-16 bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0 shadow-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]"
          style={{ WebkitAppRegion: "no-drag" } as any}
        >
          <Plus className="w-8 h-8" />
        </Button>
      </motion.div>
    </div>
  );
}
