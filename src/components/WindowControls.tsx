import { Minus, Square, X } from "lucide-react";
import { Button } from "./ui/button";

export function WindowControls() {
    const handleMinimize = () => {
        window.ipcRenderer.minimize();
    };

    const handleMaximize = () => {
        window.ipcRenderer.maximize();
    };

    const handleClose = () => {
        window.ipcRenderer.close();
    };

    return (
        <div className="flex items-center gap-1 ml-4" style={{ WebkitAppRegion: "no-drag" } as any}>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleMinimize}
                className="h-8 w-8 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground"
            >
                <Minus className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleMaximize}
                className="h-8 w-8 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground"
            >
                <Square className="h-3 w-3" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 rounded-lg hover:bg-red-500/20 hover:text-red-500 text-muted-foreground transition-colors"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}
