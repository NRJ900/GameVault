export interface NewsItem {
    id: string;
    title: string;
    date: string;
    source: string;
    summary: string;
    url: string;
}

export interface Review {
    source: string;
    score: string;
    summary: string;
    url: string;
}

export interface GameDetailData {
    id: string;
    news: NewsItem[];
    reviews: Review[];
    screenshots: string[];
    developer: string;
    publisher: string;
    releaseDate: string;
}

export const mockGameDetails: Record<string, GameDetailData> = {
    "1": { // Elden Ring
        id: "1",
        developer: "FromSoftware",
        publisher: "Bandai Namco",
        releaseDate: "Feb 25, 2022",
        news: [
            {
                id: "n1",
                title: "Shadow of the Erdtree DLC Announced",
                date: "2 days ago",
                source: "IGN",
                summary: "FromSoftware has officially unveiled the first major expansion for Elden Ring, featuring a new map, weapons, and bosses.",
                url: "#"
            },
            {
                id: "n2",
                title: "Patch 1.10 Notes: PvP Balance Adjustments",
                date: "1 week ago",
                source: "Official Site",
                summary: "New update brings significant changes to poise damage and critical hit interactions in PvP.",
                url: "#"
            },
            {
                id: "n3",
                title: "Elden Ring Wins Game of the Year",
                date: "1 month ago",
                source: "The Game Awards",
                summary: "The masterpiece by Hidetaka Miyazaki takes home the top prize at the annual awards ceremony.",
                url: "#"
            }
        ],
        reviews: [
            {
                source: "IGN",
                score: "10/10",
                summary: "A masterpiece of open-world design that places FromSoftware's best combat in a sprawling, mysterious land.",
                url: "#"
            },
            {
                source: "PC Gamer",
                score: "90/100",
                summary: "Elden Ring is a massive, challenging, and beautiful journey that redefines what an open-world RPG can be.",
                url: "#"
            },
            {
                source: "GameSpot",
                score: "10/10",
                summary: "Elden Ring is a triumph of game design, offering a world that is as hostile as it is inviting.",
                url: "#"
            }
        ],
        screenshots: [
            "https://images.igdb.com/igdb/image/upload/t_1080p/sc971g.jpg", // Limgrave
            "https://images.igdb.com/igdb/image/upload/t_1080p/sc971h.jpg", // Combat
            "https://images.igdb.com/igdb/image/upload/t_1080p/sc971i.jpg", // Boss
            "https://images.igdb.com/igdb/image/upload/t_1080p/sc971j.jpg"  // Landscape
        ]
    },
    "2": { // Cyberpunk 2077
        id: "2",
        developer: "CD Projekt Red",
        publisher: "CD Projekt",
        releaseDate: "Dec 10, 2020",
        news: [
            {
                id: "n1",
                title: "Phantom Liberty Expansion Out Now",
                date: "Yesterday",
                source: "Kotaku",
                summary: "Idris Elba joins the cast in this spy-thriller expansion that overhauls the game's skill trees.",
                url: "#"
            }
        ],
        reviews: [
            {
                source: "IGN",
                score: "9/10",
                summary: "Phantom Liberty completes Cyberpunk 2077's redemption arc with a fantastic story and gameplay overhaul.",
                url: "#"
            }
        ],
        screenshots: [
            "https://images.igdb.com/igdb/image/upload/t_1080p/sc867g.jpg",
            "https://images.igdb.com/igdb/image/upload/t_1080p/sc867h.jpg"
        ]
    }
};

// Helper to get details or generic fallback
export const getGameDetails = (gameId: string): GameDetailData => {
    return mockGameDetails[gameId] || {
        id: gameId,
        developer: "Unknown Developer",
        publisher: "Unknown Publisher",
        releaseDate: "Unknown",
        news: [
            {
                id: "default-1",
                title: "Community Update",
                date: "Recently",
                source: "Community Hub",
                summary: "Check out the latest community creations and discussions for this title.",
                url: "#"
            }
        ],
        reviews: [
            {
                source: "Metacritic",
                score: "TBD",
                summary: "No reviews available for this title yet.",
                url: "#"
            }
        ],
        screenshots: []
    };
};
