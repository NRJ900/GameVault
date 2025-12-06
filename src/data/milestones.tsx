import React from "react";
import { Clock, Gamepad2, Zap, Play } from "lucide-react";
import { UserStats } from "../types";

export interface Milestone {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    points: number;
    condition: (stats: UserStats) => { current: number; target: number; unlocked: boolean };
    rarity: "common" | "rare" | "legendary";
}

export const MILESTONES: Milestone[] = [
    {
        id: "novice_gamer",
        title: "Novice Gamer",
        description: "Play any game for 1 hour",
        icon: <Clock className="w-6 h-6" />,
        points: 10,
        rarity: "common",
        condition: (stats) => {
            const target = 60; // 60 minutes
            const current = stats.totalPlaytimeMinutes;
            return { current, target, unlocked: current >= target };
        }
    },
    {
        id: "dedicated_gamer",
        title: "Dedicated Gamer",
        description: "Play 3 games for over 5 hours each",
        icon: <Gamepad2 className="w-6 h-6" />,
        points: 50,
        rarity: "legendary",
        condition: (stats) => {
            const target = 3;
            const gamesOver5Hours = Object.values(stats.gamePlaytime).filter(minutes => minutes >= 300).length;
            return { current: gamesOver5Hours, target, unlocked: gamesOver5Hours >= target };
        }
    },
    {
        id: "loyal_user",
        title: "Loyal User",
        description: "Open a game through GameVault",
        icon: <Zap className="w-6 h-6" />,
        points: 30,
        rarity: "rare",
        condition: (stats) => {
            const target = 1;
            const current = stats.gamesLaunchedViaApp.length > 0 ? 1 : 0;
            return { current, target, unlocked: current >= target };
        }
    },
    {
        id: "explorer",
        title: "Explorer",
        description: "First open of a game (5pts per game)",
        icon: <Play className="w-6 h-6" />,
        points: 5, // Base points, but logic might need to be "5 * games"
        rarity: "common",
        condition: (stats) => {
            const target = 10; // Arbitrary target for "Explorer Level 1"
            const current = stats.gamesLaunched.length;
            return { current, target, unlocked: current > 0 };
        }
    }
];
