import { motion } from "motion/react";
import { ArrowLeft, Trophy, Star, Award, Lock, Unlock, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";

import { UserStats } from "../types";

import { MILESTONES } from "../data/milestones";

interface AchievementsProps {
  userStats: UserStats;
  onBack: () => void;
  onClaim: (id: string, points: number) => void;
  onClaimAll: (achievements: { id: string; points: number }[]) => void;
}

export function Achievements({ userStats, onBack, onClaim, onClaimAll }: AchievementsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Calculate dynamic achievements
  const achievements = MILESTONES.map(m => {
    const status = m.condition(userStats);
    return {
      ...m,
      ...status
    };
  });

  // Filter achievements
  const filteredAchievements = achievements.filter((achievement) => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" ||
      (activeTab === "unlocked" && achievement.unlocked) ||
      (activeTab === "locked" && !achievement.unlocked);

    return matchesSearch && matchesTab;
  });

  // Calculate stats
  const totalAchievements = achievements.length;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const completionPercentage = Math.round((unlockedCount / totalAchievements) * 100);

  // Points calculations
  const claimedPoints = achievements
    .filter(a => userStats.claimedAchievements.includes(a.id))
    .reduce((sum, a) => {
      // Special logic for explorer points
      if (a.id === 'explorer') return sum + (userStats.gamesLaunched.length * 5);
      return sum + a.points;
    }, 0);

  const claimableAchievements = achievements.filter(a => a.unlocked && !userStats.claimedAchievements.includes(a.id));
  const claimablePoints = claimableAchievements.reduce((sum, a) => {
    if (a.id === 'explorer') return sum + (userStats.gamesLaunched.length * 5);
    return sum + a.points;
  }, 0);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-400";
      case "rare": return "text-[var(--gaming-cyan)]";
      case "legendary": return "text-[var(--gaming-purple)]";
      default: return "text-muted-foreground";
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-500/20 border-gray-500/30";
      case "rare": return "bg-[var(--gaming-cyan)]/20 border-[var(--gaming-cyan)]/30";
      case "legendary": return "bg-[var(--gaming-purple)]/20 border-[var(--gaming-purple)]/30";
      default: return "bg-white/5 border-white/10";
    }
  };

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)] flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1>Milestones</h1>
                  <p className="text-muted-foreground">Track your global gaming progress</p>
                </div>
              </div>

              {claimablePoints > 0 && (
                <Button
                  onClick={() => onClaimAll(claimableAchievements.map(a => ({
                    id: a.id,
                    points: a.id === 'explorer' ? userStats.gamesLaunched.length * 5 : a.points
                  })))}
                  className="bg-[var(--gaming-accent)] hover:bg-[var(--gaming-accent)]/90 text-white gap-2"
                >
                  <Star className="w-4 h-4 fill-current" />
                  Claim All ({claimablePoints} pts)
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-[var(--gaming-purple)]/10 to-transparent border-white/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Milestones Unlocked</p>
              <Trophy className="w-5 h-5 text-[var(--gaming-accent)]" />
            </div>
            <p className="text-3xl mb-1">{unlockedCount}</p>
            <p className="text-xs text-muted-foreground">of {totalAchievements} milestones</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[var(--gaming-green)]/10 to-transparent border-white/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Points</p>
              <Star className="w-5 h-5 text-[var(--gaming-green)]" />
            </div>
            <p className="text-3xl mb-1">{claimedPoints}</p>
            <p className="text-xs text-muted-foreground">claimed points</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[var(--gaming-cyan)]/10 to-transparent border-white/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Completion</p>
              <Award className="w-5 h-5 text-[var(--gaming-cyan)]" />
            </div>
            <p className="text-3xl mb-1">{completionPercentage}%</p>
            <Progress value={completionPercentage} className="h-2 mt-2" />
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search milestones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unlocked">Unlocked ({unlockedCount})</TabsTrigger>
            <TabsTrigger value="locked">Locked ({totalAchievements - unlockedCount})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAchievements.map((achievement, index) => {
            const isClaimed = userStats.claimedAchievements.includes(achievement.id);
            const pointsValue = achievement.id === 'explorer' ? userStats.gamesLaunched.length * 5 : achievement.points;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`p-6 border transition-all ${achievement.unlocked
                    ? `${getRarityBg(achievement.rarity)} hover:scale-[1.02]`
                    : "bg-card/30 border-white/5 opacity-60"
                    }`}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 ${achievement.unlocked
                        ? "bg-white/10 backdrop-blur-sm text-white"
                        : "bg-white/5 grayscale text-muted-foreground"
                        }`}
                    >
                      {achievement.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate mb-1">{achievement.title}</h4>
                          <Badge
                            variant="outline"
                            className={`${getRarityColor(achievement.rarity)} capitalize`}
                          >
                            {achievement.rarity}
                          </Badge>
                        </div>

                        {/* Claim Button or Status */}
                        {achievement.unlocked ? (
                          isClaimed ? (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full">
                              <Star className="w-3 h-3 text-[var(--gaming-green)]" />
                              <span>Claimed</span>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-[var(--gaming-green)] hover:bg-[var(--gaming-green)]/90 text-black"
                              onClick={() => onClaim(achievement.id, pointsValue)}
                            >
                              Claim {pointsValue} pts
                            </Button>
                          )
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full">
                            <Star className="w-3 h-3" />
                            <span>{pointsValue} pts</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {achievement.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{Math.min(achievement.current, achievement.target)} / {achievement.target}</span>
                        </div>
                        <Progress
                          value={(Math.min(achievement.current, achievement.target) / achievement.target) * 100}
                          className="h-1.5"
                        />
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        {achievement.unlocked ? (
                          <div className="flex items-center gap-1 text-[var(--gaming-green)] text-xs">
                            <Unlock className="w-3 h-3" />
                            <span>Unlocked</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
