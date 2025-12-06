import { useEffect } from "react";

interface ShortcutHandler {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  handler: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutHandler[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrlKey ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatches = shortcut.shiftKey ? e.shiftKey : !e.shiftKey;
        const metaMatches = shortcut.metaKey ? e.metaKey : true;

        if (keyMatches && ctrlMatches && shiftMatches && metaMatches) {
          e.preventDefault();
          shortcut.handler();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, enabled]);
}

export const KEYBOARD_SHORTCUTS: ShortcutHandler[] = [
  {
    key: "1",
    ctrlKey: true,
    handler: () => { },
    description: "Dashboard",
  },
  {
    key: "2",
    ctrlKey: true,
    handler: () => { },
    description: "My Stack",
  },
  {
    key: "3",
    ctrlKey: true,
    handler: () => { },
    description: "Most Played",
  },
  {
    key: "4",
    ctrlKey: true,
    handler: () => { },
    description: "Favorites",
  },
  {
    key: "5",
    ctrlKey: true,
    handler: () => { },
    description: "Continue Playing",
  },
  {
    key: "f",
    ctrlKey: true,
    handler: () => { },
    description: "Focus Search",
  },
  {
    key: "l",
    ctrlKey: true,
    handler: () => { },
    description: "Launch Last Played",
  },
  {
    key: "k",
    ctrlKey: true,
    handler: () => { },
    description: "Command Palette",
  },
  {
    key: "Escape",
    handler: () => { },
    description: "Close/Go Back",
  },
];
