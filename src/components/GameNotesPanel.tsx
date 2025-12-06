import { useState } from "react";
import { motion } from "motion/react";
import { BookMarked, CheckSquare, Image, Save, X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";



interface Achievement {
  name: string;
  completed: boolean;
}

interface GameNotesPanelProps {
  gameTitle: string;
  onClose: () => void;
  initialNotes?: string;
  achievements?: Achievement[];
  screenshots?: string[];
}

export function GameNotesPanel({
  gameTitle,
  onClose,
  initialNotes = "",
  achievements = [],
  screenshots = [],
}: GameNotesPanelProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [checklist, setChecklist] = useState<Achievement[]>(achievements);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  const handleSave = () => {
    toast.success("Notes saved!");
    onClose();
  };

  const toggleChecklistItem = (index: number) => {
    setChecklist(
      checklist.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    setChecklist([...checklist, { name: newChecklistItem, completed: false }]);
    setNewChecklistItem("");
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
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

            {/* Checklist Tab */}
            <TabsContent value="checklist" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Add achievement or task..."
                  onKeyPress={(e) => e.key === "Enter" && addChecklistItem()}
                />
                <Button onClick={addChecklistItem}>Add</Button>
              </div>

              <div className="space-y-2">
                {checklist.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <button
                      onClick={() => toggleChecklistItem(index)}
                      className="flex-shrink-0"
                    >
                      <CheckSquare
                        className={`w-5 h-5 ${item.completed
                          ? "text-[var(--gaming-green)] fill-[var(--gaming-green)]/20"
                          : "text-muted-foreground"
                          }`}
                      />
                    </button>
                    <span
                      className={`flex-1 ${item.completed
                        ? "line-through text-muted-foreground"
                        : ""
                        }`}
                    >
                      {item.name}
                    </span>
                  </motion.div>
                ))}

                {checklist.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No checklist items yet. Add your first task above!
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Screenshots Tab */}
            <TabsContent value="screenshots" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {screenshots.length > 0 ? (
                  screenshots.map((screenshot, index) => (
                    <div
                      key={index}
                      className="aspect-video rounded-lg overflow-hidden bg-white/5"
                    >
                      <img
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
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
