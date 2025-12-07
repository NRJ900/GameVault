export interface RawgGameDetails {
    id: number;
    name: string;
    description_raw: string;
    released: string;
    background_image: string;
    website: string;
    rating: number;
    metacritic: number;
    genres: { name: string }[];
    developers: { name: string }[];
    publishers: { name: string }[];
    platforms: {
        platform: { name: string };
        requirements?: { minimum?: string; recommended?: string };
    }[];
}

class RawgService {
    private apiKey: string = "";
    private baseUrl = "https://api.rawg.io/api";

    setApiKey(key: string) {
        this.apiKey = key;
    }

    async getGameDetailsByName(name: string): Promise<RawgGameDetails | null> {
        if (!this.apiKey) {
            console.warn("RAWG API Key not set");
            return null;
        }

        try {
            // First search for the game to get ID
            const searchUrl = `${this.baseUrl}/games?key=${this.apiKey}&search=${encodeURIComponent(name)}&page_size=1`;
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();

            if (!searchData.results || searchData.results.length === 0) {
                return null;
            }

            const gameId = searchData.results[0].id;

            // Then fetch full details
            const detailsUrl = `${this.baseUrl}/games/${gameId}?key=${this.apiKey}`;
            const detailsResponse = await fetch(detailsUrl);
            const detailsData = await detailsResponse.json();

            return detailsData as RawgGameDetails;
        } catch (error) {
            console.error("Error fetching RAWG details:", error);
            return null;
        }
    }

    async searchGames(query: string): Promise<{ id: number; name: string }[]> {
        if (!this.apiKey) return [];
        try {
            const searchUrl = `${this.baseUrl}/games?key=${this.apiKey}&search=${encodeURIComponent(query)}&page_size=5`;
            const response = await fetch(searchUrl);
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error("Error searching RAWG:", error);
            return [];
        }
    }

    async getGameDetails(id: string | number): Promise<RawgGameDetails | null> {
        if (!this.apiKey) return null;
        try {
            const url = `${this.baseUrl}/games/${id}?key=${this.apiKey}`;
            const response = await fetch(url);
            return await response.json() as RawgGameDetails;
        } catch (error) {
            console.error("Error fetching RAWG details:", error);
            return null;
        }
    }
    async getSuggestedGames(id: string | number): Promise<RawgGameDetails[]> {
        if (!this.apiKey) return [];
        try {
            const url = `${this.baseUrl}/games/${id}/suggested?key=${this.apiKey}&page_size=3`;
            const response = await fetch(url);
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error("Error fetching suggested games:", error);
            return [];
        }
    }
    async getGamesByGenre(genreSlug: string): Promise<RawgGameDetails[]> {
        if (!this.apiKey) return [];
        try {
            const url = `${this.baseUrl}/games?key=${this.apiKey}&genres=${genreSlug}&ordering=-rating&page_size=5`;
            const response = await fetch(url);
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error("Error fetching games by genre:", error);
            return [];
        }
    }

    async getGameStores(gameId: number): Promise<{ url: string; store_id: number }[]> {
        if (!this.apiKey) return [];
        try {
            const url = `${this.baseUrl}/games/${gameId}/stores?key=${this.apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error("Error fetching game stores:", error);
            return [];
        }
    }
}

export const rawgService = new RawgService();
