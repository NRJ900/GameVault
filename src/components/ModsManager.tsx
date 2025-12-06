import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Puzzle, Download, Trash2, CheckCircle, AlertCircle, Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { toast } from "sonner";

interface Mod {
  id: string;
  name: string;
  author: string;
  version: string;
  size: string;
  downloads: number;
  rating: number;
  compatible: boolean;
  enabled: boolean;
  installed: boolean;
}

interface ModsManagerProps {
  gameTitle: string;
  onClose: () => void;
}

const mockMods: Mod[] = [
  {
    id: "1",
    name: "HD Texture Pack",
    author: "ModMaster99",
    version: "2.1.0",
    size: "4.5 GB",
    downloads: 125000,
    rating: 4.8,
    compatible: true,
    enabled: true,
    installed: true,
  },
  {
    id: "2",
    name: "Ultimate UI Overhaul",
    author: "DesignPro",
    version: "1.5.2",
    size: "120 MB",
    downloads: 89000,
    rating: 4.6,
    compatible: true,
    enabled: false,
    installed: true,
  },
  {
    id: "3",
    name: "Performance Boost",
    author: "OptimizeGuru",
    version: "3.0.1",
    size: "25 MB",
    downloads: 250000,
    rating: 4.9,
    compatible: true,
    enabled: true,
    installed: true,
  },
  {
    id: "4",
    name: "Extra Content DLC",
    author: "CommunityTeam",
    version: "1.0.0",
    size: "1.2 GB",
    downloads: 45000,
    rating: 4.3,
    compatible: true,
    enabled: false,
    installed: false,
  },
  {
    id: "5",
    name: "Legacy Graphics Mod",
    author: "RetroGamer",
    version: "0.9.5",
    size: "890 MB",
    downloads: 15000,
    rating: 3.8,
    compatible: false,
    enabled: false,
    installed: false,
  },
];

export function ModsManager({ gameTitle, onClose }: ModsManagerProps) {
  const [mods, setMods] = useState<Mod[]>(mockMods);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "installed" | "available">("all");

  const filteredMods = mods.filter((mod) => {
    const matchesSearch = mod.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "installed" && mod.installed) ||
      (filter === "available" && !mod.installed);
    return matchesSearch && matchesFilter;
  });

  const toggleMod = (modId: string) => {
    setMods(
      mods.map((mod) =>
        mod.id === modId ? { ...mod, enabled: !mod.enabled } : mod
      )
    );
    const mod = mods.find((m) => m.id === modId);
    toast.success(mod?.enabled ? "Mod disabled" : "Mod enabled");
  };

  const installMod = (modId: string) => {
    setMods(
      mods.map((mod) =>
        mod.id === modId ? { ...mod, installed: true, enabled: true } : mod
      )
    );
    toast.success("Mod installed successfully!");
  };

  const uninstallMod = (modId: string) => {
    setMods(
      mods.map((mod) =>
        mod.id === modId ? { ...mod, installed: false, enabled: false } : mod
      )
    );
    toast.success("Mod uninstalled");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[85vh] bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Puzzle className="w-5 h-5 text-[var(--gaming-accent)]" />
            <div>
              <h2 className="text-lg">Mods Manager</h2>
              <p className="text-sm text-muted-foreground">{gameTitle}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="p-6 border-b border-white/10 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mods..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {["all", "installed", "available"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f as typeof filter)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Mods List */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-280px)] space-y-3">
          <AnimatePresence>
            {filteredMods.map((mod) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="truncate">{mod.name}</h3>
                      {mod.installed && (
                        <Badge variant="outline" className="text-xs">
                          Installed
                        </Badge>
                      )}
                      {!mod.compatible && (
                        <Badge variant="destructive" className="text-xs">
                          Incompatible
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span>by {mod.author}</span>
                      <span>v{mod.version}</span>
                      <span>{mod.size}</span>
                      <span>★ {mod.rating}</span>
                      <span>{mod.downloads.toLocaleString()} downloads</span>
                    </div>

                    {mod.installed && mod.compatible && (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={mod.enabled}
                          onCheckedChange={() => toggleMod(mod.id)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {mod.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {mod.compatible && (
                      <CheckCircle className="w-4 h-4 text-[var(--gaming-green)]" />
                    )}
                    {!mod.compatible && (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}

                    {mod.installed ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => uninstallMod(mod.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Uninstall
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => installMod(mod.id)}
                        disabled={!mod.compatible}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Install
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredMods.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Puzzle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No mods found</p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between p-6 border-t border-white/10 text-sm text-muted-foreground">
          <span>{mods.filter((m) => m.installed).length} mods installed</span>
          <span>{mods.filter((m) => m.enabled).length} mods enabled</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
