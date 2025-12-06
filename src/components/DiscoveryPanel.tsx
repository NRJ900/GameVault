import { motion } from "motion/react";
import { Sparkles, TrendingUp, Zap, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Game } from "../types";

interface DiscoveryPanelProps {
  currentGame?: Game;
  allGames: Game[];
  onGameClick: (game: Game) => void;
}

export function DiscoveryPanel({ currentGame, allGames, onGameClick }: DiscoveryPanelProps) {
  // Similar games logic
  const getSimilarGames = () => {
    if (!currentGame) return [];
    return allGames
      .filter(
        (game) =>
          game.id !== currentGame.id &&
          (game.genre === currentGame.genre || game.genre.includes(currentGame.genre.split(" ")[0]))
      )
      .slice(0, 3);
  };

  // What to play next based on play patterns
  const getNextToPlay = () => {
    // Games not played recently, sorted by hours played (favorites)
    const timeMap: Record<string, number> = {
      "Today": 0,
      "2 hours ago": 1,
      "Yesterday": 2,
      "3 days ago": 3,
      "4 days ago": 4,
      "5 days ago": 5,
      "1 week ago": 6,
    };

    return [...allGames]
      .filter((game) => {
        const timeValue = timeMap[game.lastPlayed as string] ?? 10;
        return timeValue >= 3;
      })
      .sort((a, b) => b.hoursPlayed - a.hoursPlayed)
      .slice(0, 1)[0];
  };

  // Quick play suggestions
  const getQuickPlayGames = () => {
    return allGames.filter((game) => game.hoursPlayed < 50 && game.hoursPlayed > 10).slice(0, 2);
  };

  const similarGames = getSimilarGames();
  const nextToPlay = getNextToPlay();
  const quickPlayGames = getQuickPlayGames();

  return (
    <div className="space-y-6">
      {/* Similar Games */}
      {currentGame && similarGames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[var(--gaming-accent)]" />
            <h3>Similar to {currentGame.title}</h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {similarGames.map((game) => (
              <motion.div
                key={game.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onGameClick(game)}
                className="cursor-pointer"
              >
                <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm truncate">{game.title}</p>
                    <p className="text-xs text-muted-foreground">{game.genre}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* What to Play Next */}
      {nextToPlay && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[var(--gaming-cyan)]" />
            <h3>What to Play Next</h3>
            <Badge variant="outline" className="ml-auto">AI Suggestion</Badge>
          </div>

          <Card
            className="p-4 bg-gradient-to-r from-[var(--gaming-purple)]/10 to-[var(--gaming-cyan)]/10 border-white/20 cursor-pointer hover:border-white/40 transition-all"
            onClick={() => onGameClick(nextToPlay)}
          >
            <div className="flex items-start gap-4">
              <div className="w-24 h-32 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={nextToPlay.coverImage}
                  alt={nextToPlay.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="mb-2">{nextToPlay.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {nextToPlay.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{nextToPlay.genre}</span>
                  <span>{nextToPlay.hoursPlayed}h played</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Quick Play */}
      {quickPlayGames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-[var(--gaming-green)]" />
            <h3>Quick Play</h3>
            <Badge variant="outline" className="ml-auto text-xs">30-60 min sessions</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {quickPlayGames.map((game) => (
              <motion.div
                key={game.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onGameClick(game)}
                className="cursor-pointer"
              >
                <Card className="p-3 bg-card/50 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={game.coverImage}
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate mb-1">{game.title}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{game.hoursPlayed}h</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
