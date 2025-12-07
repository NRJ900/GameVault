import { ArrowDownAZ, ArrowUpAZ, Clock, Calendar, ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { Button } from "./ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

export type SortOption = "name" | "playtime" | "lastPlayed";
export type SortDirection = "asc" | "desc";

interface SortControlProps {
    sortBy: SortOption;
    sortDirection: SortDirection;
    onSortChange: (value: SortOption) => void;
    onDirectionChange: () => void;
}

export function SortControl({
    sortBy,
    sortDirection,
    onSortChange,
    onDirectionChange,
}: SortControlProps) {
    return (
        <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
                <SelectTrigger className="w-[160px] bg-card/50 border-white/10">
                    <div className="flex items-center gap-2">
                        {sortBy === "name" && <ArrowDownAZ className="w-4 h-4" />}
                        {sortBy === "playtime" && <Clock className="w-4 h-4" />}
                        {sortBy === "lastPlayed" && <Calendar className="w-4 h-4" />}
                        <SelectValue placeholder="Sort by" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="playtime">Playtime</SelectItem>
                    <SelectItem value="lastPlayed">Last Played</SelectItem>
                </SelectContent>
            </Select>

            <Button
                variant="outline"
                size="icon"
                onClick={onDirectionChange}
                className="bg-card/50 border-white/10"
                title={sortDirection === "asc" ? "Ascending" : "Descending"}
            >
                {sortDirection === "asc" ? (
                    <ArrowUpWideNarrow className="w-4 h-4" />
                ) : (
                    <ArrowDownWideNarrow className="w-4 h-4" />
                )}
            </Button>
        </div>
    );
}
