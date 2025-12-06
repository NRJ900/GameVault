import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Layers, Plus, Trash2, Edit3, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Card } from "./ui/card";

import { Game, GameCollection } from "../types";

interface MyStackProps {
  games: Game[];
  collections: GameCollection[];
  onBack: () => void;
  onGameClick: (game: Game) => void;
  onAddCollection: (collection: Omit<GameCollection, "id">) => void;
  onDeleteCollection: (collectionId: string) => void;
  onUpdateCollection: (collectionId: string, updates: Partial<GameCollection>) => void;
  onGameContextMenu?: (e: React.MouseEvent, game: Game) => void;
}

const collectionColors = [
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
];

export function MyStack({
  games,
  collections,
  onBack,
  onGameClick,
  onAddCollection,
  onDeleteCollection,
  onUpdateCollection,
  onGameContextMenu,
}: MyStackProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageGamesOpen, setIsManageGamesOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<GameCollection | null>(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(collectionColors[0]);
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());
  const [draggedGameId, setDraggedGameId] = useState<string | null>(null);

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      onAddCollection({
        name: newCollectionName,
        description: newCollectionDescription,
        gameIds: [],
        color: selectedColor,
      });
      setNewCollectionName("");
      setNewCollectionDescription("");
      setSelectedColor(collectionColors[0]);
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditCollection = () => {
    if (selectedCollection && newCollectionName.trim()) {
      onUpdateCollection(selectedCollection.id, {
        name: newCollectionName,
        description: newCollectionDescription,
        color: selectedColor,
      });
      setIsEditDialogOpen(false);
      setSelectedCollection(null);
    }
  };

  const openEditDialog = (collection: GameCollection) => {
    setSelectedCollection(collection);
    setNewCollectionName(collection.name);
    setNewCollectionDescription(collection.description);
    setSelectedColor(collection.color);
    setIsEditDialogOpen(true);
  };

  const openManageGamesDialog = (collection: GameCollection) => {
    setSelectedCollection(collection);
    setIsManageGamesOpen(true);
  };

  const toggleGameInCollection = (gameId: string) => {
    if (!selectedCollection) return;

    const gameIds = selectedCollection.gameIds.includes(gameId)
      ? selectedCollection.gameIds.filter((id) => id !== gameId)
      : [...selectedCollection.gameIds, gameId];

    onUpdateCollection(selectedCollection.id, { gameIds });
    setSelectedCollection({ ...selectedCollection, gameIds });
  };

  const toggleCollectionExpanded = (collectionId: string) => {
    setExpandedCollections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(collectionId)) {
        newSet.delete(collectionId);
      } else {
        newSet.add(collectionId);
      }
      return newSet;
    });
  };

  const handleDragStart = (e: React.DragEvent, gameId: string) => {
    e.dataTransfer.setData("gameId", gameId);
    setDraggedGameId(gameId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, collectionId: string) => {
    e.preventDefault();
    const gameId = e.dataTransfer.getData("gameId");
    const collection = collections.find((c) => c.id === collectionId);

    if (collection && !collection.gameIds.includes(gameId)) {
      onUpdateCollection(collectionId, {
        gameIds: [...collection.gameIds, gameId],
      });
    }
    setDraggedGameId(null);
  };

  return (
    <div className="size-full overflow-y-auto p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--gaming-purple)] to-[var(--gaming-cyan)] flex items-center justify-center">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1>My Stack</h1>
                <p className="text-muted-foreground">Drag and drop games to organize them</p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0 rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Collection
          </Button>
        </div>

        {/* Collections Grid */}
        {collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            {/* Empty State UI */}
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[var(--gaming-purple)]/20 to-[var(--gaming-cyan)]/20 border border-white/10 flex items-center justify-center mb-6">
              <Layers className="w-16 h-16 text-[var(--gaming-accent)]" />
            </div>
            <h2 className="mb-2">No Collections Yet</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Create custom collections to organize your games.
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0 rounded-xl"
            >
              Create Collection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {collections.map((collection, index) => {
              const collectionGames = games.filter((game) =>
                collection.gameIds.includes(game.id)
              );
              const isExpanded = expandedCollections.has(collection.id);

              return (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, collection.id)}
                >
                  <Card className={`p-6 bg-card/50 backdrop-blur-sm border-white/10 transition-all group ${draggedGameId && !collection.gameIds.includes(draggedGameId)
                    ? "border-[var(--gaming-accent)] ring-2 ring-[var(--gaming-accent)]/20 bg-[var(--gaming-accent)]/5"
                    : "hover:border-white/20"
                    }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${collection.color}20` }}
                        >
                          <Layers className="w-6 h-6" style={{ color: collection.color }} />
                        </div>
                        <div className="flex-1">
                          <h3>{collection.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {collectionGames.length} game{collectionGames.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(collection)}
                          className="h-8 w-8 rounded-lg hover:bg-white/10"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteCollection(collection.id)}
                          className="h-8 w-8 rounded-lg hover:bg-destructive/20 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {collection.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {collection.description}
                      </p>
                    )}

                    {/* Game Preview */}
                    {collectionGames.length > 0 ? (
                      <>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {collectionGames.slice(0, 4).map((game) => (
                            <div
                              key={game.id}
                              className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => onGameClick(game)}
                              onContextMenu={onGameContextMenu ? (e) => onGameContextMenu(e, game) : undefined}
                            >
                              <img
                                src={game.coverImage}
                                alt={game.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Expanded Game List */}
                        <AnimatePresence>
                          {isExpanded && collectionGames.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden mb-4"
                            >
                              <div className="space-y-2 pt-2 border-t border-white/10">
                                {collectionGames.map((game) => (
                                  <motion.div
                                    key={game.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                                    onClick={() => onGameClick(game)}
                                    onContextMenu={onGameContextMenu ? (e) => onGameContextMenu(e, game) : undefined}
                                  >
                                    <div className="w-12 h-16 rounded-md overflow-hidden flex-shrink-0">
                                      <img
                                        src={game.coverImage}
                                        alt={game.title}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm truncate">{game.title}</p>
                                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                        <span>{game.hoursPlayed}h played</span>
                                        <span>{game.genre}</span>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleGameInCollection(game.id);
                                      }}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <div className="p-8 rounded-xl border-2 border-dashed border-white/10 text-center mb-4">
                        <p className="text-sm text-muted-foreground">Drop games here</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => openManageGamesDialog(collection)}
                        className="flex-1 rounded-xl"
                      >
                        Manage Games
                      </Button>
                      {collectionGames.length > 0 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleCollectionExpanded(collection.id)}
                          className="rounded-xl"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Library Section */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <h2 className="text-xl font-bold mb-6">Game Library</h2>
        <p className="text-muted-foreground mb-6">Drag games from here to your collections above</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              draggable
              onDragStart={(e) => handleDragStart(e, game.id)}
              onClick={() => onGameClick(game)}
              className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-white/10 cursor-pointer active:cursor-grabbing hover:border-[var(--gaming-accent)] transition-colors group"
            >
              <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={game.coverImage}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-[var(--gaming-accent)] transition-colors">{game.title}</p>
                <p className="text-xs text-muted-foreground">{game.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Dialogs */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-white/20">
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Organize your games with a custom collection
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Collection Name</Label>
              <Input
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="e.g., Cozy Games, Competitive FPS..."
                className="mt-2"
              />
            </div>

            <div>
              <Label>Description (Optional)</Label>
              <Textarea
                value={newCollectionDescription}
                onChange={(e) => setNewCollectionDescription(e.target.value)}
                placeholder="What's this collection about?"
                className="mt-2"
                rows={3}
              />
            </div>

            <div>
              <Label className="mb-3 block">Color</Label>
              <div className="flex gap-2">
                {collectionColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full transition-all ${selectedColor === color ? "scale-110 ring-2 ring-white/50" : ""
                      }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateCollection}
              className="bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0"
            >
              Create Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-white/20">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>Update your collection details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Collection Name</Label>
              <Input
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Description (Optional)</Label>
              <Textarea
                value={newCollectionDescription}
                onChange={(e) => setNewCollectionDescription(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>

            <div>
              <Label className="mb-3 block">Color</Label>
              <div className="flex gap-2">
                {collectionColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full transition-all ${selectedColor === color ? "scale-110 ring-2 ring-white/50" : ""
                      }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditCollection}
              className="bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isManageGamesOpen} onOpenChange={setIsManageGamesOpen}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-white/20 max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Manage Games</DialogTitle>
            <DialogDescription>
              {selectedCollection?.name} - Select games to add to this collection
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {games.map((game) => {
                const isInCollection = selectedCollection?.gameIds.includes(game.id);
                return (
                  <motion.div
                    key={game.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleGameInCollection(game.id)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${isInCollection
                      ? "border-[var(--gaming-accent)] ring-2 ring-[var(--gaming-accent)]/50"
                      : "border-white/10 hover:border-white/30"
                      }`}
                  >
                    <div className="aspect-[3/4]">
                      <img
                        src={game.coverImage}
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                      {isInCollection && (
                        <div className="absolute inset-0 bg-[var(--gaming-accent)]/20 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-[var(--gaming-accent)] flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                      <p className="text-xs text-white truncate">{game.title}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setIsManageGamesOpen(false)}
              className="bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
