import { Skeleton } from "./ui/skeleton";

export function SkeletonGameListItem() {
    return (
        <div className="flex items-center gap-4 p-3 rounded-xl bg-card/50 border border-border">
            <Skeleton className="w-16 h-20 rounded-lg flex-shrink-0" />
            <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex gap-2">
                        <Skeleton className="h-4 w-16 rounded-full" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                </div>
                <div className="col-span-3">
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="col-span-3">
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="col-span-2 space-y-2">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-1.5 w-full" />
                </div>
            </div>
        </div>
    );
}
