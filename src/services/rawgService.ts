const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export interface RawgGame {
    id: number;
    name: string;
    background_image: string;
    released: string;
    metacritic: number;
    rating: number;
    slug: string;
}

export interface RawgGameDetails extends RawgGame {
    description_raw: string;
    website: string;
    reddit_url: string;
    metacritic_url: string;
    developers: { name: string }[];
    publishers: { name: string }[];
    genres: { name: string }[];
    platforms: {
        platform: { name: string };
        requirements?: {
            minimum?: string;
            recommended?: string;
        };
    }[];
}

export const rawgService = {
    async searchGames(query: string): Promise<RawgGame[]> {
        if (!API_KEY) {
            console.warn("RAWG API Key is missing");
            return [];
        }
        try {
            const response = await fetch(
                `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=5`
            );
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error("Failed to search games:", error);
            return [];
        }
    },

    async getGameDetails(id: number): Promise<RawgGameDetails | null> {
        if (!API_KEY) return null;
        try {
            const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
            return await response.json();
        } catch (error) {
            console.error("Failed to get game details:", error);
            return null;
        }
    },

    async getGameDetailsByName(name: string): Promise<RawgGameDetails | null> {
        if (!API_KEY) return null;
        try {
            // First search for the game to get the ID
            const searchResults = await this.searchGames(name);
            if (searchResults.length > 0) {
                // Get details for the first result
                return await this.getGameDetails(searchResults[0].id);
            }
            return null;
        } catch (error) {
            console.error("Failed to get game details by name:", error);
            return null;
        }
    }
};
