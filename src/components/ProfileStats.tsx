import { motion } from "motion/react";
import { ArrowLeft, TrendingUp, Clock, Trophy, Download, HardDrive, CheckCircle, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { useRef } from "react";

interface ProfileStatsProps {
  onBack: () => void;
  profilePicture?: string;
  onProfilePictureChange?: (picture: string) => void;
}

const topGames = [
  { title: "Cyberpunk 2077", hours: 142, percentage: 100 },
  { title: "Starfield", hours: 98, percentage: 69 },
  { title: "Racing Legends", hours: 87, percentage: 61 },
];

const weeklyStats = [
  { day: "Mon", hours: 3.5 },
  { day: "Tue", hours: 2.1 },
  { day: "Wed", hours: 4.2 },
  { day: "Thu", hours: 1.8 },
  { day: "Fri", hours: 5.5 },
  { day: "Sat", hours: 7.2 },
  { day: "Sun", hours: 6.3 },
];

export function ProfileStats({ onBack, profilePicture, onProfilePictureChange }: ProfileStatsProps) {
  const totalWeeklyHours = weeklyStats.reduce((sum, stat) => sum + stat.hours, 0);
  const maxHours = Math.max(...weeklyStats.map((s) => s.hours));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onProfilePictureChange?.(imageUrl);
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="size-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="min-h-full p-8"
      >
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
            <h1>Profile & Statistics</h1>
            <p className="text-muted-foreground">Track your gaming activity and achievements</p>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-[var(--gaming-purple)]/10 to-[var(--gaming-cyan)]/10 border-white/10">
          <div className="flex items-center gap-6">
            <div className="relative group">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-white/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)] flex items-center justify-center">
                  <span className="text-3xl text-white">GV</span>
                </div>
              )}
              <button
                onClick={handleUploadClick}
                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Upload className="w-6 h-6 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <h2 className="mb-1">GameVault User</h2>
              <p className="text-muted-foreground mb-3">Member since October 2024</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[var(--gaming-green)]">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Google Drive Connected</span>
                </div>
                <Badge className="bg-[var(--gaming-purple)] text-white border-0">
                  Premium
                </Badge>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0 rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Export Summary
            </Button>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[var(--gaming-purple)]/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[var(--gaming-purple)]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl">{totalWeeklyHours.toFixed(1)}h</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[var(--gaming-cyan)]/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[var(--gaming-cyan)]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl">98.4h</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[var(--gaming-green)]/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[var(--gaming-green)]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Games Owned</p>
                <p className="text-2xl">47</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[var(--gaming-purple)]/20 flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-[var(--gaming-purple)]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Storage</p>
                <p className="text-2xl">245 GB</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Activity Chart */}
        <Card className="p-6 mb-6 bg-card/50 backdrop-blur-sm border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3>Weekly Activity</h3>
              <p className="text-sm text-muted-foreground">
                Total: {totalWeeklyHours.toFixed(1)} hours this week
              </p>
            </div>
            <Badge variant="outline" className="border-white/20">
              Last 7 Days
            </Badge>
          </div>

          <div className="flex items-end justify-between gap-4 h-48">
            {weeklyStats.map((stat, index) => {
              const heightPercent = (stat.hours / maxHours) * 100;
              return (
                <div key={stat.day} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-[var(--gaming-purple)] to-[var(--gaming-cyan)] relative group cursor-pointer"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      {stat.hours}h
                    </div>
                  </motion.div>
                  <span className="text-sm text-muted-foreground">{stat.day}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Games */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-white/10">
          <h3 className="mb-4">Most Played Games</h3>
          <div className="space-y-4">
            {topGames.map((game, index) => (
              <div key={game.title} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)] flex items-center justify-center text-sm text-white">
                      {index + 1}
                    </span>
                    <span>{game.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{game.hours} hours</span>
                </div>
                <Progress value={game.percentage} className="h-2 rounded-full" />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
