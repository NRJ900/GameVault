import React from "react";
import { Clock, Zap, Library, Repeat, Layers, Timer } from "lucide-react";
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

const createLeveledMilestone = (
    baseId: string,
    baseTitle: string,
    baseDescription: string,
    icon: React.ReactNode,
    levels: { target: number; points: number; rarity: Milestone["rarity"] }[],
    getValue: (stats: UserStats) => number,
    formatTarget?: (target: number) => string
): Milestone[] => {
    return levels.map((level, index) => ({
        id: `${baseId}_${index + 1}`,
        title: `${baseTitle} (Lvl ${index + 1})`,
        description: baseDescription.replace("{}", formatTarget ? formatTarget(level.target) : level.target.toString()),
        icon,
        points: level.points,
        rarity: level.rarity,
        condition: (stats) => {
            const current = getValue(stats);
            return { current, target: level.target, unlocked: current >= level.target };
        }
    }));
};

export const MILESTONES: Milestone[] = [
    // 1. Time Traveler (Total Playtime)
    ...createLeveledMilestone(
        "time_traveler",
        "Time Traveler",
        "Play for {} hours total",
        <Clock className="w-6 h-6" />,
        [
            { target: 60, points: 10, rarity: "common" },    // 1 hour
            { target: 600, points: 50, rarity: "common" },   // 10 hours
            { target: 3000, points: 100, rarity: "rare" },   // 50 hours
            { target: 6000, points: 200, rarity: "rare" },   // 100 hours
            { target: 30000, points: 500, rarity: "legendary" } // 500 hours
        ],
        (stats) => stats.totalPlaytimeMinutes,
        (target) => (target / 60).toString()
    ),

    // 2. Library Builder (Unique Games Launched)
    ...createLeveledMilestone(
        "library_builder",
        "Library Builder",
        "Launch {} different games",
        <Library className="w-6 h-6" />,
        [
            { target: 5, points: 20, rarity: "common" },
            { target: 10, points: 50, rarity: "common" },
            { target: 25, points: 100, rarity: "rare" },
            { target: 50, points: 250, rarity: "rare" },
            { target: 100, points: 500, rarity: "legendary" }
        ],
        (stats) => stats.gamesLaunched.length
    ),

    // 3. Frequent Flyer (Total Launches)
    ...createLeveledMilestone(
        "frequent_flyer",
        "Frequent Flyer",
        "Launch games {} times",
        <Repeat className="w-6 h-6" />,
        [
            { target: 10, points: 10, rarity: "common" },
            { target: 50, points: 40, rarity: "common" },
            { target: 100, points: 100, rarity: "rare" },
            { target: 500, points: 250, rarity: "rare" },
            { target: 1000, points: 500, rarity: "legendary" }
        ],
        (stats) => stats.totalLaunches
    ),

    // 4. Marathon Runner (Single Game Playtime)
    ...createLeveledMilestone(
        "marathon_runner",
        "Marathon Runner",
        "Play a single game for {} hours",
        <Timer className="w-6 h-6" />,
        [
            { target: 300, points: 50, rarity: "common" },   // 5 hours
            { target: 600, points: 100, rarity: "common" },  // 10 hours
            { target: 1440, points: 200, rarity: "rare" },   // 24 hours
            { target: 3000, points: 400, rarity: "rare" },   // 50 hours
            { target: 6000, points: 1000, rarity: "legendary" } // 100 hours
        ],
        (stats) => Math.max(0, ...Object.values(stats.gamePlaytime)),
        (target) => (target / 60).toString()
    ),

    // 5. Loyal User (Launches via App)
    ...createLeveledMilestone(
        "loyal_user",
        "Loyal User",
        "Launch {} games via VAULTED",
        <Zap className="w-6 h-6" />,
        [
            { target: 1, points: 10, rarity: "common" },
            { target: 10, points: 30, rarity: "common" },
            { target: 50, points: 100, rarity: "rare" },
            { target: 100, points: 200, rarity: "rare" },
            { target: 500, points: 500, rarity: "legendary" }
        ],
        (stats) => stats.gamesLaunchedViaApp.length
    ),

    // 6. Deep Diver (Variety & Depth)
    {
        id: "deep_diver_1",
        title: "Deep Diver (Lvl 1)",
        description: "Play 3 games for >1 hour each",
        icon: <Layers className="w-6 h-6" />,
        points: 50,
        rarity: "common",
        condition: (stats) => {
            const target = 3;
            const count = Object.values(stats.gamePlaytime).filter(m => m >= 60).length;
            return { current: count, target, unlocked: count >= target };
        }
    },
    {
        id: "deep_diver_2",
        title: "Deep Diver (Lvl 2)",
        description: "Play 3 games for >5 hours each",
        icon: <Layers className="w-6 h-6" />,
        points: 100,
        rarity: "common",
        condition: (stats) => {
            const target = 3;
            const count = Object.values(stats.gamePlaytime).filter(m => m >= 300).length;
            return { current: count, target, unlocked: count >= target };
        }
    },
    {
        id: "deep_diver_3",
        title: "Deep Diver (Lvl 3)",
        description: "Play 5 games for >10 hours each",
        icon: <Layers className="w-6 h-6" />,
        points: 250,
        rarity: "rare",
        condition: (stats) => {
            const target = 5;
            const count = Object.values(stats.gamePlaytime).filter(m => m >= 600).length;
            return { current: count, target, unlocked: count >= target };
        }
    },
    {
        id: "deep_diver_4",
        title: "Deep Diver (Lvl 4)",
        description: "Play 10 games for >20 hours each",
        icon: <Layers className="w-6 h-6" />,
        points: 500,
        rarity: "rare",
        condition: (stats) => {
            const target = 10;
            const count = Object.values(stats.gamePlaytime).filter(m => m >= 1200).length;
            return { current: count, target, unlocked: count >= target };
        }
    },
    {
        id: "deep_diver_5",
        title: "Deep Diver (Lvl 5)",
        description: "Play 20 games for >50 hours each",
        icon: <Layers className="w-6 h-6" />,
        points: 1000,
        rarity: "legendary",
        condition: (stats) => {
            const target = 20;
            const count = Object.values(stats.gamePlaytime).filter(m => m >= 3000).length;
            return { current: count, target, unlocked: count >= target };
        }
    }
];
