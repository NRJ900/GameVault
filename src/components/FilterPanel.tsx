import { motion, AnimatePresence } from "motion/react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";

interface FilterState {
  genres: string[];
  platforms: string[];
  playtimeRange: [number, number];
  sortBy: string;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

const genres = ["Action", "RPG", "Strategy", "Simulation", "Racing", "Adventure", "Shooter"];
const platforms = ["PC", "Steam", "Epic Games", "GOG", "Xbox"];

export function FilterPanel({ isOpen, onClose, filters, onFilterChange, onReset }: FilterPanelProps) {
  const handleGenreToggle = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre];
    onFilterChange({ ...filters, genres: newGenres });
  };

  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter((p) => p !== platform)
      : [...filters.platforms, platform];
    onFilterChange({ ...filters, platforms: newPlatforms });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[var(--gaming-accent)]" />
                <h2>Filters</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Genre Filter */}
              <div>
                <Label className="mb-3 block">Genre</Label>
                <div className="space-y-3">
                  {genres.map((genre) => (
                    <div key={genre} className="flex items-center gap-3">
                      <Checkbox
                        id={genre}
                        checked={filters.genres.includes(genre)}
                        onCheckedChange={() => handleGenreToggle(genre)}
                      />
                      <label
                        htmlFor={genre}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        {genre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Platform Filter */}
              <div>
                <Label className="mb-3 block">Platform</Label>
                <div className="space-y-3">
                  {platforms.map((platform) => (
                    <div key={platform} className="flex items-center gap-3">
                      <Checkbox
                        id={platform}
                        checked={filters.platforms.includes(platform)}
                        onCheckedChange={() => handlePlatformToggle(platform)}
                      />
                      <label
                        htmlFor={platform}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        {platform}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Playtime Filter */}
              <div>
                <Label className="mb-3 block">Playtime (hours)</Label>
                <div className="px-2">
                  <Slider
                    value={filters.playtimeRange}
                    onValueChange={(value) => onFilterChange({ ...filters, playtimeRange: value as [number, number] })}
                    max={200}
                    step={5}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{filters.playtimeRange[0]}h</span>
                    <span>{filters.playtimeRange[1] === 200 ? "200h+" : `${filters.playtimeRange[1]}h`}</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Sort By */}
              <div>
                <Label className="mb-3 block">Sort By</Label>
                <div className="space-y-2">
                  {["Recently Played", "Most Played", "Title (A-Z)", "Title (Z-A)"].map((option) => (
                    <button
                      key={option}
                      onClick={() => onFilterChange({ ...filters, sortBy: option })}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-colors text-sm ${filters.sortBy === option
                          ? "bg-[var(--gaming-accent)] text-white border-[var(--gaming-accent)]"
                          : "border-border hover:bg-muted"
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-border flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={onReset}
              >
                Reset
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0 rounded-xl"
                onClick={onClose}
              >
                Done
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
