import type {
    SpotifyUser,
    SpotifyTrack,
    SpotifyCurrentlyPlaying,
} from '@/types/spotify'

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify`
  : '/api/spotify';

export class SpotifyService {
    private static async fetchJson<T>(path: string): Promise<T> {
        const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
        // Spotify API may return 204 for no content
        if (res.status === 204) return null as T;
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return (await res.json()) as T;
    }
    /** Fetch current user's profile */
    static async getUser(): Promise<SpotifyUser> {
        return this.fetchJson('/me');
    }
    /** Fetch top tracks for the current user */
    static async getTopTracks(): Promise<SpotifyTrack[]> {
        const res = await this.fetchJson<{ items: SpotifyTrack[] }>('/me/top-tracks');
        return res.items ?? [];
    }
    /** Fetch user's currently playing track */
    static async getCurrentlyPlaying(): Promise<SpotifyCurrentlyPlaying | null> {
        return this.fetchJson<SpotifyCurrentlyPlaying>('/me/player/currently-playing')
    }
}