import { useState } from "react";

import { Upload, FolderOpen, Image as ImageIcon, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner";



interface AddGameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (game: {
    title: string;
    coverImage: string;
    description: string;
    genre: string;
    platform: string;
    executablePath?: string;
  }) => void;
}

const genres = [
  "RPG",
  "Action",
  "Adventure",
  "Strategy",
  "Shooter",
  "Racing",
  "Sports",
  "Simulation",
  "Puzzle",
  "Horror",
  "Fighting",
  "Platformer",
];

const platforms = [
  "PC",
  "Steam",
  "Epic Games",
  "GOG",
  "Xbox",
  "PlayStation",
  "Origin",
  "Ubisoft Connect",
  "Battle.net",
];

export function AddGameDialog({ isOpen, onClose, onAddGame }: AddGameDialogProps) {
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [executablePath, setExecutablePath] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Please enter a game title");
      return;
    }

    if (!genre) {
      toast.error("Please select a genre");
      return;
    }

    if (!platform) {
      toast.error("Please select a platform");
      return;
    }

    onAddGame({
      title: title.trim(),
      coverImage: coverImage || "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1080",
      description: description.trim() || "No description provided.",
      genre,
      platform,
      executablePath: executablePath.trim(),
    });

    // Reset form
    setTitle("");
    setCoverImage("");
    setDescription("");
    setGenre("");
    setPlatform("");
    setExecutablePath("");

    onClose();
  };

  const handleBrowseExecutable = async () => {
    try {
      const path = await window.ipcRenderer.selectGameExe();
      if (path) {
        setExecutablePath(path);
        toast.success("Executable selected!");
      }
    } catch (error) {
      console.error("Failed to select executable:", error);
      toast.error("Failed to select executable");
    }
  };

  const handleUploadCover = async () => {
    try {
      const path = await window.ipcRenderer.selectImage();
      if (path) {
        // Convert file path to a format the browser can display (file:// protocol is often blocked)
        // For now, we'll use the raw path, but in production, this might need a custom protocol or base64 conversion.
        // However, Electron can often display local files if webSecurity is configured or if using a custom protocol.
        // Let's assume the renderer can handle local paths or we need to convert to a file URL.
        const fileUrl = `file://${path.replace(/\\/g, '/')}`;
        setCoverImage(fileUrl);
        toast.success("Cover image selected!");
      }
    } catch (error) {
      console.error("Failed to select image:", error);
      toast.error("Failed to select image");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-white/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)] flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            Add Game to Library
          </DialogTitle>
          <DialogDescription>
            Manually add a game to your library. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Game Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Game Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Elden Ring"
              className=""
            />
          </div>

          {/* Genre & Platform Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre">Genre *</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform *</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/cover.jpg"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleUploadCover}
                className="px-3"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Leave empty to use default cover image
            </p>
          </div>

          {/* Executable Path */}
          <div className="space-y-2">
            <Label htmlFor="executablePath">Game Executable Path (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="executablePath"
                value={executablePath}
                onChange={(e) => setExecutablePath(e.target.value)}
                placeholder="C:\Games\MyGame\game.exe"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleBrowseExecutable}
                className="px-3"
              >
                <FolderOpen className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description of the game..."
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0"
          >
            <Save className="w-4 h-4 mr-2" />
            Add Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
