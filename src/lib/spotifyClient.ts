import type {
  SpotifyUser,
  SpotifyTrack,
  SpotifyArtist,
  SpotifyCurrentlyPlaying,
  TimeRange,
  TopItemsOptions,
  RecentlyPlayedItemsOptions,
  RecentlyPlayedResponse,
  TopItemsResponse,
} from '@/types/spotify';

const API_BASE =
  process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify`
    : '/api/spotify';

type Queryish = Record<string, string | number | undefined | null>;

export class SpotifyService {
  /* ----------------------------- private utils ---------------------------- */

  /** Ensure integers within a range. */
  private static clampInt(value: unknown, min: number, max: number, name: string): number {
    const n = Math.trunc(Number(value));
    if (!Number.isFinite(n)) throw new Error(`Invalid "${name}": must be a number.`);
    if (n < min || n > max) throw new Error(`Invalid "${name}": must be between ${min} and ${max}.`);
    return n;
  }

  /** Query string builder that drops undefined/null/empty. */
  private static qs(params?: Queryish): string {
    if (!params) return '';
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
    }
    const s = sp.toString();
    return s ? `?${s}` : '';
  }

  /** Build absolute API url from a path and optional params. */
  private static buildUrl(path: string, params?: Queryish): string {
    return `${API_BASE}${path}${this.qs(params)}`;
  }

  /** Fetch JSON with consistent error handling and 204 handling. */
  private static async fetchJson<T>(pathOrUrl: string, init?: RequestInit): Promise<T> {
    const isAbsolute = /^https?:\/\//i.test(pathOrUrl) || pathOrUrl.startsWith(API_BASE);
    const url = isAbsolute ? pathOrUrl : `${API_BASE}${pathOrUrl}`;

    const res = await fetch(url, { cache: 'no-store', ...init });

    if (res.status === 204) {
      // Endpoint explicitly returns no content
      return null as T;
    }

    if (!res.ok) {
      let detail: any = undefined;
      try {
        detail = await res.json();
      } catch {
        // ignore JSON parse errors
      }
      const message =
        detail?.error?.message ??
        detail?.error ??
        detail?.message ??
        `Fetch failed (${res.status})`;
      const err = new Error(message) as Error & { status?: number; detail?: unknown };
      err.status = res.status;
      err.detail = detail;
      throw err;
    }

    return res.json() as Promise<T>;
  }

  /** Validate /me/top options with sane defaults. */
  private static validateTopOptions(opts?: TopItemsOptions): Required<TopItemsOptions> {
    const out: Required<TopItemsOptions> = {
      limit: 20,
      offset: 0,
      time_range: 'medium_term',
    };
    if (!opts) return out;

    if (opts.limit !== undefined) out.limit = this.clampInt(opts.limit, 1, 50, 'limit');
    if (opts.offset !== undefined) {
      const n = Math.trunc(Number(opts.offset));
      if (!Number.isFinite(n) || n < 0) {
        throw new Error(`Invalid "offset": must be an integer >= 0.`);
      }
      out.offset = n;
    }
    if (opts.time_range !== undefined) {
      const allowed: TimeRange[] = ['long_term', 'medium_term', 'short_term'];
      if (!allowed.includes(opts.time_range)) {
        throw new Error(`Invalid "time_range": expected one of ${allowed.join(', ')}.`);
      }
      out.time_range = opts.time_range;
    }
    return out;
  }

  /** Validate /recently-played cursor options (after XOR before). */
  private static validateRecentlyPlayedOptions(
    opts?: RecentlyPlayedItemsOptions
  ): Required<RecentlyPlayedItemsOptions> {
    const out: Required<RecentlyPlayedItemsOptions> = {
      limit: 20,
      after: 0,
      before: 0,
    };
    if (!opts) return out;

    if (opts.limit !== undefined) out.limit = this.clampInt(opts.limit, 1, 50, 'limit');

    const hasAfter = typeof opts.after === 'number';
    const hasBefore = typeof opts.before === 'number';
    if (hasAfter && hasBefore) {
      throw new Error(`Specify only one of "after" or "before", not both.`);
    }
    if (hasAfter) {
      out.after = Math.trunc(opts.after!);
      out.before = 0;
    } else if (hasBefore) {
      out.before = Math.trunc(opts.before!);
      out.after = 0;
    }
    return out;
  }

  /* ------------------------------- endpoints ------------------------------ */

  /** Fetch the current user's profile. */
  static async getUser(init?: RequestInit): Promise<SpotifyUser> {
    return this.fetchJson('/me', init);
  }

  /**
   * Generic "Top Items" fetcher. Use to get top artists or top tracks.
   * Example: getTopItems<SpotifyArtist>('artists', { time_range: 'short_term' })
   */
  static async getTopItems<T extends SpotifyArtist | SpotifyTrack>(
    type: 'artists' | 'tracks',
    options?: TopItemsOptions,
    init?: RequestInit
  ): Promise<TopItemsResponse<T>> {
    const { limit, offset, time_range } = this.validateTopOptions(options);
    const url = this.buildUrl('/me/top', { type, time_range, limit, offset });
    return this.fetchJson<TopItemsResponse<T>>(url, init);
  }

  /** Fetch top tracks (convenience wrapper). */
  static async getTopTracks(
    options?: TopItemsOptions,
    init?: RequestInit
  ): Promise<SpotifyTrack[]> {
    const res = await this.getTopItems<SpotifyTrack>('tracks', options, init);
    return res.items ?? [];
  }

  /** Fetch top artists (convenience wrapper). */
  static async getTopArtists(
    options?: TopItemsOptions,
    init?: RequestInit
  ): Promise<SpotifyArtist[]> {
    const res = await this.getTopItems<SpotifyArtist>('artists', options, init);
    return res.items ?? [];
  }

  /** Fetch the user's currently playing track (returns null if none). */
  static async getCurrentlyPlaying(init?: RequestInit): Promise<SpotifyCurrentlyPlaying | null> {
    return this.fetchJson<SpotifyCurrentlyPlaying>('/me/player/currently-playing', init);
  }

  /** Fetch the user's recently played tracks (cursor-based). */
  static async getRecentlyPlayed(
    options?: RecentlyPlayedItemsOptions,
    init?: RequestInit
  ): Promise<RecentlyPlayedResponse> {
    const { limit, before, after } = this.validateRecentlyPlayedOptions(options);

    // Omit zero-cursors so the API behaves like a first page.
    const params = {
      limit,
      after: after || undefined,
      before: before || undefined,
    };

    const url = this.buildUrl('/me/player/recently-played', params);
    return this.fetchJson<RecentlyPlayedResponse>(url, init);
  }
}