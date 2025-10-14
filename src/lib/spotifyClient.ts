import type {
    SpotifyUser,
    SpotifyTrack,
    SpotifyCurrentlyPlaying,
} from '@/types/spotify'

type TimeRange = "long_term" | "medium_term" | "short_term";
export interface TopItemsOptions {
    limit?: number;          // 1..50 (default 20)
    offset?: number;         // >= 0 (default 0)
    time_range?: TimeRange;  // default "medium_term"
}

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify`
  : '/api/spotify';

export class SpotifyService {
    /* ----------------------------- private utils ---------------------------- */

    private static async fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
        const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store', ...init });
        if (res.status === 204) return null as T;

        if (!res.ok) {
            let detail: unknown = undefined;
            try { detail = await res.json(); } catch { /* ignore */ }
            const message =
                (detail as any)?.error ??
                (detail as any)?.message ??
                `Fetch failed: ${res.status}`;
            throw new Error(message);
        }
        return (await res.json()) as T;
    }

    private static qs (params: Record<string, string | number | undefined>) {
        const sp = new URLSearchParams();
        for (const [k, v] of Object.entries(params)) {
            if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
        }
        const s = sp.toString();
        return s ? `?${s}` : "";
    }

    private static validateTopOptions(opts?: TopItemsOptions): Required<TopItemsOptions> {
        const out: Required<TopItemsOptions> = {
            limit: 20,
            offset: 0,
            time_range: "medium_term",
        };
        if (!opts) return out;

        if (opts.limit !== undefined) {
            const n = Math.trunc(Number(opts.limit));
            if (!Number.isFinite(n) || n < 1 || n > 50) {
                throw new Error(`Invalid "limit": must be an integer between 1 and 50.`);
            }
            out.limit = n;
        }
        if (opts.offset !== undefined) {
            const n = Math.trunc(Number(opts.offset));
            if (!Number.isFinite(n) || n < 0) {
                throw new Error(`Invalid "offset": must be an integer >= 0.`);
            }
            out.offset = n;
        }
        if (opts.time_range !== undefined) {
            const allowed: TimeRange[] = ["long_term", "medium_term", "short_term"];
            if (!allowed.includes(opts.time_range)) {
                throw new Error(
                    `Invalid "time_range": allowed "long_term" | "medium_term" | "short_term".`
                );
            }
            out.time_range = opts.time_range;
        }
        return out;
    }
    /* ------------------------------- endpoints ------------------------------ */

    /** Fetch current user's profile */
    static async getUser(): Promise<SpotifyUser> {
        return this.fetchJson('/me');
    }

    /**
   * Fetch top tracks with scalable options.
   * Server route expected: /api/spotify/me/top?type=tracks&time_range=&limit=&offset=
   */
    static async getTopTracks(
        options?: TopItemsOptions,
        init?: RequestInit
    ): Promise<SpotifyTrack[]> {
        const { limit, offset, time_range } = this.validateTopOptions(options);
        const query = this.qs({ type: "tracks", time_range, limit, offset });
        const res = await this.fetchJson<{ items: SpotifyTrack[] }>(`/me/top${query}`, init);
        return res.items ?? [];
    }
    
    /** Fetch user's currently playing track */
    static async getCurrentlyPlaying(): Promise<SpotifyCurrentlyPlaying | null> {
        return this.fetchJson<SpotifyCurrentlyPlaying>('/me/player/currently-playing')
    }
}