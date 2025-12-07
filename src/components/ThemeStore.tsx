import { motion } from "motion/react";
import { Palette, Lock, Unlock, Check, Star, ShoppingBag, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

import { Theme } from "../types";

interface ThemeStoreProps {
    points: number;
    ownedThemes: string[];
    unlockedFeatures: { customThemes: boolean };
    onPurchaseTheme: (theme: Theme) => void;
    onPurchaseFeature: (feature: string, cost: number) => void;
    onBack: () => void;
    currentTheme: string;
    onEquip: (themeId: string) => void;
}

export const availableThemes: Theme[] = [
    {
        id: "cyberpunk",
        name: "Cyberpunk Neon",
        description: "High contrast neon colors for the ultimate futuristic vibe.",
        price: 500,
        isPremium: true,
        colors: {
            background: "#09090b",
            foreground: "#fafafa",
            primary: "#f472b6",
            secondary: "#22d3ee",
            accent: "#f472b6",
            muted: "#71717a",
            border: "#27272a",
        },
    },
    {
        id: "forest",
        name: "Enchanted Forest",
        description: "Calming greens and earthy tones for a relaxed gaming session.",
        price: 300,
        isPremium: true,
        colors: {
            background: "#052e16",
            foreground: "#f0fdf4",
            primary: "#4ade80",
            secondary: "#a3e635",
            accent: "#4ade80",
            muted: "#86efac",
            border: "#14532d",
        },
    },
    {
        id: "ocean",
        name: "Deep Ocean",
        description: "Deep blues and teals inspired by the mysteries of the sea.",
        price: 300,
        isPremium: true,
        colors: {
            background: "#082f49",
            foreground: "#f0f9ff",
            primary: "#38bdf8",
            secondary: "#0ea5e9",
            accent: "#38bdf8",
            muted: "#7dd3fc",
            border: "#0c4a6e",
        },
    },
    {
        id: "sunset",
        name: "Retro Sunset",
        description: "Warm oranges and purples giving off that 80s synthwave feel.",
        price: 400,
        isPremium: true,
        colors: {
            background: "#2e1065",
            foreground: "#faf5ff",
            primary: "#f97316",
            secondary: "#d946ef",
            accent: "#f97316",
            muted: "#c4b5fd",
            border: "#5b21b6",
        },
    },
    {
        id: "midnight",
        name: "Midnight Purple",
        description: "Deep purple tones for a mysterious and elegant look.",
        price: 400,
        isPremium: true,
        colors: {
            background: "#1e1b4b",
            foreground: "#e0e7ff",
            primary: "#818cf8",
            secondary: "#4f46e5",
            accent: "#818cf8",
            muted: "#6366f1",
            border: "#312e81",
        },
    },
    {
        id: "solar",
        name: "Solar Flare",
        description: "Bright and energetic orange tones to light up your library.",
        price: 450,
        isPremium: true,
        colors: {
            background: "#451a03",
            foreground: "#fff7ed",
            primary: "#fb923c",
            secondary: "#ea580c",
            accent: "#fb923c",
            muted: "#fdba74",
            border: "#7c2d12",
        },
    },
    {
        id: "mint",
        name: "Minty Fresh",
        description: "Clean and refreshing mint greens for a modern aesthetic.",
        price: 350,
        isPremium: true,
        colors: {
            background: "#042f2e",
            foreground: "#f0fdfa",
            primary: "#2dd4bf",
            secondary: "#0d9488",
            accent: "#2dd4bf",
            muted: "#5eead4",
            border: "#115e59",
        },
    },
    {
        id: "royal",
        name: "Royal Gold",
        description: "Luxurious gold and black for a premium experience.",
        price: 600,
        isPremium: true,
        colors: {
            background: "#000000",
            foreground: "#fefce8",
            primary: "#fbbf24",
            secondary: "#d97706",
            accent: "#fbbf24",
            muted: "#fde047",
            border: "#451a03",
        },
    },
    {
        id: "crimson",
        name: "Crimson Red",
        description: "Bold and aggressive red tones for the competitive gamer.",
        price: 400,
        isPremium: true,
        colors: {
            background: "#450a0a",
            foreground: "#fef2f2",
            primary: "#f87171",
            secondary: "#dc2626",
            accent: "#f87171",
            muted: "#fca5a5",
            border: "#7f1d1d",
        },
    },
    {
        id: "nebula",
        name: "Nebula",
        description: "A dynamic, animated theme inspired by deep space.",
        price: 1000,
        isPremium: true,
        isAnimated: true,
        colors: {
            background: "#1a1625",
            foreground: "#e2e8f0",
            primary: "#4e207dff",
            secondary: "#616ff6ff",
            accent: "#2dd4bf",
            muted: "#312e81",
            border: "#9738caff",
        },
    },
    {
        id: "aurora",
        name: "Aurora",
        description: "Shifting lights of the north in an animated display.",
        price: 1000,
        isPremium: true,
        isAnimated: true,
        colors: {
            background: "#022c22",
            foreground: "#ecfdf5",
            primary: "#34d399",
            secondary: "#0ea5e9",
            accent: "#a7f3d0",
            muted: "#115e59",
            border: "#0f766e",
        },
    },
];

const FEATURE_COST = 1000;

export function ThemeStore({
    points,
    ownedThemes,
    unlockedFeatures,
    onPurchaseTheme,
    onPurchaseFeature,
    onBack,
    currentTheme,
    onEquip,
}: ThemeStoreProps) {
    return (
        <div className="size-full overflow-y-auto">
            <div className="max-w-[1800px] mx-auto p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            className="rounded-full hover:bg-white/10"
                        >
                            <Palette className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1>Theme Store</h1>
                            <p className="text-muted-foreground">Spend your hard-earned points on new looks</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full border border-yellow-500/30">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-yellow-500">{points} Points</span>
                    </div>
                </div>

                {/* Premium Features Section */}
                <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Unlock className="w-5 h-5 text-[var(--gaming-accent)]" />
                        Premium Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className={`p-6 border transition-all ${unlockedFeatures.customThemes ? "bg-green-500/10 border-green-500/30" : "bg-card/50 border-white/10"}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <Upload className="w-6 h-6 text-white" />
                                    </div>
                                    {unlockedFeatures.customThemes ? (
                                        <Badge className="bg-green-500 text-white hover:bg-green-600">Owned</Badge>
                                    ) : (
                                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                                            {FEATURE_COST} pts
                                        </Badge>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold mb-2">Custom Theme Upload</h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Unlock the ability to upload your own custom background images and define your own color palette.
                                </p>
                                <Button
                                    className="w-full"
                                    variant={unlockedFeatures.customThemes ? "outline" : "default"}
                                    disabled={unlockedFeatures.customThemes || points < FEATURE_COST}
                                    onClick={() => onPurchaseFeature("customThemes", FEATURE_COST)}
                                >
                                    {unlockedFeatures.customThemes ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Unlocked
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-4 h-4 mr-2" />
                                            Purchase Feature
                                        </>
                                    )}
                                </Button>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                {/* Themes Grid */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-[var(--gaming-accent)]" />
                        Theme Collection
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {availableThemes.map((theme, index) => {
                            const isOwned = ownedThemes.includes(theme.id);
                            const canAfford = points >= theme.price;

                            return (
                                <motion.div
                                    key={theme.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 + 0.2 }}
                                >
                                    <Card className="overflow-hidden border-white/10 bg-card/50 hover:border-white/20 transition-all group">
                                        {/* Theme Preview */}
                                        <div className="h-32 relative overflow-hidden">
                                            <div
                                                className="absolute inset-0"
                                                style={{ background: theme.colors.background }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center gap-4">
                                                <div className="w-8 h-8 rounded-full shadow-lg" style={{ background: theme.colors.primary }} />
                                                <div className="w-8 h-8 rounded-full shadow-lg" style={{ background: theme.colors.secondary }} />
                                                <div className="w-8 h-8 rounded-full shadow-lg" style={{ background: theme.colors.accent }} />
                                            </div>
                                            {isOwned && (
                                                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg flex items-center gap-1">
                                                    <Check className="w-3 h-3" />
                                                    Owned
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg">{theme.name}</h3>
                                                {!isOwned && (
                                                    <span className="text-yellow-500 font-bold text-sm flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-yellow-500" />
                                                        {theme.price}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                {theme.description}
                                            </p>

                                            {isOwned ? (
                                                currentTheme === theme.id ? (
                                                    <Button className="w-full bg-green-500/20 text-green-500 hover:bg-green-500/30 cursor-default">
                                                        <Check className="w-4 h-4 mr-2" />
                                                        Equipped
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        className="w-full"
                                                        variant="secondary"
                                                        onClick={() => onEquip(theme.id)}
                                                    >
                                                        Equip
                                                    </Button>
                                                )
                                            ) : (
                                                <Button
                                                    className="w-full"
                                                    disabled={!canAfford}
                                                    onClick={() => onPurchaseTheme(theme)}
                                                >
                                                    {canAfford ? (
                                                        <>
                                                            <ShoppingBag className="w-4 h-4 mr-2" />
                                                            Purchase
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock className="w-4 h-4 mr-2" />
                                                            Insufficient Points
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
