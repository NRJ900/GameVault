import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const recommendations = [
  {
    id: 1,
    title: "Stellar Odyssey",
    reason: "Based on your love for space games",
    match: 95,
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400",
  },
  {
    id: 2,
    title: "Neon Knights",
    reason: "Fans of cyberpunk will enjoy this",
    match: 88,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
  },
];

export function AIRecommendations() {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3>AI Recommendations</h3>
          <p className="text-sm text-muted-foreground">Games you might enjoy</p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((game) => (
          <motion.div
            key={game.id}
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
                <h4 className="truncate text-sm">{game.title}</h4>
                <Badge
                  variant="outline"
                  className="border-[var(--gaming-green)] text-[var(--gaming-green)] text-xs flex-shrink-0"
                >
                  {game.match}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {game.reason}
              </p>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs px-2 text-[var(--gaming-accent)] hover:text-[var(--gaming-accent)] hover:bg-[var(--gaming-accent)]/10"
              >
                Learn More
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
