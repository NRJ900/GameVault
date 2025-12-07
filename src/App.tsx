import { useState, useEffect, useRef } from "react";
import { TopNavBar } from "./components/TopNavBar";
import { SideNavPanel } from "./components/SideNavPanel";
import { Dashboard } from "./components/Dashboard";
import { GameSettings } from "./components/GameSettings";
import { GlobalSettings } from "./components/GlobalSettings";
import { Achievements } from "./components/Achievements";
import { Favorites } from "./components/Favorites";
import { MyStack } from "./components/MyStack";
import { ContinuePlaying } from "./components/ContinuePlaying";
import { RecentlyPlayed } from "./components/RecentlyPlayed";
import { ThemeStore, availableThemes } from "./components/ThemeStore";
import { GameDetails } from "./components/GameDetails";
import { Messages, Notification } from "./components/Messages";
import { DeveloperTools } from "./components/temp";
import { MILESTONES } from "./data/milestones";


import { LaunchScreen } from "./components/LaunchScreen";
import { DailyLimitSettings } from "./components/DailyLimitSettings";
import { LivePlaytimeTracker } from "./components/LivePlaytimeTracker";
import { GameNotesPanel } from "./components/GameNotesPanel";
import { ModsManager } from "./components/ModsManager";
import { GameContextMenu } from "./components/GameContextMenu";
import { CommandPalette } from "./components/CommandPalette";
import { AddGameDialog } from "./components/AddGameDialog";
import { ScanWizard } from "./components/ScanWizard";
import {
  KeyboardShortcutsHelper,
  ShortcutsButton,
} from "./components/KeyboardShortcutsHelper";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { useTheme } from "./components/theme-provider";
import { rawgService, RawgGameDetails } from "@/services/rawgService";

import { Game, GameCollection, Theme } from "./types";

