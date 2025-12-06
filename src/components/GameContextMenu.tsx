import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Star,
  Pin,
  Settings,
  BookMarked,
  Puzzle,
  FolderOpen,
  Share2,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface GameContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onLaunch: () => void;
  onToggleFavorite: () => void;
  onTogglePin: () => void;
  onSettings: () => void;
  onNotes: () => void;
  onMods: () => void;
  onOpenFolder?: () => void;
  onDelete?: () => void;
  onRefreshMetadata?: () => void;
  isFavorite?: boolean;
  isPinned?: boolean;
}

export function GameContextMenu({
  isOpen,
  position,
  onClose,
  onLaunch,
  onToggleFavorite,
  onTogglePin,
  onSettings,
  onNotes,
  onMods,
  onOpenFolder,
  onDelete,
  onRefreshMetadata,
  isFavorite,
  isPinned,
}: GameContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<{ top?: number; left?: number; bottom?: number; right?: number }>({});

  const menuItems = [
    { icon: Play, label: "Launch Game", action: onLaunch, color: "var(--gaming-accent)" },
    {
      icon: Star,
      label: isFavorite ? "Remove from Favorites" : "Add to Favorites",
      action: onToggleFavorite,
    },
    {
      icon: Pin,
      label: isPinned ? "Unpin from Dashboard" : "Pin to Dashboard",
      action: onTogglePin,
    },
    { icon: BookMarked, label: "Game Notes & Journal", action: onNotes },
    { icon: Puzzle, label: "Manage Mods", action: onMods, disabled: true },
    { icon: Settings, label: "Game Settings", action: onSettings },
    { icon: RefreshCw, label: "Refresh Metadata", action: () => onRefreshMetadata?.() },
    { icon: FolderOpen, label: "Open Game Folder", action: () => onOpenFolder?.() },
    { icon: Share2, label: "Share", action: () => onClose() },
    { icon: Trash2, label: "Remove from Library", action: () => onDelete?.(), color: "var(--destructive)" },
  ];

  useLayoutEffect(() => {
    if (isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newStyle: { top?: number; left?: number; bottom?: number; right?: number } = {
        top: position.y,
        left: position.x,
      };

      // Check vertical overflow
      if (position.y + rect.height > viewportHeight) {
        // Open upwards
        newStyle.top = undefined;
        newStyle.bottom = viewportHeight - position.y;
      }

      // Check horizontal overflow
      if (position.x + rect.width > viewportWidth) {
        // Open to the left
        newStyle.left = undefined;
        newStyle.right = viewportWidth - position.x;
      }

      setMenuStyle(newStyle);
    }
  }, [isOpen, position]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100]"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />

      {/* Menu */}
      <AnimatePresence>
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            position: "fixed",
            zIndex: 101,
            ...menuStyle,
          }}
          className="min-w-[220px] bg-card/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="py-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={index}
                  whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  onClick={() => {
                    if (item.disabled) {
                      toast.info("This feature is coming soon!");
                      return;
                    }
                    item.action();
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  style={{ color: item.color }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{item.label} {item.disabled && "(Soon)"}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
