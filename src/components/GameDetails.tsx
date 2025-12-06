import { motion } from "motion/react";
import { ArrowLeft, Play, Clock, Trophy, Calendar, Globe, Star, Newspaper, Image as ImageIcon, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Game } from "../types";
import { getGameDetails } from "../data/mockGameDetails";
import { useState, useRef, useEffect } from "react";
import { rawgService, RawgGameDetails } from "../services/rawgService";


interface GameDetailsProps {
    game: Game;
    onBack: () => void;
    onPlay: () => void;
}

export function GameDetails({ game, onBack, onPlay }: GameDetailsProps) {
    const mockDetails = getGameDetails(game.id);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [rawgDetails, setRawgDetails] = useState<RawgGameDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const details = await rawgService.getGameDetailsByName(game.title);
                if (details) {
                    setRawgDetails(details);
                }
            } catch (error) {
                console.error("Failed to fetch RAWG details:", error);
                // toast.error("Could not fetch latest game details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [game.title]);

    // Use RAWG data if available, otherwise fallback to mock
    const displayDetails = {
        description: rawgDetails?.description_raw || game.description,
        releaseDate: rawgDetails?.released || mockDetails.releaseDate,
        developer: rawgDetails?.developers[0]?.name || mockDetails.developer,
        publisher: rawgDetails?.publishers[0]?.name || mockDetails.publisher,
        genre: rawgDetails?.genres.map(g => g.name).join(", ") || game.genre,
        metacritic: rawgDetails?.metacritic,
        website: rawgDetails?.website,
    };

    if (isLoading) {
        return (
            <div className="size-full flex items-center justify-center bg-background/95 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[var(--gaming-cyan)] border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Loading game details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="size-full overflow-y-auto bg-background/95 backdrop-blur-sm">
            {/* Hero Section */}
            <div className="relative h-[500px] w-full overflow-hidden">
                <div className="absolute inset-0">
                    {game.trailerUrl ? (
                        <video
                            ref={videoRef}
                            src={game.trailerUrl}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                        />
                    ) : (
                        <img
                            src={rawgDetails?.background_image || game.coverImage}
                            alt={game.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>

                {/* Mute Toggle for Video */}
                {game.trailerUrl && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMuted(!isMuted)}
                        className="absolute bottom-8 right-8 z-20 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md"
                    >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </Button>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-8 max-w-[1800px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-end gap-8"
                    >
                        <img
                            src={rawgDetails?.background_image || game.coverImage}
                            alt={game.title}
                            className="w-48 h-64 object-cover rounded-xl shadow-2xl border border-white/10 hidden md:block"
                        />
                        <div className="flex-1 space-y-4 mb-4">
                            <h1 className="text-5xl font-bold text-white drop-shadow-lg">{game.title}</h1>
                            <div className="flex items-center gap-6 text-gray-200">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    <span>{game.hoursPlayed.toFixed(2)}h played</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5" />
                                    <span>{game.achievements}/{game.totalAchievements} achievements</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    <span>Released: {displayDetails.releaseDate}</span>
                                </div>
                                {displayDetails.metacritic && (
                                    <div className="flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-500" />
                                        <span>Metacritic: {displayDetails.metacritic}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-4 pt-4">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        size="lg"
                                        onClick={onPlay}
                                        className="bg-gradient-to-r from-[var(--gaming-purple)] to-[var(--gaming-cyan)] text-white border-0 text-lg px-8 h-12 rounded-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all"
                                    >
                                        <Play className="w-5 h-5 mr-2 fill-current" />
                                        Play Now
                                    </Button>
                                </motion.div>
                                {displayDetails.website && (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            onClick={() => window.open(displayDetails.website, '_blank')}
                                            className="h-12 px-6 rounded-xl backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
                                        >
                                            <Globe className="w-5 h-5 mr-2" />
                                            Official Site
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="absolute top-8 left-8"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md w-10 h-10"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </motion.div>
            </div>

            <div className="max-w-[1800px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">About</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                            {displayDetails.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {displayDetails.developer && <span className="px-3 py-1 rounded-full bg-secondary">Developer: {displayDetails.developer}</span>}
                            {displayDetails.publisher && <span className="px-3 py-1 rounded-full bg-secondary">Publisher: {displayDetails.publisher}</span>}
                            {displayDetails.genre && <span className="px-3 py-1 rounded-full bg-secondary">Genre: {displayDetails.genre}</span>}
                        </div>
                    </section>

                    {/* News */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <Newspaper className="w-6 h-6 text-[var(--gaming-cyan)]" />
                            <h2 className="text-2xl font-bold">Latest News</h2>
                        </div>
                        <div className="grid gap-4">
                            {mockDetails.news.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="p-6 rounded-xl bg-card border border-border hover:border-[var(--gaming-cyan)]/50 transition-colors group cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-semibold group-hover:text-[var(--gaming-cyan)] transition-colors">
                                            {item.title}
                                        </h3>
                                        <span className="text-sm text-muted-foreground">{item.date}</span>
                                    </div>
                                    <p className="text-muted-foreground mb-3">{item.summary}</p>
                                    <div className="flex items-center gap-2 text-sm text-[var(--gaming-cyan)]">
                                        <span>Read on {item.source}</span>
                                        <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Media Gallery */}
                    {mockDetails.screenshots.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <ImageIcon className="w-6 h-6 text-[var(--gaming-purple)]" />
                                <h2 className="text-2xl font-bold">Media Gallery</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {mockDetails.screenshots.map((url, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        className="aspect-video rounded-xl overflow-hidden border border-border group relative"
                                    >
                                        <img
                                            src={url}
                                            alt={`Screenshot ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Reviews */}
                    <section className="bg-card rounded-2xl p-6 border border-border">
                        <div className="flex items-center gap-2 mb-6">
                            <Star className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-2xl font-bold">Reviews</h2>
                        </div>
                        <div className="space-y-6">
                            {mockDetails.reviews.map((review, index) => (
                                <div key={index} className="border-b border-border last:border-0 pb-6 last:pb-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold">{review.source}</span>
                                        <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 font-bold text-sm">
                                            {review.score}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic">"{review.summary}"</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* System Requirements */}
                    {(game.systemRequirements || rawgDetails?.platforms?.find(p => p.platform.name === "PC")?.requirements) && (
                        <section className="bg-card rounded-2xl p-6 border border-border">
                            <h2 className="text-xl font-bold mb-4">System Requirements (PC)</h2>
                            <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
                                <RequirementBlock
                                    title="Minimum"
                                    text={game.systemRequirements?.minimum || rawgDetails?.platforms?.find(p => p.platform.name === "PC")?.requirements?.minimum}
                                />
                                <RequirementBlock
                                    title="Recommended"
                                    text={game.systemRequirements?.recommended || rawgDetails?.platforms?.find(p => p.platform.name === "PC")?.requirements?.recommended}
                                />
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

function RequirementBlock({ title, text }: { title: string, text?: string }) {
    if (!text) return null;

    // Clean up "Minimum:" or "Recommended:" repetition at start
    const cleanText = text.replace(new RegExp(`^${title}:\\s*`, 'i'), '').trim();

    const lines = cleanText.split('\n').filter(line => line.trim());

    return (
        <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-base">{title}:</h3>
            <div className="space-y-1">
                {lines.map((line, i) => {
                    // Check for keywords to bold
                    const keywords = ['OS', 'Processor', 'Memory', 'Graphics', 'DirectX', 'Storage', 'Sound Card', 'Additional Notes', 'VR Support'];
                    const match = keywords.find(k => line.toLowerCase().startsWith(k.toLowerCase()));

                    if (match) {
                        // Split by the first colon if present, or just bold the keyword
                        const parts = line.split(':');
                        if (parts.length > 1) {
                            const label = parts[0];
                            const value = parts.slice(1).join(':');
                            return (
                                <div key={i} className="flex flex-col sm:flex-row sm:gap-2">
                                    <span className="font-bold text-foreground min-w-[100px]">{label}:</span>
                                    <span>{value}</span>
                                </div>
                            );
                        }
                    }
                    return <div key={i}>{line}</div>;
                })}
            </div>
        </div>
    );
}
