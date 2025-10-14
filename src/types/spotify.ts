// types/spotify.ts

/** Generic image object used across Spotify entities */
export interface SpotifyImage {
  url: string;
  height?: number | null;
  width?: number | null;
}

/** Followers metadata (often used on Users/Artists) */
export interface SpotifyFollowers {
  href?: string | null;
  total: number;
}

/** External links (we mostly care about the Spotify link) */
export interface SpotifyExternalUrls {
  spotify?: string;
}

/** Minimal Artist shape used by track listings */
export interface SpotifyArtist {
  id: string;
  name: string;
  external_urls?: SpotifyExternalUrls;
}

/** Minimal Album shape used by track listings */
export interface SpotifyAlbum {
  id: string;
  name: string;
  images?: SpotifyImage[];
  release_date?: string; // ISO date string e.g. "2020-05-01"
  total_tracks?: number;
  external_urls?: SpotifyExternalUrls;
}

/** User profile (what /me returns) */
export interface SpotifyUser {
  id: string;
  display_name?: string;
  followers?: SpotifyFollowers;
  images?: SpotifyImage[];
}

/** Track shape for "top tracks" and similar lists */
export interface SpotifyTrack {
  id: string;
  name: string;
  album?: SpotifyAlbum;
  artists?: SpotifyArtist[];
  external_urls?: SpotifyExternalUrls;
  duration_ms?: number;
  preview_url?: string | null;
}

/** Standard Spotify paging wrapper */
export interface Paging<T> {
  href?: string;
  items: T[];
  limit?: number;
  next?: string | null;
  offset?: number;
  previous?: string | null;
  total?: number;
}

/** Response shape for /me/top/tracks */
export type TopTracksResponse = Paging<SpotifyTrack>;

/** Playback state for /me/player/currently-playing */
export interface SpotifyCurrentlyPlaying {
  device?: {
    id?: string;
    is_active?: boolean;
    is_private_session?: boolean;
    is_restricted?: boolean;
    name?: string;
    type?: string;
    volume_percent?: number;
    supports_volume?: boolean;
  };
  repeat_state?: 'off' | 'track' | 'context' | string;
  shuffle_state?: boolean;
  context?: {
    type?: string;
    href?: string;
    external_urls?: {
      spotify?: string;
    };
    uri?: string;
  };
  timestamp?: number;
  progress_ms?: number;
  is_playing: boolean;
  item: SpotifyTrack | null;
  currently_playing_type: 'track' | 'episode' | 'ad' | string;
  actions?: {
    interrupting_playback?: boolean;
    pausing?: boolean;
    resuming?: boolean;
    seeking?: boolean;
    skipping_next?: boolean;
    skipping_prev?: boolean;
    toggling_repeat_context?: boolean;
    toggling_shuffle?: boolean;
    toggling_repeat_track?: boolean;
    transferring_playback?: boolean;
  };
}

export const TIME_RANGES = ["long_term", "medium_term", "short_term"] as const;
export type TimeRange = (typeof TIME_RANGES)[number];

export const TOP_ITEM_TYPES = ["artists", "tracks"] as const;
export type TopItemType = (typeof TOP_ITEM_TYPES)[number];

export interface TopItemsOptions {
  /** 1..50 (default 20) */
  limit?: number;
  /** >= 0 (default 0) */
  offset?: number;
  /** default "medium_term" */
  time_range?: TimeRange;
}
