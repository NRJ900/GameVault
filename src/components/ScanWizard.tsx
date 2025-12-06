import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Loader2, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ScanWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onImportGames: (games: { title: string; executablePath: string; steamAppId?: string }[]) => void;
    existingGames: { executablePath?: string }[];
}

interface FoundGame {
    name: string;
    path: string;
    steamAppId?: string;
}

export function ScanWizard({ isOpen, onClose, onImportGames, existingGames }: ScanWizardProps) {
    const [step, setStep] = useState<"start" | "scanning" | "results">("start");
    const [foundGames, setFoundGames] = useState<FoundGame[]>([]);
    const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set());

    const handleScan = async () => {
        setStep("scanning");
        try {
            const games = await window.ipcRenderer.scanGames();

            // Filter out games that are already in the library
            const newGames = games.filter(scannedGame =>
                !existingGames.some(existing =>
                    existing.executablePath?.toLowerCase() === scannedGame.path.toLowerCase()
                )
            );

            setFoundGames(newGames);
            // Select all by default
            setSelectedGames(new Set(newGames.map((g) => g.path)));
            setStep("results");
        } catch (error: any) {
            console.error("Scan failed:", error);
            toast.error(`Failed to scan for games: ${error.message || "Unknown error"}`);
            setStep("start");
        }
    };

    const handleImport = () => {
        const gamesToImport = foundGames
            .filter((g) => selectedGames.has(g.path))
            .map((g) => ({
                title: g.name,
                executablePath: g.path,
                steamAppId: g.steamAppId
            }));

        onImportGames(gamesToImport);
        onClose();
        setStep("start");
        setFoundGames([]);
    };

    const toggleGame = (path: string) => {
        const newSelected = new Set(selectedGames);
        if (newSelected.has(path)) {
            newSelected.delete(path);
        } else {
            newSelected.add(path);
        }
        setSelectedGames(newSelected);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-card/95 backdrop-blur-xl border-white/20 max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 pb-4 shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-[var(--gaming-cyan)]" />
                        Scan Library
                    </DialogTitle>
                    <DialogDescription>
                        Automatically find games installed on your computer.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 flex flex-col min-h-0 overflow-hidden px-6">
                    {step === "start" && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                            <div className="w-16 h-16 rounded-full bg-[var(--gaming-cyan)]/10 flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-[var(--gaming-cyan)]" />
                            </div>
                            <h3 className="text-xl font-semibold">Ready to Scan?</h3>
                            <p className="text-muted-foreground max-w-md">
                                We will scan common game directories (Steam, Epic Games, etc.) for installed games. This might take a few seconds.
                            </p>
                        </div>
                    )}

                    {step === "scanning" && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                            <Loader2 className="w-12 h-12 text-[var(--gaming-cyan)] animate-spin" />
                            <h3 className="text-xl font-semibold">Scanning...</h3>
                            <p className="text-muted-foreground">Looking for games on your system...</p>
                        </div>
                    )}

                    {step === "results" && (
                        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                            <div className="flex items-center justify-between mb-4 shrink-0">
                                <h3 className="font-semibold">Found {foundGames.length} Games</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        if (selectedGames.size === foundGames.length) {
                                            setSelectedGames(new Set());
                                        } else {
                                            setSelectedGames(new Set(foundGames.map((g) => g.path)));
                                        }
                                    }}
                                >
                                    {selectedGames.size === foundGames.length ? "Deselect All" : "Select All"}
                                </Button>
                            </div>

                            {foundGames.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground min-h-[200px]">
                                    <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                                    <p>No games found in common directories.</p>
                                    <p className="text-sm">Try adding games manually.</p>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto min-h-0 border rounded-md bg-black/20 pr-2 custom-scrollbar">
                                    <div className="p-4 space-y-2">
                                        {foundGames.map((game) => (
                                            <div
                                                key={game.path}
                                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group cursor-pointer"
                                                onClick={() => toggleGame(game.path)}
                                            >
                                                <Checkbox
                                                    id={game.path}
                                                    checked={selectedGames.has(game.path)}
                                                    onCheckedChange={() => toggleGame(game.path)}
                                                    className="border-white/30 data-[state=checked]:bg-[var(--gaming-cyan)] data-[state=checked]:border-[var(--gaming-cyan)]"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-base group-hover:text-[var(--gaming-cyan)] transition-colors">
                                                        {game.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground truncate font-mono opacity-70">
                                                        {game.path}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 pt-4 shrink-0">
                    {step === "start" && (
                        <>
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleScan}
                                className="bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0"
                            >
                                Start Scan
                            </Button>
                        </>
                    )}

                    {step === "results" && (
                        <>
                            <Button variant="outline" onClick={() => setStep("start")}>
                                Back
                            </Button>
                            <Button
                                onClick={handleImport}
                                disabled={selectedGames.size === 0}
                                className="bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0"
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Import {selectedGames.size} Games
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
