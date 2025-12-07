import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, HardDrive, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface DeveloperToolsProps {
    isOpen: boolean;
    onClose: () => void;
    setPoints: (points: number) => void;
    currentPoints: number;
}

export function DeveloperTools({ isOpen, onClose, setPoints, currentPoints }: DeveloperToolsProps) {
    const [customPoints, setCustomPoints] = useState("");

    const handleSetPoints = (amount: number) => {
        setPoints(amount);
        toast.success(`Points set to ${amount}`);
    };

    const handleAddPoints = () => {
        const amount = parseInt(customPoints);
        if (!isNaN(amount)) {
            setPoints(currentPoints + amount);
            toast.success(`Added ${amount} points`);
            setCustomPoints("");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-md bg-card border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-red-500/20 bg-red-500/10">
                            <div className="flex items-center gap-2 text-red-400">
                                <HardDrive className="w-5 h-5" />
                                <h2 className="font-bold">Developer Tools</h2>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-red-500/20 text-red-400">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">

                            {/* Points Management */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Economy</h3>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        className="border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                                        onClick={() => handleSetPoints(5000)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Set 5000
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                                        onClick={() => handleSetPoints(0)}
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Reset to 0
                                    </Button>
                                </div>

                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Custom amount..."
                                        value={customPoints}
                                        onChange={(e) => setCustomPoints(e.target.value)}
                                        className="bg-black/50 text-white border-red-500/20 focus-visible:ring-red-500/50 placeholder:text-white/50"
                                    />
                                    <Button
                                        variant="secondary"
                                        onClick={handleAddPoints}
                                        disabled={!customPoints}
                                    >
                                        Add
                                    </Button>
                                </div>

                                <p className="text-xs text-muted-foreground text-center">
                                    Current Balance: <span className="text-foreground font-mono">{currentPoints}</span>
                                </p>
                            </div>

                            {/* Other Essentials (Placeholder for now) */}
                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">System</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    <Button
                                        variant="ghost"
                                        className="justify-start text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                                        onClick={() => {
                                            localStorage.clear();
                                            window.location.reload();
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Clear Local Storage & Reload
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
