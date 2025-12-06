export interface Game {
    id: string;
    title: string;
    coverImage: string;
    hoursPlayed: number;
    description: string;
    genre: string;
    platform: string;
    lastPlayed: string;
    achievements?: number;
    totalAchievements?: number;
    isFavorite?: boolean;
    isPinned?: boolean;
    executablePath?: string;
    lastPlayedTimestamp?: number;
    trailerUrl?: string;
    releaseDate?: string;
    rating?: number;
    systemRequirements?: {
        minimum?: string;
        recommended?: string;
    };
    steamAppId?: string;
}

export interface GameCollection {
    id: string;
    name: string;
    description: string;
    gameIds: string[];
    color: string;
}

export interface Theme {
    id: string;
    name: string;
    colors: {
        background: string;
        foreground: string;
        primary: string;
        secondary: string;
        accent: string;
        muted: string;
        border: string;
    };
    price: number;
    isPremium: boolean;
    description: string;
}

export interface GamificationState {
    points: number;
    unlockedThemeIds: string[];
    unlockedFeatures: {
        customThemes: boolean;
    };
}

export interface UserStats {
    totalPlaytimeMinutes: number;
    totalLaunches: number;
    gamesLaunched: string[]; // IDs of games launched at least once
    gamesLaunchedViaApp: string[]; // IDs of games launched via GameVault
    gamePlaytime: Record<string, number>; // gameId -> minutes played
    claimedAchievements: string[]; // IDs of claimed milestones
}
