import { motion } from "motion/react";
import { Clock, Trophy, Calendar } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Game } from "../types";

interface GameListItemProps {
    game: Game;
    onClick: () => void;
    onContextMenu?: (e: React.MouseEvent) => void;
    onTitleClick?: (e: React.MouseEvent) => void;
}

export function GameListItem({ game, onClick, onContextMenu, onTitleClick }: GameListItemProps) {
    const achievementProgress = ((game.achievements || 0) / (game.totalAchievements || 1)) * 100;

    return (
        <motion.div
            whileHover={{ scale: 1.01, backgroundColor: "var(--accent)" }}
            whileTap={{ scale: 0.99 }}
            onClick={onClick}
            onContextMenu={(e) => {
                if (onContextMenu) {
                    e.preventDefault();
                    onContextMenu(e);
                }
            }}
            className="group flex items-center gap-4 p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border cursor-pointer transition-colors"
        >
            {/* Cover Image */}
            <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
                <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                    <h3
                        className="font-semibold text-lg truncate group-hover:text-primary transition-colors hover:underline cursor-pointer w-fit"
                        onClick={(e) => {
                            if (onTitleClick) {
                                e.stopPropagation();
                                onTitleClick(e);
                            }
                        }}
                    >
                        {game.title}
                    </h3>
                    <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                            {game.genre}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {game.platform}
                        </Badge>
                    </div>
                </div>

                {/* Stats */}
                <div className="col-span-3 flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                        {game.hoursPlayed < 2
                            ? `${Math.round(game.hoursPlayed * 60)} mins played`
                            : `${game.hoursPlayed.toFixed(1)}h played`}
                    </span>
                </div>

                <div className="col-span-3 flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{game.lastPlayed}</span>
                </div>

                {/* Achievements */}
                <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-1.5">
                        <Trophy className="w-3 h-3 text-[var(--gaming-accent)]" />
                        <span className="text-xs text-muted-foreground">
                            {Math.round(achievementProgress)}%
                        </span>
                    </div>
                    <Progress value={achievementProgress} className="h-1.5" />
                </div>
            </div>
        </motion.div>
    );
}
