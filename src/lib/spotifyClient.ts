import type {
    SpotifyUser,
    SpotifyTrack
} from '@/types/spotify'

export class SpotifyService {
    private static async fetchJson<T>(url: string): Promise<T> {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return (await res.json()) as T;
    }

    static async getUser(): Promise<SpotifyUser> {
        return this.fetchJson('/api/spotify/me');
    }

    static async getTopTracks(): Promise<SpotifyTrack[]> {
        const res = await this.fetchJson<{ items: SpotifyTrack[] }>('/api/spotify/me/top-tracks');
        return res.items ?? [];
    }
}