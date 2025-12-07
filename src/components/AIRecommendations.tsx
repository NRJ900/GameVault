import { motion } from "motion/react";
import { Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Game } from "../types";
import { useEffect, useState } from "react";
import { rawgService } from "@/services/rawgService";

interface AIRecommendationsProps {
  games?: Game[];
}

interface Recommendation {
  id: number;
  title: string;
  reason: string;
  match: number;
  image: string;
  storeUrl?: string;
}

export function AIRecommendations({ games = [] }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sourceGenre, setSourceGenre] = useState<string>("");

  const fetchRecommendations = async () => {
    if (games.length === 0) return;

    setIsLoading(true);
    try {
      // Pick a random game from library to base recommendations on
      // Prefer games with high playtime if available
      const playedGames = games.filter(g => g.hoursPlayed > 2);
      const pool = playedGames.length > 0 ? playedGames : games;
      const randomGame = pool[Math.floor(Math.random() * pool.length)];



      let genreSlug = "";
      let genreName = "";

      // 1. Try to get genre from local data
      if (randomGame.genre && randomGame.genre !== "Unknown") {
        genreName = randomGame.genre;
        genreSlug = randomGame.genre.toLowerCase().replace(/\s+/g, "-");
      } else {
        // 2. If not found, fetch from RAWG
        const details = await rawgService.getGameDetailsByName(randomGame.title);
        if (details && details.genres && details.genres.length > 0) {
          genreName = details.genres[0].name;
          genreSlug = details.genres[0].name.toLowerCase().replace(/\s+/g, "-");
        }
      }

      if (!genreSlug) {
        console.warn("No genre found for", randomGame.title);
        setIsLoading(false);
        return;
      }

      setSourceGenre(genreName);

      // 3. Get high rated games in this genre
      const genreGames = await rawgService.getGamesByGenre(genreSlug);

      // Filter out the source game itself
      const candidates = genreGames.filter(g => g.name !== randomGame.title);

      if (candidates.length === 0) {
        setIsLoading(false);
        return;
      }

      // Pick top 2
      const topPicks = candidates.slice(0, 2);

      const mapped: Recommendation[] = await Promise.all(topPicks.map(async (g) => {
        // Fetch store links
        const stores = await rawgService.getGameStores(g.id);
        // Prefer Steam, then Epic, then GOG, then any
        const preferredStore = stores.find(s => s.store_id === 1) ||
          stores.find(s => s.store_id === 11) ||
          stores.find(s => s.store_id === 5) ||
          stores[0];

        return {
          id: g.id,
          title: g.name,
          reason: `Highly rated ${genreName} game`,
          match: Math.floor(Math.random() * 10) + 85, // Mock match percentage
          image: g.background_image,
          storeUrl: preferredStore?.url
        };
      }));

      setRecommendations(mapped);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [games.length]);

  if (games.length === 0) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3>AI Recommendations</h3>
            <p className="text-sm text-muted-foreground">Add games to get suggestions</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-white/10 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3>AI Recommendations</h3>
            <p className="text-sm text-muted-foreground">
              {sourceGenre ? `Because you play ${sourceGenre} games` : "Games you might enjoy"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={fetchRecommendations} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-3 flex-1">
        {recommendations.map((game) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ x: 4 }}
            className="flex gap-3 p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <ImageWithFallback
              src={game.image}
              alt={game.title}
              className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="truncate text-sm font-medium">{game.title}</h4>
                <Badge
                  variant="outline"
                  className="border-[var(--gaming-green)] text-[var(--gaming-green)] text-xs flex-shrink-0"
                >
                  {game.match}% Match
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {game.reason}
              </p>
              {game.storeUrl && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs px-2 text-[var(--gaming-accent)] hover:text-[var(--gaming-accent)] hover:bg-[var(--gaming-accent)]/10 p-0"
                  onClick={() => window.ipcRenderer.invoke('launch-external', game.storeUrl)}
                >
                  View in Store
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
        {recommendations.length === 0 && !isLoading && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No recommendations found. Try adding more games!
          </div>
        )}
      </div>
    </Card>
  );
}
