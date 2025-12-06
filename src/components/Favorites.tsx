import { motion } from "motion/react";
import { ArrowLeft, Star, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { GameTile } from "./GameTile";

import { Game } from "../types";

interface FavoritesProps {
  games: Game[];
  onBack: () => void;
  onGameClick: (game: Game) => void;
  onGameContextMenu?: (e: React.MouseEvent, game: Game) => void;
  onTitleClick?: (game: Game) => void;
}

export function Favorites({ games, onBack, onGameClick, onGameContextMenu, onTitleClick }: FavoritesProps) {
  // Mock: For now, show top 3 most played games as favorites
  const favoriteGames = [...games].sort((a, b) => b.hoursPlayed - a.hoursPlayed).slice(0, 3);

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
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1>Favorites</h1>
                <p className="text-muted-foreground">Your handpicked collection</p>
              </div>
            </div>
          </div>
        </div>

        {favoriteGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[500px]">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-6"
            >
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[var(--gaming-purple)]/20 to-[var(--gaming-cyan)]/20 border border-white/10 flex items-center justify-center">
                <Star className="w-16 h-16 text-[var(--gaming-accent)]" />
              </div>
            </motion.div>

            <h2 className="mb-2">No Favorites Yet</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Mark games as favorites to quickly access your most-loved titles.
            </p>

            <Button
              size="lg"
              className="bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0 rounded-xl"
              onClick={onBack}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Explore Games
            </Button>
          </div>
        ) : (
          <>
            {/* Info Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--gaming-purple)]/10 to-[var(--gaming-cyan)]/10 border border-white/10 mb-8">
              <div className="flex items-center gap-4">
                <Sparkles className="w-8 h-8 text-[var(--gaming-accent)]" />
                <div>
                  <h3 className="mb-1">Your Favorite Games</h3>
                  <p className="text-sm text-muted-foreground">
                    {favoriteGames.length} games marked as favorites
                  </p>
                </div>
              </div>
            </div>

            {/* Games Grid */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {favoriteGames.map((game, index) => (
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
                    onTitleClick={onTitleClick ? (e) => {
                      e.stopPropagation();
                      console.log("Favorites received title click");
                      onTitleClick(game);
                    } : undefined}
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
