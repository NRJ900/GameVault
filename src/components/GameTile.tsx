import { motion } from "motion/react";
import { Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { Game } from "../types";
import { useState, useRef } from "react";

interface GameTileProps {
  game: Game;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onTitleClick?: (e: React.MouseEvent) => void;
}

export function GameTile({ game, onClick, onContextMenu, onTitleClick }: GameTileProps) {
  // Auto-categorization logic
  const getGameTags = () => {
    const tags: { label: string; color: string }[] = [];

    if (game.hoursPlayed > 100) {
      tags.push({ label: "Binge-worthy", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" });
    } else if (game.hoursPlayed < 30 && game.hoursPlayed > 5) {
      tags.push({ label: "Quick Play", color: "bg-green-500/20 text-green-400 border-green-500/30" });
    }

    const timeMap: Record<string, number> = {
      "Today": 0,
      "2 hours ago": 1,
      "Yesterday": 2,
    };

    if (game.lastPlayed && (timeMap[game.lastPlayed] !== undefined && timeMap[game.lastPlayed] <= 2)) {
      tags.push({ label: "Recently Played", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" });
    }

    return tags;
  };

  const tags = getGameTags();
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && game.trailerUrl) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => { }); // Ignore play errors
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onContextMenu={(e) => {
        if (onContextMenu) {
          e.preventDefault();
          onContextMenu(e);
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm border border-white/10 shadow-lg transition-all duration-300"
      style={{
        boxShadow: isHovered ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 4px 24px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={game.coverImage}
          alt={game.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />

        {/* Video Trailer */}
        {game.trailerUrl && (
          <video
            ref={videoRef}
            src={game.trailerUrl}
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Glow Effect on Hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle at center, var(--gaming-glow) 0%, transparent 70%)",
          }}
        />

        {/* Auto-Category Tags */}
        {tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {tags.map((tag, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-0.5 ${tag.color} backdrop-blur-sm`}
                >
                  {tag.label}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <motion.div
          className="relative z-30 p-2 -mx-2 rounded-lg transition-colors hover:bg-white/10 cursor-pointer group/title"
          onClick={(e) => {
            if (onTitleClick) {
              e.preventDefault();
              e.stopPropagation();
              onTitleClick(e);
            }
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg group-hover/title:text-[var(--gaming-cyan)] transition-colors">
            {game.title}
          </h3>
          <div className="h-0.5 w-0 group-hover/title:w-full bg-[var(--gaming-cyan)] transition-all duration-300 mt-1" />
        </motion.div>

        {/* Hours Played */}
        <div className="flex items-center gap-2 text-white/80">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            {game.hoursPlayed < 2
              ? `${Math.round(game.hoursPlayed * 60)} mins played`
              : `${game.hoursPlayed.toFixed(2)}h played`}
          </span>
        </div>

        {/* Progress Ring */}
        <div className="absolute top-4 right-4">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="var(--gaming-accent)"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${(game.hoursPlayed % 100)} 125.6`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xs">{Math.min(game.hoursPlayed, 99).toFixed(1)}h</span>
          </div>
        </div>

        {/* Hover Indicator */}
        <div className="absolute inset-0 border-2 border-[var(--gaming-accent)] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </motion.div>
  );
}
