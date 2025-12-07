import { motion } from "motion/react";
import { GameTile } from "./GameTile";
import { SkeletonGameTile } from "./SkeletonGameTile";
import { Game } from "../types";

interface RecentlyPlayedProps {
    games: Game[];
    onGameClick: (game: Game) => void;
    onGameContextMenu?: (e: React.MouseEvent, game: Game) => void;
    onGameTitleClick?: (game: Game) => void;
    isLoading?: boolean;
}

export function RecentlyPlayed({ games, onGameClick, onGameContextMenu, onGameTitleClick, isLoading }: RecentlyPlayedProps) {
    const recentlyPlayed = [...games]
        .sort((a, b) => {
            if (a.lastPlayedTimestamp && b.lastPlayedTimestamp) {
                return b.lastPlayedTimestamp - a.lastPlayedTimestamp;
            }
            if (a.lastPlayedTimestamp) return -1;
            if (b.lastPlayedTimestamp) return 1;
            return 0;
        })
        .slice(0, 6);

    return (
        <div className="p-8 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Recently Played</h1>
                <p className="text-muted-foreground">Jump back into your recent games</p>
            </div>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
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
                                    console.log("RecentlyPlayed received title click");
                                    if (onGameTitleClick) onGameTitleClick(game);
                                } : undefined}
                            />
                        </motion.div>
                    ))}
            </motion.div>

            {!isLoading && recentlyPlayed.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">No recently played games yet.</p>
                </div>
            )}
        </div>
    );
}
