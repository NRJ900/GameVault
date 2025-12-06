import { Skeleton } from "./ui/skeleton";

export function SkeletonGameTile() {
    return (
        <div className="rounded-2xl overflow-hidden bg-card/50 border border-white/10 shadow-lg">
            <div className="aspect-[3/4] relative">
                <Skeleton className="h-full w-full" />
            </div>
            <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
        </div>
    );
}
