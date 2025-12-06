import { motion } from "motion/react";
import { Clock, TrendingUp, Flame, Settings2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface MiniDashboardProps {
  dailyLimit: number;
  dailyLimitEnabled: boolean;
  todayPlaytime: number;
  onConfigureLimit: () => void;
}

export function MiniDashboard({ 
  dailyLimit, 
  dailyLimitEnabled, 
  todayPlaytime,
  onConfigureLimit 
}: MiniDashboardProps) {
  const percentage = dailyLimitEnabled ? Math.min((todayPlaytime / dailyLimit) * 100, 100) : 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-[var(--gaming-purple)]/10 to-[var(--gaming-cyan)]/10 border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-[var(--gaming-purple)]" />
        <h3>Today's Activity</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--gaming-purple)]/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[var(--gaming-purple)]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Playtime Today</p>
              <p className="text-xl">{todayPlaytime.toFixed(1)} hours</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--gaming-cyan)]/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[var(--gaming-cyan)]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Most Active</p>
              <p className="text-xl">Cyberpunk 2077</p>
            </div>
          </div>
        </div>

        {dailyLimitEnabled && (
          <div className="pt-4 border-t border-white/10">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-muted-foreground">Daily Limit</span>
              <div className="flex items-center gap-2">
                <span>{percentage.toFixed(0)}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onConfigureLimit}
                  className="h-6 w-6 rounded-md hover:bg-white/10"
                >
                  <Settings2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${
                  percentage >= 100
                    ? "bg-destructive"
                    : "bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)]"
                }`}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {todayPlaytime.toFixed(1)} / {dailyLimit.toFixed(1)} hours
            </p>
          </div>
        )}

        {!dailyLimitEnabled && (
          <div className="pt-4 border-t border-white/10">
            <Button
              variant="outline"
              size="sm"
              onClick={onConfigureLimit}
              className="w-full rounded-xl"
            >
              Set Daily Limit
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
