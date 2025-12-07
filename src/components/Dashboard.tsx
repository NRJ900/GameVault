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
  mostActiveGame?: string;
}

import { SortControl, SortOption, SortDirection } from "./SortControl";

export function Dashboard({ games, onGameClick, dailyLimit, dailyLimitEnabled, todayPlaytime, onConfigureLimit, onGameContextMenu, onAddGameClick, onScanGameClick, onGameTitleClick, isLoading, mostActiveGame }: DashboardProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

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

  // Sort games
  const sortedGames = [...games].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.title.localeCompare(b.title);
        break;
      case "playtime":
        comparison = (a.hoursPlayed || 0) - (b.hoursPlayed || 0);
        break;
      case "lastPlayed":
        // Handle "Never" or missing timestamps
        const timeA = a.lastPlayedTimestamp || (a.lastPlayed === "Never" ? 0 : 1);
        const timeB = b.lastPlayedTimestamp || (b.lastPlayed === "Never" ? 0 : 1);
        comparison = timeA - timeB;
        break;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });


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
          <div className="col-span-2 h-full">
            <MiniDashboard
              dailyLimit={dailyLimit}
              dailyLimitEnabled={dailyLimitEnabled}
              todayPlaytime={todayPlaytime}
              mostActiveGame={mostActiveGame}
              onConfigureLimit={onConfigureLimit}
            />
          </div>
          <div className="h-full">
            <AIRecommendations games={games} />
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


        {/* My Games Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">My Games</h2>
            <p className="text-muted-foreground text-sm">{games.length} games in your library</p>
          </div>
          <div className="flex items-center gap-3">
            <SortControl
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortChange={setSortBy}
              onDirectionChange={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
            />
            <Button
              variant="outline"
              onClick={onScanGameClick}
              className="bg-card/50 border-white/10"
            >
              <Search className="w-4 h-4 mr-2" />
              Scan Library
            </Button>
            <div className="flex bg-card/50 rounded-lg p-1 border border-white/10">
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
            : viewMode === "grid" ? (
              <>
                {sortedGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GameTile
                      game={game}
                      onClick={() => onGameClick(game)}
                      onContextMenu={onGameContextMenu ? (e) => onGameContextMenu(e, game) : undefined}
                      onTitleClick={onGameTitleClick ? (e) => {
                        e.stopPropagation();
                        onGameTitleClick(game);
                      } : undefined}
                    />
                  </motion.div>
                ))}
              </>
            ) : (
              <>
                {sortedGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GameListItem
                      game={game}
                      onClick={() => onGameClick(game)}
                      onContextMenu={onGameContextMenu ? (e) => onGameContextMenu(e, game) : undefined}
                      onTitleClick={onGameTitleClick ? (e) => {
                        e.stopPropagation();
                        onGameTitleClick(game);
                      } : undefined}
                    />
                  </motion.div>
                ))}
              </>
            )}
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