export default function App() {
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [uiScale, setUiScale] = useState(1);
  const [defaultGameDir, setDefaultGameDir] = useState("C:\\Program Files\\Games");
  const [autoDetectGames, setAutoDetectGames] = useState(true);
  const [cloudEmail, setCloudEmail] = useState("");
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [gameNewsUpdates, setGameNewsUpdates] = useState(true);
  const [achievementNotifications, setAchievementNotifications] = useState(true);
  const [launchReminders, setLaunchReminders] = useState(false);
  const [rawgApiKey, setRawgApiKey] = useState(import.meta.env.VITE_RAWG_API_KEY || "");

  useEffect(() => {
    rawgService.setApiKey(rawgApiKey);
  }, [rawgApiKey]);

  useEffect(() => {
    const baseSize = 16;
    const newSize = baseSize * uiScale;
    document.documentElement.style.setProperty('--font-size', `${newSize}px`);
  }, [uiScale]);

  const [activeView, setActiveView] = useState<"dashboard" | "continue-playing" | "settings" | "about" | "store" | "game-details" | "my-stack" | "achievements" | "favorites" | "messages" | "recently-played">("dashboard");
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showAddGameDialog, setShowAddGameDialog] = useState(false);
  const [showScanWizard, setShowScanWizard] = useState(false);
  const [showLimitSettings, setShowLimitSettings] = useState(false);
  const [showDevTools, setShowDevTools] = useState(false);

  // Konami Code Listener
  useEffect(() => {
    const konamiCode = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a"
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setShowDevTools(true);
          toast.success("Developer Mode Activated! 🔧");
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- Persistence Logic ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedGames = await window.ipcRenderer.loadData('games');
        if (savedGames) setGames(savedGames);

        const savedStats = await window.ipcRenderer.loadData('userStats');
        if (savedStats) setUserStats(savedStats);

        const savedPoints = await window.ipcRenderer.loadData('points');
        if (savedPoints) setPoints(savedPoints);

        const savedThemes = await window.ipcRenderer.loadData('ownedThemes');
        if (savedThemes) setOwnedThemes(savedThemes);

        const savedSettings = await window.ipcRenderer.loadData('settings');
        if (savedSettings) {
          if (savedSettings.theme) setTheme(savedSettings.theme);
          if (savedSettings.accentColor) setAccentColor(savedSettings.accentColor);
          if (savedSettings.bgImage) setBgImage(savedSettings.bgImage);
          if (savedSettings.bgBlur) setBgBlur(savedSettings.bgBlur);
          if (savedSettings.bgOpacity) setBgOpacity(savedSettings.bgOpacity);
          if (savedSettings.uiScale) setUiScale(savedSettings.uiScale);
          if (savedSettings.dailyLimit) setDailyLimit(savedSettings.dailyLimit);
          if (savedSettings.dailyLimitEnabled !== undefined) setDailyLimitEnabled(savedSettings.dailyLimitEnabled);
          if (savedSettings.gameNewsUpdates !== undefined) setGameNewsUpdates(savedSettings.gameNewsUpdates);
          if (savedSettings.achievementNotifications !== undefined) setAchievementNotifications(savedSettings.achievementNotifications);
          if (savedSettings.launchReminders !== undefined) setLaunchReminders(savedSettings.launchReminders);
          if (savedSettings.rawgApiKey) setRawgApiKey(savedSettings.rawgApiKey);
        }

        const savedCollections = await window.ipcRenderer.loadData('collections');
        if (savedCollections) setCollections(savedCollections);

      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load saved data");
      }
    };
    loadData();
  }, []); // Run once on mount



  // User Stats for Achievements
  const [userStats, setUserStats] = useState<{
    totalPlaytimeMinutes: number;
    totalLaunches: number;
    gamesLaunched: string[];
    gamesLaunchedViaApp: string[];
    gamePlaytime: Record<string, number>;
    claimedAchievements: string[];
  }>({
    totalPlaytimeMinutes: 0,
    totalLaunches: 0,
    gamesLaunched: [],
    gamesLaunchedViaApp: [],
    gamePlaytime: {},
    claimedAchievements: [],
  });

  // Track unlocked milestones to detect new ones
  const [unlockedMilestones, setUnlockedMilestones] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Check for new achievements
  useEffect(() => {
    const newUnlocked: string[] = [];

    MILESTONES.forEach(milestone => {
      const { unlocked } = milestone.condition(userStats);
      if (unlocked && !unlockedMilestones.includes(milestone.id)) {
        newUnlocked.push(milestone.id);

        // Add notification
        const newNotification: Notification = {
          id: Date.now().toString() + Math.random(),
          title: "Achievement Unlocked!",
          message: `You've unlocked "${milestone.title}" - ${milestone.description}`,
          timestamp: Date.now(),
          read: false,
          type: "achievement"
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Show toast
        toast.success("Achievement Unlocked!", {
          description: milestone.title,
          action: {
            label: "View",
            onClick: () => setActiveView("messages")
          }
        });
      }
    });

    if (newUnlocked.length > 0) {
      setUnlockedMilestones(prev => [...prev, ...newUnlocked]);
    }
  }, [userStats, unlockedMilestones]);

  // Game State
  const [games, setGames] = useState<Game[]>([]);

  // Filter State
  const [filters] = useState({
    genres: [] as string[],
    platforms: [] as string[],
    playtimeRange: [0, 200] as [number, number],
    sortBy: "Recently Played",
  });

  // Filter Logic
  const filteredGames = games.filter((game) => {
    if (searchQuery && !game.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.genres.length > 0 && !filters.genres.includes(game.genre)) return false;
    if (filters.platforms.length > 0 && !filters.platforms.includes(game.platform)) return false;
    if (game.hoursPlayed < filters.playtimeRange[0] || (filters.playtimeRange[1] < 200 && game.hoursPlayed > filters.playtimeRange[1])) return false;
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "Most Played": return b.hoursPlayed - a.hoursPlayed;
      case "Title (A-Z)": return a.title.localeCompare(b.title);
      case "Title (Z-A)": return b.title.localeCompare(a.title);
      case "Recently Played": default: return 0;
    }
  });



  const [gameForSettings, setGameForSettings] = useState<Game | null>(null);

  const [collections, setCollections] = useState<GameCollection[]>([]);

  // Daily limit states
  const [dailyLimit, setDailyLimit] = useState(8);
  const [dailyLimitEnabled, setDailyLimitEnabled] = useState(true);
  const [todayPlaytime, setTodayPlaytime] = useState(0); // Hours
  const [dailyGamePlaytime, setDailyGamePlaytime] = useState<Record<string, number>>({}); // Game ID -> Minutes
  const [limitDialogShown, setLimitDialogShown] = useState(false);


  // New feature states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Game | null>(null);
  const [showGameNotes, setShowGameNotes] = useState(false);
  const [gameForNotes, setGameForNotes] = useState<Game | null>(null);
  const [showModsManager, setShowModsManager] = useState(false);
  const [gameForMods, setGameForMods] = useState<Game | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    game: Game | null;
  }>({ isOpen: false, position: { x: 0, y: 0 }, game: null });

  // Track playtime for "Today's Activity"
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && currentlyPlaying) {
      interval = setInterval(() => {
        // Increment total today playtime (in hours)
        // 1 second = 1/3600 hours
        setTodayPlaytime(prev => prev + (1 / 3600));

        // Increment specific game playtime (in minutes)
        setDailyGamePlaytime(prev => ({
          ...prev,
          [currentlyPlaying.id]: (prev[currentlyPlaying.id] || 0) + (1 / 60)
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentlyPlaying]);

  // Calculate most active game
  const mostActiveGameId = Object.entries(dailyGamePlaytime).sort(([, a], [, b]) => b - a)[0]?.[0];
  const mostActiveGame = games.find(g => g.id === mostActiveGameId)?.title || "None";

  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcutsHelper, setShowShortcutsHelper] = useState(false);

  // Gamification State
  const [points, setPoints] = useState(200); // Default points updated to 200
  const [ownedThemes, setOwnedThemes] = useState<string[]>(["light", "dark"]);
  const [unlockedFeatures, setUnlockedFeatures] = useState({ customThemes: false });

  // Background Customization State
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgBlur, setBgBlur] = useState(0);
  const [bgOpacity, setBgOpacity] = useState(0.5);

  const handlePurchaseTheme = (theme: Theme) => {
    if (points >= theme.price) {
      setPoints((prev) => prev - theme.price);
      setOwnedThemes((prev) => [...prev, theme.id]);
      toast.success(`Purchased ${theme.name}!`, { description: "You can now select this theme in Settings." });
    } else {
      toast.error("Insufficient points!");
    }
  };

  const handlePurchaseFeature = (feature: string, cost: number) => {
    if (points >= cost) {
      setPoints((prev) => prev - cost);
      setUnlockedFeatures((prev) => ({ ...prev, [feature]: true }));
      toast.success("Feature Unlocked!", { description: "You can now use Custom Theme Uploads." });
    } else {
      toast.error("Insufficient points!");
    }
  };

  // --- Persistence Logic ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedGames = await window.ipcRenderer.loadData('games');
        if (savedGames) setGames(savedGames);

        const savedStats = await window.ipcRenderer.loadData('userStats');
        if (savedStats) setUserStats(savedStats);

        const savedPoints = await window.ipcRenderer.loadData('points');
        if (savedPoints) setPoints(savedPoints);

        const savedThemes = await window.ipcRenderer.loadData('ownedThemes');
        if (savedThemes) setOwnedThemes(savedThemes);

        const savedFeatures = await window.ipcRenderer.loadData('unlockedFeatures');
        if (savedFeatures) setUnlockedFeatures(savedFeatures);

        const savedSettings = await window.ipcRenderer.loadData('settings');
        if (savedSettings) {
          if (savedSettings.theme) setTheme(savedSettings.theme);
          if (savedSettings.accentColor) setAccentColor(savedSettings.accentColor);
          if (savedSettings.bgImage) setBgImage(savedSettings.bgImage);
          if (savedSettings.bgBlur) setBgBlur(savedSettings.bgBlur);
          if (savedSettings.bgOpacity) setBgOpacity(savedSettings.bgOpacity);
          if (savedSettings.uiScale) setUiScale(savedSettings.uiScale);
          if (savedSettings.dailyLimit) setDailyLimit(savedSettings.dailyLimit);
          if (savedSettings.dailyLimitEnabled !== undefined) setDailyLimitEnabled(savedSettings.dailyLimitEnabled);
        }

        const savedCollections = await window.ipcRenderer.loadData('collections');
        if (savedCollections) setCollections(savedCollections);

      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load saved data");
      }
    };
    loadData();
  }, []); // Run once on mount

  // Save Data Effects
  useEffect(() => {
    const timer = setTimeout(() => {
      window.ipcRenderer.saveData('games', games);
    }, 1000);
    return () => clearTimeout(timer);
  }, [games]);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.ipcRenderer.saveData('userStats', userStats, true); // Encrypted
    }, 1000);
    return () => clearTimeout(timer);
  }, [userStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.ipcRenderer.saveData('gamification', {
        points,
        ownedThemes,
        unlockedFeatures
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [points, ownedThemes, unlockedFeatures]);

  // Window Focus Effect for Animation
  useEffect(() => {
    const handleFocus = () => document.body.classList.add('window-focused');
    const handleBlur = () => document.body.classList.remove('window-focused');

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Initial check
    if (document.hasFocus()) {
      handleFocus();
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.body.classList.remove('window-focused');
    };
  }, []);

  useEffect(() => {
    window.ipcRenderer.saveData('collections', collections);
  }, [collections]);

  useEffect(() => {
    const settings = {
      theme,
      accentColor,
      bgImage,
      bgBlur,
      bgOpacity,
      uiScale,
      dailyLimit,
      dailyLimitEnabled,
      gameNewsUpdates,
      achievementNotifications,
      launchReminders,
      rawgApiKey
    };
    const timer = setTimeout(() => {
      window.ipcRenderer.saveData('settings', settings);
    }, 1000);
    return () => clearTimeout(timer);
  }, [theme, accentColor, bgImage, bgBlur, bgOpacity, uiScale, dailyLimit, dailyLimitEnabled, gameNewsUpdates, achievementNotifications, launchReminders]);
  // -------------------------

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: "1", ctrlKey: true, handler: () => setActiveView("dashboard"), description: "Go to Dashboard" },
    { key: "2", ctrlKey: true, handler: () => setActiveView("my-stack"), description: "Go to My Stack" },
    { key: "3", ctrlKey: true, handler: () => setActiveView("achievements"), description: "Go to Achievements" },
    { key: "4", ctrlKey: true, handler: () => setActiveView("favorites"), description: "Go to Favorites" },
    { key: "5", ctrlKey: true, handler: () => setActiveView("continue-playing"), description: "Go to Continue Playing" },
    { key: "f", ctrlKey: true, handler: () => { toast.info("Search focused"); }, description: "Focus Search" },
    { key: "l", ctrlKey: true, handler: () => handleLaunchLastPlayed(), description: "Launch Last Played" },
    { key: "k", ctrlKey: true, handler: () => setShowCommandPalette(true), description: "Command Palette" },
    {
      key: "Escape", handler: () => {
        if (selectedGame) setSelectedGame(null);
        else if (showCommandPalette) setShowCommandPalette(false);
        else if (showShortcutsHelper) setShowShortcutsHelper(false);
        else if (contextMenu.isOpen) setContextMenu({ ...contextMenu, isOpen: false });
        else if (showGameNotes) setShowGameNotes(false);
        else if (showModsManager) setShowModsManager(false);
      }, description: "Close/Go Back"
    },
    { key: "?", handler: () => setShowShortcutsHelper(true), description: "Show Keyboard Shortcuts" },
  ]);

  // Check daily limit
  useEffect(() => {
    if (dailyLimitEnabled && todayPlaytime >= dailyLimit && !limitDialogShown) {
      setShowLimitSettings(true);
      setLimitDialogShown(true);
    }
  }, [todayPlaytime, dailyLimit, dailyLimitEnabled, limitDialogShown]);

  // Handle launch screen completion
  const handleLaunchComplete = () => {
    setShowLaunchScreen(false);
    const timer = setTimeout(() => { setIsLoading(false); }, 1000);
    return () => clearTimeout(timer);
  };

  // Simulate initial loading
  useEffect(() => {
    if (!showLaunchScreen) {
      const timer = setTimeout(() => { setIsLoading(false); }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showLaunchScreen]);

  // Dynamic Theme Injection
  useEffect(() => {
    const root = document.documentElement;
    const customTheme = availableThemes.find((t) => t.id === theme);

    if (customTheme) {
      Object.entries(customTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
        if (key === "background") {
          root.style.setProperty("--background", value);
          root.style.setProperty("--card", value);
          root.style.setProperty("--popover", value);
          root.style.setProperty("--input-background", value);
          root.style.setProperty("--sidebar", value);
        }
        if (key === "foreground") {
          root.style.setProperty("--foreground", value);
          root.style.setProperty("--card-foreground", value);
          root.style.setProperty("--popover-foreground", value);
          root.style.setProperty("--sidebar-foreground", value);
        }
        if (key === "primary") root.style.setProperty("--primary", value);
        if (key === "secondary") root.style.setProperty("--secondary", value);
        if (key === "muted") root.style.setProperty("--muted", value);
        if (key === "border") {
          root.style.setProperty("--border", value);
          root.style.setProperty("--input", value);
          root.style.setProperty("--sidebar-border", value);
        }
      });

      if (accentColor) {
        root.style.setProperty("--gaming-accent", accentColor);
      }

      if (customTheme.isAnimated) {
        document.body.classList.add("theme-animated");
      } else {
        document.body.classList.remove("theme-animated");
      }

      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      document.body.classList.remove("theme-animated");
      const keys = [
        "background", "foreground", "primary", "secondary", "muted", "border",
        "card", "popover", "input", "input-background", "sidebar",
        "card-foreground", "popover-foreground", "sidebar-foreground", "sidebar-border",
        "gaming-accent"
      ];
      keys.forEach((key) => root.style.removeProperty(`--${key}`));

      if (accentColor) {
        root.style.setProperty("--gaming-accent", accentColor);
      }
    }
  }, [theme, accentColor]);



  const handleSaveDailyLimit = (limit: number, enabled: boolean) => {
    setDailyLimit(limit);
    setDailyLimitEnabled(enabled);
    setLimitDialogShown(false);
    toast.success("Daily limit settings saved!");
  };

  const handleGameTitleClick = (game: Game) => {
    setSelectedGameId(game.id);
    setActiveView("game-details");
  };



  const handleGameClick = async (game: Game) => {
    if (isPlaying) {
      toast.warning("A game is already running!");
      return;
    }

    const toastId = toast.loading(`Launching ${game.title}...`);

    try {
      // Launch the game
      await window.ipcRenderer.launchGame({
        executablePath: game.executablePath || "",
        steamAppId: game.steamAppId
      });

      setIsPlaying(true);
      setCurrentlyPlaying(game);

      // Update last played immediately
      setGames((prevGames) =>
        prevGames.map((g) =>
          g.id === game.id ? { ...g, lastPlayed: "Just now", lastPlayedTimestamp: Date.now() } : g
        )
      );

      // Update the existing toast instead of dismissing and creating new
      toast.success(`Playing ${game.title}`, {
        id: toastId,
        duration: 3000
      });

      setUserStats(prev => {
        const isFirstLaunch = !prev.gamesLaunched.includes(game.id);
        const newGamesLaunched = isFirstLaunch ? [...prev.gamesLaunched, game.id] : prev.gamesLaunched;
        const isFirstAppLaunch = !prev.gamesLaunchedViaApp.includes(game.id);
        const newGamesLaunchedViaApp = isFirstAppLaunch ? [...prev.gamesLaunchedViaApp, game.id] : prev.gamesLaunchedViaApp;

        return {
          ...prev,
          totalLaunches: prev.totalLaunches + 1,
          gamesLaunched: newGamesLaunched,
          gamesLaunchedViaApp: newGamesLaunchedViaApp,
        };
      });

    } catch (error) {
      console.error("Failed to launch game:", error);
      toast.error("Failed to launch game", {
        id: toastId,
        description: "Please check if the executable exists.",
        duration: 5000
      });
    }
  };

  const activeGameRef = useRef<string | null>(null);

  // Sync ref with state (optional, but good for consistency if state changes elsewhere)
  useEffect(() => {
    if (!isPlaying) {
      activeGameRef.current = null;
    } else if (currentlyPlaying) {
      activeGameRef.current = currentlyPlaying.executablePath || null;
    }
  }, [isPlaying, currentlyPlaying]);

  // Listen for game exit
  useEffect(() => {
    const handleGameExited = (_event: any, game: Game) => {
      // Check if the exited game is actually the one we are tracking
      // Use ref for immediate check
      if (activeGameRef.current && activeGameRef.current === game.executablePath) {
        handleStopPlaying();
        toast.info("Game closed", {
          id: `closed-${game.id}`,
          description: `${game.title} session ended`,
        });
        activeGameRef.current = null;
      }
    };

    const handleGameDetected = (_event: any, game: Game) => {
      // Prevent duplicate detection using Ref for synchronous check
      if (activeGameRef.current === game.executablePath) return;

      if (!isPlaying && game) {
        const knownGame = games.find(g => g.executablePath === game.executablePath);

        if (knownGame) {
          // Set ref IMMEDIATELY to block subsequent events
          activeGameRef.current = knownGame.executablePath || null;

          setIsPlaying(true);
          setCurrentlyPlaying(knownGame);
          toast.success("Game Detected!", {
            id: `detected-${knownGame.id}`,
            description: `Tracking playtime for ${knownGame.title}`,
          });
        }
      }
    };

    const handleScreenshotCaptured = (_event: any, { path, gameName }: { path: string, gameName: string }) => {
      toast.success("Screenshot Saved", {
        description: `Saved to screenshots/${gameName}`,
        action: {
          label: "View",
          onClick: () => window.ipcRenderer.openPath(path)
        }
      });
    };

    const handleShortcutRegistered = (_event: any, key: string) => {
      toast.info("Screenshot Ready", {
        description: `Press ${key} to take a screenshot`,
        duration: 5000,
      });
    };

    const handleShortcutFailed = () => {
      toast.error("Screenshot Error", {
        description: "Could not register F12 or fallback keys. Check if other apps are using them.",
      });
    };

    window.ipcRenderer.on('game-exited', handleGameExited);
    window.ipcRenderer.on('game-detected', handleGameDetected);
    window.ipcRenderer.on('screenshot-captured', handleScreenshotCaptured);
    window.ipcRenderer.on('shortcut-registered', handleShortcutRegistered);
    window.ipcRenderer.on('shortcut-registration-failed', handleShortcutFailed);

    return () => {
      window.ipcRenderer.off('game-exited', handleGameExited);
      window.ipcRenderer.off('game-detected', handleGameDetected);
      window.ipcRenderer.off('screenshot-captured', handleScreenshotCaptured);
      window.ipcRenderer.off('shortcut-registered', handleShortcutRegistered);
      window.ipcRenderer.off('shortcut-registration-failed', handleShortcutFailed);
    };
  }, [isPlaying, currentlyPlaying, games]);

  // Track playtime
  useEffect(() => {
    if (isPlaying && currentlyPlaying) {
      const interval = setInterval(() => {
        // Update User Stats
        setUserStats(prev => {
          const currentPlaytime = prev.gamePlaytime[currentlyPlaying.id] || 0;
          const newStats = {
            ...prev,
            totalPlaytimeMinutes: prev.totalPlaytimeMinutes + 1,
            gamePlaytime: {
              ...prev.gamePlaytime,
              [currentlyPlaying.id]: currentPlaytime + 1
            }
          };
          // Persist user stats
          window.ipcRenderer.saveData('userStats', newStats);
          return newStats;
        });

        // Update Game State (hoursPlayed) and persist
        setGames(prevGames => {
          const updatedGames = prevGames.map(g => {
            if (g.id === currentlyPlaying.id) {
              return {
                ...g,
                hoursPlayed: (g.hoursPlayed || 0) + (1 / 60)
              };
            }
            return g;
          });
          window.ipcRenderer.saveData('games', updatedGames);
          return updatedGames;
        });

      }, 60000); // Every minute

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentlyPlaying]);



  const handleLaunchLastPlayed = () => {
    const recentGamesForSidebar = [...games].sort((a, b) => {
      if (a.lastPlayed === "Just now") return -1;
      if (b.lastPlayed === "Just now") return 1;
      return 0;
    }).slice(0, 5);

    const lastPlayedGame = recentGamesForSidebar[0];
    if (lastPlayedGame) {
      activeGameRef.current = lastPlayedGame.executablePath || null; // Set ref
      setIsPlaying(true);
      setCurrentlyPlaying(lastPlayedGame);
      setGames((prevGames) =>
        prevGames.map((g) =>
          g.id === lastPlayedGame.id ? { ...g, lastPlayed: "Just now", lastPlayedTimestamp: Date.now() } : g
        )
      );
      toast.success("Launching last played game...", {
        description: `Starting ${lastPlayedGame.title}`,
      });
    }
  };

  const handleStopPlaying = async () => {
    if (currentlyPlaying?.executablePath) {
      try {
        await window.ipcRenderer.stopGame(currentlyPlaying.executablePath);
      } catch (error) {
        console.error("Failed to stop game:", error);
      }
    }

    activeGameRef.current = null; // Clear ref
    setIsPlaying(false);
    setCurrentlyPlaying(null);
    if (currentlyPlaying) {
      toast.info("Game session ended", {
        id: `session-ended-${currentlyPlaying.id}`,
        description: `${currentlyPlaying.title} - Session saved`,
      });
    }
  };

  const handleClaimAchievement = (id: string, pointsToClaim: number) => {
    if (userStats.claimedAchievements.includes(id)) return;

    setUserStats(prev => ({
      ...prev,
      claimedAchievements: [...prev.claimedAchievements, id]
    }));
    setPoints(prev => prev + pointsToClaim);
    toast.success(`Claimed ${pointsToClaim} points!`);
  };

  const handleClaimAllAchievements = (achievementsToClaim: { id: string; points: number }[]) => {
    const newClaims = achievementsToClaim.filter(a => !userStats.claimedAchievements.includes(a.id));
    if (newClaims.length === 0) return;

    const totalPoints = newClaims.reduce((sum, a) => sum + a.points, 0);
    const newIds = newClaims.map(a => a.id);

    setUserStats(prev => ({
      ...prev,
      claimedAchievements: [...prev.claimedAchievements, ...newIds]
    }));
    setPoints(prev => prev + totalPoints);
    toast.success(`Claimed ${totalPoints} points from ${newClaims.length} achievements!`);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };



  const handleViewChange = (view: string) => {
    setActiveView(view as any);
  };

  const handleToggleFavorite = (gameId: string) => {
    setGames((prevGames) =>
      prevGames.map((game) =>
        game.id === gameId
          ? { ...game, isFavorite: !game.isFavorite }
          : game,
      ),
    );
    const game = games.find((g) => g.id === gameId);
    if (game?.isFavorite) {
      toast.success("Removed from favorites");
    } else {
      toast.success("Added to favorites");
    }
  };

  const handleAddCollection = (collection: Omit<GameCollection, "id">) => {
    const newCollection: GameCollection = {
      ...collection,
      id: Date.now().toString(),
    };
    setCollections([...collections, newCollection]);
    toast.success(`Collection "${collection.name}" created!`);
  };

  const handleDeleteCollection = (collectionId: string) => {
    setCollections(collections.filter((c) => c.id !== collectionId));
    toast.success("Collection deleted");
  };

  const handleUpdateCollection = (collectionId: string, updates: Partial<GameCollection>) => {
    setCollections(collections.map((c) => c.id === collectionId ? { ...c, ...updates } : c));
    if (updates.name) {
      toast.success("Collection updated");
    }
  };

  const handleTogglePin = (gameId: string) => {
    setGames((prevGames) =>
      prevGames.map((game) =>
        game.id === gameId
          ? { ...game, isPinned: !game.isPinned }
          : game,
      ),
    );
    const game = games.find((g) => g.id === gameId);
    if (game?.isPinned) {
      toast.success("Unpinned from dashboard");
    } else {
      toast.success("Pinned to dashboard");
    }
  };

  const handleGameContextMenu = (e: React.MouseEvent, game: Game) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      game,
    });
  };

  const handleOpenNotes = (game: Game) => {
    setGameForNotes(game);
    setShowGameNotes(true);
  };

  const handleOpenMods = (game: Game) => {
    setGameForMods(game);
    setShowModsManager(true);
  };

  const handleAddGame = (game: Game) => {
    setGames((prev) => [...prev, game]);
    setShowAddGameDialog(false);
    toast.success(`Added ${game.title} to library!`);
  };

  const handleImportGames = async (importedGames: { title: string; executablePath: string; steamAppId?: string }[]) => {
    setIsLoading(true);
    setShowScanWizard(false);

    // Simulate processing
    const newGamesPromises = importedGames.map(async (game) => {
      const name = game.title || game.executablePath.split('\\').pop()?.replace('.exe', '') || "Unknown Game";

      // Try to fetch metadata
      let details: RawgGameDetails | null = null;
      try {
        const searchResults = await rawgService.searchGames(name);
        if (searchResults.length > 0) {
          details = await rawgService.getGameDetails(searchResults[0].id);
        }
      } catch (e) {
        console.error("Failed to fetch metadata for", name);
      }

      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: details?.name || name,
        coverImage: details?.background_image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
        description: details?.description_raw || "Imported from local scan.",
        genre: details?.genres?.[0]?.name || "Unknown",
        platform: "PC",
        executablePath: game.executablePath,
        lastPlayed: "Never",
        achievements: 0,
        totalAchievements: 0,
        hoursPlayed: 0,
        isPinned: false,
        releaseDate: details?.released,
        rating: details?.metacritic || 0,
        systemRequirements: details?.platforms?.find((p) => p.platform.name === "PC")?.requirements,
        steamAppId: game.steamAppId,
      } as Game;
    });

    const newGames = await Promise.all(newGamesPromises);

    setGames((prev) => [...prev, ...newGames]);
    setIsLoading(false);
    toast.success(`Imported ${newGames.length} games with details!`);
  };

  const handleRefreshMetadata = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Refreshing game metadata...");

    try {
      const updatedGamesPromises = games.map(async (game) => {
        // Skip if we already have a custom cover (optional, but good for performance)
        // For now, we'll refresh everything to ensure consistency

        try {
          // 1. Search for the game to get the ID
          const searchResults = await rawgService.searchGames(game.title);
          if (searchResults.length === 0) return game;

          const gameId = searchResults[0].id;

          // 2. Fetch full details
          const details = await rawgService.getGameDetails(gameId);

          if (!details) return game;

          return {
            ...game,
            coverImage: details.background_image || game.coverImage,
            description: details.description_raw || game.description,
            genre: details.genres?.[0]?.name || game.genre,
            releaseDate: details.released || game.releaseDate,
            rating: details.metacritic || game.rating,
            systemRequirements: details.platforms?.find((p) => p.platform.name === "PC")?.requirements || game.systemRequirements,
          };
        } catch (e) {
          console.error(`Failed to refresh metadata for ${game.title}`, e);
          return game;
        }
      });

      const updatedGames = await Promise.all(updatedGamesPromises);
      setGames(updatedGames);
      toast.success("Metadata refreshed successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to refresh metadata:", error);
      toast.error("Failed to refresh metadata", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshGameMetadata = async (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    const toastId = toast.loading(`Refreshing metadata for ${game.title}...`);

    try {
      // 1. Search for the game to get the ID
      const searchResults = await rawgService.searchGames(game.title);
      if (searchResults.length === 0) {
        toast.error("Game not found on RAWG", { id: toastId });
        return;
      }

      const rawgId = searchResults[0].id;

      // 2. Fetch full details
      const details = await rawgService.getGameDetails(rawgId);

      if (!details) {
        toast.error("Failed to fetch details", { id: toastId });
        return;
      }

      const updatedGame = {
        ...game,
        coverImage: details.background_image || game.coverImage,
        description: details.description_raw || game.description,
        genre: details.genres?.[0]?.name || game.genre,
        releaseDate: details.released || game.releaseDate,
        rating: details.metacritic || game.rating,
        systemRequirements: details.platforms?.find((p) => p.platform.name === "PC")?.requirements || game.systemRequirements,
      };

      setGames(prev => prev.map(g => g.id === gameId ? updatedGame : g));
      toast.success("Metadata updated!", { id: toastId });
    } catch (error) {
      console.error("Failed to refresh game metadata:", error);
      toast.error("Failed to update metadata", { id: toastId });
    }
  };

  const handleDeleteGame = (gameId: string) => {
    setGames((prev) => prev.filter((g) => g.id !== gameId));
    if (selectedGame?.id === gameId) setSelectedGame(null);
    if (gameForSettings?.id === gameId) setGameForSettings(null);
    toast.success("Game removed from library");
  };

  const handleOpenLocation = async (path: string) => {
    try {
      await window.ipcRenderer.openPath(path);
      toast.success("Opened file location");
    } catch (error) {
      toast.error("Failed to open location");
    }
  };
  const handleBackupNow = async () => {
    try {
      const dataToSave = {
        games,
        userStats,
        points,
        ownedThemes,
        unlockedFeatures,
        theme,
        accentColor,
        bgImage,
        bgBlur,
        bgOpacity,
        uiScale,
        defaultGameDir,
        autoDetectGames,
        cloudEmail,
        cloudSyncEnabled,
        autoBackup,
        rawgApiKey
      };
      // Use the new save-backup IPC which opens a save dialog
      const success = await window.ipcRenderer.saveBackup(JSON.stringify(dataToSave, null, 2));
      if (success) {
        toast.success("Backup created successfully!");
      }
    } catch (e) {
      toast.error("Backup failed");
    }
  };

  const handleDefaultGameDirChange = async (newPath: string) => {
    setDefaultGameDir(newPath);

    if (autoDetectGames) {
      const toastId = toast.loading(`Scanning ${newPath} for games...`);
      try {
        const foundGames = await window.ipcRenderer.scanGames(newPath);

        // Filter out games that are already in the library
        const newGames = foundGames.filter((scannedGame: any) =>
          !games.some(existing =>
            existing.executablePath?.toLowerCase() === scannedGame.path.toLowerCase()
          )
        );

        if (newGames.length > 0) {
          // Import the new games
          const gamesToImport = newGames.map((g: any) => ({
            title: g.name,
            executablePath: g.path,
            steamAppId: g.steamAppId
          }));

          await handleImportGames(gamesToImport);
          toast.success(`Found and added ${newGames.length} new games!`, { id: toastId });
        } else {
          toast.info("No new games found in this directory.", { id: toastId });
        }
      } catch (error) {
        console.error("Auto-scan failed:", error);
        toast.error("Failed to scan directory", { id: toastId });
      }
    }
  };

  const handleRescanDefaultDir = async () => {
    if (!defaultGameDir) return;

    const toastId = toast.loading(`Scanning ${defaultGameDir} for games...`);
    try {
      const foundGames = await window.ipcRenderer.scanGames(defaultGameDir);

      // Filter out games that are already in the library
      const newGames = foundGames.filter((scannedGame: any) =>
        !games.some(existing =>
          existing.executablePath?.toLowerCase() === scannedGame.path.toLowerCase()
        )
      );

      if (newGames.length > 0) {
        // Import the new games
        const gamesToImport = newGames.map((g: any) => ({
          title: g.name,
          executablePath: g.path,
          steamAppId: g.steamAppId
        }));

        await handleImportGames(gamesToImport);
        toast.success(`Found and added ${newGames.length} new games!`, { id: toastId });
      } else {
        toast.info("No new games found in this directory.", { id: toastId });
      }
    } catch (error) {
      console.error("Manual scan failed:", error);
      toast.error("Failed to scan directory", { id: toastId });
    }
  };

  const handleRestoreBackup = async () => {
    try {
      // Use the new load-backup IPC which opens an open dialog
      const data = await window.ipcRenderer.loadBackup();
      if (data) {
        if (data.games) setGames(data.games);
        if (data.userStats) setUserStats(data.userStats);
        if (data.points) setPoints(data.points);
        if (data.ownedThemes) setOwnedThemes(data.ownedThemes);
        if (data.unlockedFeatures) setUnlockedFeatures(data.unlockedFeatures);
        if (data.theme) setTheme(data.theme);
        if (data.accentColor) setAccentColor(data.accentColor);
        if (data.bgImage) setBgImage(data.bgImage);
        if (data.bgBlur) setBgBlur(data.bgBlur);
        if (data.bgOpacity) setBgOpacity(data.bgOpacity);
        if (data.uiScale) setUiScale(data.uiScale);
        if (data.defaultGameDir) setDefaultGameDir(data.defaultGameDir);
        if (data.autoDetectGames !== undefined) setAutoDetectGames(data.autoDetectGames);
        if (data.cloudEmail) setCloudEmail(data.cloudEmail);
        if (data.cloudSyncEnabled !== undefined) setCloudSyncEnabled(data.cloudSyncEnabled);
        if (data.autoBackup !== undefined) setAutoBackup(data.autoBackup);
        if (data.rawgApiKey) setRawgApiKey(data.rawgApiKey);

        toast.success("Backup restored successfully!");
      }
    } catch (e) {
      toast.error("Restore failed");
    }
  };


  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <Dashboard
            games={filteredGames}
            onGameClick={handleGameClick}
            onGameContextMenu={handleGameContextMenu}
            onAddGameClick={() => {
              console.log("Add Game Clicked");
              toast.info("Opening Add Game Dialog...");
              setShowAddGameDialog(true);
            }}
            onScanGameClick={() => {
              console.log("Scan Game Clicked");
              toast.info("Opening Scan Wizard...");
              setShowScanWizard(true);
            }}
            onGameTitleClick={handleGameTitleClick}
            isLoading={isLoading}
            dailyLimit={dailyLimit}
            dailyLimitEnabled={dailyLimitEnabled}
            todayPlaytime={todayPlaytime}
            mostActiveGame={mostActiveGame}
            onConfigureLimit={() => setShowLimitSettings(true)}
          />
        );
      case "continue-playing":
        return (
          <ContinuePlaying
            games={games}
            onBack={() => setActiveView("dashboard")}
            onGameClick={handleGameClick}
            onGameContextMenu={handleGameContextMenu}
          />
        );
      case "recently-played":
        return (
          <RecentlyPlayed
            games={games}
            onGameClick={handleGameClick}
            onGameContextMenu={handleGameContextMenu}
            onGameTitleClick={handleGameTitleClick}
            isLoading={isLoading}
          />
        );
      case "settings":
        return (
          <GlobalSettings
            onBack={() => setActiveView("dashboard")}
            accentColor={accentColor}
            onAccentColorChange={setAccentColor}
            onBgImageChange={setBgImage}
            bgBlur={bgBlur}
            onBgBlurChange={setBgBlur}
            bgOpacity={bgOpacity}
            onBgOpacityChange={setBgOpacity}
            unlockedFeatures={unlockedFeatures}
            setPoints={setPoints}
            ownedThemes={ownedThemes}
            bgImage={bgImage}
            uiScale={uiScale}
            onUiScaleChange={setUiScale}
            onOpenStore={() => setActiveView("store")}
            defaultGameDir={defaultGameDir}
            onDefaultGameDirChange={handleDefaultGameDirChange}
            onRescanDefaultDir={handleRescanDefaultDir}
            autoDetectGames={autoDetectGames}
            onAutoDetectGamesChange={setAutoDetectGames}
            onScanLibrary={() => setShowScanWizard(true)}
            cloudEmail={cloudEmail}
            onCloudEmailChange={setCloudEmail}
            cloudSyncEnabled={cloudSyncEnabled}
            onCloudSyncEnabledChange={setCloudSyncEnabled}
            autoBackup={autoBackup}
            onAutoBackupChange={setAutoBackup}
            onBackup={handleBackupNow}
            onRestore={handleRestoreBackup}
            gameNewsUpdates={gameNewsUpdates}
            onGameNewsUpdatesChange={setGameNewsUpdates}
            achievementNotifications={achievementNotifications}
            onAchievementNotificationsChange={setAchievementNotifications}
            launchReminders={launchReminders}
            onLaunchRemindersChange={setLaunchReminders}
            rawgApiKey={rawgApiKey}
            onRawgApiKeyChange={setRawgApiKey}
            onRefreshMetadata={handleRefreshMetadata}
          />
        );
      case "store":
        return (
          <ThemeStore
            points={points}
            ownedThemes={ownedThemes}
            unlockedFeatures={unlockedFeatures}
            onPurchaseTheme={handlePurchaseTheme}
            onPurchaseFeature={handlePurchaseFeature}
            onBack={() => setActiveView("settings")}
            currentTheme={theme}
            onEquip={setTheme}
          />
        );
      case "game-details":
        return selectedGameId ? (
          <GameDetails
            game={games.find(g => g.id === selectedGameId)!}
            onBack={() => setActiveView("dashboard")}
            onPlay={() => {
              const game = games.find(g => g.id === selectedGameId);
              if (game) handleGameClick(game);
            }}
          />
        ) : null;
      case "achievements":
        return (
          <Achievements
            userStats={userStats}
            onBack={() => setActiveView("dashboard")}
            onClaim={handleClaimAchievement}
            onClaimAll={handleClaimAllAchievements}
          />
        );
      case "favorites":
        return (
          <Favorites
            games={filteredGames.filter((g) => g.isFavorite)}
            onBack={() => setActiveView("dashboard")}
            onGameClick={handleGameClick}
            onGameContextMenu={handleGameContextMenu}
            onTitleClick={handleGameTitleClick}
          />
        );
      case "my-stack":
        return (
          <MyStack
            games={games}
            onBack={() => setActiveView("dashboard")}
            onGameClick={handleGameClick}
            onGameContextMenu={handleGameContextMenu}
            onAddCollection={handleAddCollection}
            onDeleteCollection={handleDeleteCollection}
            onUpdateCollection={handleUpdateCollection}
            collections={collections}
          />
        );
      case "messages":
        return (
          <Messages
            notifications={notifications}
            onBack={() => setActiveView("dashboard")}
            onMarkAsRead={handleMarkAsRead}
            onClearAll={handleClearNotifications}
          />
        );
      default:
        return (
          <Dashboard
            games={filteredGames}
            onGameClick={handleGameClick}
            onGameContextMenu={handleGameContextMenu}
            onAddGameClick={() => setShowAddGameDialog(true)}
            onScanGameClick={() => setShowScanWizard(true)}
            onGameTitleClick={handleGameTitleClick}
            isLoading={isLoading}
            dailyLimit={dailyLimit}
            dailyLimitEnabled={dailyLimitEnabled}
            todayPlaytime={todayPlaytime}
            onConfigureLimit={() => setShowLimitSettings(true)}
          />
        );
    }
  };

  if (showLaunchScreen) {
    return <LaunchScreen onComplete={handleLaunchComplete} />;
  }

  return (
    <div className="flex h-screen overflow-hidden text-foreground font-sans antialiased selection:bg-primary selection:text-primary-foreground relative">
      {/* Background Image Layer (for custom backgrounds) */}
      {bgImage && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: `url(${bgImage})`,
            filter: `blur(${bgBlur}px)`,
            opacity: 1 - bgOpacity
          }}
        />
      )}

      {/* Sidebar */}
      <SideNavPanel
        activeView={activeView}
        onViewChange={(view) => setActiveView(view as any)}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        recentGames={[...games]
          .sort((a, b) => {
            if (a.lastPlayed === "Just now") return -1;
            if (b.lastPlayed === "Just now") return 1;
            return 0;
          })
          .slice(0, 5)}
        onGameClick={handleGameClick}
        onGameContextMenu={handleGameContextMenu}
        onRecentlyPlayedClick={() => setActiveView("recently-played")}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <TopNavBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSettingsClick={() => setActiveView("settings")}
          onStoreClick={() => setActiveView("store")}
          points={points}
          notifications={notifications}
          onMessagesClick={() => setActiveView("messages")}
          activeView={activeView}
          onNavigate={(view) => setActiveView(view as any)}
        />

        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {renderContent()}
        </main>
      </div>

      {/* Overlays */}
      {isPlaying && currentlyPlaying && (
        <LivePlaytimeTracker
          isPlaying={true}
          currentGame={currentlyPlaying?.title || "Unknown Game"}
          onStop={handleStopPlaying}
        />
      )}



      {gameForSettings && (
        <GameSettings
          game={gameForSettings!}
          isOpen={!!gameForSettings}
          onClose={() => setGameForSettings(null)}
          onSave={(updatedGame) => {
            setGames((prev) =>
              prev.map((g) => (g.id === updatedGame.id ? updatedGame : g)),
            );
            setGameForSettings(null);
            toast.success("Game settings saved");
          }}
          onDelete={handleDeleteGame}
          onOpenLocation={handleOpenLocation}
        />
      )}

      {showAddGameDialog && (
        <AddGameDialog
          isOpen={showAddGameDialog}
          onClose={() => setShowAddGameDialog(false)}
          onAddGame={(gameData) => handleAddGame({
            ...gameData,
            id: Date.now().toString(),
            hoursPlayed: 0,
            lastPlayed: "Never",
            achievements: 0,
            totalAchievements: 0,
            isPinned: false,
            isFavorite: false,
            platform: gameData.platform || "PC",
            genre: gameData.genre || "Unknown",
            executablePath: gameData.executablePath || "",
          })}
        />
      )}

      {showScanWizard && (
        <ScanWizard
          isOpen={showScanWizard}
          onClose={() => setShowScanWizard(false)}
          onImportGames={handleImportGames}
          existingGames={games}
        />
      )}

      {showLimitSettings && (
        <DailyLimitSettings
          isOpen={showLimitSettings}
          onClose={() => setShowLimitSettings(false)}
          onSave={handleSaveDailyLimit}
          currentLimit={dailyLimit}
          isEnabled={dailyLimitEnabled}
        />
      )}

      {showGameNotes && gameForNotes && (
        <GameNotesPanel
          gameTitle={gameForNotes?.title || "Unknown Game"}
          onClose={() => setShowGameNotes(false)}
        />
      )}

      {showModsManager && gameForMods && (
        <ModsManager
          gameTitle={gameForMods?.title || "Unknown Game"}
          onClose={() => setShowModsManager(false)}
        />
      )}

      {showDevTools && (
        <DeveloperTools
          isOpen={showDevTools}
          onClose={() => setShowDevTools(false)}
          setPoints={setPoints}
          currentPoints={points}
        />
      )}

      {contextMenu.isOpen && contextMenu.game && (
        <GameContextMenu
          isOpen={contextMenu.isOpen}
          position={contextMenu.position}
          onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
          onLaunch={() => {
            if (contextMenu.game) handleGameClick(contextMenu.game);
            setContextMenu({ ...contextMenu, isOpen: false });
          }}
          onToggleFavorite={() => {
            if (contextMenu.game) handleToggleFavorite(contextMenu.game.id);
            setContextMenu({ ...contextMenu, isOpen: false });
          }}
          onTogglePin={() => {
            if (contextMenu.game) handleTogglePin(contextMenu.game.id);
            setContextMenu({ ...contextMenu, isOpen: false });
          }}
          onSettings={() => {
            if (contextMenu.game) setGameForSettings(contextMenu.game);
            setContextMenu({ ...contextMenu, isOpen: false });
          }}
          onNotes={() => {
            if (contextMenu.game) handleOpenNotes(contextMenu.game);
            setContextMenu({ ...contextMenu, isOpen: false });
          }}
          onRefreshMetadata={() => {
            if (contextMenu.game) handleRefreshGameMetadata(contextMenu.game.id);
            setContextMenu({ ...contextMenu, isOpen: false });
          }}
          onMods={() => {
            if (contextMenu.game) handleOpenMods(contextMenu.game);
            setContextMenu({ ...contextMenu, isOpen: false });
          }}
          onOpenFolder={() => {
            if (contextMenu.game && contextMenu.game.executablePath) {
              // We want to open the folder containing the executable
              // Since we don't have a direct "dirname" function here easily without node path module in renderer (unless we polyfill),
              // we can just pass the executable path to the main process and let it handle opening the item in folder.
              // The 'openPath' IPC handler uses 'shell.showItemInFolder' which does exactly this.
              window.ipcRenderer.openPath(contextMenu.game.executablePath);
              toast.success("Opening game folder...");
            } else {
              toast.error("Game path not configured");
            }
            setContextMenu({ ...contextMenu, isOpen: false });
          }}
          onDelete={() => {
            if (contextMenu.game) handleDeleteGame(contextMenu.game.id);
            setContextMenu({ ...contextMenu, isOpen: false });
          }}
          isFavorite={contextMenu.game?.isFavorite ?? false}
          isPinned={contextMenu.game?.isPinned ?? false}
        />
      )}

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        games={games}
        onNavigate={handleViewChange}
        onGameClick={(game) => {
          handleGameClick(game);
          setShowCommandPalette(false);
        }}
        onLaunchLast={handleLaunchLastPlayed}
      />

      <KeyboardShortcutsHelper
        isOpen={showShortcutsHelper}
        onClose={() => setShowShortcutsHelper(false)}
      />

      <ShortcutsButton onClick={() => setShowShortcutsHelper(true)} />

      <Toaster />
    </div>
  );
}