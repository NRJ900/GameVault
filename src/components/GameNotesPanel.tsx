import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BookMarked, Image, Save, X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";



interface GameNotesPanelProps {
  gameTitle: string;
  onClose: () => void;
  initialNotes?: string;
}

export function GameNotesPanel({
  gameTitle,
  onClose,
  initialNotes = "",
}: GameNotesPanelProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [screenshots, setScreenshots] = useState<string[]>([]);

  useEffect(() => {
    const loadScreenshots = async () => {
      const shots = await window.ipcRenderer.getGameScreenshots(gameTitle);
      setScreenshots(shots);
    };
    loadScreenshots();
  }, [gameTitle]);

  const handleSave = () => {
    toast.success("Notes saved!");
    onClose();
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
        className="w-full max-w-2xl max-h-[80vh] bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <BookMarked className="w-5 h-5 text-[var(--gaming-accent)]" />
            <div>
              <h2 className="text-lg">Game Notes & Journal</h2>
              <p className="text-sm text-muted-foreground">{gameTitle}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            </TabsList>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your game notes, strategies, or memorable moments here..."
                className="min-h-[300px] resize-none"
              />
              <div className="text-xs text-muted-foreground">
                Last saved: Just now
              </div>
            </TabsContent>

            {/* Screenshots Tab */}
            <TabsContent value="screenshots" className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs"
                  onClick={() => {
                    if (screenshots.length > 0) {
                      // Open folder of the first screenshot
                      window.ipcRenderer.invoke('open-screenshots-folder', gameTitle);
                    } else {
                      window.ipcRenderer.invoke('open-screenshots-folder', gameTitle);
                    }
                  }}
                >
                  <Image className="w-4 h-4" />
                  Browse Folder
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {screenshots.length > 0 ? (
                  screenshots.map((screenshot, index) => (
                    <div
                      key={index}
                      className="aspect-video rounded-lg overflow-hidden bg-white/5 group relative"
                    >
                      <img
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onClick={() => window.ipcRenderer.openPath(screenshot.replace('media://', ''))}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <p className="text-xs text-white font-medium">Click to Open</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Image className="w-12 h-12 mb-3 opacity-50" />
                    <p>No screenshots yet</p>
                    <p className="text-sm">Press F12 in-game to capture</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Notes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
