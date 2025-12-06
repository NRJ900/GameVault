import { motion, AnimatePresence } from "motion/react";
import { X, FolderOpen, Trash2, Edit3, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useState, useEffect } from "react";

import { Game } from "../types";

interface GameSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game;
  onSave: (game: Game) => void;
  onDelete: (id: string) => void;
  onOpenLocation: (path: string) => void;
}

export function GameSettings({
  isOpen,
  onClose,
  game,
  onSave,
  onDelete,
  onOpenLocation
}: GameSettingsProps) {
  const [title, setTitle] = useState(game.title);
  const [coverImage, setCoverImage] = useState(game.coverImage);

  useEffect(() => {
    if (isOpen) {
      setTitle(game.title);
      setCoverImage(game.coverImage);
    }
  }, [isOpen, game]);

  const handleCoverUpload = async () => {
    try {
      const path = await window.ipcRenderer.selectImage();
      if (path) {
        // Convert file path to a format the browser can display
        const fileUrl = `file://${path.replace(/\\/g, '/')}`;
        setCoverImage(fileUrl);
        toast.success("Cover image selected");
      }
    } catch (error) {
      console.error("Failed to select image:", error);
      toast.error("Failed to select image");
    }
  };

  const handleSave = () => {
    onSave({
      ...game,
      title,
      coverImage,
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to remove this game from your library?")) {
      onDelete(game.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-card/95 backdrop-blur-xl border-l border-white/20 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2>Game Settings</h2>
                <p className="text-sm text-muted-foreground mt-1">{game.title}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Game Location */}
              <div className="p-4 rounded-xl border border-white/10 space-y-4">
                <div>
                  <Label className="mb-2 block">Game Location</Label>
                  <div className="flex gap-2">
                    <Input
                      value={game.executablePath || "Not configured"}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={async () => {
                        try {
                          const path = await window.ipcRenderer.selectGameExe();
                          if (path) {
                            onSave({ ...game, executablePath: path });
                            toast.success("Game location updated");
                          }
                        } catch (e) {
                          toast.error("Failed to select executable");
                        }
                      }}
                    >
                      Browse
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--gaming-accent)]"
                    onClick={() => game.executablePath && onOpenLocation(game.executablePath)}
                    disabled={!game.executablePath}
                  >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Open File Location
                  </Button>
                </div>
              </div>

              {/* Game Details */}
              <div className="space-y-4">
                <div>
                  <Label>Game Title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label>Cover Image</Label>
                  <div className="mt-2 flex gap-4 items-start">
                    <div className="w-32 aspect-[3/4] rounded-lg overflow-hidden border border-white/10 bg-black/20 relative group">
                      <img
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handleCoverUpload}>
                        <Edit3 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Recommended size: 600x900px. Supports JPG, PNG, WEBP.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCoverUpload}>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload New
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-red-500 font-medium mb-4">Danger Zone</h3>
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-200">Remove from Library</h4>
                    <p className="text-sm text-red-200/60">
                      This will remove the game from your library but keep files on disk.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Game
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-card/50">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[var(--gaming-accent)] hover:bg-[var(--gaming-accent)]/80 text-white"
              >
                Save Changes
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
